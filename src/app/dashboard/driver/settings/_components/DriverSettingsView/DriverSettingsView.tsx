'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import { Switch } from '@/components/ui/switch';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  FileCheck2,
  FileText,
  HeartPulse,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  PenTool,
  Phone,
  Power,
  Radio,
  RotateCcw,
  Save,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Stethoscope,
  Trash2,
  Truck,
  UploadCloud,
  User,
  Volume2,
  Wind,
  X,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getMyDriverProfileAction,
  updateMyDriverProfileAction,
  updateDutyStatusAction,
  IUpdateDriverProfilePayload,
} from '@/services/driver/driver.service';
import { changePasswordAction } from '@/services/auth/auth.service';
import { useAuth } from '@/context/AuthContext';
import { compressImageFile } from '@/lib/image-compressor';
import DriverSettingsSkeleton from '@/components/dashboard/skeletons/driver/DriverSettingsSkeleton';

type TabKey = 'identity' | 'fleet' | 'documents' | 'cockpit' | 'security';

const AMBULANCE_TYPES = [
  {
    id: 'ICU',
    label: 'ICU Life Support',
    desc: 'Critical care equipped with ventilator, suction & telemetry',
    icon: Activity,
    badge: 'Critical Care',
  },
  {
    id: 'CCU',
    label: 'CCU Cardiac Care',
    desc: 'Coronary care unit with defibrillator & monitor',
    icon: Zap,
    badge: 'Cardiac Ready',
  },
  {
    id: 'AC',
    label: 'AC Rapid Transit',
    desc: 'Climate-controlled emergency transport ambulance',
    icon: HeartPulse,
    badge: 'Standard Emergency',
  },
  {
    id: 'BASIC',
    label: 'Basic Ambulance (Non-AC)',
    desc: 'General patient stretcher transit unit',
    icon: Truck,
    badge: 'Standard Non-AC',
  },
  {
    id: 'NEONATAL',
    label: 'Neonatal Pediatric',
    desc: 'Mobile baby incubator & pediatric oxygen kit',
    icon: HeartPulse,
    badge: 'Pediatric Care',
  },
  {
    id: 'FREEZER',
    label: 'Freezer Unit',
    desc: 'Sub-zero temperature mortuary transit vehicle',
    icon: Snowflake,
    badge: 'Specialized',
  },
] as const;

