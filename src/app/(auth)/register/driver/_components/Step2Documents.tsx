'use client';

import React, { useRef, useState } from 'react';
import {
  FileText,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
} from 'lucide-react';
import { InputField } from '@/components/dashboard/Fields/InputField/InputField';
import { compressImageFile } from '@/lib/image-compressor';

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

const isImage = (val: string | null): boolean => {
  if (!val) return false;
  return (
    val.startsWith('data:image') ||
    val.startsWith('http://') ||
    val.startsWith('https://') ||
    val.startsWith('blob:') ||
    /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(val)
  );
};

export const Step2Documents: React.FC<Step2Props> = ({ data, onUpdate, onNext, onBack }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nidFrontInput = useRef<HTMLInputElement>(null);
  const nidBackInput = useRef<HTMLInputElement>(null);
  const licenseFrontInput = useRef<HTMLInputElement>(null);
  const licenseBackInput = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    field: keyof DriverDocumentsData,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 1280, 1280, 0.82);
        onUpdate({ [field]: compressed });
        setErrors((prev) => ({ ...prev, [field]: '' }));
      } catch {
        setErrors((prev) => ({ ...prev, [field]: 'Failed to process file' }));
      }
      e.target.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!data.nidNumber.trim()) newErrors.nidNumber = 'NID number is required';
    if (!data.nidFront) newErrors.nidFront = 'NID card photo (Front) is required';
    if (!data.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
    if (!data.licenseExpiry.trim()) newErrors.licenseExpiry = 'License expiry date is required';
    if (!data.licenseFront) newErrors.licenseFront = 'Driving license photo (Front) is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  const renderUploadCard = (
    field: keyof DriverDocumentsData,
    label: string,
    subLabel: string,
    inputRef: React.RefObject<HTMLInputElement | null>,
  ) => {
    const val = data[field];
    const isImg = isImage(val);

    return (
      <div className="flex flex-col gap-1.5">
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => handleFileUpload(field, e)}
          className="hidden"
        />

        {val ? (
          <div className="group relative flex min-h-[140px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-emerald-500 bg-slate-900/5 transition-all">
            {isImg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={val}
                alt={label}
                className="h-[140px] w-full object-cover rounded-xl"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <CheckCircle2 className="mb-1.5 h-8 w-8 text-emerald-600" />
                <span className="max-w-[200px] truncate text-xs font-bold text-emerald-800">
                  {val.length > 50 ? 'Document Uploaded' : val}
                </span>
                <span className="mt-1 text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
                  Upload Successful
                </span>
              </div>
            )}

            {/* Hover Actions Overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-md hover:bg-slate-100 cursor-pointer"
              >
                Change
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ [field]: null })}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-md hover:bg-red-700 cursor-pointer"
              >
                Remove
              </button>
            </div>

            {/* Bottom Status Tag */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-lg bg-emerald-700/90 px-2.5 py-1 text-white backdrop-blur-xs text-[10px] font-semibold">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                <span>{label}</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider font-bold">Uploaded</span>
            </div>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            className={`flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition-all ${
              errors[field]
                ? 'border-red-400 bg-red-50/30'
                : 'border-slate-200 bg-slate-50/50 hover:border-red-400 hover:bg-slate-50'
            }`}
          >
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-400 shadow-xs">
              <UploadCloud className="h-5 w-5 text-red-600" />
            </div>
            <span className="text-xs font-bold text-slate-700">{label}</span>
            <span className="mt-0.5 text-[11px] text-slate-400">{subLabel}</span>
          </div>
        )}

        {errors[field] && (
          <p className="text-[11px] font-medium text-red-600">{errors[field]}</p>
        )}
      </div>
    );
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
          {renderUploadCard(
            'nidFront',
            'NID Front Side',
            'Click or drag photo here',
            nidFrontInput,
          )}
          {renderUploadCard(
            'nidBack',
            'NID Back Side',
            'Click or drag photo here',
            nidBackInput,
          )}
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
          {renderUploadCard(
            'licenseFront',
            'License Front',
            'Clear photo of license front',
            licenseFrontInput,
          )}
          {renderUploadCard(
            'licenseBack',
            'License Back',
            'Clear photo of license back',
            licenseBackInput,
          )}
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
