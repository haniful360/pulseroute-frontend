'use client';

import React, { useState, useEffect } from 'react';
import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { getMyProfileAction, updateMyProfileAction } from '@/services/user/user.service';
import { changePasswordAction } from '@/services/auth/auth.service';
import { Shield, User, Lock, MapPin, KeyRound, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PatientSettingsSkeleton } from '@/components/dashboard/skeletons/patient';

export default function PatientSettingsView() {
  const { user: authUser, profile, refreshUser } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Profile fields
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [address, setAddress] = useState('');

  // Toggles
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [liveLocationSharing, setLiveLocationSharing] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Password fields
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load backend profile
  const populateFields = (userData: any, profileData: any) => {
    setPatientName(profileData?.name || profileData?.fullName || userData?.name || '');
    setPatientEmail(userData?.email || '');
    setPatientPhone(profileData?.contactNumber || userData?.phone || '');
    setEmergencyPhone(profileData?.emergencyContactNumber || '');
    setAddress(profileData?.address || '');
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        name: patientName.trim(),
        contactNumber: patientPhone.trim(),
        emergencyContactNumber: emergencyPhone.trim(),
        address: address.trim(),
      };

      const res = await updateMyProfileAction(payload);
      if (res.success) {
        await refreshUser();
        toast.success('Patient profile and emergency privacy settings updated successfully!');
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error('Please provide both current and new passwords.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
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
        setShowPasswordSection(false);
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
    if (authUser) {
      populateFields(authUser, profile);
      toast.info('Settings form reset to saved profile.');
    }
  };

  if (isLoading) {
    return <PatientSettingsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Patient Settings & Emergency Privacy"
        description="Manage your account profile, emergency contacts, two-factor authentication, and emergency location broadcast settings."
      />

      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-12">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-8">
          {/* Personal Info */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#E63946]">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-500">
                  Update your primary identity on the PulseRoute emergency dispatch network
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <InputField
                label="Full Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Full Name"
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Email Address"
                  type="email"
                  value={patientEmail}
                  disabled
                  placeholder="Email"
                  helperText="Contact support to change your account email."
                />
                <InputField
                  label="Primary Phone Number"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+880 17XXXXXXXX"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Emergency Contact Phone"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+880 1XXXXXXXXX"
                  helperText="Paramedics will notify this contact upon dispatch."
                />
                <InputField
                  label="Primary Home Address / Pickup Landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House, Road, Area, Dhaka"
                />
              </div>
            </div>
          </div>

          {/* Privacy & SOS Broadcast */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">SOS Broadcast & Privacy</h3>
                <p className="text-xs text-slate-500">
                  Control how telemetry is broadcast to emergency contacts and triage teams
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Auto-SMS Broadcast on SOS Trigger
                  </p>
                  <p className="text-xs text-slate-500">
                    Instantly notify all emergency contacts with live GPS coordinates upon booking
                  </p>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                  className="data-[state=checked]:bg-[#E63946]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Real-Time ER Bed Reservation Sharing
                  </p>
                  <p className="text-xs text-slate-500">
                    Allow hospital triage desk to receive your vital medical chart in advance
                  </p>
                </div>
                <Switch
                  checked={liveLocationSharing}
                  onCheckedChange={setLiveLocationSharing}
                  className="data-[state=checked]:bg-[#E63946]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Two-Factor Security Authentication (2FA)
                  </p>
                  <p className="text-xs text-slate-500">
                    Require OTP verification for profile and medical summary changes
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

          {/* Security & Password Accordion */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Account Security</h3>
                  <p className="text-xs text-slate-500">
                    Change your account password and security credentials
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="text-xs font-bold text-purple-600 hover:text-purple-700"
              >
                {showPasswordSection ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {showPasswordSection && (
              <div className="mt-6 space-y-4 pt-2">
                <InputField
                  label="Current Password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                  />
                  <InputField
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <DynamicActionButton
                    type="button"
                    onClick={handlePasswordChange}
                    isLoading={isChangingPassword}
                    disabled={isChangingPassword}
                    label="Update Password"
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Action Panel */}
        <div className="space-y-6 lg:col-span-4">
          <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900">Save Profile</h4>
            <p className="mt-1 text-xs text-slate-500">
              Your preferences and emergency contacts are encrypted and synchronized across the
              PulseRoute network.
            </p>

            <div className="mt-6 space-y-3">
              <DynamicActionButton
                type="submit"
                variant="danger"
                label={isSaving ? 'Saving Changes...' : 'Save Changes'}
                isLoading={isSaving}
                disabled={isSaving || isLoading}
                fullWidth
              />
              <DynamicActionButton
                type="button"
                variant="outline"
                onClick={handleReset}
                label="Reset"
                disabled={isSaving}
                fullWidth
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
