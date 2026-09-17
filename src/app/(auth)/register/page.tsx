'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthHeader } from '../_components/AuthHeader';
import { AuthFooter } from '../_components/AuthFooter';
import { EmergencyBanner } from '../_components/EmergencyBanner';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Lock, Mail, User, Phone, Droplet, ArrowRight } from 'lucide-react';
import { InputField } from '@/components/dashboard/Fields/InputField/InputField';

export default function PatientRegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-orange-500' };
    if (score === 3)
      return { score: 3, label: 'GOOD', subLabel: 'Secure enough', color: 'bg-emerald-500' };
    return { score: 4, label: 'STRONG', subLabel: 'Highly secure', color: 'bg-green-600' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!phoneNumber.trim() || phoneNumber.length < 8) {
      newErrors.phoneNumber = 'Enter a valid phone number';
    }
    if (!bloodGroup) {
      newErrors.bloodGroup = 'Please select a blood group';
    }
    if (!password || password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!emergencyContact.trim()) {
      newErrors.emergencyContact = 'Emergency contact is required';
    }
    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms and Privacy Policy';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-gradient-to-b from-slate-50 via-white to-slate-50/80">
      <AuthHeader subtitle="Patient Portal" />

      <main className="flex flex-1 items-center justify-center p-4 py-8">
        <div className="w-full max-w-[560px] rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all sm:p-10">
          {/* Title Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Patient Registration
            </h1>
            <p className="mt-1.5 text-sm font-normal text-slate-500">
              Create your account to get priority emergency assistance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <InputField
              id="fullName"
              label="Full Name"
              placeholder="e.g. Mohammad Rahim"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
              }}
              icon={<User className="h-4 w-4" />}
              error={errors.fullName}
            />

            {/* Email Address */}
            <InputField
              id="email"
              label="Email Address"
              type="email"
              placeholder="rahim@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              icon={<Mail className="h-4 w-4" />}
              error={errors.email}
            />

            {/* Phone Number with Bangladesh flag and prefix */}
            <InputField
              id="phone"
              label="Phone Number"
              type="tel"
              placeholder="01712345678"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: '' }));
              }}
              prefix={
                <span className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold select-none">
                  <span className="relative inline-block h-3 w-4 flex-shrink-0 overflow-hidden rounded-xs shadow-xs">
                    <svg viewBox="0 0 20 12" className="h-full w-full">
                      <rect width="20" height="12" fill="#006a4e" />
                      <circle cx="9" cy="6" r="4" fill="#f42a41" />
                    </svg>
                  </span>
                  <span>+880</span>
                </span>
              }
              error={errors.phoneNumber}
            />

            {/* Gender & Blood Group Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Gender */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Gender</Label>
                <div className="flex h-11 items-center gap-2">
                  {(['Male', 'Female', 'Other'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`flex h-full flex-1 cursor-pointer items-center justify-center rounded-xl border text-xs font-semibold transition-all ${
                        gender === g
                          ? 'border-red-600 bg-red-50 text-red-700 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blood Group */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Blood Group</Label>
                <Select
                  value={bloodGroup}
                  onValueChange={(val) => {
                    setBloodGroup(val);
                    if (errors.bloodGroup) setErrors((prev) => ({ ...prev, bloodGroup: '' }));
                  }}
                >
                  <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:bg-white">
                    <div className="flex items-center gap-2">
                      <Droplet className="h-3.5 w-3.5 text-red-500" />
                      <SelectValue placeholder="Select Blood Group" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200">
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                      <SelectItem
                        key={group}
                        value={group}
                        className="cursor-pointer font-semibold"
                      >
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.bloodGroup && <p className="text-xs text-red-600">{errors.bloodGroup}</p>}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <InputField
                id="password"
                label="Password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                icon={<Lock className="h-4 w-4" />}
                error={errors.password}
              />

              {/* Dynamic Password Strength Indicator (Matches Figma) */}
              {password && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          strength.score >= i ? strength.color : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="font-bold text-emerald-600">{strength.label}</span>
                    {strength.subLabel && (
                      <span className="text-slate-400">- {strength.subLabel}</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <InputField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              icon={<Lock className="h-4 w-4" />}
              error={errors.confirmPassword}
            />

            {/* Emergency Contact Number */}
            <InputField
              id="emergencyContact"
              label="Emergency Contact Number"
              type="tel"
              placeholder="018XXXXXXXX"
              value={emergencyContact}
              onChange={(e) => {
                setEmergencyContact(e.target.value);
                if (errors.emergencyContact)
                  setErrors((prev) => ({ ...prev, emergencyContact: '' }));
              }}
              icon={<Phone className="h-4 w-4 text-red-500" />}
              error={errors.emergencyContact}
              helperText="Family member or trusted contact for critical emergency dispatch."
            />

            {/* Terms and Privacy Checkbox */}
            <div className="pt-2">
              <div className="flex items-start space-x-2.5">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => {
                    setAgreeTerms(checked === true);
                    if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: '' }));
                  }}
                  className="mt-0.5 rounded-md data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600"
                />
                <label
                  htmlFor="terms"
                  className="cursor-pointer text-xs leading-relaxed text-slate-600"
                >
                  I agree to PulseRoute&apos;s{' '}
                  <Link href="/terms" className="font-semibold text-red-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="font-semibold text-red-600 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="mt-1 text-xs text-red-600">{errors.agreeTerms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-bold tracking-wide text-white shadow-md shadow-red-600/25 transition-all duration-200 hover:bg-red-700 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <span>Create Patient Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-3 font-semibold tracking-wider text-slate-400">
                Or sign up with
              </span>
            </div>
          </div>

          {/* Social Google Signup */}
          <button
            type="button"
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>

          {/* Login Link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            <span>Already have an account? </span>
            <Link
              href="/login"
              className="font-bold text-red-600 transition-colors hover:text-red-700"
            >
              Log In
            </Link>
          </div>
        </div>
      </main>

      <AuthFooter supportEmail="support@pulseroute.com" />
      <EmergencyBanner />
    </div>
  );
}
