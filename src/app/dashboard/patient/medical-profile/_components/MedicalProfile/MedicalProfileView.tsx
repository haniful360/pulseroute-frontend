'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Heart,
  CheckCircle2,
  X,
  Plus,
  ShieldCheck,
  Phone,
  AlertTriangle,
  ChevronDown,
  User,
  Calendar,
  MapPin,
  Activity,
  Pill,
  FileText,
  Camera,
  Trash2,
  Loader2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getMyProfileAction, updateMyProfileAction } from '@/services/user/user.service';
import { compressImageFile } from '@/lib/image-compressor';
import { toast } from 'sonner';
import { MedicalProfileSkeleton } from '@/components/dashboard/skeletons/patient';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const SUGGESTED_CONDITIONS = [
  'Hypertension',
  'Diabetes (Type 2)',
  'Asthma',
  'Cardiac Arrhythmia',
  'Chronic Kidney Disease',
  'Epilepsy',
];

const SUGGESTED_ALLERGIES = [
  'Penicillin',
  'Latex',
  'Aspirin',
  'Sulfa Drugs',
  'Iodine',
  'Peanuts',
  'Shellfish',
];

export default function MedicalProfileView() {
  const { refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Loading & Action states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingAvatar, setIsProcessingAvatar] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Loaded pristine state for Cancel
  const [initialData, setInitialData] = useState<any>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [bloodGroup, setBloodGroup] = useState('B+');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER' | ''>('MALE');
  const [dob, setDob] = useState('');

  const [conditions, setConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState('');

  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState('');

  const [medications, setMedications] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');

  // Clean blood group string helper (e.g. "B+ (Positive)" -> "B+")
  const normalizeBloodGroup = (val: string | null | undefined): string => {
    if (!val) return 'B+';
    const clean = val.split(' ')[0].trim().toUpperCase();
    return BLOOD_GROUPS.includes(clean) ? clean : 'B+';
  };

  // Populate state helper
  const populateProfile = (data: any) => {
    const user = data || {};
    const patient = data?.patient || {};

    setFullName(patient.name || user.name || '');
    setEmail(patient.email || user.email || '');
    setPhone(patient.contactNumber || user.phone || '');
    setEmergencyPhone(patient.emergencyContactNumber || '');
    setAddress(patient.address || '');
    setAvatarUrl(patient.profilePhoto || user.avatarUrl || null);

    setBloodGroup(normalizeBloodGroup(patient.bloodGroup));
    if (patient.gender) setGender(patient.gender);

    if (patient.dateOfBirth) {
      try {
        const d = new Date(patient.dateOfBirth);
        if (!isNaN(d.getTime())) {
          setDob(d.toISOString().split('T')[0]);
        }
      } catch {
        setDob('');
      }
    } else {
      setDob('');
    }

    // Parse medical history
    if (patient.medicalHistory) {
      try {
        const parsed = JSON.parse(patient.medicalHistory);
        if (Array.isArray(parsed.conditions)) {
          setConditions(parsed.conditions);
        } else if (typeof parsed.conditions === 'string') {
          setConditions([parsed.conditions]);
        }

        if (Array.isArray(parsed.allergies)) {
          setAllergies(parsed.allergies);
        } else if (typeof parsed.allergies === 'string') {
          setAllergies([parsed.allergies]);
        }

        if (parsed.medications) setMedications(parsed.medications);
        if (parsed.notes) setClinicalNotes(parsed.notes);
      } catch {
        // Plain text fallback
        setConditions(patient.medicalHistory ? [patient.medicalHistory] : []);
      }
    } else {
      setConditions([]);
      setAllergies([]);
      setMedications('');
      setClinicalNotes('');
    }
  };

  // Load real profile from backend
  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      try {
        const res = await getMyProfileAction();
        if (res.success && res.data) {
          setInitialData(res.data);
          populateProfile(res.data);
        }
      } catch (err) {
        console.error('Failed to load patient medical profile:', err);
        toast.error('Unable to fetch profile from server. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  // Compute profile completeness
  const completeness = (() => {
    let score = 0;
    if (bloodGroup) score += 20;
    if (emergencyPhone && emergencyPhone.trim().length >= 6) score += 20;
    if (phone && phone.trim().length >= 6) score += 15;
    if (address && address.trim().length > 3) score += 15;
    if (gender && dob) score += 15;
    if (conditions.length > 0 || allergies.length > 0) score += 15;
    return Math.min(100, score);
  })();

  // Calculate age from DOB
  const calculateAge = (dobString: string): string => {
    if (!dobString) return '';
    try {
      const birth = new Date(dobString);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age > 0 ? `${age} yrs` : '';
    } catch {
      return '';
    }
  };

  // Condition tag handlers
  const handleAddCondition = (val?: string) => {
    const toAdd = (val || newCondition).trim();
    if (!toAdd) return;
    if (!conditions.includes(toAdd)) {
      setConditions([...conditions, toAdd]);
    }
    setNewCondition('');
  };

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  // Allergy tag handlers
  const handleAddAllergy = (val?: string) => {
    const toAdd = (val || newAllergy).trim();
    if (!toAdd) return;
    if (!allergies.includes(toAdd)) {
      setAllergies([...allergies, toAdd]);
    }
    setNewAllergy('');
  };

  const handleRemoveAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  // Avatar upload handler
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingAvatar(true);
    try {
      const compressed = await compressImageFile(file, 800, 800, 0.85);
      setAvatarUrl(compressed);
      toast.success('Profile photo ready. Click "Save Changes" to apply.');
    } catch {
      toast.error('Failed to process image. Please choose another photo.');
    } finally {
      setIsProcessingAvatar(false);
      e.target.value = '';
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    toast.info('Profile photo cleared.');
  };

  // Cancel / Reset
  const handleCancel = () => {
    if (initialData) {
      populateProfile(initialData);
      toast.info('Form reverted to saved profile values.');
    }
  };

  // Save changes to backend
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const medicalHistoryPayload = JSON.stringify({
        conditions,
        allergies,
        medications: medications.trim(),
        notes: clinicalNotes.trim(),
      });

      const payload = {
        name: fullName.trim(),
        phone: phone.trim(),
        contactNumber: phone.trim(),
        address: address.trim(),
        emergencyContactNumber: emergencyPhone.trim(),
        bloodGroup: bloodGroup.trim(),
        gender: gender || null,
        dateOfBirth: dob ? dob : null,
        medicalHistory: medicalHistoryPayload,
        avatarUrl: avatarUrl,
        profilePhoto: avatarUrl,
      };

      const res = await updateMyProfileAction(payload);
      if (res.success) {
        setInitialData(res.data);
        populateProfile(res.data);
        await refreshUser();
        setToastMessage('Your vital medical record and emergency settings have been updated.');
        setShowToast(true);
        toast.success('Medical profile updated successfully!');
      } else {
        toast.error(res.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error('Update medical profile error:', err);
      toast.error(err?.message || 'Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <MedicalProfileSkeleton />;
  }

  const ageText = calculateAge(dob);

  return (
    <div className="space-y-6">
      {/* 1. Top Header Row with Actions & Live Readiness */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-[#0B132B] sm:text-3xl">
              Medical Profile
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-600/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              SOS Active
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Live clinical parameters, pre-existing conditions, and emergency dispatch contact.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 active:scale-95 disabled:opacity-50"
          >
            Discard Changes
          </button>
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={isSaving || isProcessingAvatar}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#E63946] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-red-500/20 transition hover:bg-red-600 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Profile...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Floating Notification Banner */}
      {showToast && (
        <div className="relative flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Medical Passport Synced</h4>
              <p className="text-xs text-slate-600">{toastMessage}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="cursor-pointer text-slate-400 transition hover:text-slate-600"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 3. Emergency SOS Readiness Bar */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#E63946]">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0B132B]">
                  Paramedic Dispatch Readiness
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                    completeness >= 80
                      ? 'bg-emerald-100 text-emerald-800'
                      : completeness >= 50
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {completeness}% Ready
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Accurate blood group and emergency contact details reduce first-response triage time by up to 60%.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-black text-slate-900">{completeness}%</span>
            <div className="h-2.5 w-32 overflow-hidden rounded-full bg-slate-100 sm:w-48">
              <div
                className={`h-full transition-all duration-500 ${
                  completeness >= 80 ? 'bg-emerald-500' : completeness >= 50 ? 'bg-amber-500' : 'bg-[#E63946]'
                }`}
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Two-Column Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* ================= LEFT COLUMN: IDENTITY & VITALS ================= */}
        <div className="space-y-6 lg:col-span-7">
          {/* Card 1: Patient Identity & Primary Contact */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#E63946]">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0B132B]">Patient Identity & Contact</h2>
                <p className="text-xs text-slate-500">
                  Primary identifiers verified for hospital admissions and ambulance reception.
                </p>
              </div>
            </div>

            {/* Avatar Row */}
            <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-tr from-slate-100 to-slate-200 shadow-inner">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={fullName || 'Patient Avatar'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-red-50 text-xl font-black text-[#E63946]">
                    {fullName ? fullName.slice(0, 2).toUpperCase() : 'PT'}
                  </div>
                )}
                {isProcessingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900">Patient Profile Photo</h4>
                <p className="text-xs text-slate-500">
                  Visible to responding paramedics to confirm patient identity on arrival.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingAvatar}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-95"
                  >
                    <Camera className="h-3.5 w-3.5 text-slate-500" />
                    Change Photo
                  </button>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 active:scale-95"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-600 uppercase">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Baxter Valdez"
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium text-slate-900 transition focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-600 uppercase">
                  Registered Email
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-100/70 px-3.5 pr-20 text-sm font-medium text-slate-500 cursor-not-allowed"
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Verified
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-600 uppercase">
                  Primary Contact Number
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 (295) 241-7038"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium text-slate-900 transition focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center justify-between text-xs font-bold tracking-wider text-red-700 uppercase">
                  <span>Emergency Hotline Number</span>
                  <span className="text-[10px] font-bold text-red-600">Priority Dial</span>
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="e.g. +880 1712 345678"
                    className="h-11 w-full rounded-xl border border-red-300 bg-red-50/30 px-3.5 pr-10 text-sm font-medium text-slate-900 transition focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 focus:outline-none"
                  />
                  <Phone className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-red-500" />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Paramedics and SOS auto-dialer dial this number instantly during dispatch.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold tracking-wider text-slate-600 uppercase">
                  Residential / Primary Pickup Address
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House 12, Road 5, Dhanmondi, Dhaka"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 pl-10 text-sm font-medium text-slate-900 transition focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 focus:outline-none"
                  />
                  <MapPin className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Clinical Vitals & Physiology */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#E63946]">
                <Heart className="h-5 w-5 fill-[#E63946]/10" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0B132B]">Clinical Vitals & Blood Group</h2>
                <p className="text-xs text-slate-500">
                  Critical baseline physiology used for blood transfusion and paramedic pre-alerting.
                </p>
              </div>
            </div>

            {/* Blood Group Grid */}
            <div className="mt-6">
              <label className="flex items-center justify-between text-xs font-bold tracking-wider text-slate-600 uppercase">
                <span>Blood Group</span>
                <span className="text-xs font-black text-[#E63946]">Selected: {bloodGroup}</span>
              </label>
              <div className="mt-2.5 grid grid-cols-4 gap-2 sm:grid-cols-8">
                {BLOOD_GROUPS.map((bg) => {
                  const isSelected = bloodGroup === bg;
                  return (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBloodGroup(bg)}
                      className={`flex h-12 cursor-pointer flex-col items-center justify-center rounded-2xl border text-sm font-black transition active:scale-95 ${
                        isSelected
                          ? 'border-[#E63946] bg-[#E63946] text-white shadow-md shadow-red-500/20'
                          : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span>{bg}</span>
                      <span className={`text-[9px] font-semibold ${isSelected ? 'text-red-100' : 'text-slate-400'}`}>
                        {bg.includes('+') ? 'Rh+' : 'Rh-'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gender & DOB */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-600 uppercase">
                  Biological Gender
                </label>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {(['MALE', 'FEMALE', 'OTHER'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`flex h-11 cursor-pointer items-center justify-center rounded-xl border text-xs font-bold uppercase transition active:scale-95 ${
                        gender === g
                          ? 'border-[#E63946] bg-red-50 text-[#E63946]'
                          : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold tracking-wider text-slate-600 uppercase">
                    Date of Birth
                  </label>
                  {ageText && (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                      Age: {ageText}
                    </span>
                  )}
                </div>
                <div className="relative mt-1.5">
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 pl-10 text-sm font-medium text-slate-900 transition focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 focus:outline-none"
                  />
                  <Calendar className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: CONDITIONS, ALLERGIES & MEDS ================= */}
        <div className="space-y-6 lg:col-span-5">
          {/* Card 3: Pre-Existing Conditions */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0B132B]">Existing Medical Conditions</h2>
                <p className="text-xs text-slate-500">
                  Chronic or recurring conditions paramedics prioritize in transit.
                </p>
              </div>
            </div>

            {/* Current Conditions Chips */}
            <div className="mt-5">
              <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-2.5">
                {conditions.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">
                    No existing medical conditions listed.
                  </span>
                ) : (
                  conditions.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-1.5 text-xs font-bold text-amber-900 shadow-2xs"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveCondition(idx)}
                        className="cursor-pointer text-amber-700 transition hover:text-[#E63946]"
                        title={`Remove ${item}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Add New Input */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCondition();
                    }
                  }}
                  placeholder="e.g. Hypertension, Asthma..."
                  className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-900 transition focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddCondition()}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-slate-900 px-3.5 text-xs font-bold text-white transition hover:bg-slate-800 active:scale-95"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
              </div>

              {/* Suggestions */}
              <div className="mt-3">
                <span className="text-[11px] font-semibold text-slate-400">Quick Suggestions:</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {SUGGESTED_CONDITIONS.filter((c) => !conditions.includes(c)).slice(0, 4).map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => handleAddCondition(cond)}
                      className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900"
                    >
                      + {cond}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Known Allergies */}
          <div className="rounded-3xl border border-red-200/80 bg-red-50/30 p-6 shadow-xs sm:p-7">
            <div className="flex items-center gap-3 border-b border-red-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-[#E63946]">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-red-950">Known Allergies & Adverse Reactions</h2>
                <p className="text-xs text-red-700">
                  Critical alerts shown in high-contrast red to responding paramedics.
                </p>
              </div>
            </div>

            {/* Allergies Chips */}
            <div className="mt-5">
              <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-2xl border border-red-200 bg-white p-2.5">
                {allergies.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">
                    No drug or environmental allergies recorded.
                  </span>
                ) : (
                  allergies.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 shadow-2xs"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergy(idx)}
                        className="cursor-pointer text-red-400 transition hover:text-red-700"
                        title={`Remove ${item}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Add Allergy Input */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAllergy();
                    }
                  }}
                  placeholder="e.g. Penicillin, Latex..."
                  className="h-10 flex-1 rounded-xl border border-red-200 bg-white px-3.5 text-xs font-medium text-slate-900 transition focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddAllergy()}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-[#E63946] px-3.5 text-xs font-bold text-white transition hover:bg-red-600 active:scale-95"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
              </div>

              {/* Suggestions */}
              <div className="mt-3">
                <span className="text-[11px] font-semibold text-red-800">Common Allergies:</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {SUGGESTED_ALLERGIES.filter((a) => !allergies.includes(a)).slice(0, 4).map((alg) => (
                    <button
                      key={alg}
                      type="button"
                      onClick={() => handleAddAllergy(alg)}
                      className="cursor-pointer rounded-lg border border-red-200 bg-white px-2 py-1 text-[11px] font-medium text-red-800 transition hover:border-red-400 hover:bg-red-50"
                    >
                      + {alg}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Current Medications & Treatment Notes */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Pill className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0B132B]">Medications & Clinical Notes</h2>
                <p className="text-xs text-slate-500">
                  Daily prescriptions and specific transport instructions.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-600 uppercase">
                  Current Routine Medications
                </label>
                <input
                  type="text"
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  placeholder="e.g. Amlodipine 5mg daily, Metformin 500mg"
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium text-slate-900 transition focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-600 uppercase">
                  Special Emergency Instructions
                </label>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="e.g. Wheelchair accessible transport needed; patient has cardiac pacemaker installed in 2024."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm font-medium text-slate-900 transition focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card 6: Encrypted Telemetry Notice */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#0B132B] p-6 text-white shadow-lg sm:p-7">
            <div className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-red-600/15 blur-2xl" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E63946] text-white shadow-md shadow-red-500/20">
                <Lock className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">
                  HIPAA-Grade Live Telemetry
                </h4>
                <p className="text-xs leading-relaxed text-slate-300">
                  Your medical profile is end-to-end encrypted. When you request an ambulance or tap SOS, this dossier is transmitted securely to the dispatched paramedic tablet and receiving hospital triage bay.
                </p>
                <div className="pt-2 text-[11px] font-semibold text-emerald-400">
                  National Emergency Dial: 999 | Health Desk: 16263
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Sticky Bottom Action Bar on Mobile/Desktop */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <p className="text-xs text-slate-500">
          Last updated profile will be used in subsequent emergency dispatches.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 active:scale-95 disabled:opacity-50"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={isSaving || isProcessingAvatar}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#E63946] px-5 py-2 text-xs font-bold text-white shadow-md shadow-red-500/20 transition hover:bg-red-600 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
