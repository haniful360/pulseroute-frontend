'use client';

import React, { useState, useMemo, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet, TrendingUp, CreditCard, RefreshCcw, Download, Search, RefreshCw, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllInvoicesAction, exportInvoicesCsvAction } from '@/services/invoice.service';
import { getOverviewAnalyticsAction } from '@/services/analytics.service';
import { toast } from 'sonner';

const TABS = ['All', 'Settled', 'Pending', 'Refunded'];

export default function RevenueView() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = () => {
    startTransition(async () => {
      try {
        const [invRes, analyticsRes] = await Promise.all([
          getAllInvoicesAction({ limit: 50 }),
          getOverviewAnalyticsAction(),
        ]);

        if (invRes?.data?.data) {
          setInvoices(invRes.data.data);
        }
        if (analyticsRes?.data) {
          setOverview(analyticsRes.data);
        }
      } catch (err) {
        console.error('Failed to load revenue and invoice data:', err);
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTransactions = useMemo(() => {
    return invoices.filter((inv) => {
      // Map tabs
      let matchTab = true;
      if (activeTab === 'Settled') matchTab = inv.paymentStatus === 'PAID';
      if (activeTab === 'Pending') matchTab = inv.paymentStatus === 'PENDING';
      if (activeTab === 'Refunded') matchTab = inv.paymentStatus === 'REFUNDED';

      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(q)) ||
        (inv.tripId && inv.tripId.toLowerCase().includes(q));

      return matchTab && matchSearch;
    });
  }, [invoices, activeTab, search]);

  const handleExportCsv = async () => {
    try {
      toast.info('Downloading official financial audit CSV from server...');
      const res = await exportInvoicesCsvAction({
        paymentStatus: activeTab === 'Settled' ? 'PAID' : activeTab === 'Pending' ? 'PENDING' : activeTab === 'Refunded' ? 'REFUNDED' : undefined,
      });

      if (res.success && res.data) {
        const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `pulseroute_financial_audit_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Financial audit CSV downloaded successfully.');
      } else {
        toast.error(res.message || 'Failed to download audit CSV');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error exporting CSV');
    }
  };

  // Financial aggregates
  const grossBilled = Number(overview?.financials?.totalBilledAmount || 0);
  const platformRevenue = Number(overview?.financials?.totalCommissionEarned || 0);
  const driverPayouts = Number(overview?.financials?.totalDriverEarnings || 0);
  const totalPaid = Number(overview?.financials?.totalPaidAmount || 0);
  const pendingSettlement = Math.max(0, grossBilled - totalPaid);
  const pendingPayoutCount = overview?.financials?.pendingPayoutRequestsCount || 0;

  // Percentage calculations
  const totalBar = grossBilled || 1;
  const operatorPercent = Math.round((driverPayouts / totalBar) * 100) || 78;
  const commissionPercent = Math.round((platformRevenue / totalBar) * 100) || 12;
  const pendingPercent = Math.round((pendingSettlement / totalBar) * 100) || 7;
  const refundPercent = Math.max(0, 100 - operatorPercent - commissionPercent - pendingPercent) || 3;

  const formatBDT = (amount: number) => {
    if (amount >= 1000000) return `৳${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `৳${(amount / 1000).toFixed(1)}K`;
    return `৳${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#E63946]">
            OPERATIONS CONTROL CENTER
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Revenue Operations & Payouts
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Consolidated transaction logs, platform fee settlements, and automated payout schedules.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          disabled={isPending}
          className="gap-2 self-start sm:self-auto rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', isPending && 'animate-spin text-[#E63946]')} />
          Refresh
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Stat 1 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Wallet className="h-4 w-4" />
            </div>
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Gross booking value</div>
          </div>
          {isPending ? (
            <Skeleton className="h-8 w-20 bg-slate-200 mt-1" />
          ) : (
            <div className="text-2xl font-black text-[#0b132b]">
              {formatBDT(grossBilled)}
            </div>
          )}
          <div className="text-xs font-medium text-emerald-600 mt-1">Total platform invoiced</div>
        </div>

        {/* Stat 2 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Platform revenue</div>
          </div>
          {isPending ? (
            <Skeleton className="h-8 w-20 bg-slate-200 mt-1" />
          ) : (
            <div className="text-2xl font-black text-[#0b132b]">
              {formatBDT(platformRevenue)}
            </div>
          )}
          <div className="text-xs font-medium text-slate-500 mt-1">Platform fee collections</div>
        </div>

        {/* Stat 3 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <CreditCard className="h-4 w-4" />
            </div>
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Pending payouts</div>
          </div>
          {isPending ? (
            <Skeleton className="h-8 w-20 bg-slate-200 mt-1" />
          ) : (
            <div className="text-2xl font-black text-[#0b132b]">
              {formatBDT(pendingSettlement)}
            </div>
          )}
          <div className="text-xs font-medium text-amber-600 mt-1">
            {pendingPayoutCount} pending operator requests
          </div>
        </div>

        {/* Stat 4 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <RefreshCcw className="h-4 w-4" />
            </div>
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Settled Volume</div>
          </div>
          {isPending ? (
            <Skeleton className="h-8 w-20 bg-slate-200 mt-1" />
          ) : (
            <div className="text-2xl font-black text-[#0b132b]">
              {formatBDT(totalPaid)}
            </div>
          )}
          <div className="text-xs font-medium text-emerald-600 mt-1">Processed transactions</div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
        <h2 className="text-sm font-bold tracking-tight text-slate-900 mb-4">Platform Revenue Breakdown</h2>
        <div className="h-4 rounded-full overflow-hidden flex w-full mb-4">
          <div className="bg-[#0b132b]" style={{ width: `${operatorPercent}%` }} />
          <div className="bg-[#E63946]" style={{ width: `${commissionPercent}%` }} />
          <div className="bg-amber-400" style={{ width: `${pendingPercent}%` }} />
          <div className="bg-slate-300" style={{ width: `${refundPercent}%` }} />
        </div>
        <div className="flex flex-wrap gap-4 items-center mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#0b132b]" />
            <span className="text-xs font-medium text-slate-500">Operator payouts</span>
            <span className="text-sm font-bold text-slate-900">{operatorPercent}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#E63946]" />
            <span className="text-xs font-medium text-slate-500">Platform commission</span>
            <span className="text-sm font-bold text-slate-900">{commissionPercent}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="text-xs font-medium text-slate-500">Pending settlement</span>
            <span className="text-sm font-bold text-slate-900">{pendingPercent}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-slate-300" />
            <span className="text-xs font-medium text-slate-500">Reserve / adjustment</span>
            <span className="text-sm font-bold text-slate-900">{refundPercent}%</span>
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900">Transaction Ledger</h2>
            <p className="text-xs font-medium text-slate-500 mt-1">
              {filteredTransactions.length} transactions recorded
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-semibold rounded-xl transition-all',
                    activeTab === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-[220px]">
              <InputField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoice or trip..."
                icon={<Search className="h-4 w-4 text-slate-400" />}
              />
            </div>

            <Button
              variant="outline"
              onClick={handleExportCsv}
              className="h-9 rounded-xl text-xs w-full sm:w-auto gap-2 border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f8fafc] text-[10px] tracking-wider text-[#64748b] uppercase">
              <tr>
                <th className="px-5 py-4 font-semibold">Invoice</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Trip ID</th>
                <th className="px-5 py-4 font-semibold">Gross (BDT)</th>
                <th className="px-5 py-4 font-semibold">Commission</th>
                <th className="px-5 py-4 font-semibold">Net Payout</th>
                <th className="px-5 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isPending ? (
                [1, 2, 3, 4, 5].map((idx) => (
                  <tr key={idx} className="hover:bg-[#f8fafc]">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-24 bg-slate-200" />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-20 bg-slate-200" />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-28 bg-slate-200" />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-16 bg-slate-200" />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-16 bg-slate-200" />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-16 bg-slate-200" />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-16 rounded-full bg-slate-200" />
                    </td>
                  </tr>
                ))
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => {
                  const dateStr = new Date(tx.createdAt || Date.now()).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const isPaid = tx.paymentStatus === 'PAID';
                  const isPendingTx = tx.paymentStatus === 'PENDING';
                  const isRefunded = tx.paymentStatus === 'REFUNDED';
                  const statusLabel = isPaid ? 'Settled' : isPendingTx ? 'Pending' : isRefunded ? 'Refunded' : tx.paymentStatus;

                  return (
                    <tr key={tx.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-semibold text-slate-700">
                          {tx.invoiceNumber || tx.id.slice(0, 10)}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-[#334155] font-medium">{dateStr}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-[#334155] font-medium font-mono text-xs">
                        {tx.tripId ? `TRP-${tx.tripId.slice(-6).toUpperCase()}` : 'TRP-DIRECT'}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-semibold text-slate-900">
                        ৳{Number(tx.totalAmount || 0).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-semibold text-[#E63946]">
                        ৳{Number(tx.platformCommission || 0).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-[#334155] font-medium">
                        ৳{Number(tx.driverEarning || 0).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-0.5 text-[10px] font-bold',
                            isPaid && 'bg-emerald-50 text-emerald-600',
                            isPendingTx && 'bg-amber-50 text-amber-600',
                            isRefunded && 'bg-slate-100 text-slate-600'
                          )}
                        >
                          {statusLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                        <FileText className="h-5 w-5" />
                      </div>
                      <p className="font-semibold text-slate-800">No transactions found</p>
                      <p className="text-xs text-slate-400 mt-0.5">Dispatched trips with completed payments will appear in this ledger.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
