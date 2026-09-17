'use client';

import React, { useRef, useState } from 'react';
import {
  FileText,
  Calendar,
  Plus,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
} from 'lucide-react';
import { InputField } from '@/components/dashboard/Fields/InputField/InputField';

export interface DriverDocumentsData {
  nidNumber: string;
  nidFront: string | null;
  nidBack: string | null;
  licenseNumber: string;
  licenseExpiry: string;
  licenseFront: string | null;
  licenseBack: string | null;
}

interface Step2Props {
  data: DriverDocumentsData;
  onUpdate: (data: Partial<DriverDocumentsData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Documents: React.FC<Step2Props> = ({ data, onUpdate, onNext, onBack }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nidFrontInput = useRef<HTMLInputElement>(null);
  const nidBackInput = useRef<HTMLInputElement>(null);
  const licenseFrontInput = useRef<HTMLInputElement>(null);
  const licenseBackInput = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    field: keyof DriverDocumentsData,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, [field]: 'File size must be under 5MB' }));
        return;
      }
      onUpdate({ [field]: file.name });
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!data.nidNumber.trim()) newErrors.nidNumber = 'NID number is required';
    if (!data.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
    if (!data.licenseExpiry.trim()) newErrors.licenseExpiry = 'License expiry date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. National ID (NID) Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-red-600">
            <FileText className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 sm:text-base">National ID (NID)</h3>
        </div>

        {/* NID Number */}
        <InputField
          id="nidNumber"
          label="NID Number"
          placeholder="Enter your 10 or 13-digit NID number"
          value={data.nidNumber}
          onChange={(e) => {
            onUpdate({ nidNumber: e.target.value });
            if (errors.nidNumber) setErrors((prev) => ({ ...prev, nidNumber: '' }));
          }}
          error={errors.nidNumber}
        />

        {/* NID Upload Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* NID Front */}
          <div
            onClick={() => nidFrontInput.current?.click()}
            className={`flex min-h-[130px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition-all ${
              data.nidFront
                ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900'
                : 'border-slate-200 bg-slate-50/50 hover:border-red-400 hover:bg-slate-50'
            }`}
          >
            <input
              ref={nidFrontInput}
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileUpload('nidFront', e)}
              className="hidden"
            />
            {data.nidFront ? (
              <>
                <CheckCircle2 className="mb-1.5 h-7 w-7 text-emerald-600" />
                <span className="max-w-[200px] truncate text-xs font-bold text-emerald-800">
                  {data.nidFront}
                </span>
                <span className="mt-1 text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
                  Upload Successful
                </span>
              </>
            ) : (
              <>
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-400 shadow-xs">
                  <Plus className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">NID Front Side</span>
                <span className="mt-0.5 text-[11px] text-slate-400">Drag or click to upload</span>
              </>
            )}
          </div>

          {/* NID Back */}
          <div
            onClick={() => nidBackInput.current?.click()}
            className={`flex min-h-[130px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition-all ${
              data.nidBack
                ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900'
                : 'border-slate-200 bg-slate-50/50 hover:border-red-400 hover:bg-slate-50'
            }`}
          >
            <input
              ref={nidBackInput}
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileUpload('nidBack', e)}
              className="hidden"
            />
            {data.nidBack ? (
              <>
                <CheckCircle2 className="mb-1.5 h-7 w-7 text-emerald-600" />
                <span className="max-w-[200px] truncate text-xs font-bold text-emerald-800">
                  {data.nidBack}
                </span>
                <span className="mt-1 text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
                  Upload Successful
                </span>
              </>
            ) : (
              <>
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-400 shadow-xs">
                  <Plus className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">NID Back Side</span>
                <span className="mt-0.5 text-[11px] text-slate-400">Drag or click to upload</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Driving License Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-red-600">
            <FileText className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 sm:text-base">Driving License</h3>
        </div>

        {/* License Number & Expiry Date Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            id="licenseNumber"
            label="License Number"
            placeholder="e.g. LA0123456789"
            value={data.licenseNumber}
            onChange={(e) => {
              onUpdate({ licenseNumber: e.target.value });
              if (errors.licenseNumber) setErrors((prev) => ({ ...prev, licenseNumber: '' }));
            }}
            error={errors.licenseNumber}
          />

          <InputField
            id="licenseExpiry"
            label="Expiry Date"
            type="date"
            value={data.licenseExpiry}
            onChange={(e) => {
              onUpdate({ licenseExpiry: e.target.value });
              if (errors.licenseExpiry) setErrors((prev) => ({ ...prev, licenseExpiry: '' }));
            }}
            icon={<Calendar className="h-4 w-4" />}
            error={errors.licenseExpiry}
          />
        </div>

        {/* License Upload Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* License Front */}
          <div
            onClick={() => licenseFrontInput.current?.click()}
            className={`flex min-h-[130px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition-all ${
              data.licenseFront
                ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900'
                : 'border-slate-200 bg-slate-50/50 hover:border-red-400 hover:bg-slate-50'
            }`}
          >
            <input
              ref={licenseFrontInput}
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileUpload('licenseFront', e)}
              className="hidden"
            />
            {data.licenseFront ? (
              <>
                <CheckCircle2 className="mb-1.5 h-7 w-7 text-emerald-600" />
                <span className="max-w-[200px] truncate text-xs font-bold text-emerald-800">
                  {data.licenseFront}
                </span>
                <span className="mt-1 text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
                  Upload Successful
                </span>
              </>
            ) : (
              <>
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-400 shadow-xs">
                  <UploadCloud className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">License Front</span>
                <span className="mt-0.5 text-[11px] text-slate-400">Clear photo required</span>
              </>
            )}
          </div>

          {/* License Back */}
          <div
            onClick={() => licenseBackInput.current?.click()}
            className={`flex min-h-[130px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition-all ${
              data.licenseBack
                ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900'
                : 'border-slate-200 bg-slate-50/50 hover:border-red-400 hover:bg-slate-50'
            }`}
          >
            <input
              ref={licenseBackInput}
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileUpload('licenseBack', e)}
              className="hidden"
            />
            {data.licenseBack ? (
              <>
                <CheckCircle2 className="mb-1.5 h-7 w-7 text-emerald-600" />
                <span className="max-w-[200px] truncate text-xs font-bold text-emerald-800">
                  {data.licenseBack}
                </span>
                <span className="mt-1 text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
                  Upload Successful
                </span>
              </>
            ) : (
              <>
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-400 shadow-xs">
                  <UploadCloud className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">License Back</span>
                <span className="mt-0.5 text-[11px] text-slate-400">Max size: 5MB</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold tracking-wide text-slate-700 transition-all hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          className="flex h-12 flex-[2] cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-bold tracking-wide text-white shadow-md shadow-red-600/25 transition-all hover:bg-red-700"
        >
          <span>Next: Vehicle Details</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};
