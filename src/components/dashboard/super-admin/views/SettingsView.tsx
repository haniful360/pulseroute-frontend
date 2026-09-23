'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Activity,
  Bell,
  CheckCircle2,
  FileText,
  Globe,
  Lock,
  Save,
  Settings2,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';

const auditEvents = [
  { action: 'Pricing updated', actor: 'Rahat Mahmud', time: '2 min ago', type: 'config' },
  {
    action: 'Driver #DRV-8821 approved',
    actor: 'System (Auto-KYC)',
    time: '15 min ago',
    type: 'approval',
  },
  { action: 'Webhook endpoint changed', actor: 'Rahat Mahmud', time: '1 hr ago', type: 'config' },
  {
    action: 'Emergency broadcast sent',
    actor: 'Rahat Mahmud',
    time: '3 hrs ago',
    type: 'broadcast',
  },
];

export default function SettingsView() {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-bold tracking-[0.2em] text-[#E63946] uppercase">
            OPERATIONS CONTROL CENTER
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Super Admin System Settings
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Configure validation webhook endpoints, security controls, and platform operations
            preferences.
          </p>
        </div>
        <Button
          variant="danger"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Configuration'}
        </Button>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">
              Security posture
            </span>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <span className="text-2xl font-black text-[#0b132b]">Strong</span>
            <span className="text-xs font-medium text-slate-500">2FA enforced</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">
              API health
            </span>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <span className="text-2xl font-black text-[#0b132b]">99.98%</span>
            <span className="text-xs font-medium text-slate-500">All services online</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">
              Audit events
            </span>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <span className="text-2xl font-black text-[#0b132b]">18,402</span>
            <span className="text-xs font-medium text-slate-500">Last 30 days</span>
          </div>
        </div>
      </div>

      {/* Two-column Layout */}
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* Left column: Settings Sections */}
        <div className="space-y-5">
          {/* Card 1: Dispatch Configuration */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-slate-700" />
              <h2 className="text-sm font-bold tracking-tight text-slate-900">
                Dispatch Configuration
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500">Core ambulance dispatch parameters</p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold text-[#334155]">
                  Dispatch SLA Timeout (minutes)
                </label>
                <Input defaultValue="8" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-[#334155]">
                  Fleet Radar Refresh (seconds)
                </label>
                <Input defaultValue="15" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-[#334155]">
                  Max Dispatch Radius (km)
                </label>
                <Input defaultValue="25" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-[#334155]">
                  Auto-reassign Timeout (minutes)
                </label>
                <Input defaultValue="3" />
              </div>
            </div>
          </div>

          {/* Card 2: Security & Authentication */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-slate-700" />
              <h2 className="text-sm font-bold tracking-tight text-slate-900">
                Security & Authentication
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Admin access controls and session policies
            </p>

            <div className="mt-4">
              <div className="flex items-center justify-between border-b border-slate-100 py-3">
                <span className="text-xs font-bold text-[#334155]">Two-Factor Authentication</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-slate-600">
                    Enforced for all admins
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 py-3">
                <span className="text-xs font-bold text-[#334155]">Session Timeout (minutes)</span>
                <div className="w-24">
                  <Input defaultValue="30" />
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 py-3">
                <span className="text-xs font-bold text-[#334155]">Max Login Attempts</span>
                <div className="w-24">
                  <Input defaultValue="5" />
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-xs font-bold text-[#334155]">IP Allowlist</span>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
                    192.168.1.0/24
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
                    10.0.0.0/8
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: API & Webhooks */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-slate-700" />
              <h2 className="text-sm font-bold tracking-tight text-slate-900">
                API & Webhook Endpoints
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500">External service integrations</p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold text-[#334155]">
                  Primary Webhook URL
                </label>
                <Input defaultValue="https://api.pulseroute.com/webhooks/dispatch" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-[#334155]">
                  Stripe Webhook Secret
                </label>
                <Input type="password" defaultValue="whsec_1234567890abcdef" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-[#334155]">Support Email</label>
                <Input defaultValue="ops@pulseroute.com" />
              </div>
            </div>
          </div>

          {/* Card 4: Notification Preferences */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-slate-700" />
              <h2 className="text-sm font-bold tracking-tight text-slate-900">
                Notification Preferences
              </h2>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between border-b border-slate-100 py-3">
                <span className="text-xs font-medium text-slate-700">Email Notifications</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                  Enabled
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 py-3">
                <span className="text-xs font-medium text-slate-700">
                  SMS Alerts for Critical Dispatches
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                  Enabled
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 py-3">
                <span className="text-xs font-medium text-slate-700">Weekly Revenue Report</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                  Enabled
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-xs font-medium text-slate-700">
                  Fleet Maintenance Reminders
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                  Enabled
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="danger" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* System Health card */}
          <div className="rounded-2xl bg-[#0b132b] p-5 text-white">
            <div className="text-[10px] font-bold tracking-widest text-[#94a3b8] uppercase">
              SYSTEM HEALTH
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Platform API</span>
                <span className="font-bold text-emerald-400">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Database</span>
                <span className="font-bold text-emerald-400">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Stripe Gateway</span>
                <span className="font-bold text-emerald-400">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">SMS Provider</span>
                <span className="font-bold text-emerald-400">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">GPS Service</span>
                <span className="font-bold text-amber-400">Degraded</span>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded bg-white/10 p-3 text-[10px] text-slate-300">
              <Activity className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <p>
                System uptime: 99.98% over the last 30 days. All critical services are operational.
              </p>
            </div>
          </div>

          {/* Audit Log Preview card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <h3 className="mb-4 text-sm font-bold tracking-tight text-slate-900">
              Recent Audit Events
            </h3>

            <div className="flex flex-col gap-4">
              {auditEvents.map((event, i) => (
                <div key={i} className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <div
                      className={cn(
                        'mt-1 h-2 w-2 shrink-0 rounded-full',
                        event.type === 'config'
                          ? 'bg-blue-500'
                          : event.type === 'approval'
                            ? 'bg-emerald-500'
                            : 'bg-amber-500',
                      )}
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{event.action}</p>
                      <p className="text-[11px] text-slate-500">{event.actor}</p>
                    </div>
                  </div>
                  <span className="text-[11px] whitespace-nowrap text-slate-500">{event.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
