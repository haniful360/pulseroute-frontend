'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { MapPin, Navigation, Hospital, Search, Check, Building2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { forwardGeocode } from '@/lib/geocoding';

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

// Curated Emergency Hospital & Landmark Presets in Dhaka
const DHAKA_PRESETS: PlaceSelection[] = [
  {
    address: 'Dhaka Medical College Hospital (DMCH), Bakshibazar, Dhaka',
    lat: 23.7258,
    lng: 90.3976,
    placeId: 'dmch_dhaka',
  },
  {
    address: 'Square Hospital, 18/F Bir Uttam Qazi Nuruzzaman Sarak, Panthapath, Dhaka',
    lat: 23.7533,
    lng: 90.3817,
    placeId: 'square_panthapath',
  },
  {
    address: 'Evercare Hospital Dhaka (Apollo), Plot 81, Block E, Bashundhara R/A, Dhaka',
    lat: 23.8093,
    lng: 90.4312,
    placeId: 'evercare_bashundhara',
  },
  {
    address: 'United Hospital, Plot 15, Road 71, Gulshan-2, Dhaka',
    lat: 23.7997,
    lng: 90.4194,
    placeId: 'united_gulshan',
  },
  {
    address: 'Bangabandhu Sheikh Mujib Medical University (BSMMU / PG), Shahbagh, Dhaka',
    lat: 23.7388,
    lng: 90.3958,
    placeId: 'bsmmu_shahbagh',
  },
  {
    address: 'BIRDEM General Hospital, Shahbagh, Dhaka',
    lat: 23.7392,
    lng: 90.3965,
    placeId: 'birdem_shahbagh',
  },
  {
    address: 'National Institute of Cardiovascular Diseases (NICVD), Sher-e-Bangla Nagar, Dhaka',
    lat: 23.7719,
    lng: 90.3705,
    placeId: 'nicvd_dhaka',
  },
  {
    address: 'Labaid Specialized Hospital, House 06, Road 04, Dhanmondi, Dhaka',
    lat: 23.7431,
    lng: 90.3826,
    placeId: 'labaid_dhanmondi',
  },
  {
    address: 'Ibn Sina Specialized Hospital, House 48, Road 9/A, Dhanmondi, Dhaka',
    lat: 23.7482,
    lng: 90.3742,
    placeId: 'ibnsina_dhanmondi',
  },
  {
    address: 'Kurmitola General Hospital, Airport Road, Dhaka Cantonment',
    lat: 23.8223,
    lng: 90.4079,
    placeId: 'kurmitola_cantonment',
  },
  {
    address: 'Shaheed Suhrawardy Medical College Hospital, Sher-e-Bangla Nagar, Dhaka',
    lat: 23.7697,
    lng: 90.3718,
    placeId: 'suhrawardy_dhaka',
  },
  {
    address: 'Holy Family Red Crescent Medical College Hospital, 1 Eskaton Garden, Dhaka',
    lat: 23.7467,
    lng: 90.4039,
    placeId: 'holyfamily_eskaton',
  },
  {
    address: 'Uttara Crescent Hospital, Unit 1, Rabindra Sarani, Sector 3, Uttara, Dhaka',
    lat: 23.8687,
    lng: 90.3986,
    placeId: 'uttara_crescent',
  },
];

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
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const { isLoaded, authError } = useGoogleMaps();

  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceSelection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimerRef = useRef<any>(null);
  const lastResolvedAddressRef = useRef<string>(value);

  // Helper to forward-geocode manual typing to real coordinates
  const handleManualGeocode = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!clean || !onPlaceSelect) return;
      if (clean === lastResolvedAddressRef.current) return;

      try {
        const geo = await forwardGeocode(clean);
        if (geo) {
          lastResolvedAddressRef.current = clean;
          onPlaceSelect({
            address: clean,
            lat: geo.lat,
            lng: geo.lng,
          });
        }
      } catch {
        // preserve manual text
      }
    },
    [onPlaceSelect]
  );

  // 1. Google Places Autocomplete (When Google Maps is fully authenticated)
  useEffect(() => {
    if (!isLoaded || authError || !inputRef.current || autocompleteRef.current) return;
    if (!window.google?.maps?.places) return;

    try {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'bd' },
        fields: ['address_components', 'formatted_address', 'geometry', 'name', 'place_id'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry?.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || place.name || '';

        lastResolvedAddressRef.current = address;
        onChange(address);
        if (onPlaceSelect) {
          onPlaceSelect({
            address,
            lat,
            lng,
            placeId: place.place_id,
          });
        }
        setIsOpen(false);
      });

      autocompleteRef.current = autocomplete;
    } catch (err) {
      console.warn('Google Places initialization failed, fallback active:', err);
    }
  }, [isLoaded, authError, onChange, onPlaceSelect]);

  // 2. OpenStreetMap & Dhaka Preset Fallback Search
  const searchNominatimAndPresets = useCallback(
    async (query: string) => {
      const clean = query.trim().toLowerCase();
      if (!clean) {
        setSuggestions(DHAKA_PRESETS.slice(0, 5));
        return;
      }

      // Filter preset hospitals first
      const matchedPresets = DHAKA_PRESETS.filter((p) =>
        p.address.toLowerCase().includes(clean)
      );

      setIsLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&countrycodes=bd&q=${encodeURIComponent(
            query
          )}&limit=5`
        );
        if (res.ok) {
          const data = await res.json();
          const nominatimResults: PlaceSelection[] = data.map((item: any) => ({
            address: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            placeId: `osm_${item.place_id}`,
          }));

          // Merge presets and OpenStreetMap results
          const combined = [...matchedPresets, ...nominatimResults];
          // Deduplicate by address
          const unique = combined.filter(
            (v, idx, a) => a.findIndex((t) => t.address === v.address) === idx
          );
          setSuggestions(unique.slice(0, 6));
        } else {
          setSuggestions(matchedPresets);
        }
      } catch {
        setSuggestions(matchedPresets);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleInputChange = (text: string) => {
    onChange(text);
    setIsOpen(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchNominatimAndPresets(text);
      // Auto forward-geocode if user paused typing
      handleManualGeocode(text);
    }, 600);
  };

  const handleSelectSuggestion = (place: PlaceSelection) => {
    lastResolvedAddressRef.current = place.address;
    onChange(place.address);
    if (onPlaceSelect) {
      onPlaceSelect(place);
    }
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn('relative space-y-1.5', className)}>
      {label && (
        <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <div className="pointer-events-none absolute left-3.5 flex items-center text-slate-400 z-10">
            {icon}
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            setIsOpen(true);
            if (!value) {
              setSuggestions(DHAKA_PRESETS.slice(0, 5));
            } else {
              searchNominatimAndPresets(value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (suggestions.length > 0) {
                handleSelectSuggestion(suggestions[0]);
              } else if (value.trim()) {
                handleManualGeocode(value);
                setIsOpen(false);
              }
            }
          }}
          onBlur={() => {
            // Slight delay so clicking a suggestion is processed before blur
            setTimeout(() => {
              if (value.trim()) {
                handleManualGeocode(value);
              }
            }, 300);
          }}
          placeholder={placeholder}
          required={required}
          className={cn(
            'h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-xs font-medium text-slate-900 shadow-2xs transition placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500',
            icon ? 'pl-10' : 'pl-4',
            isLoading ? 'pr-10' : 'pr-4'
          )}
        />
        {isLoading && (
          <div className="absolute right-3.5 flex items-center text-slate-400 pointer-events-none">
            <Loader2 className="h-4 w-4 animate-spin text-red-500" />
          </div>
        )}
      </div>

      {/* Floating Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-60 overflow-y-auto rounded-2xl border border-slate-200 bg-white/98 shadow-xl backdrop-blur-md p-1.5">
          <div className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center justify-between border-b border-slate-100 mb-1">
            <span>Locations &amp; Hospitals in Dhaka</span>
            <span className="text-[9px] text-emerald-600 font-semibold">Live GPS Ready</span>
          </div>

          <div className="space-y-0.5">
            {suggestions.map((item) => (
              <button
                key={item.placeId || item.address}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer group"
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 group-hover:bg-red-500 group-hover:text-white transition">
                  {item.address.toLowerCase().includes('hospital') ||
                  item.address.toLowerCase().includes('medical') ? (
                    <Hospital className="h-3.5 w-3.5" />
                  ) : (
                    <MapPin className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-red-600 transition">
                    {item.address.split(',')[0]}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {item.address}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
