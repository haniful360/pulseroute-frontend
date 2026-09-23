'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Activity,
  Ambulance,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Check,
  Download,
  Filter,
  Plus,
  Radio,
  Search,
  Settings2,
  ShieldCheck,
  UserRound,
  Wallet,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type Row = Record<string, string>;
type AdminDataViewProps = {
  eyebrow?: string;
  title: string;
  description: string;
  stats?: { label: string; value: string; delta: string; positive?: boolean }[];
  columns?: string[];
  rows?: Row[];
  searchPlaceholder?: string;
  filters?: string[];
  map?: boolean;
  form?: 'pricing' | 'announcement' | 'settings';
  actionLabel?: string;
};

const icons = [Activity, Ambulance, Wallet, UserRound];

export default function AdminDataView({
  eyebrow = 'OPERATIONS CONTROL CENTER',
  title,
  description,
  stats = [],
  columns = [],
  rows = [],
  searchPlaceholder = 'Search records...',
  filters = [],
  map = false,
  form,
  actionLabel,
}: AdminDataViewProps) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [saved, setSaved] = useState(false);
  const filteredRows = useMemo(
    () =>
      rows.filter(
        (row) =>
          Object.values(row).join(' ').toLowerCase().includes(query.toLowerCase()) &&
          (activeFilter === 'All' || Object.values(row).includes(activeFilter)),
      ),
    [activeFilter, query, rows],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#e63946] uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#0b132b] sm:text-3xl">
            {title}
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-[#64748b]">{description}</p>
        </div>
        {actionLabel && (
          <Button variant="danger" onClick={() => setSaved(true)}>
            <Plus /> {actionLabel}
          </Button>
        )}
      </div>

      {stats.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <p className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">
                    {stat.label}
                  </p>
                  <span className="rounded-lg bg-red-50 p-2 text-[#e63946]">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-4 text-2xl font-black text-[#0b132b]">{stat.value}</p>
                <p
                  className={`mt-2 flex items-center gap-1 text-[10px] font-bold ${stat.positive === false ? 'text-[#e63946]' : 'text-emerald-600'}`}
                >
                  {stat.positive === false ? (
                    <ArrowDownRight className="h-3 w-3" />
                  ) : (
                    <ArrowUpRight className="h-3 w-3" />
                  )}
                  {stat.delta}
                </p>
              </div>
            );
          })}
        </div>
      )}
      {map && (
        <div className="relative min-h-[440px] overflow-hidden rounded-2xl border bg-[#d6d8dc] shadow-sm">
          <div className="absolute inset-0 bg-[url('/assets/dashboard/driver/dhaka_radar_map.png')] bg-cover bg-center opacity-80" />
          <div className="absolute inset-0 bg-slate-900/10" />
          <div className="absolute top-5 left-5 rounded-xl bg-white p-4 shadow-xl">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 animate-pulse text-[#e63946]" />
              <p className="text-xs font-bold">Fleet coverage live</p>
            </div>
            <p className="mt-2 text-2xl font-black">
              84 <span className="text-xs font-semibold text-[#64748b]">active units</span>
            </p>
            <p className="mt-1 text-[10px] text-[#64748b]">12 currently responding to trips</p>
          </div>
          {[
            ['Dhanmondi', 'left-[38%] top-[42%]'],
            ['Gulshan', 'right-[24%] top-[27%]'],
            ['Uttara', 'right-[18%] bottom-[24%]'],
          ].map(([label, position]) => (
            <div key={label} className={`absolute ${position} flex flex-col items-center`}>
              <span className="rounded-full border-2 border-white bg-[#e63946] p-2 text-white shadow-lg">
                <Ambulance className="h-4 w-4" />
              </span>
              <span className="mt-1 rounded bg-[#0b132b] px-2 py-1 text-[9px] font-bold text-white">
                {label}
              </span>
            </div>
          ))}
          <div className="absolute right-4 bottom-4 left-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#0b132b]/90 px-4 py-3 text-xs text-white">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> GPS telemetry
              synchronized
            </span>
            <span className="text-slate-300">Last update: 12 seconds ago</span>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <Settings2 /> Map layers
            </Button>
          </div>
        </div>
      )}

      {form && (
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[#0b132b]">
                  {form === 'pricing'
                    ? 'Fare schedule'
                    : form === 'announcement'
                      ? 'Compose broadcast'
                      : 'Platform configuration'}
                </h2>
                <p className="text-xs text-[#64748b]">
                  Changes are saved locally for this workspace.
                </p>
              </div>
              {saved && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <Check className="h-4 w-4" /> Saved
                </span>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {(form === 'pricing'
                ? [
                    'Base fare (BDT)',
                    'Per kilometer (BDT)',
                    'ICU surcharge (BDT)',
                    'Night surcharge (%)',
                  ]
                : form === 'announcement'
                  ? ['Broadcast title', 'Audience']
                  : [
                      'Dispatch SLA (minutes)',
                      'Radar refresh (seconds)',
                      'Support email',
                      'Webhook endpoint',
                    ]
              ).map((label) => (
                <label key={label} className="text-xs font-bold text-[#334155]">
                  {label}
                  <Input className="mt-2 h-10" placeholder={label} />
                </label>
              ))}
            </div>
            {form === 'announcement' && (
              <label className="mt-4 block text-xs font-bold text-[#334155]">
                Message
                <textarea
                  className="mt-2 min-h-28 w-full rounded-lg border p-3 text-sm outline-none"
                  placeholder="Write an operational update for the fleet..."
                />
              </label>
            )}
            <Button variant="danger" className="mt-5" onClick={() => setSaved(true)}>
              Save changes
            </Button>
          </div>
          <div className="rounded-2xl border bg-[#0b132b] p-5 text-white">
            <p className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase">
              Control status
            </p>
            <div className="mt-5 space-y-4 text-xs">
              <p className="flex items-center justify-between">
                <span className="text-slate-400">Security</span>
                <b className="text-emerald-400">Protected</b>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-400">Last sync</span>
                <b>2 mins ago</b>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-slate-400">Audit trail</span>
                <b>Enabled</b>
              </p>
            </div>
            <div className="mt-8 rounded-xl bg-white/10 p-3 text-[10px] leading-relaxed text-slate-300">
              <ShieldCheck className="mb-2 h-5 w-5 text-emerald-400" />
              Every admin action is recorded with actor, timestamp, and previous value.
            </div>
          </div>
        </div>
      )}

      {columns.length > 0 && (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
            <div>
              <h2 className="font-bold text-[#0b132b]">Records</h2>
              <p className="text-xs text-[#64748b]">
                Showing {filteredRows.length} of {rows.length} records
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute top-2.5 left-3 h-4 w-4 text-[#94a3b8]" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-9 w-52 pl-9 text-xs"
                  placeholder={searchPlaceholder}
                />
              </div>
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex h-9 items-center gap-1 rounded-lg border px-3 text-xs font-semibold ${activeFilter === filter ? 'border-[#e63946] bg-red-50 text-[#e63946]' : 'text-[#64748b]'}`}
                >
                  <Filter className="h-3 w-3" />
                  {filter}
                </button>
              ))}
              <Button variant="outline" size="sm">
                <Download /> Export
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-[10px] tracking-wider text-[#64748b] uppercase">
                <tr>
                  {columns.map((column) => (
                    <th key={column} className="px-5 py-4 font-bold">
                      {column}
                    </th>
                  ))}
                  <th className="px-5 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredRows.map((row) => (
                  <tr key={row.id ?? JSON.stringify(row)} className="hover:bg-[#f8fafc]">
                    <>
                      {columns.map((column) => (
                        <td key={column} className="px-5 py-4 whitespace-nowrap text-[#334155]">
                          {column === 'Status' ? (
                            <span
                              className={`rounded-full px-2 py-1 text-[10px] font-bold ${row[column] === 'Active' || row[column] === 'Completed' || row[column] === 'Online' ? 'bg-emerald-50 text-emerald-600' : row[column] === 'Critical' || row[column] === 'Suspended' ? 'bg-red-50 text-[#e63946]' : 'bg-amber-50 text-amber-600'}`}
                            >
                              {row[column]}
                            </span>
                          ) : (
                            row[column]
                          )}
                        </td>
                      ))}
                    </>
                    <td className="px-5 py-4 text-right">
                      <button className="text-[#64748b] hover:text-[#e63946]">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {!map && !form && columns.length === 0 && (
        <div className="rounded-2xl border border-dashed bg-white p-10 text-center">
          <Bell className="mx-auto h-8 w-8 text-[#e63946]" />
          <h2 className="mt-3 font-bold">No records configured</h2>
          <p className="mt-1 text-sm text-[#64748b]">
            Connect this workspace to the platform API to load live records.
          </p>
        </div>
      )}
    </div>
  );
}
