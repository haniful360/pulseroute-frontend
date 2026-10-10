'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import GoogleMapView, { MapMarkerItem } from '@/components/shared/GoogleMap/GoogleMapView';
import GooglePlaceAutocomplete from '@/components/shared/GoogleMap/GooglePlaceAutocomplete';
import {
  Ambulance,
  Cross,
  Crosshair,
  Hospital,
  MapPin,
  Navigation,
  Plus,
  ShieldCheck,
  Siren,
  Snowflake,
  Stethoscope,
  Users,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { createTripAction } from '@/services/trip/trip.service';
import { getAllPricingConfigsAction, estimateFareAction } from '@/services/pricing/pricing.service';
import { getCurrentDevicePosition, reverseGeocode, forwardGeocode } from '@/lib/geocoding';

const ambulanceCategories = [
  { label: 'BASIC' as const, icon: Ambulance, defaultPrice: '1,500' },
  { label: 'AC' as const, icon: Snowflake, defaultPrice: '2,200' },
  { label: 'ICU' as const, icon: Cross, defaultPrice: '3,500' },
  { label: 'CCU' as const, icon: Stethoscope, defaultPrice: '4,000' },
  { label: 'NEONATAL' as const, icon: Users, defaultPrice: '4,500' },
  { label: 'FREEZER' as const, icon: Snowflake, defaultPrice: '3,800' },
];

const requirementsList = ['High-Flow Oxygen', 'Cardiac Monitoring', 'Wheelchair', 'Unconscious'];

export default function BookAmbulanceView() {
  const router = useRouter();

  // Location state
  const [pickupLocation, setPickupLocation] = useState('Road 27, House 42, Dhanmondi, Dhaka');
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number }>({
    lat: 23.7505,
    lng: 90.3752,
  });

  const [destinationHospital, setDestinationHospital] = useState('United Hospital, Gulshan-2, Dhaka');
  const [destinationCoords, setDestinationCoords] = useState<{ lat: number; lng: number }>({
    lat: 23.7995,
    lng: 90.4182,
  });

  const [selectedCategory, setSelectedCategory] = useState<'BASIC' | 'AC' | 'ICU' | 'CCU' | 'NEONATAL' | 'FREEZER'>('ICU');
  const [severity, setSeverity] = useState<'stable' | 'urgent' | 'critical'>('critical');
  const [patientNotes, setPatientNotes] = useState<string>('');
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([
    'Cardiac Monitoring',
    'Unconscious',
  ]);

  const [pricingConfigs, setPricingConfigs] = useState<any[]>([]);
  const [estimatedFare, setEstimatedFare] = useState<number | null>(3500);
  const [estimatedDistanceKm, setEstimatedDistanceKm] = useState<number>(7.2);
  const [estimatedDurationMins, setEstimatedDurationMins] = useState<number>(18);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Restore draft or passed params from HeroSection if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlPickup = params.get('pickup');
        const urlPickupLat = params.get('pickupLat');
        const urlPickupLng = params.get('pickupLng');
        const urlType = params.get('type') as 'BASIC' | 'AC' | 'ICU' | 'CCU' | 'NEONATAL' | 'FREEZER' | null;
        const urlDest = params.get('dest');
        const urlDestLat = params.get('destLat');
        const urlDestLng = params.get('destLng');
        const urlSeverity = params.get('severity')?.toLowerCase() as 'stable' | 'urgent' | 'critical' | null;
        const urlNotes = params.get('notes');

        if (urlPickup) setPickupLocation(urlPickup);
        if (urlPickupLat && urlPickupLng) {
          setPickupCoords({ lat: Number(urlPickupLat), lng: Number(urlPickupLng) });
        }
        if (urlType) setSelectedCategory(urlType);
        if (urlDest) setDestinationHospital(urlDest);
        if (urlDestLat && urlDestLng) {
          setDestinationCoords({ lat: Number(urlDestLat), lng: Number(urlDestLng) });
        }
        if (urlSeverity) setSeverity(urlSeverity);
        if (urlNotes) setPatientNotes(urlNotes);

        const saved = sessionStorage.getItem('pending_ambulance_booking');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.pickup) setPickupLocation(parsed.pickup);
          if (parsed.pickupLat && parsed.pickupLng) {
            setPickupCoords({ lat: Number(parsed.pickupLat), lng: Number(parsed.pickupLng) });
          }
          if (parsed.dest) setDestinationHospital(parsed.dest);
          if (parsed.destLat && parsed.destLng) {
            setDestinationCoords({ lat: Number(parsed.destLat), lng: Number(parsed.destLng) });
          }
          if (parsed.type) setSelectedCategory(parsed.type);
          if (parsed.severity) {
            const s = parsed.severity.toLowerCase() as 'stable' | 'urgent' | 'critical';
            setSeverity(s);
          }
          if (parsed.notes) setPatientNotes(parsed.notes);
          sessionStorage.removeItem('pending_ambulance_booking');
          toast.success('Loaded your emergency booking request details.');
        }
      } catch {
        // ignore parse error
      }
    }
  }, []);

  // Fetch real pricing configs from backend
  useEffect(() => {
    async function loadPricing() {
      try {
        const res = await getAllPricingConfigsAction();
        if (res.success && res.data) {
          setPricingConfigs(res.data);
        }
      } catch (err) {
        console.error('Failed to load pricing:', err);
      }
    }
    loadPricing();
  }, []);

  // Calculate real distance & fare when locations or category change
  useEffect(() => {
    async function updateEstimate() {
      if (!pickupCoords || !destinationCoords) return;

      // Approximate distance calculation
      const R = 6371;
      const dLat = ((destinationCoords.lat - pickupCoords.lat) * Math.PI) / 180;
      const dLon = ((destinationCoords.lng - pickupCoords.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((pickupCoords.lat * Math.PI) / 180) *
          Math.cos((destinationCoords.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const dist = Math.max(Number((R * c).toFixed(1)), 1.5);
      const duration = Math.max(Math.ceil(dist * 2.5), 8);

      setEstimatedDistanceKm(dist);
      setEstimatedDurationMins(duration);

      try {
        const estimateRes = await estimateFareAction({
          ambulanceType: selectedCategory,
          distanceKm: dist,
          estimatedDurationMins: duration,
        });

        if (estimateRes.success && estimateRes.data?.finalEstimatedFare) {
          setEstimatedFare(Number(estimateRes.data.finalEstimatedFare));
        } else {
          // Fallback based on config
          const config = pricingConfigs.find((p) => p.ambulanceType === selectedCategory);
          if (config) {
            const fare = Number(config.baseFare) + dist * Number(config.perKmRate);
            setEstimatedFare(Math.round(fare));
          }
        }
      } catch {
        // Fallback
        const defaultCategory = ambulanceCategories.find((c) => c.label === selectedCategory);
        setEstimatedFare(defaultCategory ? Number(defaultCategory.defaultPrice.replace(',', '')) : 3500);
      }
    }

    updateEstimate();
  }, [pickupCoords, destinationCoords, selectedCategory, pricingConfigs]);

  const toggleRequirement = (req: string) => {
    setSelectedRequirements((curr) =>
      curr.includes(req) ? curr.filter((item) => item !== req) : [...curr, req]
    );
  };

  // Get current device GPS location (Automatic Extraction + Reverse Geocoding)
  const handleUseCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const pos = await getCurrentDevicePosition();
      setPickupCoords({ lat: pos.lat, lng: pos.lng });

      const address = await reverseGeocode(pos.lat, pos.lng);
      setPickupLocation(address);
      toast.success(`Current GPS location locked: ${address}`);
    } catch (err: any) {
      console.warn('Geolocation failed:', err);
      toast.error(err.message || 'Unable to retrieve GPS location. You can type your location manually.');
    } finally {
      setIsLocating(false);
    }
  };

  // Confirm emergency booking
  const handleConfirmBooking = async () => {
    if (!pickupLocation.trim()) {
      toast.error('Please enter or select a pickup location.');
      return;
    }

    setIsSubmitting(true);
    try {
      // If address was typed manually, synchronize coordinates via forward geocoding
      let effectiveCoords = pickupCoords;
      try {
        const geo = await forwardGeocode(pickupLocation.trim());
        if (geo) {
          effectiveCoords = { lat: geo.lat, lng: geo.lng };
          setPickupCoords(effectiveCoords);
        }
      } catch {
        // preserve current coords
      }

      const severityMap: Record<string, 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW'> = {
        stable: 'LOW',
        urgent: 'HIGH',
        critical: 'CRITICAL',
      };

      const combinedNotes = [
        patientNotes.trim(),
        selectedRequirements.length ? `Requirements: ${selectedRequirements.join(', ')}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      const payload = {
        ambulanceType: selectedCategory,
        emergencySeverity: (severityMap[severity] || 'CRITICAL') as 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW',
        pickupAddress: pickupLocation.trim(),
        pickupLatitude: effectiveCoords.lat,
        pickupLongitude: effectiveCoords.lng,
        destinationAddress: destinationHospital,
        destinationLatitude: destinationCoords.lat,
        destinationLongitude: destinationCoords.lng,
        patientNotes: combinedNotes || undefined,
      };

      const res = await createTripAction(payload);

      if (res.success && res.data) {
        toast.success(`🚨 Emergency dispatch initiated! Trip Code: ${res.data.trip?.tripCode || 'Active'}`);
        router.push(`/dashboard/patient/active-trip?tripId=${res.data.trip?.id}`);
      } else {
        toast.error(res.message || 'Failed to dispatch ambulance. Please try again or call 999.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Network error during dispatch booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare Map Markers
  const mapMarkers: MapMarkerItem[] = [
    {
      id: 'pickup',
      lat: pickupCoords.lat,
      lng: pickupCoords.lng,
      iconType: 'pickup',
      title: 'Pickup Location',
      label: 'Your Emergency Pickup',
    },
    {
      id: 'destination',
      lat: destinationCoords.lat,
      lng: destinationCoords.lng,
      iconType: 'destination',
      title: destinationHospital,
      label: destinationHospital,
    },
    // Nearby ambulance simulation markers in Dhaka
    {
      id: 'amb-1',
      lat: pickupCoords.lat + 0.009,
      lng: pickupCoords.lng - 0.008,
      iconType: 'ambulance',
      title: 'Active Paramedic Unit (DHA-12)',
    },
    {
      id: 'amb-2',
      lat: pickupCoords.lat - 0.012,
      lng: pickupCoords.lng + 0.011,
      iconType: 'ambulance',
      title: 'Active ICU Unit (DHA-09)',
    },
  ];

  return (
    <div className="-m-4 flex min-h-[calc(100vh-4rem)] flex-col bg-[#f8fafc] sm:-m-6 lg:-m-8">
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Left Side: Booking Form Section */}
        <section className="w-full border-b border-slate-200 bg-white p-5 lg:w-[400px] lg:border-r lg:border-b-0 lg:p-6 overflow-y-auto">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">
                Emergency Dispatch
              </p>
              <h1 className="mt-1 text-xl font-black text-slate-900">Booking Cockpit</h1>
            </div>
            <DynamicBadge text="System Ready" color="#10b981" size="xs" />
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50/50 p-4 shadow-xs">
            {/* 1. Pickup Address */}
            <div>
              <GooglePlaceAutocomplete
                label="Pickup address"
                value={pickupLocation}
                onChange={setPickupLocation}
                onPlaceSelect={(place) => {
                  setPickupCoords({ lat: place.lat, lng: place.lng });
                  setPickupLocation(place.address);
                }}
                icon={<MapPin className="h-4 w-4 text-[#e63946]" />}
                placeholder="Type building, road, area or hospital"
                required
              />
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 cursor-pointer disabled:opacity-50"
              >
                <Crosshair className={`h-3.5 w-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Extracting GPS location...' : 'Use current location'}</span>
              </button>
            </div>

            {/* 2. Destination Hospital */}
            <div>
              <GooglePlaceAutocomplete
                label="Destination hospital"
                value={destinationHospital}
                onChange={setDestinationHospital}
                onPlaceSelect={(place) => {
                  setDestinationCoords({ lat: place.lat, lng: place.lng });
                  setDestinationHospital(place.address);
                }}
                icon={<Hospital className="h-4 w-4 text-blue-600" />}
                placeholder="Search hospitals & clinics"
              />
            </div>

            {/* 3. Ambulance Type */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Ambulance type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ambulanceCategories.map(({ label, icon: Icon }) => {
                  const isSelected = selectedCategory === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setSelectedCategory(label)}
                      className={`relative flex h-16 flex-col items-center justify-center gap-1 rounded-2xl border text-[10px] font-bold transition cursor-pointer ${
                        isSelected
                          ? 'border-[#e63946] bg-red-50 text-[#e63946] shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-red-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 rounded-full bg-[#e63946] p-0.5 text-white">
                          <ShieldCheck className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Emergency Severity */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Emergency severity
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSeverity('stable')}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    severity === 'stable'
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Stable
                </button>
                <button
                  type="button"
                  onClick={() => setSeverity('urgent')}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    severity === 'urgent'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Urgent
                </button>
                <button
                  type="button"
                  onClick={() => setSeverity('critical')}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    severity === 'critical'
                      ? 'bg-red-600 text-white shadow-xs shadow-red-600/30'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Critical
                </button>
              </div>
            </div>

            {/* 5. Patient Notes for the Crew */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600">
                Patient notes for the crew
              </label>

              {/* Quick Requirement Chips */}
              <div className="flex flex-wrap gap-1.5">
                {requirementsList.map((req) => {
                  const selected = selectedRequirements.includes(req);
                  return (
                    <button
                      key={req}
                      type="button"
                      onClick={() => toggleRequirement(req)}
                      className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-[10px] font-bold transition cursor-pointer ${
                        selected
                          ? 'bg-[#0b132b] text-white shadow-xs'
                          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {req}
                      {selected ? <X className="h-2.5 w-2.5" /> : <Plus className="h-2.5 w-2.5 text-slate-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Note input */}
              <textarea
                rows={2}
                value={patientNotes}
                onChange={(e) => setPatientNotes(e.target.value)}
                placeholder="Symptoms, floor number, oxygen needed..."
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
              />
            </div>

            {/* 6. Estimated Fare & ETA */}
            <div className="flex items-end justify-between rounded-2xl border border-slate-200 bg-white p-4">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Estimated fare - {selectedCategory}
                </p>
                <p className="mt-0.5 text-xl font-black text-slate-900">
                  BDT {estimatedFare ? estimatedFare.toLocaleString() : '3,500'}{' '}
                  <span className="ml-1 text-[10px] font-bold text-emerald-600 uppercase">Locked</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Est. Distance: {estimatedDistanceKm} km
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-400">ETA</p>
                <p className="mt-0.5 text-sm font-bold text-slate-900">
                  {estimatedDurationMins - 4} - {estimatedDurationMins} mins
                </p>
              </div>
            </div>

            {/* Action Confirm Button */}
            <DynamicActionButton
              variant="danger"
              onClick={handleConfirmBooking}
              icon={Siren}
              iconPosition="left"
              isLoading={isSubmitting}
              label="Confirm Emergency Dispatch"
              fullWidth
              className="h-12 text-xs font-bold tracking-wider uppercase shadow-lg shadow-red-500/25 cursor-pointer"
            />
          </div>
        </section>

        {/* Right Side: Real Interactive Google Map */}
        <section className="relative min-h-[470px] flex-1 overflow-hidden bg-slate-100">
          <GoogleMapView
            center={pickupCoords}
            zoom={13}
            markers={mapMarkers}
            route={{
              origin: pickupCoords,
              destination: destinationCoords,
            }}
            onLocationSelect={(loc) => {
              setPickupCoords({ lat: loc.lat, lng: loc.lng });
              if (loc.address) setPickupLocation(loc.address);
              toast.info(`Pickup location updated to: ${loc.address || `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`}`);
            }}
            showTraffic
            className="w-full h-full min-h-[500px]"
          />

          {/* Floating Coverage Status Card */}
          <div className="absolute top-5 right-5 w-60 rounded-3xl border border-white/60 bg-white/95 p-4 shadow-2xl backdrop-blur-md z-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <p className="text-[9px] font-bold tracking-widest text-[#64748b] uppercase">
                Coverage Status
              </p>
              <DynamicBadge text="Live Google GPS" color="#10b981" size="xs" />
            </div>
            <div className="mt-3 space-y-2 text-xs font-medium text-slate-700">
              <div className="flex justify-between">
                <span>Fleet Available:</span>
                <b className="text-slate-900">14 units nearby</b>
              </div>
              <div className="flex justify-between">
                <span>Avg Dispatch Delay:</span>
                <b className="text-emerald-600">22 seconds</b>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                Click anywhere on map to reposition pickup
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Footer */}
      <div className="flex h-12 items-center justify-between border-t border-slate-200 bg-white px-6 text-xs text-slate-500">
        <div className="flex items-center gap-2 font-bold text-[#0b132b]">
          <span className="rounded-lg bg-[#e63946] p-1 text-white">
            <Ambulance className="h-4 w-4" />
          </span>
          Pulse<span className="text-[#e63946]">Route</span>
        </div>
        <span>Emergency dispatch is monitored 24/7 with Live GPS</span>
        <Link href="/dashboard/patient/active-trip" className="font-semibold text-[#e63946] hover:underline">
          View Active Trip &rarr;
        </Link>
      </div>
    </div>
  );
}
