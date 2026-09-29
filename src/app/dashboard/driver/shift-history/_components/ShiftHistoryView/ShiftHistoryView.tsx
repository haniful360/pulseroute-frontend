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
import { getMyTripsAction } from '@/services/trip.service';

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

const fallbackShiftData: ShiftLog[] = [
  {
    id: 'SFT-1049',
    shiftDate: 'Sep 23, 2024',
    startTime: '07:00 AM',
    endTime: '03:30 PM',
    duration: '8h 30m',
    dispatches: 8,
    avgResponse: '6.4 mins',
    rating: '5.0',
    status: 'Completed',
  },
  {
    id: 'SFT-1048',
    shiftDate: 'Sep 22, 2024',
    startTime: '03:00 PM',
    endTime: '11:00 PM',
    duration: '8h 00m',
    dispatches: 6,
    avgResponse: '7.1 mins',
    rating: '4.9',
    status: 'Completed',
  },
];

export default function ShiftHistoryView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [shifts, setShifts] = useState<ShiftLog[]>(fallbackShiftData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrips() {
      try {
        const res = await getMyTripsAction();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: ShiftLog[] = res.data.map((trip: any, index: number) => ({
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
            rating: '5.0',
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
          onClick={() => toast.success('Shift telemetry report exported.')}
          label="Export Logs"
          className="self-start sm:self-auto"
        />
      </div>

      {/* Metrics Row */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">MONTHLY SHIFTS</span>
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-black text-slate-900">22</p>
          <p className="mt-1 text-xs text-slate-500">176 Duty hours logged</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">AVG RESPONSE</span>
            <Timer className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-black text-emerald-600">6.4m</p>
          <p className="mt-1 text-xs text-slate-500">Target &lt; 8.0 mins</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">MISSIONS COMPLETED</span>
            <Activity className="h-5 w-5 text-[#E63946]" />
          </div>
          <p className="mt-2 text-3xl font-black text-slate-900">142</p>
          <p className="mt-1 text-xs text-emerald-600">100% successful transports</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">PARAMEDIC SCORE</span>
            <Flame className="h-5 w-5 text-amber-500" />
          </div>
          <p className="mt-2 text-3xl font-black text-slate-900">4.92</p>
          <p className="mt-1 text-xs text-slate-500">Top 3% in Dhaka Central</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recorded Shift Logs</h3>
            <p className="text-xs text-slate-500">Telemetry synced with Central PulseRoute Dispatche</p>
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

        <CustomTable columns={columns} data={filteredShifts} />
      </div>
    </div>
  );
}
