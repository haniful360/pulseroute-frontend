'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { MapPin, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PlaceSelection {
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
}

export interface GooglePlaceAutocompleteProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (place: PlaceSelection) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  required?: boolean;
}

export default function GooglePlaceAutocomplete({
  label,
  value,
  onChange,
  onPlaceSelect,
  placeholder = 'Search address or hospital...',
  icon,
  className,
  required,
}: GooglePlaceAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;
    if (!window.google?.maps?.places) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'bd' }, // Focus on Bangladesh / Dhaka
      fields: ['address_components', 'formatted_address', 'geometry', 'name', 'place_id'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address || place.name || '';

      onChange(address);
      if (onPlaceSelect) {
        onPlaceSelect({
          address,
          lat,
          lng,
          placeId: place.place_id,
        });
      }
    });

    autocompleteRef.current = autocomplete;
  }, [isLoaded]);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="pointer-events-none absolute left-3.5 flex items-center text-slate-400">
            {icon}
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={cn(
            "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-xs font-medium text-slate-900 shadow-2xs transition placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500",
            icon ? "pl-10" : "pl-4"
          )}
        />
      </div>
    </div>
  );
}
