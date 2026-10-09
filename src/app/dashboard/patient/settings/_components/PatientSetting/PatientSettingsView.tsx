'use client';

import React, { useState, useEffect, useRef } from 'react';
import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { getMyProfileAction, updateMyProfileAction } from '@/services/user/user.service';
import { changePasswordAction } from '@/services/auth/auth.service';
import { compressImageFile } from '@/lib/image-compressor';
import {
  Activity,
  AlertCircle,
  Calendar,
  Camera,
  CheckCircle2,
  Droplet,
  Eye,
  EyeOff,
  Heart,
  HeartPulse,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Save,
  Shield,
  ShieldCheck,
  Trash2,
  UploadCloud,
  User,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { PatientSettingsSkeleton } from '@/components/dashboard/skeletons/patient';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

export default function PatientSettingsView() {
  const { user: authUser, profile, refreshUser } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'security'>('profile');

  // Profile Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER' | ''>('MALE');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // Privacy & SOS Broadcast Toggles
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [liveLocationSharing, setLiveLocationSharing] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Password Fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Raw copy for reset
  const [pristineData, setPristineData] = useState<any>(null);

  // Populate data
  const populateFields = (userData: any, profileData: any) => {
    setPristineData({ user: userData, profile: profileData });
    setName(profileData?.name || profileData?.fullName || userData?.name || '');
    setEmail(userData?.email || '');
    setPhone(profileData?.contactNumber || userData?.phone || '');
    setEmergencyPhone(profileData?.emergencyContactNumber || '');
    setAddress(profileData?.address || '');
    setAvatarUrl(userData?.avatarUrl || profileData?.profilePhoto || '');
    setBloodGroup(profileData?.bloodGroup || 'B+');
    setGender(profileData?.gender || 'MALE');
    setDateOfBirth(
      profileData?.dateOfBirth
        ? new Date(profileData.dateOfBirth).toISOString().split('T')[0]
        : '',
    );

    // Read stored privacy preferences
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('patient_privacy_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.smsNotifications !== undefined) setSmsNotifications(parsed.smsNotifications);
          if (parsed.liveLocationSharing !== undefined)
            setLiveLocationSharing(parsed.liveLocationSharing);
          if (parsed.twoFactorAuth !== undefined) setTwoFactorAuth(parsed.twoFactorAuth);
        }
      } catch (e) {
        console.error('Error loading stored privacy:', e);
      }
    }
  };

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await getMyProfileAction();
        if (res.success && res.data) {
          const u = res.data;
          const p = res.data.patient || profile;
          populateFields(u, p);
        } else if (authUser) {
          populateFields(authUser, profile);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        if (authUser) {
          populateFields(authUser, profile);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [authUser, profile]);

  // Image upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 800, 800, 0.85);
        setAvatarUrl(compressed);
        toast.success('Avatar selected and ready to save.');
      } catch {
        toast.error('Failed to process image');
      }
      e.target.value = '';
    }
  };

  // Save Profile Changes
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        contactNumber: phone.trim(),
        emergencyContactNumber: emergencyPhone.trim() || null,
        address: address.trim() || null,
        avatarUrl: avatarUrl || null,
        profilePhoto: avatarUrl || null,
        bloodGroup: bloodGroup || null,
        gender: (gender as any) || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
      };

      // Persist privacy toggles
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'patient_privacy_settings',
          JSON.stringify({
            smsNotifications,
            liveLocationSharing,
            twoFactorAuth,
          }),
        );
      }

      const res = await updateMyProfileAction(payload);
      if (res.success) {
        await refreshUser();
        toast.success('Patient profile and emergency settings updated successfully!');
      } else {
        toast.error(res.message || 'Failed to update profile settings.');
      }
    } catch (err: any) {
      console.error('Profile update failed:', err);
      toast.error(err?.message || 'Error updating settings. Please try again.');
    } finally {
      setIsSaving(false);
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
      toast.error('New password must be at least 8 characters long.');
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
        toast.success('Security password changed successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.message || 'Failed to change password. Verify your current password.');
      }
    } catch (err: any) {
      console.error('Password change error:', err);
      toast.error(err?.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleReset = () => {
    if (pristineData) {
      populateFields(pristineData.user, pristineData.profile);
      toast.info('Settings form reset to saved profile.');
    }
  };

  if (isLoading) {
    return <PatientSettingsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DynamicPageHeader
          title="Patient Profile & Emergency Settings"
          description="Manage your verified personal identity, vital blood group, emergency dispatch contacts, and security credentials."
        />

        <div className="flex flex-wrap items-center gap-3">
          <DynamicActionButton
            type="button"
            variant="outline"
            icon={RotateCcw}
            iconPosition="left"
            onClick={handleReset}
            label="Discard"
          />
          <DynamicActionButton
            type="button"
            variant="danger"
            icon={Save}
            iconPosition="left"
            isLoading={isSaving}
            onClick={() => handleSaveProfile()}
            label="Save All Changes"
          />
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { key: 'profile', label: 'Identity & Vitals', icon: User },
          { key: 'privacy', label: 'SOS Broadcast & Privacy', icon: Shield },
          { key: 'security', label: 'Security & Password', icon: Lock },
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

      {/* Content Layout */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column (8 Cols) */}
        <div className="space-y-6 lg:col-span-8">
          {/* TAB 1: IDENTITY & VITALS */}
          {activeTab === 'profile' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#E63946]">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Personal Identity &amp; Vitals</h3>
                    <p className="text-xs text-slate-500">
                      Primary patient identification used during emergency paramedic dispatch
                    </p>
                  </div>
                </div>
                <DynamicBadge
                  text="Emergency Ready"
                  color="#10b981"
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
                        alt="Patient Avatar"
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
                  <h4 className="text-sm font-bold text-slate-900">Patient Profile Photo</h4>
                  <p className="text-xs text-slate-500">
                    A clear photo helps paramedics and ER triage officers identify the patient quickly.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      <UploadCloud className="h-3.5 w-3.5 text-[#E63946]" /> Upload Photo
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

              {/* Personal Details Form */}
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  helperText="Your official legal name"
                />

                <InputField
                  label="Primary Contact Phone"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 17XXXXXXXX"
                  helperText="Used for booking confirmation SMS & driver calls"
                />

                <InputField
                  label="Registered Email Address"
                  type="email"
                  value={email}
                  readOnly
                  disabled
                  helperText="Account login identifier (Read-only)"
                />

                <InputField
                  label="Emergency Contact Phone"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+880 18XXXXXXXX"
                  helperText="Paramedics and triage will alert this contact upon SOS"
                />
              </div>

              {/* Medical Vitals Row */}
              <div className="p-4 rounded-2xl bg-red-50/40 border border-red-100 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-950 flex items-center gap-1.5">
                  <HeartPulse className="h-4 w-4 text-[#E63946]" /> Emergency Vital Baseline
                </h4>

                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Blood Group */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Droplet className="h-3.5 w-3.5 text-red-500" /> Blood Group
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#E63946] focus:outline-none"
                    >
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg} Blood
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Gender */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Biological Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#E63946] focus:outline-none"
                    >
                      {GENDERS.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* DOB */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" /> Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#E63946] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <InputField
                label="Primary Home Address / Pickup Landmark"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. House 42, Road 11, Banani, Dhaka"
                helperText="Default emergency pickup point pre-filled during 911 SOS booking"
              />
            </div>
          )}

          {/* TAB 2: PRIVACY & SOS BROADCAST */}
          {activeTab === 'privacy' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">SOS Telemetry &amp; Privacy</h3>
                  <p className="text-xs text-slate-500">
                    Control how vital metrics and GPS telemetry are broadcast to family and triage teams
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Auto-SMS Broadcast on SOS Trigger
                    </p>
                    <p className="text-xs text-slate-500">
                      Instantly notify emergency contacts with live tracking URL upon ambulance dispatch
                    </p>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                    className="data-[state=checked]:bg-[#E63946]"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Real-Time ER Bed Reservation Sharing
                    </p>
                    <p className="text-xs text-slate-500">
                      Allow hospital emergency desks to receive your blood group and medical chart in advance
                    </p>
                  </div>
                  <Switch
                    checked={liveLocationSharing}
                    onCheckedChange={setLiveLocationSharing}
                    className="data-[state=checked]:bg-[#E63946]"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Two-Factor Authentication (2FA)
                    </p>
                    <p className="text-xs text-slate-500">
                      Require OTP verification code sent via SMS for new device sign-ins
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorAuth}
                    onCheckedChange={setTwoFactorAuth}
                    className="data-[state=checked]:bg-[#E63946]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Security &amp; Password</h3>
                  <p className="text-xs text-slate-500">
                    Update your account password to keep your medical data and booking history secure
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
                    label="New Password"
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    helperText="Include uppercase, numbers and symbols for safety"
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
                  placeholder="Re-type new password"
                />

                <div className="pt-2">
                  <DynamicActionButton
                    type="submit"
                    variant="danger"
                    label="Change Password"
                    isLoading={isChangingPassword}
                  />
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Column / Summary Card (4 Cols) */}
        <div className="space-y-6 lg:col-span-4 sticky top-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-red-50 text-[#E63946] font-bold text-xl">
                    {name ? name.slice(0, 2).toUpperCase() : 'PT'}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-bold text-slate-900 truncate">
                  {name || 'Registered Patient'}
                </h4>
                <p className="text-xs text-slate-500 truncate">{email || 'patient@pulseroute.com'}</p>
                <div className="mt-1 flex items-center gap-2">
                  <DynamicBadge
                    text={`${bloodGroup} Blood`}
                    color="#E63946"
                    size="xs"
                  />
                  <span className="text-[11px] font-semibold text-slate-600">
                    {gender || 'Standard'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Emergency Snapshot */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Contact:</span>
                <span className="font-semibold text-slate-800">{phone || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Emergency SOS:</span>
                <span className="font-bold text-red-600">{emergencyPhone || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Primary Zone:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[140px]">
                  {address || 'Dhaka, BD'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <DynamicActionButton
                type="button"
                variant="danger"
                label="Save All Changes"
                icon={Save}
                iconPosition="left"
                isLoading={isSaving}
                onClick={() => handleSaveProfile()}
                fullWidth
              />
              <DynamicActionButton
                type="button"
                variant="outline"
                onClick={handleReset}
                label="Discard Unsaved Changes"
                fullWidth
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
