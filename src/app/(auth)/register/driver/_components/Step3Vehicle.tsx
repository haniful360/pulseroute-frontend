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

export const Step3Vehicle: React.FC<Step3Props> = ({ data, onUpdate, onNext, onBack }) => {
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newPhotoUrls = Array.from(files).map((file) => URL.createObjectURL(file));
      onUpdate({
        photos: [...data.photos, ...newPhotoUrls],
      });
      if (errors.photos) setErrors((prev) => ({ ...prev, photos: '' }));
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
    if (data.photos.length < 1) {
      // Default to sample if user hasn't uploaded, but notify
      // We can also allow proceeding or require at least 1
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
        <div>
          <h3 className="text-sm font-bold text-slate-800 sm:text-base">Vehicle Photos</h3>
          <p className="text-xs text-slate-500">
            Upload photos of your vehicle&apos;s exterior and interior (min 3 photos)
          </p>
        </div>

        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 text-center">
          <input
            ref={photoInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />

          <div
            onClick={() => photoInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center py-3"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm">
              <UploadCloud className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold text-slate-800 sm:text-sm">Drop your photos here</p>
            <p className="mt-1 text-xs text-slate-500">
              or <span className="font-semibold text-red-600 underline">browse from computer</span>
            </p>
          </div>

          {/* Thumbnails preview */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 border-t border-slate-200/60 pt-3">
            {data.photos.map((url, index) => (
              <div
                key={index}
                className="group relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200 shadow-xs"
              >
                <Image
                  src={url}
                  alt={`Ambulance preview ${index + 1}`}
                  width={64}
                  height={64}
                  unoptimized
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove photo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            {/* Quick add thumbnail button */}
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-slate-400 shadow-xs transition-colors hover:border-red-400 hover:text-red-600"
            >
              <Plus className="h-5 w-5" />
              <span className="mt-0.5 text-[9px] font-bold">ADD</span>
            </button>
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
          <span>Submit for Verification</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};
