'use client';

import { Button } from '@/components/ui/button';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
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
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getAllSettingsAction, upsertSettingAction } from '@/services/setting.service';

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
  const [dispatchSla, setDispatchSla] = useState('8');
  const [radarRefresh, setRadarRefresh] = useState('15');
  const [maxRadius, setMaxRadius] = useState('25');
  const [reassignTimeout, setReassignTimeout] = useState('3');

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await getAllSettingsAction();
        if (res.success && Array.isArray(res.data)) {
          const sla = res.data.find((s: any) => s.key === 'DISPATCH_SLA_TIMEOUT');
          if (sla) setDispatchSla(String(sla.value));
          const rad = res.data.find((s: any) => s.key === 'MAX_DISPATCH_RADIUS');
          if (rad) setMaxRadius(String(rad.value));
        }
      } catch {
        // use defaults
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        upsertSettingAction({ key: 'DISPATCH_SLA_TIMEOUT', value: dispatchSla, category: 'DISPATCH' }),
        upsertSettingAction({ key: 'MAX_DISPATCH_RADIUS', value: maxRadius, category: 'DISPATCH' }),
      ]);
      setSaved(true);
      toast.success('Platform operational settings synchronized with backend.');
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
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
              <InputField
                label="Dispatch SLA Timeout (minutes)"
                value={dispatchSla}
                onChange={(e) => setDispatchSla(e.target.value)}
              />
              <InputField
                label="Fleet Radar Refresh (seconds)"
                value={radarRefresh}
                onChange={(e) => setRadarRefresh(e.target.value)}
              />
              <InputField
                label="Max Dispatch Radius (km)"
                value={maxRadius}
                onChange={(e) => setMaxRadius(e.target.value)}
              />
              <InputField
                label="Auto-reassign Timeout (minutes)"
                value={reassignTimeout}
                onChange={(e) => setReassignTimeout(e.target.value)}
              />
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
                <div className="w-28">
                  <InputField value="30" />
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 py-3">
                <span className="text-xs font-bold text-[#334155]">Max Login Attempts</span>
                <div className="w-28">
                  <InputField value="5" />
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
              <InputField
                label="Primary Webhook URL"
                value="https://api.pulseroute.com/webhooks/dispatch"
              />
              <InputField
                label="Stripe Webhook Secret"
                type="password"
                value="whsec_1234567890abcdef"
              />
              <InputField
                label="Support Email"
                value="ops@pulseroute.com"
              />
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
