'use client';

import React, { useState, useMemo } from 'react';
import { Route, Activity, CheckCircle2, XCircle, Download, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const tripsData = [
  { id: 'TRP-8821', patient: 'Rashida Khatun', driver: 'Rahim Uddin', origin: 'Dhanmondi', destination: 'Gulshan', type: 'ICU', status: 'Completed', date: 'Sep 24, 2026' },
  { id: 'TRP-8816', patient: 'Sajid Ahmed', driver: 'Kamal Hossain', origin: 'Uttara', destination: 'Banani', type: 'AC', status: 'In Transit', date: 'Sep 24, 2026' },
  { id: 'TRP-8794', patient: 'Mina Begum', driver: 'Arif Hasan', origin: 'Mirpur', destination: 'Square Hospital', type: 'Basic', status: 'Critical', date: 'Sep 24, 2026' },
  { id: 'TRP-8788', patient: 'Nusrat Jahan', driver: 'Nayeem Islam', origin: 'Gulshan', destination: 'Evercare', type: 'CCU', status: 'Completed', date: 'Sep 24, 2026' },
  { id: 'TRP-8776', patient: 'Abdul Karim', driver: 'Shakib Rahman', origin: 'Mohammadpur', destination: 'DMCH', type: 'ICU', status: 'In Transit', date: 'Sep 23, 2026' },
  { id: 'TRP-8770', patient: 'Fatema Akter', driver: 'Habib Chowdhury', origin: 'Bashundhara', destination: 'United Hospital', type: 'AC', status: 'Completed', date: 'Sep 23, 2026' },
  { id: 'TRP-8761', patient: 'Rafiq Hossain', driver: 'Jahid Alam', origin: 'Tejgaon', destination: 'Lab Aid', type: 'Basic', status: 'Cancelled', date: 'Sep 23, 2026' },
  { id: 'TRP-8755', patient: 'Sadia Islam', driver: 'Mamun Khan', origin: 'Banasree', destination: 'Apollo Hospital', type: 'ICU', status: 'Completed', date: 'Sep 22, 2026' },
];

export default function TripsView() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = ['All', 'Completed', 'In Transit', 'Critical', 'Cancelled'];

  const filteredTrips = useMemo(() => {
    return tripsData.filter(trip => {
      const matchesTab = activeTab === 'All' || trip.status === activeTab;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = trip.id.toLowerCase().includes(searchLower) ||
                            trip.patient.toLowerCase().includes(searchLower) ||
                            trip.driver.toLowerCase().includes(searchLower);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#E63946]">
          OPERATIONS CONTROL CENTER
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Trip Management & Dispatch Logs
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Search, filter, and audit ongoing and past emergency dispatches and patient transfers.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total trips */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Total trips</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Route className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#0b132b]">1,240</div>
            <div className="mt-1 text-xs font-medium text-emerald-600">+86 this month</div>
          </div>
        </div>

        {/* In progress */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">In progress</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#0b132b]">18</div>
            <div className="mt-1 text-xs font-medium text-amber-600">3 critical</div>
          </div>
        </div>

        {/* Completed today */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Completed today</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#0b132b]">142</div>
            <div className="mt-1 text-xs font-medium text-emerald-600">+11.4%</div>
          </div>
        </div>

        {/* Cancelled */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Cancelled</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <XCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#0b132b]">8</div>
            <div className="mt-1 text-xs font-medium text-emerald-600">-2.1%</div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="border-b border-slate-100 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900">Dispatch Records</h2>
              <p className="mt-1 text-xs text-slate-500">Showing {filteredTrips.length} of {tripsData.length} trips</p>
            </div>
            <Button variant="outline" size="sm" className="h-9 rounded-xl">
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full items-center gap-1 overflow-x-auto rounded-2xl bg-slate-100 p-1 sm:w-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'flex-shrink-0 rounded-xl px-4 py-1.5 text-xs font-bold transition-all',
                    activeTab === tab
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search ID, patient, driver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-xl bg-slate-50 pl-9 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f8fafc] text-[10px] tracking-wider text-[#64748b] uppercase">
              <tr>
                <th className="px-5 py-4 font-bold">Trip ID</th>
                <th className="px-5 py-4 font-bold">Patient</th>
                <th className="px-5 py-4 font-bold">Driver</th>
                <th className="px-5 py-4 font-bold">Route</th>
                <th className="px-5 py-4 font-bold">Type</th>
                <th className="px-5 py-4 font-bold">Status</th>
                <th className="px-5 py-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrips.map((trip) => (
                <tr key={trip.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs font-semibold text-slate-500">{trip.id}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-medium text-slate-900">{trip.patient}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-600">{trip.driver}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span>{trip.origin}</span>
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                      <span>{trip.destination}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
                      trip.type === 'ICU' && "bg-red-50 text-[#E63946] border-red-200",
                      trip.type === 'AC' && "bg-blue-50 text-blue-600 border-blue-200",
                      trip.type === 'Basic' && "bg-slate-100 text-slate-600 border-slate-200",
                      trip.type === 'CCU' && "bg-purple-50 text-purple-600 border-purple-200"
                    )}>
                      {trip.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                      trip.status === 'Completed' && "bg-emerald-50 text-emerald-600",
                      trip.status === 'In Transit' && "bg-blue-50 text-blue-600",
                      trip.status === 'Critical' && "bg-red-50 text-[#E63946]",
                      trip.status === 'Cancelled' && "bg-slate-100 text-slate-600"
                    )}>
                      {trip.status === 'Critical' && <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>}
                      {trip.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <button className="text-xs font-bold text-[#E63946] hover:text-red-700">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
