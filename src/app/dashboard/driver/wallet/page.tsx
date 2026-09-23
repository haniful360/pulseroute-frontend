'use client';

import { Button } from '@/components/ui/button';
import { ArrowUpRight, Check, CreditCard, Download, X } from 'lucide-react';
import { useState } from 'react';

export default function DriverWalletPage() {
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="relative space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0b132b]">Wallet Overview</h1>
          <p className="mt-1 text-sm text-[#64748b]">
            Manage your earnings and request bank settlements.
          </p>
        </div>
        <Button variant="danger" onClick={() => setPayoutOpen(true)}>
          <ArrowUpRight /> Request payout
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5">
          <p className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">
            Total balance
          </p>
          <p className="mt-2 text-3xl font-black text-[#0b132b]">$1,482.50</p>
          <p className="mt-3 text-xs text-[#64748b]">
            Next auto-settlement: <b>Sept 30</b>
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <p className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">
            This month
          </p>
          <p className="mt-2 text-3xl font-black text-[#0b132b]">$842.20</p>
          <p className="mt-3 text-xs text-emerald-600">+12.5% vs avg</p>
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <p className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">
            Platform commission
          </p>
          <p className="mt-2 text-3xl font-black text-[#0b132b]">$1,245.90</p>
          <p className="mt-3 text-xs text-[#e63946]">Invoice sent</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="font-bold">Earnings ledger</h2>
            <p className="text-xs text-[#64748b]">Recent trip settlements</p>
          </div>
          <Button variant="outline" size="sm">
            <Download /> Export as CSV
          </Button>
        </div>
        <div className="divide-y text-xs">
          {[
            ['Sep 24, 2024', 'TRP-8821', '+$211.20', 'Completed'],
            ['Sep 24, 2024', 'TRP-8816', '+$182.60', 'Completed'],
            ['Sep 23, 2024', 'TRP-8794', '+$281.60', 'Pending'],
          ].map(([date, id, amount, status]) => (
            <div key={id} className="grid grid-cols-4 gap-3 p-5">
              <div>
                <b>{date}</b>
                <p className="text-[10px] text-[#94a3b8]">11:42 AM</p>
              </div>
              <span className="font-semibold">{id}</span>
              <b className={status === 'Pending' ? 'text-[#0b132b]' : 'text-emerald-600'}>
                {amount}
              </b>
              <span
                className={`justify-self-end rounded-full px-2 py-1 text-[10px] font-bold ${status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}
              >
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
      {payoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b132b]/45 p-4">
          <div className="w-full max-w-[420px] rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold">Request payout</h2>
                <p className="text-xs text-[#64748b]">
                  Funds will reach your account in 2-3 business days.
                </p>
              </div>
              <button onClick={() => setPayoutOpen(false)}>
                <X className="h-5 w-5 text-[#64748b]" />
              </button>
            </div>
            <p className="mt-6 text-[10px] font-bold tracking-widest text-[#64748b] uppercase">
              Payout amount
            </p>
            <div className="mt-2 rounded-xl border bg-[#f9fafb] p-4 text-2xl font-black">
              $1,482.50
            </div>
            <p className="mt-5 text-[10px] font-bold tracking-widest text-[#64748b] uppercase">
              Destination method
            </p>
            <div className="mt-2 flex items-center justify-between rounded-xl border-2 border-[#e63946] p-4">
              <span>
                <b>Chase Bank •••• 4242</b>
                <small className="block text-[10px] text-[#64748b]">
                  Stripe Connected Express Account
                </small>
              </span>
              <CreditCard className="h-5 w-5 text-[#e63946]" />
            </div>
            <Button
              variant="danger"
              className="mt-6 h-12 w-full tracking-widest uppercase"
              onClick={() => setSubmitted(true)}
            >
              {submitted ? (
                <>
                  <Check /> Payout requested
                </>
              ) : (
                'Confirm & withdraw'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
