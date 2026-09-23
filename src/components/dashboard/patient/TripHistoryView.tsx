'use client';

import React, { useState } from 'react';
import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import DynamicModal from '@/components/dashboard/DynamicModal/DynamicModal';
import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import {
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Hospital,
  MapPin,
  Search,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

interface PatientTrip {
  id: string;
  date: string;
  ambulance: string;
  pickup: string;
  destination: string;
  driver: string;
  fare: string;
  status: string;
}

const trips: PatientTrip[] = [
  {
    id: '#8821',
    date: 'Sep 18, 2026',
    ambulance: 'ICU',
    pickup: 'Dhanmondi Road 27',
    destination: 'United Hospital, Gulshan-2',
    driver: 'Rahim Uddin',
    fare: 'BDT 3,500',
    status: 'Completed',
  },
  {
    id: '#8794',
    date: 'Aug 29, 2026',
    ambulance: 'AC',
    pickup: 'Lalmatia Block C',
    destination: 'Square Hospital, Panthapath',
    driver: 'Kamal Hossain',
    fare: 'BDT 2,200',
    status: 'Completed',
  },
  {
    id: '#8712',
    date: 'Aug 10, 2026',
    ambulance: 'Basic',
    pickup: 'Azimpur Govt Colony',
    destination: 'Dhaka Medical College',
    driver: 'Arif Hasan',
    fare: 'BDT 1,450',
    status: 'Completed',
  },
  {
    id: '#8668',
    date: 'Jul 22, 2026',
    ambulance: 'CCU',
    pickup: 'Uttara Sector 11',
    destination: 'Evercare Hospital Dhaka',
    driver: 'Nayeem Islam',
    fare: 'BDT 3,100',
    status: 'Cancelled',
  },
];

export default function TripHistoryView() {
  const [query, setQuery] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<PatientTrip | null>(null);

  const filteredTrips = trips.filter(
    (trip) =>
      trip.id.toLowerCase().includes(query.toLowerCase()) ||
      trip.destination.toLowerCase().includes(query.toLowerCase()) ||
      trip.driver.toLowerCase().includes(query.toLowerCase()),
  );

  const columns = [
    {
      header: 'Trip ID',
      cell: (trip: PatientTrip) => (
        <span className="font-mono font-bold text-slate-900">{trip.id}</span>
      ),
    },
    { header: 'Date', accessor: 'date' as keyof PatientTrip },
    {
      header: 'Ambulance Tier',
      cell: (trip: PatientTrip) => (
        <DynamicBadge text={trip.ambulance} color="#e63946" size="xs" />
      ),
    },
    { header: 'Destination', accessor: 'destination' as keyof PatientTrip },
    { header: 'Paramedic Driver', accessor: 'driver' as keyof PatientTrip },
    {
      header: 'Fare',
      cell: (trip: PatientTrip) => <span className="font-bold text-slate-900">{trip.fare}</span>,
    },
    {
      header: 'Status',
      cell: (trip: PatientTrip) => (
        <DynamicBadge
          text={trip.status}
          color={trip.status === 'Completed' ? '#10b981' : '#64748b'}
          size="sm"
        />
      ),
    },
    {
      header: 'Actions',
      cell: (trip: PatientTrip) => (
        <button
          onClick={() => setSelectedTrip(trip)}
          aria-label="View trip details"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-[#e63946] hover:text-[#e63946]"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DynamicPageHeader
          title="Patient Trip History"
          description="View records, paramedic telemetry logs, and hospital invoices of your previous emergency responses."
        />
        <DynamicActionButton
          variant="outline"
          icon={Download}
          iconPosition="left"
          onClick={() => toast.success('Trip log history exported as PDF.')}
          label="Download Invoice Logs"
          className="self-start sm:self-auto"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            TOTAL DISPATCHES
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">24</p>
          <p className="mt-1 text-xs font-semibold text-emerald-600">+3 trips this quarter</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            SUCCESS RATE
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">92%</p>
          <p className="mt-1 text-xs text-slate-500">22 Successful ER transports</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            TOTAL EXPENDITURE
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">BDT 48,750</p>
          <p className="mt-1 text-xs text-slate-500">Fully reconciled with insurance</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Completed Emergency Dispatches</h3>
            <p className="text-xs text-slate-500">Official hospital arrival telemetry and invoice details</p>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, hospital, or driver..."
              className="h-10 w-full sm:w-72 rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-xs focus:border-red-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <CustomTable columns={columns} data={filteredTrips} />
      </div>

      {/* Trip Details Modal */}
      <DynamicModal
        isOpen={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
        title={`Emergency Trip Details ${selectedTrip?.id || ''}`}
        description="Comprehensive dispatch logs and hospital triage confirmation."
        variant="light"
      >
        {selectedTrip && (
          <div className="space-y-4 pt-2 text-xs">
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Trip Date</span>
                <p className="font-bold text-slate-900">{selectedTrip.date}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                <p className="font-bold text-emerald-600">{selectedTrip.status}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Ambulance Tier</span>
                <p className="font-bold text-[#e63946]">{selectedTrip.ambulance} Support</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Fare Paid</span>
                <p className="font-bold text-slate-900">{selectedTrip.fare}</p>
              </div>
            </div>

            <div className="space-y-2 rounded-2xl border border-slate-100 p-4">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#e63946] shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Pickup</p>
                  <p className="text-slate-500">{selectedTrip.pickup}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Hospital className="h-4 w-4 text-blue-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Destination Hospital</p>
                  <p className="text-slate-500">{selectedTrip.destination}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <DynamicActionButton
                variant="outline"
                onClick={() => setSelectedTrip(null)}
                label="Close"
              />
              <DynamicActionButton
                variant="danger"
                icon={Download}
                iconPosition="left"
                onClick={() => toast.success(`Invoice for ${selectedTrip.id} downloaded.`)}
                label="Download Receipt"
              />
            </div>
          </div>
        )}
      </DynamicModal>
    </div>
  );
}
