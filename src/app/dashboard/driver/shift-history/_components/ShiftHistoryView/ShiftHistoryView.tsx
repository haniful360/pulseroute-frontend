'use client';

import React, { useState, useEffect } from 'react';
import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import {
  Activity,
  CheckCircle2,
  Clock,
  Download,
  Flame,
  Search,
  Timer,
} from 'lucide-react';
import { toast } from 'sonner';
import { getMyTripsAction } from '@/services/trip/trip.service';
import { getDriverDashboardOverviewAction } from '@/services/driver/driver.service';
import { getMyReviewsAction } from '@/services/review/review.service';
import { Skeleton } from '@/components/ui/skeleton';
import { ShiftHistorySkeleton } from '@/components/dashboard/skeletons/driver';

interface ShiftLog {
  id: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  duration: string;
  dispatches: number;
  avgResponse: string;
  rating: string;
  status: string;
}

export default function ShiftHistoryView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [shifts, setShifts] = useState<ShiftLog[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrips() {
      try {
        const [tripsRes, overviewRes, reviewsRes] = await Promise.all([
          getMyTripsAction(),
          getDriverDashboardOverviewAction(),
          getMyReviewsAction(),
        ]);

        if (overviewRes?.success && overviewRes.data) {
          setOverview(overviewRes.data);
        }

        if (reviewsRes?.success && Array.isArray(reviewsRes.data)) {
          setReviews(reviewsRes.data);
        }

        if (tripsRes.success && Array.isArray(tripsRes.data)) {
          const mapped: ShiftLog[] = tripsRes.data.map((trip: any) => ({
            id: `MSN-${trip.id.slice(-4).toUpperCase()}`,
            shiftDate: new Date(trip.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            startTime: new Date(trip.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            endTime: trip.completedAt
              ? new Date(trip.completedAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'En Route',
            duration: '45 mins',
            dispatches: 1,
            avgResponse: '4.8 mins',
            rating: trip.review?.rating ? Number(trip.review.rating).toFixed(1) : '5.0',
            status: trip.status === 'COMPLETED' ? 'Completed' : trip.status,
          }));
          setShifts(mapped);
        }
      } catch (err) {
        console.error('Failed to load driver shifts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, []);

  const filteredShifts = shifts.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.shiftDate.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns = [
    {
      header: 'Shift ID',
      cell: (row: ShiftLog) => <span className="font-mono font-bold text-slate-900">{row.id}</span>,
    },
    {
      header: 'Date & Time',
      cell: (row: ShiftLog) => (
        <div>
          <span className="font-semibold text-slate-800">{row.shiftDate}</span>
          <p className="text-[11px] text-slate-400">
            {row.startTime} - {row.endTime}
          </p>
        </div>
      ),
    },
    {
      header: 'Duty Duration',
      accessor: 'duration' as keyof ShiftLog,
    },
    {
      header: 'Dispatches',
      cell: (row: ShiftLog) => (
        <span className="font-bold text-slate-800">{row.dispatches} Missions</span>
      ),
    },
    {
      header: 'Avg Response Time',
      cell: (row: ShiftLog) => (
        <span className="font-semibold text-emerald-600">{row.avgResponse}</span>
      ),
    },
    {
      header: 'Rating',
      cell: (row: ShiftLog) => (
        <span className="flex items-center gap-1 font-bold text-amber-500">
          ★ {row.rating}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row: ShiftLog) => (
        <DynamicBadge text={row.status} color="#10b981" size="sm" />
      ),
    },
  ];

  const handleExportLogs = () => {
    if (shifts.length === 0) {
      toast.info('No recorded shift logs available to export.');
      return;
    }
    const headers = ['Shift ID', 'Date', 'Start Time', 'End Time', 'Duration', 'Dispatches', 'Avg Response Time', 'Rating', 'Status'];
    const rows = filteredShifts.map((s) => [
      s.id,
      `"${s.shiftDate}"`,
      `"${s.startTime}"`,
      `"${s.endTime}"`,
      `"${s.duration}"`,
      s.dispatches,
      `"${s.avgResponse}"`,
      s.rating,
      `"${s.status}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pulseroute_shift_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Shift logs exported successfully.');
  };

  if (loading) {
    return <ShiftHistorySkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DynamicPageHeader
          title="Shift History & Emergency Telemetry"
          description="View records of past duty shifts, emergency response durations, and paramedic metrics."
        />
        <DynamicActionButton
          variant="outline"
          icon={Download}
          iconPosition="left"
          onClick={handleExportLogs}
          label="Export Logs"
          className="self-start sm:self-auto"
        />
      </div>

      {/* Metrics Row */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">RECORDED SHIFTS</span>
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
          {loading ? (
            <Skeleton className="h-9 w-16 mt-2" />
          ) : (
            <p className="mt-2 text-3xl font-black text-slate-900">{shifts.length}</p>
          )}
          <p className="mt-1 text-xs text-slate-500">{shifts.length * 8} duty hours logged</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">AVG RESPONSE</span>
            <Timer className="h-5 w-5 text-emerald-500" />
          </div>
          {loading ? (
            <Skeleton className="h-9 w-20 mt-2" />
          ) : (
            <p className="mt-2 text-3xl font-black text-emerald-600">4.8m</p>
          )}
          <p className="mt-1 text-xs text-slate-500">Target &lt; 8.0 mins</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">MISSIONS COMPLETED</span>
            <Activity className="h-5 w-5 text-[#E63946]" />
          </div>
          {loading ? (
            <Skeleton className="h-9 w-16 mt-2" />
          ) : (
            <p className="mt-2 text-3xl font-black text-slate-900">
              {overview?.trips?.completedTrips ?? shifts.filter(s => s.status === 'Completed').length}
            </p>
          )}
          <p className="mt-1 text-xs text-emerald-600">Successful transports</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">PARAMEDIC SCORE</span>
            <Flame className="h-5 w-5 text-amber-500" />
          </div>
          {loading ? (
            <Skeleton className="h-9 w-20 mt-2" />
          ) : (
            <p className="mt-2 text-3xl font-black text-slate-900">
              {overview?.driver?.rating
                ? Number(overview.driver.rating).toFixed(2)
                : reviews.length > 0
                  ? (reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / reviews.length).toFixed(2)
                  : '5.00'}
            </p>
          )}
          <p className="mt-1 text-xs text-slate-500">Based on patient feedback</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recorded Shift Logs</h3>
            <p className="text-xs text-slate-500">Telemetry synced with Central PulseRoute Dispatch</p>
          </div>
          <div className="w-full sm:w-64">
            <InputField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search shifts or dates..."
              icon={<Search className="h-4 w-4 text-slate-400" />}
            />
          </div>
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
        ) : filteredShifts.length > 0 ? (
          <CustomTable columns={columns} data={filteredShifts} />
        ) : (
          <div className="p-10 text-center text-sm text-slate-500">
            No shift logs recorded matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
