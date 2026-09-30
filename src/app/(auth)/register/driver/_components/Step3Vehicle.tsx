'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { InputField } from '@/components/dashboard/Fields/InputField/InputField';
import {
  Truck,
  HeartPulse,
  Activity,
  Snowflake,
  Wind,
  Heart,
  Baby,
  UploadCloud,
  Plus,
  ArrowRight,
  ArrowLeft,
  Stethoscope,
  X,
} from 'lucide-react';
import { compressImageFile } from '@/lib/image-compressor';

export interface DriverVehicleData {
  vehiclePlate: string;
  ambulanceType: string;
  equipment: {
    oxygen: boolean;
    ventilator: boolean;
    defibrillator: boolean;
    suction: boolean;
    stretcher: boolean;
    firstAidKit: boolean;
  };
  photos: string[];
}

interface Step3Props {
  data: DriverVehicleData;
  onUpdate: (data: Partial<DriverVehicleData>) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const AMBULANCE_TYPES = [
  {
    id: 'icu',
    title: 'ICU Ambulance',
    icon: Activity,
    description: 'Critical care equipped with ventilator and life support',
  },
  {
    id: 'bls',
    title: 'Basic Life Support',
    icon: HeartPulse,
    description: 'Essential patient transit and trauma stabilization',
  },
  {
    id: 'freezer',
    title: 'Freezer Ambulance',
    icon: Snowflake,
    description: 'Mortuary and cold storage transport',
  },
  {
    id: 'ac_transport',
    title: 'AC Transport',
    icon: Wind,
    description: 'Climate-controlled non-critical patient mobility',
  },
  {
    id: 'cardiac',
    title: 'Cardiac (CCU)',
    icon: Heart,
    description: 'Dedicated cardiac monitoring and defibrillator units',
  },
  {
    id: 'neonatal',
    title: 'Neonatal Unit',
    icon: Baby,
    description: 'Specialized infant incubator and pediatric care',
  },
];

export const Step3Vehicle: React.FC<Step3Props> = ({
  data,
  onUpdate,
  onNext,
  onBack,
  isSubmitting = false,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleEquipmentToggle = (key: keyof DriverVehicleData['equipment'], value: boolean) => {
    onUpdate({
      equipment: {
        ...data.equipment,
        [key]: value,
      },
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      const compressPromises = fileList.map((file) => compressImageFile(file, 1280, 1280, 0.8));

      try {
        const newPhotoUrls = await Promise.all(compressPromises);
        onUpdate({
          photos: [...data.photos, ...newPhotoUrls.filter(Boolean)],
        });
        if (errors.photos) setErrors((prev) => ({ ...prev, photos: '' }));
      } catch {
        setErrors((prev) => ({ ...prev, photos: 'Failed to process some vehicle photos' }));
      }
      e.target.value = '';
    }
  };

  const removePhoto = (index: number) => {
    const updated = data.photos.filter((_, i) => i !== index);
    onUpdate({ photos: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!data.vehiclePlate.trim()) {
      newErrors.vehiclePlate = 'Vehicle License Number is required';
    }
    if (!data.ambulanceType) {
      newErrors.ambulanceType = 'Please select an ambulance category';
    }
    if (!data.photos || data.photos.length === 0) {
      newErrors.photos = 'Please upload at least one vehicle photo';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Vehicle Registration */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-red-600">
            <Truck className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 sm:text-base">Vehicle Registration</h3>
        </div>

        <InputField
          id="vehiclePlate"
          label="Vehicle License Number"
          placeholder="e.g. DHAKA-METRO-12-3456"
          value={data.vehiclePlate}
          onChange={(e) => {
            onUpdate({ vehiclePlate: e.target.value });
            if (errors.vehiclePlate) setErrors((prev) => ({ ...prev, vehiclePlate: '' }));
          }}
          className="tracking-wide uppercase"
          error={errors.vehiclePlate}
        />
      </div>

      {/* 2. Ambulance Type Grid */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 sm:text-base">Ambulance Type</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Select the category that best describes your vehicle
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3">
          {AMBULANCE_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = data.ambulanceType === type.id;
            return (
              <div
                key={type.id}
                onClick={() => onUpdate({ ambulanceType: type.id })}
                className={`relative flex min-h-[110px] cursor-pointer flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all duration-200 ${
                  isSelected
                    ? 'border-red-500 bg-red-50/50 shadow-sm ring-1 ring-red-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 rounded-md bg-red-600 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider text-white uppercase">
                    Selected
                  </span>
                )}
                <div
                  className={`mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                    isSelected ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs leading-tight font-bold text-slate-800">{type.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Medical Equipment Toggles */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-red-600">
            <Stethoscope className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 sm:text-base">
              Medical Equipment & Supplies
            </h3>
            <p className="text-xs text-slate-500">
              Select all functional equipment present in your ambulance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
          {/* Oxygen Support */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/40 p-3.5">
            <div>
              <p className="text-xs font-bold text-slate-800">Oxygen Support</p>
              <p className="text-[11px] text-slate-400">Standard medical cylinders</p>
            </div>
            <Switch
              checked={data.equipment.oxygen}
              onCheckedChange={(checked) => handleEquipmentToggle('oxygen', checked)}
              className="data-[state=checked]:bg-emerald-600"
            />
          </div>

          {/* Ventilator */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/40 p-3.5">
            <div>
              <p className="text-xs font-bold text-slate-800">Ventilator</p>
              <p className="text-[11px] text-slate-400">Built-in emergency ventilator</p>
            </div>
            <Switch
              checked={data.equipment.ventilator}
              onCheckedChange={(checked) => handleEquipmentToggle('ventilator', checked)}
              className="data-[state=checked]:bg-emerald-600"
            />
          </div>

          {/* Defibrillator */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/40 p-3.5">
            <div>
              <p className="text-xs font-bold text-slate-800">Defibrillator</p>
              <p className="text-[11px] text-slate-400">AED or manual unit</p>
            </div>
            <Switch
              checked={data.equipment.defibrillator}
              onCheckedChange={(checked) => handleEquipmentToggle('defibrillator', checked)}
              className="data-[state=checked]:bg-emerald-600"
            />
          </div>

          {/* Suction Pump */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/40 p-3.5">
            <div>
              <p className="text-xs font-bold text-slate-800">Suction Pump</p>
              <p className="text-[11px] text-slate-400">Portable or stationary</p>
            </div>
            <Switch
              checked={data.equipment.suction}
              onCheckedChange={(checked) => handleEquipmentToggle('suction', checked)}
              className="data-[state=checked]:bg-emerald-600"
            />
          </div>

          {/* Foldable Stretcher */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/40 p-3.5">
            <div>
              <p className="text-xs font-bold text-slate-800">Foldable Stretcher</p>
              <p className="text-[11px] text-slate-400">Standard ambulance cot/stretcher</p>
            </div>
            <Switch
              checked={data.equipment.stretcher}
              onCheckedChange={(checked) => handleEquipmentToggle('stretcher', checked)}
              className="data-[state=checked]:bg-emerald-600"
            />
          </div>

          {/* Advanced First Aid Kit */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/40 p-3.5">
            <div>
              <p className="text-xs font-bold text-slate-800">Advanced First Aid Kit</p>
              <p className="text-[11px] text-slate-400">Trauma bag & triage kit</p>
            </div>
            <Switch
              checked={data.equipment.firstAidKit}
              onCheckedChange={(checked) => handleEquipmentToggle('firstAidKit', checked)}
              className="data-[state=checked]:bg-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* 4. Vehicle Photos Multi-upload */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 sm:text-base">Vehicle Photos</h3>
            <p className="text-xs text-slate-500">
              Upload photos of your vehicle&apos;s exterior and interior (min 3 photos)
            </p>
          </div>
          {data.photos.length > 0 && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                data.photos.length >= 3
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {data.photos.length} / 3 photos
            </span>
          )}
        </div>

        <div
          className={`rounded-2xl border-2 border-dashed p-4 transition-colors ${
            errors.photos
              ? 'border-red-400 bg-red-50/30'
              : 'border-slate-200 bg-slate-50/50'
          }`}
        >
          <input
            ref={photoInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />

          {data.photos.length === 0 ? (
            <div
              onClick={() => photoInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center py-7"
            >
              <div className="mb-3 flex h-13 w-13 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm transition-transform hover:scale-105">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold text-slate-800 sm:text-sm">Drop your photos here</p>
              <p className="mt-1 text-xs text-slate-500">
                or <span className="font-semibold text-red-600 underline">browse from computer</span>
              </p>
              <p className="mt-1.5 text-[11px] text-slate-400">Exterior, interior & equipment (min 3 photos)</p>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3.5 p-1">
              {data.photos.map((url, index) => (
                <div
                  key={index}
                  className="group relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs"
                >
                  <Image
                    src={url}
                    alt={`Ambulance preview ${index + 1}`}
                    width={112}
                    height={112}
                    unoptimized
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition-all hover:bg-red-700 cursor-pointer"
                    aria-label="Remove photo"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-xs">
                    Photo {index + 1}
                  </span>
                </div>
              ))}

              {/* Increased Add Button */}
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="flex h-24 w-24 sm:h-28 sm:w-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-red-300 bg-red-50/50 text-red-600 shadow-xs transition-all hover:border-red-500 hover:bg-red-100/60 hover:shadow-sm"
              >
                <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 shadow-xs">
                  <Plus className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold">Add</span>
                <span className="text-[10px] font-semibold text-slate-500">
                  {data.photos.length}/3 min
                </span>
              </button>
            </div>
          )}
        </div>
        {errors.photos && (
          <p className="mt-1 text-xs font-semibold text-red-600">{errors.photos}</p>
        )}
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
          disabled={isSubmitting}
          className="flex h-12 flex-[2] cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-bold tracking-wide text-white shadow-md shadow-red-600/25 transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              <span>Submit for Verification</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
