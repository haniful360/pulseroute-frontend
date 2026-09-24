'use client';

import React, { useState } from 'react';
import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import { Switch } from '@/components/ui/switch';
import { Bell, Lock, Shield, User, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PatientSettingsView() {
  const [patientName, setPatientName] = useState('Abdur Rahman');
  const [patientEmail, setPatientEmail] = useState('abdur.rahman@example.com');
  const [patientPhone, setPatientPhone] = useState('+880 1712 345678');
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [liveLocationSharing, setLiveLocationSharing] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Patient profile and privacy preferences saved.');
  };

  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Patient Settings &amp; Emergency Privacy"
        description="Manage your account profile, two-factor authentication, and emergency location broadcast settings."
      />

      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-12">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-8">
          {/* Personal Info */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#E63946]">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-500">Update your primary identity on the PulseRoute network</p>
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
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
                <InputField
                  label="Emergency Contact Phone"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="Phone Number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Privacy & SOS Broadcast */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">SOS Broadcast &amp; Privacy</h3>
                <p className="text-xs text-slate-500">Control how telemetry is broadcast to emergency contacts</p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Auto-SMS Broadcast on SOS Trigger</p>
                  <p className="text-xs text-slate-500">Instantly notify all emergency contacts with live GPS coordinates</p>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                  className="data-[state=checked]:bg-[#E63946]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Real-Time ER Bed Reservation Sharing</p>
                  <p className="text-xs text-slate-500">Allow hospital triage desk to receive your vital medical chart in advance</p>
                </div>
                <Switch
                  checked={liveLocationSharing}
                  onCheckedChange={setLiveLocationSharing}
                  className="data-[state=checked]:bg-[#E63946]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Two-Factor Security Authentication (2FA)</p>
                  <p className="text-xs text-slate-500">Require OTP verification for profile and medical summary changes</p>
                </div>
                <Switch
                  checked={twoFactorAuth}
                  onCheckedChange={setTwoFactorAuth}
                  className="data-[state=checked]:bg-[#E63946]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Action Panel */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900">Save Profile</h4>
            <p className="mt-1 text-xs text-slate-500">Your preferences are encrypted and stored securely.</p>

            <div className="mt-6 space-y-3">
              <DynamicActionButton
                type="submit"
                variant="danger"
                label="Save Changes"
                fullWidth
              />
              <DynamicActionButton
                type="button"
                variant="outline"
                onClick={() => toast.info('Preferences reloaded.')}
                label="Reset"
                fullWidth
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
