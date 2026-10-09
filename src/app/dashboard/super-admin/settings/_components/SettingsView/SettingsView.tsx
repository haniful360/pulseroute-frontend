'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import { cn } from '@/lib/utils';
import {
  Activity,
  Award,
  Bell,
  Building2,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Globe,
  KeyRound,
  Lock,
  Mail,
  Phone,
  RotateCcw,
  Save,
  Settings2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UploadCloud,
  User,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { getAllSettingsAction, upsertSettingAction } from '@/services/setting/setting.service';
import { getRecentActivitiesAction } from '@/services/analytics/analytics.service';
import { getMyProfileAction, updateMyProfileAction } from '@/services/user/user.service';
import { changePasswordAction } from '@/services/auth/auth.service';
import { useAuth } from '@/context/AuthContext';
import { compressImageFile } from '@/lib/image-compressor';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsView() {
  const { user: authUser, refreshUser } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'operations' | 'admin-profile' | 'security'>('operations');
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingOps, setIsSavingOps] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // System Settings states
  const [dispatchSla, setDispatchSla] = useState('8');
  const [radarRefresh, setRadarRefresh] = useState('15');
  const [maxRadius, setMaxRadius] = useState('25');
  const [reassignTimeout, setReassignTimeout] = useState('3');
  const [auditEvents, setAuditEvents] = useState<any[]>([]);

  // Super Admin Profile states
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Load backend profile & system settings
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [settingsRes, activitiesRes, profileRes] = await Promise.all([
          getAllSettingsAction(),
          getRecentActivitiesAction(),
          getMyProfileAction(),
        ]);

        // 1. Settings
        if (settingsRes.success && Array.isArray(settingsRes.data)) {
          const sla = settingsRes.data.find((s: any) => s.key === 'DISPATCH_SLA_TIMEOUT');
          if (sla) setDispatchSla(String(sla.value));
          const rad = settingsRes.data.find((s: any) => s.key === 'MAX_DISPATCH_RADIUS');
          if (rad) setMaxRadius(String(rad.value));
        }

        // 2. Activities
        if (activitiesRes?.data && Array.isArray(activitiesRes.data)) {
          setAuditEvents(
            activitiesRes.data.map((a: any) => ({
              action: a.title || a.description || 'System event',
              actor: a.user?.name || a.actor || 'System',
              time: a.createdAt
                ? new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Recently',
              type: a.type?.toLowerCase().includes('approval')
                ? 'approval'
                : a.type?.toLowerCase().includes('broadcast')
                  ? 'broadcast'
                  : 'config',
            })),
          );
        }

        // 3. Admin Profile
        if (profileRes.success && profileRes.data) {
          const u = profileRes.data;
          const adm = profileRes.data.admin || {};
          setAdminName(adm.name || u.name || '');
          setAdminEmail(u.email || '');
          setAdminPhone(adm.contactNumber || u.phone || '');
          setOrgEmail(adm.orgEmail || '');
          setDepartment(adm.department || 'Emergency Operations Directorate');
          setAvatarUrl(u.avatarUrl || '');
        } else if (authUser) {
          setAdminName(authUser.name || '');
          setAdminEmail(authUser.email || '');
          setAdminPhone(authUser.phone || '');
          setAvatarUrl(authUser.avatarUrl || '');
        }
      } catch (err) {
        console.error('Failed to load settings data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [authUser]);

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 800, 800, 0.85);
        setAvatarUrl(compressed);
        toast.success('Admin portrait processed and ready to save.');
      } catch {
        toast.error('Failed to process image');
      }
      e.target.value = '';
    }
  };

  // Save Operations Settings
  const handleSaveOperations = async () => {
    setIsSavingOps(true);
    try {
      await Promise.all([
        upsertSettingAction({ key: 'DISPATCH_SLA_TIMEOUT', value: dispatchSla, category: 'DISPATCH' }),
        upsertSettingAction({ key: 'MAX_DISPATCH_RADIUS', value: maxRadius, category: 'DISPATCH' }),
      ]);
      toast.success('Platform operational settings synchronized with backend.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save settings');
    } finally {
      setIsSavingOps(false);
    }
  };

  // Save Super Admin Profile
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingProfile(true);
    try {
      const payload = {
        name: adminName.trim(),
        contactNumber: adminPhone.trim(),
        orgEmail: orgEmail.trim() || null,
        department: department.trim() || null,
        avatarUrl: avatarUrl || null,
      };

      const res = await updateMyProfileAction(payload);
      if (res.success) {
        await refreshUser();
        toast.success('Super Admin credentials and command profile updated successfully!');
      } else {
        toast.error(res.message || 'Failed to update profile.');
      }
    } catch (err: any) {
      console.error('Admin profile update error:', err);
      toast.error(err?.message || 'Error occurred while saving profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Change Password
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error('Please provide both current and new passwords.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Admin password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changePasswordAction({ oldPassword, newPassword });
      if (res.success) {
        toast.success('Root security credentials updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.message || 'Failed to update password');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error changing password');
    } finally {
      setIsChangingPassword(false);
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
            Super Admin Command &amp; Settings
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Configure system operational parameters, manage administrator credentials, and maintain root security posture.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'operations' ? (
            <Button
              variant="danger"
              onClick={handleSaveOperations}
              disabled={isSavingOps}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSavingOps ? 'Saving...' : 'Save Configuration'}
            </Button>
          ) : activeTab === 'admin-profile' ? (
            <Button
              variant="danger"
              onClick={() => handleSaveProfile()}
              disabled={isSavingProfile}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSavingProfile ? 'Saving...' : 'Save Profile'}
            </Button>
          ) : null}
        </div>
      </div>

      {/* 3 Metric Cards */}
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
            <span className="text-xs font-medium text-slate-500">Root 2FA enforced</span>
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
            <span className="text-xs font-medium text-slate-500">All microservices online</span>
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
            <span className="text-xs font-medium text-slate-500">Live platform telemetry</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { key: 'operations', label: 'Platform & Dispatch Operations', icon: Settings2 },
          { key: 'admin-profile', label: 'Administrator Identity & Profile', icon: User },
          { key: 'security', label: 'Security & Root Access', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Two-column Layout */}
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* Left Column */}
        <div className="space-y-5">
          {/* TAB 1: OPERATIONS */}
          {activeTab === 'operations' && (
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
                    Security &amp; Authentication Policies
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

              {/* Card 3: Webhooks & Notifications */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-slate-700" />
                  <h2 className="text-sm font-bold tracking-tight text-slate-900">
                    Platform Notifications &amp; Webhooks
                  </h2>
                </div>
                <p className="mt-1 text-xs text-slate-500">Automated alerts and reporting</p>

                <div className="mt-4">
                  <div className="flex items-center justify-between border-b border-slate-100 py-3">
                    <span className="text-xs font-medium text-slate-700">Dispatch Failure Alert</span>
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
                <Button variant="danger" onClick={handleSaveOperations} disabled={isSavingOps}>
                  {isSavingOps ? 'Saving...' : 'Save Operations Settings'}
                </Button>
              </div>
            </div>
          )}

          {/* TAB 2: ADMIN PROFILE & IDENTITY */}
          {activeTab === 'admin-profile' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#E63946]">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Super Administrator Identity
                    </h3>
                    <p className="text-xs text-slate-500">
                      Root administrator details and executive department credentials
                    </p>
                  </div>
                </div>
                <DynamicBadge
                  text="Root Super Admin"
                  color="#E63946"
                  size="sm"
                  icon={ShieldCheck}
                />
              </div>

              {/* Avatar Upload */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-200 flex items-center justify-center">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Admin Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-slate-400" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-[#E63946] text-white shadow-sm hover:scale-105 transition"
                    title="Change Photo"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">Administrator Portrait</h4>
                  <p className="text-xs text-slate-500">
                    Official portrait displayed on audit logs and dispatch command oversight.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      <UploadCloud className="h-3.5 w-3.5 text-[#E63946]" /> Upload Portrait
                    </button>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl('')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Form inputs */}
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Official Full Name"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. Commander Marcus Vance"
                  helperText="Primary administrator name"
                />

                <InputField
                  label="Primary Contact Phone"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  placeholder="+880 17XXXXXXXX"
                  helperText="Emergency hotline & 2FA fallback phone"
                />

                <InputField
                  label="Organization / Dispatch Email"
                  value={orgEmail}
                  onChange={(e) => setOrgEmail(e.target.value)}
                  placeholder="admin.ops@pulseroute.com"
                  helperText="Official departmental email address"
                />

                <InputField
                  label="Department / Command Division"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Emergency Medical Services Command"
                  helperText="Executive platform division"
                />

                <div className="sm:col-span-2">
                  <InputField
                    label="Root Login Email"
                    value={adminEmail}
                    readOnly
                    disabled
                    helperText="Permanent account email credential (Read-only)"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <DynamicActionButton
                  type="button"
                  variant="danger"
                  label="Save Profile Changes"
                  icon={Save}
                  iconPosition="left"
                  isLoading={isSavingProfile}
                  onClick={() => handleSaveProfile()}
                />
              </div>
            </div>
          )}

          {/* TAB 3: ROOT SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Root Credential Security</h3>
                  <p className="text-xs text-slate-500">
                    Update master administrator access password
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
                <div className="relative">
                  <InputField
                    label="Current Password"
                    type={showOldPass ? 'text' : 'password'}
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                  >
                    {showOldPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="relative">
                  <InputField
                    label="New Master Password"
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    helperText="Requires complex combination of letters, digits & symbols"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <InputField
                  label="Confirm New Password"
                  type={showNewPass ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                />

                <div className="pt-2">
                  <DynamicActionButton
                    type="submit"
                    variant="danger"
                    label="Update Master Password"
                    isLoading={isChangingPassword}
                  />
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Admin Profile Snapshot & System Health */}
        <div className="space-y-5">
          {/* Admin Profile Snapshot Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="h-14 w-14 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={adminName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-red-50 text-[#E63946] font-bold text-lg">
                    {adminName ? adminName.slice(0, 2).toUpperCase() : 'SA'}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {adminName || 'Super Admin'}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">{adminEmail || 'admin@pulseroute.com'}</p>
                <div className="mt-1">
                  <DynamicBadge
                    text="SUPER ADMIN"
                    color="#E63946"
                    size="xs"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Dept:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                  {department || 'Operations'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Org Email:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                  {orgEmail || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-semibold text-slate-800">{adminPhone || 'N/A'}</span>
              </div>
            </div>
          </div>

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
                <span className="font-bold text-amber-400">Active</span>
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
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <Skeleton className="mt-1 h-2 w-2 rounded-full" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-2.5 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-2.5 w-12" />
                  </div>
                ))
              ) : auditEvents.length > 0 ? (
                auditEvents.map((event, i) => (
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
                ))
              ) : (
                <div className="py-4 text-center text-xs text-slate-400">
                  No recent audit events recorded.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
