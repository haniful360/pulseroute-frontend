'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Camera, Lock, Mail, User, Clock, ArrowRight } from 'lucide-react';
import { InputField } from '@/components/dashboard/Fields/InputField/InputField';

export interface DriverPersonalData {
  avatarUrl: string;
  fullName: string;
  experienceYears: string;
  email: string;
  phoneNumber: string;
  password: string;
}

interface Step1Props {
  data: DriverPersonalData;
  onUpdate: (data: Partial<DriverPersonalData>) => void;
  onNext: () => void;
}

export const Step1Personal: React.FC<Step1Props> = ({ data, onUpdate, onNext }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, avatar: 'Image size must be less than 2MB' }));
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      onUpdate({ avatarUrl: previewUrl });
      setErrors((prev) => ({ ...prev, avatar: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!data.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!data.experienceYears.trim()) newErrors.experienceYears = 'Driving experience is required';
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!data.phoneNumber.trim() || data.phoneNumber.length < 8) {
      newErrors.phoneNumber = 'Enter a valid phone number';
    }
    if (!data.password || data.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Photo Upload */}
      <div className="flex flex-col items-center justify-center pb-2 text-center">
        <div
          className="group relative cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 shadow-inner transition-all group-hover:border-red-500 sm:h-28 sm:w-28">
            {data.avatarUrl ? (
              <Image
                src={data.avatarUrl}
                alt="Profile Preview"
                width={112}
                height={112}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-slate-400 transition-colors group-hover:text-red-500" />
            )}
          </div>
          <button
            type="button"
            className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-red-600 text-white shadow-md transition-colors hover:bg-red-700"
            aria-label="Upload profile photo"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        <p className="mt-2 text-xs font-medium text-slate-500">
          Upload a clear, front-facing photo. JPG or PNG, max 2MB.
        </p>
        {errors.avatar && <p className="mt-1 text-xs text-red-600">{errors.avatar}</p>}
      </div>

      {/* Full Name & Experience Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <InputField
            id="fullName"
            label="Full Name"
            placeholder="e.g. Mohammad Rahim"
            value={data.fullName}
            onChange={(e) => {
              onUpdate({ fullName: e.target.value });
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
            }}
            icon={<User className="h-4 w-4" />}
            error={errors.fullName}
          />
        </div>

        <div>
          <InputField
            id="experienceYears"
            label="Driving Experience (Years)"
            type="number"
            min="0"
            placeholder="e.g. 5"
            value={data.experienceYears}
            onChange={(e) => {
              onUpdate({ experienceYears: e.target.value });
              if (errors.experienceYears) setErrors((prev) => ({ ...prev, experienceYears: '' }));
            }}
            icon={<Clock className="h-4 w-4" />}
            error={errors.experienceYears}
          />
        </div>
      </div>

      {/* Email Address */}
      <InputField
        id="email"
        label="Email Address"
        type="email"
        placeholder="e.g. driver@example.com"
        value={data.email}
        onChange={(e) => {
          onUpdate({ email: e.target.value });
          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
        }}
        icon={<Mail className="h-4 w-4" />}
        error={errors.email}
      />

      {/* Phone Number with Bangladesh Prefix */}
      <InputField
        id="phone"
        label="Phone Number"
        type="tel"
        placeholder="01712345678"
        value={data.phoneNumber}
        onChange={(e) => {
          onUpdate({ phoneNumber: e.target.value });
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

      {/* Create Password */}
      <InputField
        id="password"
        label="Create Password"
        type="password"
        placeholder="At least 8 characters"
        value={data.password}
        onChange={(e) => {
          onUpdate({ password: e.target.value });
          if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
        }}
        icon={<Lock className="h-4 w-4" />}
        error={errors.password}
      />

      {/* Next Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-bold tracking-wide text-white shadow-md shadow-red-600/25 transition-all duration-200 hover:bg-red-700"
        >
          <span>Next: Document Verification</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};
