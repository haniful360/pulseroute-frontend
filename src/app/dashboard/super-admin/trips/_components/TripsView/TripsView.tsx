'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Route, Activity, CheckCircle2, XCircle, Download, Search, ArrowRight, Ambulance } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { getAllTripsAction } from '@/services/trip.service';

interface TripRow {
  id: string;
  patient: string;
  driver: string;
  origin: string;
  destination: string;
  type: string;
  status: string;
  date: string;
}

export default function TripsView() {
  const [tripsList, setTripsList] = useState<TripRow[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrips() {
      setLoading(true);
      try {
        const res = await getAllTripsAction();
        if (res.success && res.data) {
          const list = Array.isArray((res.data as any).data) ? (res.data as any).data : res.data;
          if (Array.isArray(list)) {
            const mapped: TripRow[] = list.map((t: any) => {
              const statusDisplay = 
                t.status === 'COMPLETED' ? 'Completed' :
                t.status === 'CANCELLED' ? 'Cancelled' :
                ['EN_ROUTE', 'ARRIVED', 'IN_TRANSIT'].includes(t.status) ? 'In Transit' :
                'Critical';
              return {
                id: `TRP-${t.id.slice(-4).toUpperCase()}`,
                patient: t.patient?.name || 'Emergency Patient',
                driver: t.driver?.name || 'Paramedic On Duty',
                origin: t.pickupAddress || 'Dhaka',
                destination: t.destinationAddress || 'Hospital',
                type: t.ambulanceType || 'ICU',
                status: statusDisplay,
                date: new Date(t.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }),
              };
            });
            setTripsList(mapped);
          }
        }
      } catch (err) {
        console.error('Failed to load trips for admin:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, []);

  const tabs = ['All', 'Completed', 'In Transit', 'Critical', 'Cancelled'];

  const filteredTrips = useMemo(() => {
    return tripsList.filter(trip => {
      const matchesTab = activeTab === 'All' || trip.status === activeTab;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = trip.id.toLowerCase().includes(searchLower) ||
                            trip.patient.toLowerCase().includes(searchLower) ||
                            trip.driver.toLowerCase().includes(searchLower) ||
                            trip.origin.toLowerCase().includes(searchLower) ||
                            trip.destination.toLowerCase().includes(searchLower);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, tripsList]);

  const totalTripsCount = tripsList.length;
  const inTransitCount = tripsList.filter(t => t.status === 'In Transit').length;
  const completedCount = tripsList.filter(t => t.status === 'Completed').length;
  const criticalCount = tripsList.filter(t => t.status === 'Critical').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#E63946]">
            OPERATIONS CONTROL CENTER
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Trip Management &amp; Dispatch Log
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Real-time tracking of active and historical emergency ambulance dispatches across Dhaka.
          </p>
        </div>
      </div>

      {/* Dynamic Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Trips */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Total Dispatches</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Route className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            {loading ? (
              <Skeleton className="h-8 w-16 bg-slate-200 mt-1" />
            ) : (
              <div className="text-2xl font-black text-[#0b132b]">{totalTripsCount}</div>
            )}
            <div className="mt-1 text-xs font-medium text-emerald-600">Recorded on platform</div>
          </div>
        </div>

        {/* In Transit */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">In Transit</div>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            {loading ? (
              <Skeleton className="h-8 w-16 bg-slate-200 mt-1" />
            ) : (
              <div className="text-2xl font-black text-[#0b132b]">{inTransitCount}</div>
            )}
            <div className="mt-1 text-xs font-medium text-blue-600">Active en-route</div>
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Completed</div>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            {loading ? (
              <Skeleton className="h-8 w-16 bg-slate-200 mt-1" />
            ) : (
              <div className="text-2xl font-black text-[#0b132b]">{completedCount}</div>
            )}
            <div className="mt-1 text-xs font-medium text-emerald-600">Safely delivered</div>
          </div>
        </div>

        {/* Critical */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Critical Alerts</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <XCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            {loading ? (
              <Skeleton className="h-8 w-16 bg-slate-200 mt-1" />
            ) : (
              <div className="text-2xl font-black text-[#0b132b]">{criticalCount}</div>
            )}
            <div className="mt-1 text-xs font-medium text-red-600">High acuity response</div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-100 p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900">Emergency Dispatches</h2>
              <p className="text-xs font-medium text-slate-500 mt-1">
                {loading ? 'Loading trip records...' : `Showing ${filteredTrips.length} of ${tripsList.length} dispatch logs`}
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer',
                    activeTab === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  )}
                >
                  {tab === 'All' ? `All (${tripsList.length})` : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full max-w-md">
            <InputField
              placeholder="Search by ID, patient, driver, or hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4 text-slate-400" />}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f8fafc] text-[10px] tracking-wider text-[#64748b] uppercase border-b border-slate-100">
              <tr>
                <th className="px-5 py-4 font-bold">Trip ID</th>
                <th className="px-5 py-4 font-bold">Patient &amp; Driver</th>
                <th className="px-5 py-4 font-bold">Route (Pickup → Drop)</th>
                <th className="px-5 py-4 font-bold">Type</th>
                <th className="px-5 py-4 font-bold">Status</th>
                <th className="px-5 py-4 font-bold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [1, 2, 3, 4, 5].map((idx) => (
                  <tr key={idx} className="hover:bg-[#f8fafc]">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-20 bg-slate-200" />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap space-y-1.5">
                      <Skeleton className="h-4 w-32 bg-slate-200" />
                      <Skeleton className="h-3 w-28 bg-slate-200" />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap space-y-1.5">
                      <Skeleton className="h-4 w-44 bg-slate-200" />
                      <Skeleton className="h-3 w-36 bg-slate-200" />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-16 rounded-full bg-slate-200" />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-20 rounded-full bg-slate-200" />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <Skeleton className="h-4 w-20 bg-slate-200 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredTrips.length > 0 ? (
                filteredTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-[#f8fafc] transition-colors group">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded-md text-slate-700">
                        {trip.id}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{trip.patient}</div>
                      <div className="text-[10px] text-slate-400">Paramedic: {trip.driver}</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                        <span>{trip.origin}</span>
                        <ArrowRight className="h-3 w-3 text-slate-400" />
                        <span className="font-bold text-slate-900">{trip.destination}</span>
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
                        "rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                        trip.status === 'Completed' && "bg-emerald-50 text-emerald-600",
                        trip.status === 'In Transit' && "bg-blue-50 text-blue-600",
                        trip.status === 'Critical' && "bg-red-50 text-[#E63946]",
                        trip.status === 'Cancelled' && "bg-slate-100 text-slate-500"
                      )}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right font-medium text-slate-500 text-xs">
                      {trip.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500 text-sm">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                        <Route className="h-5 w-5" />
                      </div>
                      <p className="font-semibold text-slate-800">No emergency trips found</p>
                      <p className="text-xs text-slate-400 mt-0.5">Trips dispatched via mobile app or web portal will appear here.</p>
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
