'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet, TrendingUp, CreditCard, RefreshCcw, Download, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const transactions = [
  { id: 'INV-8821', date: 'Sep 24, 2026', trip: 'TRP-8821', gross: '৳3,500', commission: '৳420', net: '৳3,080', status: 'Settled' },
  { id: 'INV-8816', date: 'Sep 24, 2026', trip: 'TRP-8816', gross: '৳2,200', commission: '৳264', net: '৳1,936', status: 'Pending' },
  { id: 'INV-8794', date: 'Sep 23, 2026', trip: 'TRP-8794', gross: '৳1,450', commission: '৳174', net: '৳1,276', status: 'Settled' },
  { id: 'INV-8788', date: 'Sep 23, 2026', trip: 'TRP-8788', gross: '৳4,800', commission: '৳576', net: '৳4,224', status: 'Settled' },
  { id: 'INV-8776', date: 'Sep 22, 2026', trip: 'TRP-8776', gross: '৳2,850', commission: '৳342', net: '৳2,508', status: 'Pending' },
  { id: 'INV-8770', date: 'Sep 22, 2026', trip: 'TRP-8770', gross: '৳1,900', commission: '৳228', net: '৳1,672', status: 'Refunded' },
  { id: 'INV-8761', date: 'Sep 21, 2026', trip: 'TRP-8761', gross: '৳3,200', commission: '৳384', net: '৳2,816', status: 'Settled' },
];

const TABS = ['All', 'Settled', 'Pending', 'Refunded'];

export default function RevenueView() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchTab = activeTab === 'All' || t.status === activeTab;
      const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) || 
                          t.trip.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [activeTab, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#E63946]">
          OPERATIONS CONTROL CENTER
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Revenue Operations & Payouts
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Consolidated transaction logs, platform fee settlements, and automated Stripe payout schedules.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Stat 1 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Wallet className="h-4 w-4" />
            </div>
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Gross booking value</div>
          </div>
          <div className="text-2xl font-black text-[#0b132b]">৳4.82M</div>
          <div className="text-xs font-medium text-emerald-600 mt-1">+18.2% this month</div>
        </div>
        
        {/* Stat 2 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Platform revenue</div>
          </div>
          <div className="text-2xl font-black text-[#0b132b]">৳579K</div>
          <div className="text-xs font-medium text-slate-500 mt-1">12% commission</div>
        </div>

        {/* Stat 3 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <CreditCard className="h-4 w-4" />
            </div>
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Pending payouts</div>
          </div>
          <div className="text-2xl font-black text-[#0b132b]">৳184K</div>
          <div className="text-xs font-medium text-slate-500 mt-1">32 operators</div>
        </div>

        {/* Stat 4 */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <RefreshCcw className="h-4 w-4" />
            </div>
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Refunds</div>
          </div>
          <div className="text-2xl font-black text-[#0b132b]">৳18.4K</div>
          <div className="text-xs font-medium text-emerald-600 mt-1">-6.8% vs August</div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
        <h2 className="text-sm font-bold tracking-tight text-slate-900 mb-4">September Revenue Breakdown</h2>
        <div className="h-4 rounded-full overflow-hidden flex w-full mb-4">
          <div className="bg-[#0b132b]" style={{ width: '78%' }} />
          <div className="bg-[#E63946]" style={{ width: '12%' }} />
          <div className="bg-amber-400" style={{ width: '7%' }} />
          <div className="bg-slate-300" style={{ width: '3%' }} />
        </div>
        <div className="flex flex-wrap gap-4 items-center mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#0b132b]" />
            <span className="text-xs font-medium text-slate-500">Operator payouts</span>
            <span className="text-sm font-bold text-slate-900">78%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#E63946]" />
            <span className="text-xs font-medium text-slate-500">Platform commission</span>
            <span className="text-sm font-bold text-slate-900">12%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="text-xs font-medium text-slate-500">Pending settlement</span>
            <span className="text-sm font-bold text-slate-900">7%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-slate-300" />
            <span className="text-xs font-medium text-slate-500">Refunds</span>
            <span className="text-sm font-bold text-slate-900">3%</span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900">Transaction Ledger</h2>
            <p className="text-xs font-medium text-slate-500 mt-1">{filteredTransactions.length} transactions found</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-xl transition-all",
                    activeTab === tab ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoice or trip..."
                className="pl-9 h-9 text-xs rounded-xl border-slate-200 w-full sm:w-[200px]"
              />
            </div>
            
            <Button variant="outline" className="h-9 rounded-xl text-xs w-full sm:w-auto gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f8fafc] text-[10px] tracking-wider text-[#64748b] uppercase">
              <tr>
                <th className="px-5 py-4 font-semibold">Invoice</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Trip</th>
                <th className="px-5 py-4 font-semibold">Gross (BDT)</th>
                <th className="px-5 py-4 font-semibold">Commission</th>
                <th className="px-5 py-4 font-semibold">Net Payout</th>
                <th className="px-5 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs font-semibold text-slate-500">{tx.id}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-[#334155] font-medium">{tx.date}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-[#334155] font-medium">{tx.trip}</td>
                  <td className="px-5 py-4 whitespace-nowrap font-semibold text-slate-900">{tx.gross}</td>
                  <td className="px-5 py-4 whitespace-nowrap font-semibold text-[#E63946]">{tx.commission}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-[#334155] font-medium">{tx.net}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                      tx.status === 'Settled' && "bg-emerald-50 text-emerald-600",
                      tx.status === 'Pending' && "bg-amber-50 text-amber-600",
                      tx.status === 'Refunded' && "bg-slate-100 text-slate-600"
                    )}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-500">
                    No transactions found.
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
