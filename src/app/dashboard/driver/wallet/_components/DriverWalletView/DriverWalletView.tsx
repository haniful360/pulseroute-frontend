'use client';

import React, { useState, useEffect } from 'react';
import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import DynamicModal from '@/components/dashboard/DynamicModal/DynamicModal';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import {
  ArrowUpRight,
  Check,
  CreditCard,
  DollarSign,
  Download,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getMyWalletAction,
  getMyTransactionsAction,
  createPayoutRequestAction,
  exportDriverStatementAction,
} from '@/services/wallet/wallet.service';
import { Skeleton } from '@/components/ui/skeleton';

interface LedgerItem {
  id: string;
  date: string;
  time: string;
  tripId: string;
  amount: string;
  status: string;
  method: string;
}

export default function DriverWalletView() {
  const [wallet, setWallet] = useState<any>(null);
  const [ledger, setLedger] = useState<LedgerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('0.00');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function loadWalletData() {
      setLoading(true);
      try {
        const [wRes, txRes] = await Promise.all([
          getMyWalletAction(),
          getMyTransactionsAction(),
        ]);
        if (wRes.success && wRes.data) {
          setWallet(wRes.data);
          if (wRes.data.balance) {
            setPayoutAmount(Number(wRes.data.balance).toFixed(2));
          }
        }
        if (txRes.success && Array.isArray(txRes.data)) {
          const items: LedgerItem[] = txRes.data.map((tx: any) => ({
            id: tx.id,
            date: new Date(tx.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            time: new Date(tx.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            tripId: tx.trip?.tripCode || `#TRP-${tx.id.slice(-4).toUpperCase()}`,
            amount: `${tx.type === 'DEBIT' ? '-' : '+'}BDT ${Number(tx.amount || 0).toLocaleString()}`,
            status: tx.status || 'Completed',
            method: tx.paymentMethod || 'Stripe Express',
          }));
          setLedger(items);
        }
      } catch (err) {
        console.error('Failed to load wallet data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWalletData();
  }, []);

  const handlePayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await createPayoutRequestAction({
        amount: Number(payoutAmount),
        paymentMethod: 'STRIPE',
        notes: 'Paramedic driver withdrawal',
      });
      if (res.success) {
        toast.success(`Withdrawal request of BDT ${payoutAmount} submitted successfully!`);
        setPayoutOpen(false);
        const wRes = await getMyWalletAction();
        if (wRes.success && wRes.data) setWallet(wRes.data);
      } else {
        toast.error(res.message || 'Failed to submit withdrawal');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error processing payout request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      toast.info('Generating official driver statement CSV...');
      const res = await exportDriverStatementAction();
      if (res.success && res.data) {
        const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `pulseroute_driver_statement_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Driver earnings statement downloaded successfully.');
      } else {
        toast.error(res.message || 'Failed to export statement');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error exporting statement');
    }
  };

  const columns = [
    {
      header: 'Date & Time',
      cell: (row: LedgerItem) => (
        <div>
          <span className="font-bold text-slate-900">{row.date}</span>
          <p className="text-[11px] text-slate-400">{row.time}</p>
        </div>
      ),
    },
    {
      header: 'Trip Reference',
      cell: (row: LedgerItem) => (
        <span className="font-mono font-semibold text-slate-700">{row.tripId}</span>
      ),
    },
    {
      header: 'Payout Method',
      accessor: 'method' as keyof LedgerItem,
    },
    {
      header: 'Net Earning',
      cell: (row: LedgerItem) => (
        <span
          className={`font-bold ${row.status === 'Pending' ? 'text-slate-800' : 'text-emerald-600'}`}
        >
          {row.amount}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row: LedgerItem) => (
        <DynamicBadge
          text={row.status}
          color={row.status === 'Completed' ? '#10b981' : '#f59e0b'}
          size="sm"
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DynamicPageHeader
          title="Paramedic Earnings & Wallet"
          description="Manage your duty settlements, view real-time trip earnings, and withdraw to bank."
        />
        <DynamicActionButton
          variant="danger"
          icon={ArrowUpRight}
          iconPosition="right"
          onClick={() => setPayoutOpen(true)}
          label="Request Payout"
          className="self-start sm:self-auto"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                AVAILABLE BALANCE
              </p>
              {loading ? (
                <Skeleton className="h-9 w-36 mt-2" />
              ) : (
                <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  BDT {Number(wallet?.balance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </h3>
              )}
              <p className="mt-2 text-xs text-slate-500">
                Next auto-settlement: <b className="text-slate-700">End of week</b>
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#E63946]">
              <Wallet className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                TOTAL EARNINGS
              </p>
              {loading ? (
                <Skeleton className="h-9 w-36 mt-2" />
              ) : (
                <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  BDT {Number(wallet?.totalEarned ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </h3>
              )}
              <div className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Paramedic duty earnings</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                TOTAL LIFETIME PAYOUTS
              </p>
              {loading ? (
                <Skeleton className="h-9 w-36 mt-2" />
              ) : (
                <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  BDT {Number(wallet?.totalWithdrawn ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </h3>
              )}
              <p className="mt-2 text-xs text-slate-500">Processed through central banking</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <CreditCard className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Table Section */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Earnings & Payout Ledger</h3>
            <p className="text-xs text-slate-500">Recent emergency trip settlements and deposits</p>
          </div>
          <DynamicActionButton
            variant="outline"
            size="sm"
            icon={Download}
            iconPosition="left"
            onClick={handleExportCSV}
            label="Export as CSV"
          />
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : ledger.length > 0 ? (
          <CustomTable columns={columns} data={ledger} />
        ) : (
          <div className="p-10 text-center text-sm text-slate-500">
            No transactions recorded yet in your wallet ledger.
          </div>
        )}
      </div>

      {/* Payout Modal */}
      <DynamicModal
        isOpen={payoutOpen}
        onClose={() => setPayoutOpen(false)}
        title="Request Bank Payout"
        description="Funds will be transferred to your connected Stripe Express / Bank account within 2-3 business days."
        variant="light"
      >
        <form onSubmit={handlePayoutSubmit} className="space-y-4 pt-2">
          <InputField
            label="Payout Amount (BDT)"
            value={payoutAmount}
            onChange={(e) => setPayoutAmount(e.target.value)}
            type="number"
            step="0.01"
            required
            helperText={`Maximum withdrawable amount: BDT ${Number(wallet?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Destination Account
            </label>
            <div className="flex items-center justify-between rounded-2xl border-2 border-[#e63946] bg-red-50/40 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#e63946] shadow-xs">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Chase Bank •••• 4242</p>
                  <p className="text-[11px] text-slate-500">Stripe Connected Express Account</p>
                </div>
              </div>
              <Check className="h-5 w-5 text-[#e63946]" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <DynamicActionButton
              variant="outline"
              onClick={() => setPayoutOpen(false)}
              label="Cancel"
            />
            <DynamicActionButton
              type="submit"
              variant="danger"
              isLoading={isProcessing}
              label="Confirm & Withdraw"
            />
          </div>
        </form>
      </DynamicModal>
    </div>
  );
}
