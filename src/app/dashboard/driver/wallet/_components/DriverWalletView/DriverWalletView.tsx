'use client';

import React, { useState } from 'react';
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

interface LedgerItem {
  id: string;
  date: string;
  time: string;
  tripId: string;
  amount: string;
  status: string;
  method: string;
}

const ledgerData: LedgerItem[] = [
  {
    id: '1',
    date: 'Sep 24, 2024',
    time: '11:42 AM',
    tripId: 'TRP-8821',
    amount: '+$211.20',
    status: 'Completed',
    method: 'Stripe Express',
  },
  {
    id: '2',
    date: 'Sep 24, 2024',
    time: '08:15 AM',
    tripId: 'TRP-8816',
    amount: '+$182.60',
    status: 'Completed',
    method: 'Stripe Express',
  },
  {
    id: '3',
    date: 'Sep 23, 2024',
    time: '04:30 PM',
    tripId: 'TRP-8794',
    amount: '+$281.60',
    status: 'Pending',
    method: 'Direct Bank',
  },
  {
    id: '4',
    date: 'Sep 22, 2024',
    time: '02:10 PM',
    tripId: 'TRP-8750',
    amount: '+$195.00',
    status: 'Completed',
    method: 'Stripe Express',
  },
];

export default function DriverWalletView() {
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('1482.50');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPayoutOpen(false);
      toast.success(`Withdrawal request of $${payoutAmount} submitted successfully!`);
    }, 1000);
  };

  const handleExportCSV = () => {
    toast.info('Exporting earnings ledger CSV...');
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
              <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-900">$1,482.50</h3>
              <p className="mt-2 text-xs text-slate-500">
                Next auto-settlement: <b className="text-slate-700">Sept 30</b>
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
                THIS MONTH EARNINGS
              </p>
              <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-900">$842.20</h3>
              <div className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+12.5% vs last month</span>
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
              <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-900">$14,245.90</h3>
              <p className="mt-2 text-xs text-slate-500">328 Completed emergency trips</p>
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

        <CustomTable columns={columns} data={ledgerData} />
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
            label="Payout Amount ($)"
            value={payoutAmount}
            onChange={(e) => setPayoutAmount(e.target.value)}
            type="number"
            step="0.01"
            required
            helperText="Maximum withdrawable amount: $1,482.50"
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