export default function DriverSettingsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: authUser, refreshUser } = useAuth();

  const tabQuery = (searchParams.get('tab') as TabKey) || 'identity';
  const [activeTab, setActiveTab] = useState<TabKey>(tabQuery);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingDuty, setIsUpdatingDuty] = useState(false);
  const [rawDriver, setRawDriver] = useState<any>(null);

  // Hidden file inputs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const vehiclePhotoInputRef = useRef<HTMLInputElement>(null);
  const licensePhotoInputRef = useRef<HTMLInputElement>(null);
  const nidPhotoInputRef = useRef<HTMLInputElement>(null);

  // 1. Driver Identity Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [experienceYears, setExperienceYears] = useState<string>('0');
  const [dutyStatus, setDutyStatus] = useState<'ONLINE' | 'OFFLINE' | 'BUSY'>('OFFLINE');
  const [driverVerificationStatus, setDriverVerificationStatus] = useState<string>('PENDING');
  const [driverRejectionReason, setDriverRejectionReason] = useState<string>('');

  // 2. Vehicle & Fleet Fields
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [ambulanceType, setAmbulanceType] = useState<string>('ICU');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<string>('');
  const [vehiclePhotoUrl, setVehiclePhotoUrl] = useState('');
  const [vehicleVerificationStatus, setVehicleVerificationStatus] = useState<string>('PENDING');
  const [vehicleRejectionReason, setVehicleRejectionReason] = useState<string>('');

  // Medical Equipment
  const [hasOxygen, setHasOxygen] = useState(true);
  const [hasVentilator, setHasVentilator] = useState(false);
  const [hasDefibrillator, setHasDefibrillator] = useState(false);
  const [hasSuctionMachine, setHasSuctionMachine] = useState(false);
  const [equipmentDetails, setEquipmentDetails] = useState('');

  // 3. Legal & Documents Fields
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [licensePhotoUrl, setLicensePhotoUrl] = useState('');
  const [nidNumber, setNidNumber] = useState('');
  const [nidPhotoUrl, setNidPhotoUrl] = useState('');

  // 4. Cockpit Automation Preferences
  const [autoAccept, setAutoAccept] = useState(false);
  const [trafficRadar, setTrafficRadar] = useState(true);
  const [maxDispatchRadius, setMaxDispatchRadius] = useState('15');
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [nightModeMap, setNightModeMap] = useState(false);

  // 5. Password Security
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Sync tab with URL if param changes
  useEffect(() => {
    if (searchParams.get('tab')) {
      setActiveTab(searchParams.get('tab') as TabKey);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Populate data from profile
  const populateData = (driverData: any) => {
    setRawDriver(driverData);
    const u = driverData?.user || authUser;
    const v = driverData?.currentVehicle || driverData?.vehicles?.[0];

    // Identity
    setName(driverData?.name || u?.name || '');
    setEmail(u?.email || driverData?.email || '');
    setPhone(driverData?.contactNumber || u?.phone || '');
    setAvatarUrl(u?.avatarUrl || driverData?.avatarUrl || '');
    setExperienceYears(String(driverData?.experienceYears ?? 0));
    setDutyStatus(driverData?.dutyStatus || 'OFFLINE');
    setDriverVerificationStatus(driverData?.verificationStatus || 'PENDING');
    setDriverRejectionReason(driverData?.rejectionReason || '');

    // Vehicle
    if (v) {
      setVehicleNumber(v.vehicleNumber || '');
      setAmbulanceType(v.ambulanceType || 'ICU');
      setManufacturer(v.manufacturer || '');
      setModel(v.model || '');
      setYear(v.year ? String(v.year) : '');
      setVehiclePhotoUrl(v.photoUrl || v.photos?.[0] || '');
      setVehicleVerificationStatus(v.verificationStatus || 'PENDING');
      setVehicleRejectionReason(v.rejectionReason || '');
      setHasOxygen(v.hasOxygen !== false);
      setHasVentilator(Boolean(v.hasVentilator));
      setHasDefibrillator(Boolean(v.hasDefibrillator));
      setHasSuctionMachine(Boolean(v.hasSuctionMachine));
      setEquipmentDetails(v.equipmentDetails || '');
    } else {
      setVehicleNumber('');
      setAmbulanceType('ICU');
    }

    // Documents
    setLicenseNumber(driverData?.licenseNumber || '');
    setLicenseExpiry(
      driverData?.licenseExpiry
        ? new Date(driverData.licenseExpiry).toISOString().split('T')[0]
        : '',
    );
    setLicensePhotoUrl(driverData?.licensePhotoUrl || driverData?.licensePhotos?.[0] || '');
    setNidNumber(driverData?.nidNumber || '');
    setNidPhotoUrl(driverData?.nidPhotoUrl || driverData?.nidPhotos?.[0] || '');

    // Load cockpit settings from local storage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('driver_cockpit_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.autoAccept !== undefined) setAutoAccept(parsed.autoAccept);
          if (parsed.trafficRadar !== undefined) setTrafficRadar(parsed.trafficRadar);
          if (parsed.maxDispatchRadius !== undefined)
            setMaxDispatchRadius(String(parsed.maxDispatchRadius));
          if (parsed.soundAlerts !== undefined) setSoundAlerts(parsed.soundAlerts);
          if (parsed.nightModeMap !== undefined) setNightModeMap(parsed.nightModeMap);
        }
      } catch (e) {
        console.error('Failed reading cockpit settings:', e);
      }
    }
  };

  // Fetch driver profile on mount
  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      try {
        const res = await getMyDriverProfileAction();
        if (res.success && res.data) {
          populateData(res.data);
        }
      } catch (err) {
        console.error('Failed to load driver profile in settings:', err);
        toast.error('Could not load current driver details');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [authUser]);

  // Handle image upload helper
  const handleUploadImage = async (
    file: File,
    onSuccess: (url: string) => void,
    maxW = 1200,
    maxH = 1200,
  ) => {
    try {
      const compressed = await compressImageFile(file, maxW, maxH, 0.85);
      onSuccess(compressed);
      toast.success('Image compressed and ready to save.');
    } catch {
      toast.error('Failed to process image file');
    }
  };

  // Quick Duty Status Switcher
  const handleToggleDuty = async (nextDuty: 'ONLINE' | 'OFFLINE') => {
    setIsUpdatingDuty(true);
    try {
      const res = await updateDutyStatusAction(nextDuty);
      if (res.success) {
        setDutyStatus(nextDuty);
        toast.success(`Duty status updated to ${nextDuty}`);
      } else {
        toast.error(res.message || 'Failed to update duty status');
      }
    } catch {
      toast.error('Failed to change duty status');
    } finally {
      setIsUpdatingDuty(false);
    }
  };

  // Full Driver Profile Save (Journey Update)
  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      const payload: IUpdateDriverProfilePayload = {
        name: name.trim() || undefined,
        contactNumber: phone.trim() || undefined,
        avatarUrl: avatarUrl || undefined,
        experienceYears: experienceYears !== '' ? Number(experienceYears) : undefined,

        // Vehicle specifications
        vehicleNumber: vehicleNumber.trim() || undefined,
        ambulanceType: (ambulanceType as any) || undefined,
        manufacturer: manufacturer.trim() || undefined,
        model: model.trim() || undefined,
        year: year !== '' ? Number(year) : undefined,
        vehiclePhotoUrl: vehiclePhotoUrl || undefined,

        // Life support equipment
        hasOxygen,
        hasVentilator,
        hasDefibrillator,
        hasSuctionMachine,
        equipmentDetails: equipmentDetails.trim() || undefined,

        // Credentials
        licenseNumber: licenseNumber.trim() || undefined,
        licenseExpiry: licenseExpiry ? new Date(licenseExpiry).toISOString() : undefined,
        licensePhotoUrl: licensePhotoUrl || undefined,
        nidNumber: nidNumber.trim() || undefined,
        nidPhotoUrl: nidPhotoUrl || undefined,
      };

      // Save Cockpit settings to local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'driver_cockpit_settings',
          JSON.stringify({
            autoAccept,
            trafficRadar,
            maxDispatchRadius,
            soundAlerts,
            nightModeMap,
          }),
        );
      }

      const res = await updateMyDriverProfileAction(payload);
      if (res.success && res.data) {
        populateData(res.data);
        await refreshUser();
        toast.success('Driver profile, vehicle fleet & cockpit settings updated successfully!');
      } else {
        toast.error(res.message || 'Failed to update driver details.');
      }
    } catch (err: any) {
      console.error('Update driver error:', err);
      toast.error(err?.message || 'Error occurred while saving changes.');
    } finally {
      setIsSaving(false);
    }
  };

  // Change Password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword) {
      toast.error('Current password is required');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changePasswordAction({ oldPassword, newPassword });
      if (res.success) {
        toast.success('Password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.message || 'Failed to update password');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return <DriverSettingsSkeleton />;
  }

  const isApproved = driverVerificationStatus === 'APPROVED';
  const isRejected = driverVerificationStatus === 'REJECTED';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DynamicPageHeader
          title="Driver Cockpit & Fleet Settings"
          description="Manage your professional credentials, assigned ambulance life-support specs, and radar dispatch automation."
        />

        <div className="flex flex-wrap items-center gap-3">
          <DynamicActionButton
            type="button"
            variant="outline"
            icon={RotateCcw}
            iconPosition="left"
            onClick={() => rawDriver && populateData(rawDriver)}
            label="Discard"
          />
          <DynamicActionButton
            type="button"
            variant="danger"
            icon={Save}
            iconPosition="left"
            isLoading={isSaving}
            onClick={() => handleSaveAll()}
            label="Save All Changes"
          />
        </div>
      </div>

      {/* Verification Notice Banner */}
      {isRejected && (
        <div className="flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-red-900 shadow-xs">
          <ShieldAlert className="h-5 w-5 shrink-0 text-[#E63946] mt-0.5" />
          <div className="flex-1 text-xs">
            <p className="font-bold">Driver Verification Rejected by Compliance</p>
            <p className="mt-0.5 text-red-700">
              {driverRejectionReason ||
                'Please update your driving license or NID documents below and re-submit for review.'}
            </p>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { key: 'identity', label: 'Driver Identity', icon: User },
          { key: 'fleet', label: 'Ambulance & Equipment', icon: Truck },
          { key: 'documents', label: 'Legal & KYC Docs', icon: FileText },
          { key: 'cockpit', label: 'Radar & Automation', icon: Radio },
          { key: 'security', label: 'Security & Access', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key as TabKey)}
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

      {/* Main Grid Content */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left / Main Column (8 Cols) */}
        <div className="space-y-6 lg:col-span-8">
          {/* TAB 1: DRIVER IDENTITY */}
          {activeTab === 'identity' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#E63946]">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Personal & Contact Profile</h3>
                    <p className="text-xs text-slate-500">
                      Update your public profile displayed on patient dispatch radar
                    </p>
                  </div>
                </div>
                <DynamicBadge
                  text={isApproved ? 'Verified Pilot' : 'Verification Pending'}
                  color={isApproved ? '#10b981' : '#f59e0b'}
                  size="sm"
                  icon={ShieldCheck}
                />
              </div>

              {/* Avatar Upload Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-200 flex items-center justify-center">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Driver Profile"
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
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadImage(file, setAvatarUrl, 600, 600);
                      e.target.value = '';
                    }}
                  />
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">Driver Avatar & Photo</h4>
                  <p className="text-xs text-slate-500">
                    High-resolution frontal portrait. Patients and hospital dispatchers see this.
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

              {/* Identity Form Inputs */}
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Darrel Contreras"
                  helperText="Official name registered on driving license"
                />

                <InputField
                  label="Contact Phone Number"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +880 1712 345678"
                  helperText="Primary dispatch call hotline"
                />

                <InputField
                  label="Registered Email Address"
                  value={email}
                  readOnly
                  disabled
                  helperText="PulseRoute account login credential (Read-only)"
                />

                <InputField
                  label="Total Driving Experience (Years)"
                  type="number"
                  min="0"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  placeholder="e.g. 6"
                  helperText="Professional ambulance or heavy vehicle experience"
                />
              </div>
            </div>
          )}

          {/* TAB 2: AMBULANCE FLEET & EQUIPMENT */}
          {activeTab === 'fleet' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Ambulance Fleet & Specifications
                    </h3>
                    <p className="text-xs text-slate-500">
                      Update your vehicle number plate, type, and certified onboard ICU equipment
                    </p>
                  </div>
                </div>
                <DynamicBadge
                  text={
                    vehicleVerificationStatus === 'APPROVED' ? 'BRTA Verified' : 'BRTA In Review'
                  }
                  color={vehicleVerificationStatus === 'APPROVED' ? '#10b981' : '#64748b'}
                  size="sm"
                  icon={ShieldCheck}
                />
              </div>

              {/* Vehicle Photo Upload */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Ambulance Exterior Photo</p>
                    <p className="text-[11px] text-slate-500">
                      Front view showing license plate and emergency lightbar
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => vehiclePhotoInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <UploadCloud className="h-3.5 w-3.5 text-blue-600" />
                    {vehiclePhotoUrl ? 'Replace Photo' : 'Upload Vehicle Photo'}
                  </button>
                  <input
                    ref={vehiclePhotoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadImage(file, setVehiclePhotoUrl, 1280, 720);
                      e.target.value = '';
                    }}
                  />
                </div>

                {vehiclePhotoUrl && (
                  <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={vehiclePhotoUrl}
                      alt="Vehicle Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setVehiclePhotoUrl('')}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white hover:bg-black"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Vehicle Core Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Ambulance Number Plate"
                  required
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="e.g. DH-AMB-2024 or 516"
                  helperText="Official BRTA registered number"
                />

                <InputField
                  label="Manufacturer"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="e.g. Mercedes-Benz or Toyota"
                  helperText="Vehicle make / brand"
                />

                <InputField
                  label="Vehicle Model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Sprinter 316 CDI or HiAce Super GL"
                  helperText="Specific ambulance fleet chassis"
                />

                <InputField
                  label="Model / Registration Year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 2023"
                  helperText="Year of vehicle manufacture"
                />
              </div>

              {/* Ambulance Classification Selector */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-800">
                  Ambulance Dispatch Classification
                </label>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {AMBULANCE_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = ambulanceType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setAmbulanceType(type.id)}
                        className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all ${
                          isSelected
                            ? 'border-[#E63946] bg-red-50/30 ring-1 ring-[#E63946]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              isSelected ? 'bg-[#E63946] text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-red-100 text-[#E63946]'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {type.badge}
                          </span>
                        </div>
                        <p className="mt-2 text-xs font-bold text-slate-900">{type.label}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{type.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Life Support Equipment Checklist */}
              <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Certified Life-Support Medical Equipment
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Accurate inventory is mandatory for ICU and cardiac emergency dispatch
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    {[hasOxygen, hasVentilator, hasDefibrillator, hasSuctionMachine].filter(Boolean)
                      .length}
                    /4 Active
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Oxygen */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-[#E63946]">
                        <HeartPulse className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Medical Oxygen Cylinder</p>
                        <p className="text-[10px] text-slate-500">Pressure 150 bar • Certified</p>
                      </div>
                    </div>
                    <Switch
                      checked={hasOxygen}
                      onCheckedChange={setHasOxygen}
                      className="data-[state=checked]:bg-[#E63946]"
                    />
                  </div>

                  {/* Ventilator */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Wind className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Transport Ventilator</p>
                        <p className="text-[10px] text-slate-500">Hamilton-T1 / Pulmonic standard</p>
                      </div>
                    </div>
                    <Switch
                      checked={hasVentilator}
                      onCheckedChange={setHasVentilator}
                      className="data-[state=checked]:bg-[#E63946]"
                    />
                  </div>

                  {/* Defibrillator */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                        <Zap className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Defibrillator / Monitor</p>
                        <p className="text-[10px] text-slate-500">ZOLL X Series cardiac telemetry</p>
                      </div>
                    </div>
                    <Switch
                      checked={hasDefibrillator}
                      onCheckedChange={setHasDefibrillator}
                      className="data-[state=checked]:bg-[#E63946]"
                    />
                  </div>

                  {/* Suction Machine */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Suction &amp; Intubation Kit</p>
                        <p className="text-[10px] text-slate-500">Airway clearance &amp; sterilized</p>
                      </div>
                    </div>
                    <Switch
                      checked={hasSuctionMachine}
                      onCheckedChange={setHasSuctionMachine}
                      className="data-[state=checked]:bg-[#E63946]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <InputField
                    label="Additional Medical Equipment & Inspection Notes"
                    value={equipmentDetails}
                    onChange={(e) => setEquipmentDetails(e.target.value)}
                    placeholder="e.g. Dual 4000L tanks, spinal board, pediatric kit, BRTA Fitness valid till Nov 2025"
                    helperText="Visible to emergency central dispatch doctors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LEGAL & KYC DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Legal Credentials &amp; KYC</h3>
                    <p className="text-xs text-slate-500">
                      Driving license, national identification, and BRTA certification records
                    </p>
                  </div>
                </div>
                <DynamicBadge
                  text={isApproved ? 'Approved by Admin' : 'Review in Progress'}
                  color={isApproved ? '#10b981' : '#f59e0b'}
                  size="sm"
                  icon={ShieldCheck}
                />
              </div>

              {/* Driving License Section */}
              <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    1. Professional Driving License
                  </h4>
                  <button
                    type="button"
                    onClick={() => licensePhotoInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <UploadCloud className="h-3.5 w-3.5 text-amber-600" />
                    {licensePhotoUrl ? 'Update License Scan' : 'Upload License Scan'}
                  </button>
                  <input
                    ref={licensePhotoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadImage(file, setLicensePhotoUrl);
                      e.target.value = '';
                    }}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    label="Driving License Number"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. DL-88912-DHAKA"
                    helperText="BRTA issued commercial driving license"
                  />

                  <InputField
                    label="License Expiry Date"
                    type="date"
                    value={licenseExpiry}
                    onChange={(e) => setLicenseExpiry(e.target.value)}
                    helperText="Must be valid to operate on active radar"
                  />
                </div>

                {licensePhotoUrl && (
                  <div className="relative h-40 w-full rounded-xl overflow-hidden border border-slate-200 bg-white">
                    <img
                      src={licensePhotoUrl}
                      alt="Driving License Scan"
                      className="h-full w-full object-contain bg-slate-50"
                    />
                    <button
                      type="button"
                      onClick={() => setLicensePhotoUrl('')}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white hover:bg-black"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* National ID (NID) Section */}
              <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    2. National Identity Card (NID)
                  </h4>
                  <button
                    type="button"
                    onClick={() => nidPhotoInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <UploadCloud className="h-3.5 w-3.5 text-amber-600" />
                    {nidPhotoUrl ? 'Update NID Scan' : 'Upload NID Scan'}
                  </button>
                  <input
                    ref={nidPhotoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadImage(file, setNidPhotoUrl);
                      e.target.value = '';
                    }}
                  />
                </div>

                <InputField
                  label="NID Number (Smart / 10-17 Digit)"
                  value={nidNumber}
                  onChange={(e) => setNidNumber(e.target.value)}
                  placeholder="e.g. 19922692019000123"
                  helperText="Government verified citizen identity"
                />

                {nidPhotoUrl && (
                  <div className="relative h-40 w-full rounded-xl overflow-hidden border border-slate-200 bg-white">
                    <img
                      src={nidPhotoUrl}
                      alt="NID Document Scan"
                      className="h-full w-full object-contain bg-slate-50"
                    />
                    <button
                      type="button"
                      onClick={() => setNidPhotoUrl('')}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white hover:bg-black"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: COCKPIT AUTOMATION & RADAR */}
          {activeTab === 'cockpit' && (
            <div className="space-y-6">
              {/* Dispatch Preferences */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#E63946]">
                    <Radio className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Dispatch Automation &amp; Range
                    </h3>
                    <p className="text-xs text-slate-500">
                      Fine-tune how live dispatch calls are routed to your ambulance
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Emergency Auto-Accept</p>
                      <p className="text-xs text-slate-500">
                        Automatically lock in incoming ICU emergencies within 3km radius
                      </p>
                    </div>
                    <Switch
                      checked={autoAccept}
                      onCheckedChange={setAutoAccept}
                      className="data-[state=checked]:bg-[#E63946]"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">High-Demand Zone Radar</p>
                      <p className="text-xs text-slate-500">
                        Highlight high emergency demand zones (Dhanmondi, Gulshan, Mohakhali)
                      </p>
                    </div>
                    <Switch
                      checked={trafficRadar}
                      onCheckedChange={setTrafficRadar}
                      className="data-[state=checked]:bg-[#E63946]"
                    />
                  </div>

                  <div className="pt-2">
                    <InputField
                      label="Maximum Dispatch Radius (km)"
                      type="number"
                      value={maxDispatchRadius}
                      onChange={(e) => setMaxDispatchRadius(e.target.value)}
                      placeholder="e.g. 15"
                      helperText="Default dispatch search perimeter around current GPS coordinate."
                    />
                  </div>
                </div>
              </div>

              {/* Audio & Display */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Volume2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Audio Radar &amp; Visual Alerts
                    </h3>
                    <p className="text-xs text-slate-500">
                      Custom siren chimes and high-contrast cockpit maps
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">High-Decibel Siren Chime</p>
                      <p className="text-xs text-slate-500">
                        Loud priority tone overrides device silent mode on emergency dispatch
                      </p>
                    </div>
                    <Switch
                      checked={soundAlerts}
                      onCheckedChange={setSoundAlerts}
                      className="data-[state=checked]:bg-[#E63946]"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Dark Navigation Map Overlay
                      </p>
                      <p className="text-xs text-slate-500">
                        Reduce eye strain during night duty shifts with dark radar UI
                      </p>
                    </div>
                    <Switch
                      checked={nightModeMap}
                      onCheckedChange={setNightModeMap}
                      className="data-[state=checked]:bg-[#E63946]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Security &amp; Password</h3>
                  <p className="text-xs text-slate-500">
                    Update your account credentials to keep emergency dispatch access secure
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
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
                    helperText="Use letters, numbers, and symbols for high security"
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
                    label="Update Password"
                    isLoading={isChangingPassword}
                  />
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Driver Quick Status & Save Card (4 Cols) */}
        <div className="space-y-6 lg:col-span-4 sticky top-6">
          {/* Driver Summary Card */}
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
                    {name ? name.slice(0, 2).toUpperCase() : 'DR'}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-bold text-slate-900 truncate">
                  {name || 'Registered Driver'}
                </h4>
                <p className="text-xs text-slate-500 truncate">{email || 'driver@pulseroute.com'}</p>
                <div className="mt-1 flex items-center gap-2">
                  <DynamicBadge
                    text={dutyStatus}
                    color={dutyStatus === 'ONLINE' ? '#10b981' : '#64748b'}
                    size="xs"
                  />
                  <span className="text-[11px] font-semibold text-slate-600">
                    {experienceYears} yrs exp.
                  </span>
                </div>
              </div>
            </div>

            {/* Live Duty Switcher */}
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`h-3 w-3 rounded-full animate-pulse ${
                    dutyStatus === 'ONLINE' ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Live Duty Status: {dutyStatus}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {dutyStatus === 'ONLINE'
                      ? 'Receiving 911 radar calls'
                      : 'Radar paused & offline'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isUpdatingDuty}
                onClick={() => handleToggleDuty(dutyStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  dutyStatus === 'ONLINE'
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {dutyStatus === 'ONLINE' ? 'Go Offline' : 'Go Online'}
              </button>
            </div>

            {/* Quick Fleet Summary */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Unit:</span>
                <span className="font-bold text-slate-900">{vehicleNumber || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Class:</span>
                <span className="font-semibold text-slate-800">{ambulanceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">License:</span>
                <span className="font-mono text-slate-700">{licenseNumber || 'Pending'}</span>
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
                onClick={() => handleSaveAll()}
                fullWidth
              />
              <DynamicActionButton
                type="button"
                variant="outline"
                onClick={() => rawDriver && populateData(rawDriver)}
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
