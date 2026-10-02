'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getUserDashboardOverviewAction } from '@/services/user/user.service';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import {
  Activity,
  AlertTriangle,
  Ambulance,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  HeartPulse,
  Hospital,
  MapPin,
  Phone,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

import { PatientOverviewSkeleton } from '@/components/dashboard/skeletons/patient';

export default function PatientOverviewView() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const res = await getUserDashboardOverviewAction();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load patient dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return <PatientOverviewSkeleton />;
  }

  const patientName = profile?.name || user?.name || 'Valued Patient';
  const activeTrip = data?.activeTrip;
  const totalTrips = data?.totalTripsCount ?? 0;
  const completedTrips = data?.completedTripsCount ?? 0;
  const totalSpent = data?.spentAgg?._sum?.paidAmount ?? 0;
  const completeness = data?.completenessScore ?? 85;
  const unpaidInvoices = data?.unpaidInvoices ?? [];
  const recentTrips = data?.recentTrips ?? [];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0B132B] p-6 text-white shadow-xl sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span>Rapid Emergency Dispatch Network Live</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Hello, {patientName}
            </h1>
            <p className="max-w-xl text-xs text-slate-300 sm:text-sm">
              Your patient cockpit is active. GPS telemetry and certified paramedics are on standby
              across 12 zones in Dhaka.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/dashboard/patient/book-ambulance">
              <DynamicActionButton
                variant="danger"
                icon={Ambulance}
                showIcon
                label="Dispatch Ambulance"
                className="shadow-lg shadow-red-600/30"
              />
            </Link>
            <Link href="/dashboard/patient/medical-profile">
              <DynamicActionButton
                variant="outline"
                icon={ShieldCheck}
                showIcon
                label="Medical SOS Profile"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              />
            </Link>
          </div>
        </div>

        {/* Background accent glow */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-64 w-64 rounded-full bg-red-600/20 blur-3xl" />
      </div>

      {/* 2. Active Trip Emergency Alert (if trip in progress) */}
      {activeTrip && (
        <div className="animate-in fade-in slide-in-from-top-4 relative overflow-hidden rounded-3xl border-2 border-red-500 bg-red-50 p-6 text-slate-900 shadow-lg duration-300 sm:p-7">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md shadow-red-600/30">
                <Ambulance className="h-6 w-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-wider text-red-600 uppercase">
                    🚨 EMERGENCY DISPATCH ACTIVE
                  </span>
                  <span className="inline-block rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                    {activeTrip.status}
                  </span>
                </div>
                <h3 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
                  {activeTrip.vehicle?.ambulanceType || activeTrip.ambulanceType} Ambulance is{' '}
                  {activeTrip.status === 'EN_ROUTE' ? 'En Route to Pickup' : 'Assigned'}
                </h3>
                <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">
                  Pickup: <strong className="text-slate-800">{activeTrip.pickupAddress}</strong> •
                  Hospital: <strong className="text-slate-800">{activeTrip.destinationAddress || 'Assigned Center'}</strong>
                </p>
                {activeTrip.driver && (
                  <p className="mt-1 text-xs text-slate-500">
                    Driver:{' '}
                    <strong className="text-slate-800">{activeTrip.driver.name}</strong> (📞{' '}
                    <a
                      href={`tel:${activeTrip.driver.contactNumber}`}
                      className="font-bold text-red-600 underline"
                    >
                      {activeTrip.driver.contactNumber}
                    </a>
                    )
                  </p>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Link href={`/dashboard/patient/active-trip?tripId=${activeTrip.id}`}>
                <DynamicActionButton
                  variant="danger"
                  label="Open Live Cockpit Map"
                  icon={Activity}
                  showIcon
                  className="shadow-md shadow-red-600/25"
                />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. Summary Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Trips */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Total Dispatches
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Ambulance className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900">{totalTrips}</span>
            <p className="mt-1 text-xs text-slate-500">All emergency bookings to date</p>
          </div>
        </div>

        {/* Completed Trips */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Completed Safe
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900">{completedTrips}</span>
            <p className="mt-1 text-xs text-slate-500">Delivered directly to hospital ER</p>
          </div>
        </div>

        {/* Health Profile Score */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              SOS Readiness
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{completeness}%</span>
            <Link
              href="/dashboard/patient/medical-profile"
              className="text-xs font-bold text-red-600 hover:underline"
            >
              Update
            </Link>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-red-600 transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>

        {/* Invoices & Spending */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Total Settled
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 sm:text-3xl">
              BDT {Number(totalSpent).toLocaleString()}
            </span>
            <p className="mt-1 text-xs text-slate-500">
              {unpaidInvoices.length > 0 ? (
                <span className="font-bold text-amber-600">
                  {unpaidInvoices.length} pending invoice
                </span>
              ) : (
                'All invoices clear'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Recent Emergency Trips & Rapid Helplines */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Recent Trips (8 Cols) */}
        <div className="space-y-4 lg:col-span-8">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Emergency Trips</h3>
            <Link
              href="/dashboard/patient/trip-history"
              className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
            >
              <span>View Full History</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
            {recentTrips.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Ambulance className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-2 text-sm font-semibold text-slate-700">No emergency trips yet</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Your trip logs and paramedic reports will appear here automatically.
                </p>
                <Link href="/dashboard/patient/book-ambulance" className="mt-4 inline-block">
                  <DynamicActionButton
                    size="sm"
                    variant="danger"
                    label="Book Ambulance"
                  />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentTrips.map((trip: any) => (
                  <div
                    key={trip.id}
                    className="flex flex-col justify-between gap-3 p-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:p-5"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <Hospital className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {trip.tripCode || `#${trip.id.slice(-6).toUpperCase()}`}
                          </span>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                            {trip.ambulanceType || trip.vehicle?.ambulanceType}
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-medium text-slate-700">
                          To: {trip.destinationAddress || 'Hospital'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {new Date(trip.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-slate-900">
                          BDT {Number(trip.fare || 0).toLocaleString()}
                        </span>
                        <div className="mt-0.5">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              trip.status === 'COMPLETED'
                                ? 'bg-emerald-100 text-emerald-700'
                                : trip.status === 'CANCELLED'
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {trip.status}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={
                          trip.status === 'COMPLETED' || trip.status === 'CANCELLED'
                            ? `/dashboard/patient/trip-history`
                            : `/dashboard/patient/active-trip?tripId=${trip.id}`
                        }
                      >
                        <button className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Emergency Helplines & SOS Contacts (4 Cols) */}
        <div className="space-y-6 lg:col-span-4">
          {/* Rapid Triage Hotlines */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <PhoneCall className="h-4 w-4 text-red-600" />
              <h3 className="text-sm font-bold text-slate-900">24/7 National Emergency Hotlines</h3>
            </div>

            <div className="mt-4 space-y-3">
              <a
                href="tel:999"
                className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50/70 p-3 transition hover:bg-red-100"
              >
                <div>
                  <span className="text-xs font-bold text-red-800">999 National Emergency</span>
                  <p className="text-[11px] text-red-600">Police, Ambulance, Fire Service</p>
                </div>
                <span className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-extrabold text-white">
                  CALL 999
                </span>
              </a>

              <a
                href="tel:16263"
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:bg-slate-100"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800">16263 Health Helpline</span>
                  <p className="text-[11px] text-slate-500">Govt Health Service & Triage</p>
                </div>
                <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">
                  16263
                </span>
              </a>

              <a
                href="tel:333"
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:bg-slate-100"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800">333 Citizen Services</span>
                  <p className="text-[11px] text-slate-500">Disaster & Relief Assistance</p>
                </div>
                <span className="rounded-lg bg-slate-200 px-2.5 py-1 text-xs font-bold text-slate-800">
                  333
                </span>
              </a>
            </div>
          </div>

          {/* Quick SOS Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900">Need Immediate Help?</h4>
            <p className="mt-1 text-xs text-slate-500">
              One tap dispatches the closest paramedic team directly to your current GPS location.
            </p>
            <div className="mt-4">
              <Link href="/dashboard/patient/book-ambulance" className="block">
                <DynamicActionButton
                  fullWidth
                  variant="danger"
                  label="Dispatch Nearest Ambulance"
                  icon={Ambulance}
                  showIcon
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
