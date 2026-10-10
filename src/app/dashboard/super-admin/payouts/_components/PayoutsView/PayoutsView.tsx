'use client';

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Banknote,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  AlertTriangle,
  CreditCard,
  Building,
  User,
  ArrowUpRight,
  ShieldCheck,
  Check,
  X,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  getAllPayoutRequestsAction,
  processPayoutRequestAction,
  IPayoutRequestItem,
} from '@/services/wallet/wallet.service';

const STATUS_TABS = [
  { id: 'ALL', label: 'All Requests' },
  { id: 'REQUESTED', label: 'Requested' },
  { id: 'PROCESSING', label: 'Processing' },
  { id: 'APPROVED', label: 'Approved' },
  { id: 'REJECTED', label: 'Rejected' },
];

export default function PayoutsView() {
  const [payouts, setPayouts] = useState<IPayoutRequestItem[]>([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();

  // Dialog states
  const [selectedPayout, setSelectedPayout] = useState<IPayoutRequestItem | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | 'PROCESSING' | 'DETAILS' | null>(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPayouts = () => {
    startTransition(async () => {
      try {
        const res = await getAllPayoutRequestsAction({ limit: 100 });
        if (res.success && res.data) {
          const list = Array.isArray(res.data) ? res.data : (res.data as any).data || [];
          setPayouts(list);
        } else {
          toast.error(res.message || 'Failed to load payout requests');
        }
      } catch (err) {
        console.error('Failed to load payout requests:', err);
        toast.error('Network error: Unable to load payout records');
      }
    });
  };

  useEffect(() => {
    loadPayouts();
  }, []);

  // Filtered Payouts
  const filteredPayouts = useMemo(() => {
    return payouts.filter((p) => {
      // Tab filter
      if (activeTab !== 'ALL' && p.status !== activeTab) {
        return false;
      }

      // Search filter
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const driverName = p.driver?.name?.toLowerCase() || '';
      const driverEmail = p.driver?.email?.toLowerCase() || '';
      const accountNum = p.accountNumber?.toLowerCase() || '';
      const txRef = p.transactionReference?.toLowerCase() || '';
      const id = p.id.toLowerCase();

      return (
        driverName.includes(q) ||
        driverEmail.includes(q) ||
        accountNum.includes(q) ||
        txRef.includes(q) ||
        id.includes(q)
      );
    });
  }, [payouts, activeTab, search]);

  // Aggregate stats
  const stats = useMemo(() => {
    const requested = payouts.filter((p) => p.status === 'REQUESTED');
    const processing = payouts.filter((p) => p.status === 'PROCESSING');
    const approved = payouts.filter((p) => p.status === 'APPROVED');
    const rejected = payouts.filter((p) => p.status === 'REJECTED');

    const sumAmount = (list: IPayoutRequestItem[]) =>
      list.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    return {
      requestedCount: requested.length,
      requestedAmount: sumAmount(requested),
      processingCount: processing.length,
      processingAmount: sumAmount(processing),
      approvedCount: approved.length,
      approvedAmount: sumAmount(approved),
      rejectedCount: rejected.length,
      rejectedAmount: sumAmount(rejected),
    };
  }, [payouts]);

  // Open Action Modals
  const openAction = (payout: IPayoutRequestItem, type: 'APPROVE' | 'REJECT' | 'PROCESSING' | 'DETAILS') => {
    setSelectedPayout(payout);
    setActionType(type);
    setTransactionRef(payout.transactionReference || '');
    setRejectionReason(payout.rejectionReason || '');
  };

  const closeAction = () => {
    setSelectedPayout(null);
    setActionType(null);
    setTransactionRef('');
    setRejectionReason('');
    setIsSubmitting(false);
  };

  // Submit Status Update
  const handleSubmitAction = async () => {
    if (!selectedPayout || !actionType || actionType === 'DETAILS') return;

    if (actionType === 'REJECT' && !rejectionReason.trim()) {
      toast.error('Please enter a rejection reason for the driver.');
      return;
    }

    const targetStatus: 'APPROVED' | 'REJECTED' | 'PROCESSING' =
      actionType === 'APPROVE' ? 'APPROVED' : actionType === 'REJECT' ? 'REJECTED' : 'PROCESSING';

    setIsSubmitting(true);
    try {
      const payload: {
        status: 'APPROVED' | 'REJECTED' | 'PROCESSING';
        transactionReference?: string;
        rejectionReason?: string;
      } = {
        status: targetStatus,
        transactionReference: transactionRef.trim() || undefined,
        rejectionReason: actionType === 'REJECT' ? rejectionReason.trim() : undefined,
      };

      const res = await processPayoutRequestAction(selectedPayout.id, payload);

      if (res.success) {
        toast.success(
          targetStatus === 'APPROVED'
            ? `Payout of BDT ${Number(selectedPayout.amount).toLocaleString()} approved and settled successfully!`
            : targetStatus === 'REJECTED'
            ? 'Payout request rejected.'
            : 'Payout marked as processing.'
        );
        closeAction();
        loadPayouts();
      } else {
        toast.error(res.message || 'Failed to update payout status');
      }
    } catch (err: any) {
      console.error('Error updating payout:', err);
      toast.error(err?.message || 'Server error while updating payout status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatBDT = (amount: number | string) => {
    const val = Number(amount || 0);
    return `BDT ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#E63946]">
            FINANCIAL DISBURSEMENT CONTROL
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Driver Payout Management
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Review driver withdrawal requests, verify bank accounts, and approve or reject payouts.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadPayouts}
          disabled={isPending}
          className="gap-2 self-start sm:self-auto rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', isPending && 'animate-spin text-[#E63946]')} />
          Refresh
        </Button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pending Requests */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold tracking-wider uppercase text-amber-800">
              Pending Requests
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-950">
            {formatBDT(stats.requestedAmount)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            {stats.requestedCount} drivers waiting for review
          </div>
        </div>

        {/* Processing */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold tracking-wider uppercase text-blue-800">
              In Processing
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <CreditCard className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-blue-950">
            {formatBDT(stats.processingAmount)}
          </div>
          <div className="mt-1 text-xs font-medium text-blue-700">
            {stats.processingCount} payouts under banking settlement
          </div>
        </div>

        {/* Approved & Settled */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold tracking-wider uppercase text-emerald-800">
              Approved & Settled
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-950">
            {formatBDT(stats.approvedAmount)}
          </div>
          <div className="mt-1 text-xs font-medium text-emerald-700">
            {stats.approvedCount} payouts disbursed successfully
          </div>
        </div>

        {/* Rejected */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold tracking-wider uppercase text-rose-800">
              Rejected Requests
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
              <XCircle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-rose-950">
            {formatBDT(stats.rejectedAmount)}
          </div>
          <div className="mt-1 text-xs font-medium text-rose-700">
            {stats.rejectedCount} requests declined
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Table Filters & Search */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-slate-100 p-1">
            {STATUS_TABS.map((tab) => {
              const count =
                tab.id === 'ALL'
                  ? payouts.length
                  : tab.id === 'REQUESTED'
                  ? stats.requestedCount
                  : tab.id === 'PROCESSING'
                  ? stats.processingCount
                  : tab.id === 'APPROVED'
                  ? stats.approvedCount
                  : stats.rejectedCount;

              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                      isActive ? 'bg-[#E63946] text-white' : 'bg-slate-200 text-slate-700'
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-72">
            <InputField
              type="text"
              icon={<Search className="h-4 w-4 text-slate-400" />}
              placeholder="Search driver, email, account..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 text-xs rounded-xl"
            />
          </div>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Driver Profile</th>
                <th className="px-6 py-4">Requested Amount</th>
                <th className="px-6 py-4">Payment Method & Account</th>
                <th className="px-6 py-4">Request Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <Banknote className="h-7 w-7" />
                      </div>
                      <p className="text-sm font-bold text-slate-700">No payout requests found</p>
                      <p className="text-xs text-slate-400 max-w-sm">
                        {search
                          ? 'No payout requests match your search criteria. Try a different query.'
                          : 'No payout requests exist in this status category.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayouts.map((payout) => {
                  const isPendingStatus = payout.status === 'REQUESTED';
                  const isProcessingStatus = payout.status === 'PROCESSING';
                  const isApproved = payout.status === 'APPROVED';
                  const isRejected = payout.status === 'REJECTED';

                  const walletBalance = Number(payout.wallet?.balance || 0);
                  const reqAmount = Number(payout.amount || 0);
                  const isInsufficient = walletBalance < reqAmount && (isPendingStatus || isProcessingStatus);

                  return (
                    <tr
                      key={payout.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Driver Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-[#E63946]">
                            {payout.driver?.name?.charAt(0) || 'D'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              {payout.driver?.name || 'Unknown Driver'}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {payout.driver?.email || 'N/A'}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {payout.driver?.contactNumber || ''}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Requested Amount & Wallet Balance */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-black text-slate-900">
                            {formatBDT(payout.amount)}
                          </p>
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-500">
                              Wallet Available:
                            </span>
                            <span
                              className={cn(
                                'text-[11px] font-bold',
                                isInsufficient ? 'text-rose-600' : 'text-emerald-600'
                              )}
                            >
                              {formatBDT(walletBalance)}
                            </span>
                          </div>
                          {isInsufficient && (
                            <span className="mt-1 inline-flex items-center gap-1 rounded bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-600">
                              <AlertTriangle className="h-2.5 w-2.5" /> Insufficient balance
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Payment Method & Account */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                'rounded-md px-2 py-0.5 text-[10px] font-bold uppercase',
                                payout.paymentMethod === 'STRIPE'
                                  ? 'bg-purple-100 text-purple-700'
                                  : payout.paymentMethod === 'BKASH'
                                  ? 'bg-pink-100 text-pink-700'
                                  : 'bg-blue-100 text-blue-700'
                              )}
                            >
                              {payout.paymentMethod}
                            </span>
                            <span className="font-mono text-xs font-semibold text-slate-800">
                              {payout.accountNumber || 'N/A'}
                            </span>
                          </div>
                          {payout.accountDetails && (
                            <p className="mt-1 text-[11px] text-slate-500 max-w-xs truncate" title={payout.accountDetails}>
                              {payout.accountDetails}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Request Date */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-700">
                            {formatDate(payout.createdAt)}
                          </p>
                          {payout.processedAt && (
                            <p className="mt-0.5 text-[10px] text-slate-400">
                              Processed: {formatDate(payout.processedAt)}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider',
                            isPendingStatus && 'bg-amber-100 text-amber-800',
                            isProcessingStatus && 'bg-blue-100 text-blue-800',
                            isApproved && 'bg-emerald-100 text-emerald-800',
                            isRejected && 'bg-rose-100 text-rose-800'
                          )}
                        >
                          {isPendingStatus && (
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                          )}
                          {isProcessingStatus && <Clock className="h-3 w-3" />}
                          {isApproved && <Check className="h-3 w-3" />}
                          {isRejected && <X className="h-3 w-3" />}
                          {payout.status}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(isPendingStatus || isProcessingStatus) ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openAction(payout, 'APPROVE')}
                                className="h-8 gap-1 rounded-xl border-emerald-200 bg-emerald-50 text-xs font-bold text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                              >
                                <Check className="h-3 w-3" />
                                Approve
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openAction(payout, 'REJECT')}
                                className="h-8 gap-1 rounded-xl border-rose-200 bg-rose-50 text-xs font-bold text-rose-700 hover:bg-rose-100 hover:text-rose-800"
                              >
                                <X className="h-3 w-3" />
                                Reject
                              </Button>

                              {isPendingStatus && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => openAction(payout, 'PROCESSING')}
                                  title="Mark Under Processing"
                                  className="h-8 text-[11px] text-blue-600 hover:bg-blue-50"
                                >
                                  Process
                                </Button>
                              )}
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openAction(payout, 'DETAILS')}
                              className="h-8 gap-1 rounded-xl border-slate-200 text-xs text-slate-700 hover:bg-slate-100"
                            >
                              <FileText className="h-3 w-3" />
                              Details
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPROVE PAYOUT MODAL */}
      <Dialog open={actionType === 'APPROVE'} onOpenChange={(open) => !open && closeAction()}>
        <DialogContent className="max-w-md rounded-3xl p-6 sm:p-7">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black text-slate-900">
                  Approve Driver Payout
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Confirm payout disbursement to driver’s verified payout account.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedPayout && (
            <div className="space-y-4 py-2">
              {/* Summary Card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Driver:</span>
                  <span className="font-bold text-slate-900">{selectedPayout.driver?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Payout Amount:</span>
                  <span className="text-sm font-black text-[#E63946]">
                    {formatBDT(selectedPayout.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Driver Wallet Balance:</span>
                  <span className="font-bold text-slate-900">
                    {formatBDT(selectedPayout.wallet?.balance || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Payment Channel:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {selectedPayout.paymentMethod} — {selectedPayout.accountNumber}
                  </span>
                </div>
              </div>

              {/* Warning if balance insufficient */}
              {Number(selectedPayout.wallet?.balance || 0) < Number(selectedPayout.amount) && (
                <div className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                  <div>
                    <p className="font-bold">Insufficient Driver Balance</p>
                    <p className="text-[11px] text-rose-700">
                      The driver’s current wallet balance is lower than this requested payout amount. Approving may result in a negative ledger balance.
                    </p>
                  </div>
                </div>
              )}

              {/* Transaction Reference Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Transaction / Settlement Reference (Optional)
                </label>
                <InputField
                  type="text"
                  placeholder="e.g. TRX-BKASH-998822 or STRIPE-PO-1092"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="rounded-xl text-xs"
                />
                <p className="text-[10px] text-slate-400">
                  Add banking transfer ID, Stripe payout ID, or mobile money reference for audit trails.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex sm:justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={closeAction} disabled={isSubmitting} className="rounded-xl">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitAction}
              disabled={isSubmitting}
              className="gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Approve & Settle Payout
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REJECT PAYOUT MODAL */}
      <Dialog open={actionType === 'REJECT'} onOpenChange={(open) => !open && closeAction()}>
        <DialogContent className="max-w-md rounded-3xl p-6 sm:p-7">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black text-slate-900">
                  Reject Payout Request
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Decline this withdrawal request and notify the driver.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedPayout && (
            <div className="space-y-4 py-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Driver:</span>
                  <span className="font-bold text-slate-900">{selectedPayout.driver?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Requested Amount:</span>
                  <span className="font-bold text-slate-900">{formatBDT(selectedPayout.amount)}</span>
                </div>
              </div>

              {/* Rejection Reason Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Rejection Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Provided account number was invalid or KYC mismatch"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-[#E63946] focus:outline-none focus:ring-1 focus:ring-[#E63946]"
                />
                <p className="text-[10px] text-slate-400">
                  This explanation will be permanently recorded and displayed to the driver.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex sm:justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={closeAction} disabled={isSubmitting} className="rounded-xl">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitAction}
              disabled={isSubmitting || !rejectionReason.trim()}
              className="gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <X className="h-3.5 w-3.5" />
                  Confirm Rejection
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MARK AS PROCESSING MODAL */}
      <Dialog open={actionType === 'PROCESSING'} onOpenChange={(open) => !open && closeAction()}>
        <DialogContent className="max-w-md rounded-3xl p-6 sm:p-7">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black text-slate-900">
                  Mark Under Processing
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Set this payout status to PROCESSING while bank transfer is underway.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedPayout && (
            <div className="space-y-4 py-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Driver:</span>
                  <span className="font-bold text-slate-900">{selectedPayout.driver?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Amount:</span>
                  <span className="font-bold text-slate-900">{formatBDT(selectedPayout.amount)}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Transfer Tracking Code (Optional)
                </label>
                <InputField
                  type="text"
                  placeholder="e.g. PROCESSING-BATCH-441"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex sm:justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={closeAction} disabled={isSubmitting} className="rounded-xl">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitAction}
              disabled={isSubmitting}
              className="gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Clock className="h-3.5 w-3.5" />
                  Set to Processing
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW AUDIT DETAILS MODAL */}
      <Dialog open={actionType === 'DETAILS'} onOpenChange={(open) => !open && closeAction()}>
        <DialogContent className="max-w-lg rounded-3xl p-6 sm:p-7">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black text-slate-900">
                  Payout Request Audit Log
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Complete ledger history and audit details for this withdrawal.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedPayout && (
            <div className="space-y-4 py-2 text-xs">
              {/* Status Header */}
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
                  <p className="font-black text-slate-900 text-base">{selectedPayout.status}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Amount</span>
                  <p className="font-black text-[#E63946] text-base">{formatBDT(selectedPayout.amount)}</p>
                </div>
              </div>

              {/* Grid details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 p-3 bg-white">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Driver</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedPayout.driver?.name}</p>
                  <p className="text-[11px] text-slate-500">{selectedPayout.driver?.email}</p>
                </div>
                <div className="rounded-xl border border-slate-100 p-3 bg-white">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Payment Channel</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedPayout.paymentMethod}</p>
                  <p className="font-mono text-[11px] text-slate-500">{selectedPayout.accountNumber}</p>
                </div>
                <div className="rounded-xl border border-slate-100 p-3 bg-white">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Account Details</span>
                  <p className="text-slate-700 mt-0.5">{selectedPayout.accountDetails || 'None provided'}</p>
                </div>
                <div className="rounded-xl border border-slate-100 p-3 bg-white">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Driver Balance</span>
                  <p className="font-bold text-emerald-600 mt-0.5">
                    {formatBDT(selectedPayout.wallet?.balance || 0)}
                  </p>
                </div>
              </div>

              {/* Transaction Reference / Rejection Reason */}
              {selectedPayout.transactionReference && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                  <span className="text-[10px] uppercase font-bold text-emerald-800">Transaction Reference</span>
                  <p className="font-mono font-bold text-emerald-950 mt-0.5">{selectedPayout.transactionReference}</p>
                </div>
              )}

              {selectedPayout.rejectionReason && (
                <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3">
                  <span className="text-[10px] uppercase font-bold text-rose-800">Rejection Reason</span>
                  <p className="font-medium text-rose-950 mt-0.5">{selectedPayout.rejectionReason}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="space-y-1 text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span>Requested On:</span>
                  <span className="text-slate-600 font-medium">{formatDate(selectedPayout.createdAt)}</span>
                </div>
                {selectedPayout.processedAt && (
                  <div className="flex justify-between">
                    <span>Processed On:</span>
                    <span className="text-slate-600 font-medium">{formatDate(selectedPayout.processedAt)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Payout Request ID:</span>
                  <span className="font-mono text-slate-600">{selectedPayout.id}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={closeAction} className="rounded-xl w-full sm:w-auto">
              Close Audit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
