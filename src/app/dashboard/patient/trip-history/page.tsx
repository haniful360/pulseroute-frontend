"use client";
import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import { Download, Eye, FileText, Filter, Search } from 'lucide-react';
import { useState } from 'react';

type Trip = {
  id: string;
  date: string;
  ambulance: string;
  destination: string;
  driver: string;
  fare: string;
  status: string;
};

const trips: Trip[] = [
  {
    id: '#8821',
    date: 'Sep 18, 2026',
    ambulance: 'ICU',
    destination: 'United Hospital, Gulshan-2',
    driver: 'Rahim Uddin',
    fare: 'BDT 3,500',
    status: 'Completed',
  },
  {
    id: '#8794',
    date: 'Aug 29, 2026',
    ambulance: 'AC',
    destination: 'Square Hospital, Panthapath',
    driver: 'Kamal Hossain',
    fare: 'BDT 2,200',
    status: 'Completed',
  },
  {
    id: '#8712',
    date: 'Aug 10, 2026',
    ambulance: 'Basic',
    destination: 'Dhaka Medical College',
    driver: 'Arif Hasan',
    fare: 'BDT 1,450',
    status: 'Completed',
  },
  {
    id: '#8668',
    date: 'Jul 22, 2026',
    ambulance: 'CCU',
    destination: 'Evercare Hospital Dhaka',
    driver: 'Nayeem Islam',
    fare: 'BDT 3,100',
    status: 'Cancelled',
  },
];

export default function TripHistoryPage() {
  const [query, setQuery] = useState('');
  const filteredTrips = trips.filter((trip) =>
    `${trip.id} ${trip.destination} ${trip.driver}`.toLowerCase().includes(query.toLowerCase()),
  );
  const columns = [
    {
      header: 'Trip ID',
      cell: (trip: Trip) => <span className="font-bold text-[#0b132b]">{trip.id}</span>,
    },
    { header: 'Date', accessor: 'date' as keyof Trip },
    {
      header: 'Ambulance',
      cell: (trip: Trip) => (
        <span className="rounded bg-red-50 px-2 py-1 text-[10px] font-bold text-[#e63946] uppercase">
          {trip.ambulance}
        </span>
      ),
    },
    { header: 'Destination', accessor: 'destination' as keyof Trip },
    { header: 'Driver', accessor: 'driver' as keyof Trip },
    { header: 'Fare', accessor: 'fare' as keyof Trip },
    {
      header: 'Status',
      cell: (trip: Trip) => (
        <span
          className={`rounded-full px-2 py-1 text-[10px] font-bold ${trip.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}
        >
          {trip.status}
        </span>
      ),
    },
    {
      header: '',
      cell: () => (
        <button aria-label="View trip details" className="text-[#64748b] hover:text-[#e63946]">
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Trip History"
        description="View records and paramedic summaries of your previous emergency and scheduled trips."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">
            Total trips
          </p>
          <p className="mt-2 text-2xl font-bold">24</p>
          <p className="text-[10px] text-emerald-600">+3 this month</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">
            Completed
          </p>
          <p className="mt-2 text-2xl font-bold">22</p>
          <p className="text-[10px] text-[#64748b]">92% completion rate</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">
            Total spent
          </p>
          <p className="mt-2 text-2xl font-bold">BDT 48,750</p>
          <p className="text-[10px] text-[#64748b]">Across all trips</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
          <div>
            <h3 className="font-bold text-[#0b132b]">All trip records</h3>
            <p className="text-xs text-[#64748b]">Dispatch, destination, and invoice history</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-[#94a3b8]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-9 w-48 rounded-lg border pr-3 pl-9 text-xs outline-none"
                placeholder="Search trips..."
              />
            </div>
            <button className="flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold">
              <Filter className="h-3.5 w-3.5" /> Filter
            </button>
            <button className="flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold">
              <Download className="h-3.5 w-3.5" /> Export
            </button>
          </div>
        </div>
        <CustomTable columns={columns} data={filteredTrips} />
      </div>
      <div className="flex items-center gap-2 text-xs text-[#64748b]">
        <FileText className="h-4 w-4" /> Invoices are available for every completed trip.
      </div>
    </div>
  );
}
