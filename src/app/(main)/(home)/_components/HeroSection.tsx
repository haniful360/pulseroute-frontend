'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import GooglePlaceAutocomplete from '@/components/shared/GoogleMap/GooglePlaceAutocomplete';
import { getCurrentDevicePosition, reverseGeocode, forwardGeocode } from '@/lib/geocoding';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Crosshair,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Ambulance,
  Check,
  FileText,
} from 'lucide-react';
import { createTripAction, ICreateTripPayload } from '@/services/trip/trip.service';
import { getAllPricingConfigsAction } from '@/services/pricing/pricing.service';

interface VehicleOption {
  id: string;
  label: string;
  baseFare: string;
}

const VEHICLE_TYPES: VehicleOption[] = [
  { id: 'basic', label: 'Basic', baseFare: '900 - 1,200' },
  { id: 'ac', label: 'AC', baseFare: '1,200 - 1,600' },
  { id: 'icu', label: 'ICU', baseFare: '3,500 - 4,320' },
  { id: 'ccu', label: 'CCU', baseFare: '4,200 - 5,100' },
  { id: 'neonatal', label: 'Neonatal', baseFare: '4,800 - 5,800' },
  { id: 'freezer', label: 'Freezer', baseFare: '2,500 - 3,200' },
];

interface HospitalOption {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

const HOSPITALS: HospitalOption[] = [
  { id: 'square', name: 'Square Hospital, Panthapath', lat: 23.753, lng: 90.3817 },
  { id: 'evercare', name: 'Evercare Hospital, Bashundhara', lat: 23.8151, lng: 90.4255 },
  { id: 'united', name: 'United Hospital, Gulshan 2', lat: 23.7995, lng: 90.4182 },
  { id: 'dmc', name: 'Dhaka Medical College Hospital (DMCH)', lat: 23.7258, lng: 90.3976 },
  { id: 'bsmmu', name: 'BSMMU (PG Hospital), Shahbag', lat: 23.7381, lng: 90.3956 },
  { id: 'labaid', name: 'Labaid Specialized Hospital, Dhanmondi', lat: 23.7461, lng: 90.3742 },
];

type SeverityLevel = 'stable' | 'urgent' | 'critical';

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number }>({
    lat: 23.7925,
    lng: 90.4078, // Default to Dhaka central Banani/Gulshan
  });
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('icu');
  const [severity, setSeverity] = useState<SeverityLevel>('critical');
  const [notesOpen, setNotesOpen] = useState(false);
  const [patientNotes, setPatientNotes] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);

  // Dynamic pricing & calculated route distance
  const [pricingConfigs, setPricingConfigs] = useState<any[]>([]);
  const [estimatedDist, setEstimatedDist] = useState<number>(2.4);
  const [estimatedDuration, setEstimatedDuration] = useState<number>(8);
  const [estimatedFareText, setEstimatedFareText] = useState<string>('3,500 - 4,320');

  // 1. Fetch real pricing configs from backend
  useEffect(() => {
    async function loadPricing() {
      try {
        const res = await getAllPricingConfigsAction();
        if (res.success && Array.isArray(res.data)) {
          setPricingConfigs(res.data);
        }
      } catch (err) {
        console.error('Failed to load pricing:', err);
      }
    }
    loadPricing();
  }, []);

  // 2. Dynamically calculate distance and fare estimate
  useEffect(() => {
    const hospital = HOSPITALS.find((h) => h.id === selectedHospital) || HOSPITALS[0];
    const R = 6371;
    const dLat = ((hospital.lat - pickupCoords.lat) * Math.PI) / 180;
    const dLon = ((hospital.lng - pickupCoords.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pickupCoords.lat * Math.PI) / 180) *
        Math.cos((hospital.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = Math.max(Number((R * c).toFixed(1)), 1.2);
    const duration = Math.max(Math.ceil(dist * 2.5), 6);

    setEstimatedDist(dist);
    setEstimatedDuration(duration);

    // Compute dynamic fare from pricing configs if available
    const config = pricingConfigs.find(
      (p) => p.ambulanceType?.toUpperCase() === selectedVehicle.toUpperCase()
    );
    if (config) {
      const base = Number(config.baseFare) || 1500;
      const perKm = Number(config.perKmRate) || 80;
      const calcFare = Math.round(base + dist * perKm);
      const surgeMax = Math.round(calcFare * 1.25);
      setEstimatedFareText(`${calcFare.toLocaleString()} - ${surgeMax.toLocaleString()}`);
    } else {
      const v = VEHICLE_TYPES.find((item) => item.id === selectedVehicle);
      setEstimatedFareText(v ? v.baseFare : '3,500 - 4,320');
    }
  }, [selectedVehicle, selectedHospital, pickupCoords, pricingConfigs]);

  // 3. Real Geolocation (Automatic GPS Extraction + Reverse Geocoding)
  const handleUseCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const pos = await getCurrentDevicePosition();
      setPickupCoords({ lat: pos.lat, lng: pos.lng });

      const address = await reverseGeocode(pos.lat, pos.lng);
      setPickupAddress(address);
      toast.success(`Current location locked: ${address}`);
    } catch (err: any) {
      console.warn('Geolocation failed:', err);
      toast.error(err.message || 'Unable to detect GPS location. You can type your location manually.');
    } finally {
      setIsLocating(false);
    }
  };

  // 4. Real Emergency Trip Creation
  const handleFindAmbulance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupAddress.trim()) {
      toast.error('Please specify your pickup location or click Use current location.');
      return;
    }

    // If address was typed manually, synchronize coordinates via forward geocoding
    let effectiveCoords = pickupCoords;
    try {
      const geo = await forwardGeocode(pickupAddress.trim());
      if (geo) {
        effectiveCoords = { lat: geo.lat, lng: geo.lng };
        setPickupCoords(effectiveCoords);
      }
    } catch {
      // Retain existing coordinates
    }

    const hospitalObj = HOSPITALS.find((h) => h.id === selectedHospital);
    const destinationAddress = hospitalObj ? hospitalObj.name : undefined;
    const destinationLatitude = hospitalObj ? hospitalObj.lat : undefined;
    const destinationLongitude = hospitalObj ? hospitalObj.lng : undefined;

    const ambulanceTypeUpper = selectedVehicle.toUpperCase() as
      | 'BASIC'
      | 'AC'
      | 'ICU'
      | 'CCU'
      | 'NEONATAL'
      | 'FREEZER';

    const severityUpper =
      severity === 'critical' ? 'CRITICAL' : severity === 'urgent' ? 'HIGH' : 'LOW';

    // If unauthenticated, preserve draft booking and redirect to login
    if (!isAuthenticated) {
      toast.info('Please log in or register to dispatch an emergency ambulance.');
      const bookingData = {
        pickup: pickupAddress.trim(),
        pickupLat: effectiveCoords.lat,
        pickupLng: effectiveCoords.lng,
        dest: destinationAddress,
        destLat: destinationLatitude,
        destLng: destinationLongitude,
        type: ambulanceTypeUpper,
        severity: severityUpper,
        notes: patientNotes.trim() || undefined,
      };
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pending_ambulance_booking', JSON.stringify(bookingData));
      }
      const queryParams = new URLSearchParams({
        pickup: pickupAddress.trim(),
        pickupLat: String(effectiveCoords.lat),
        pickupLng: String(effectiveCoords.lng),
        type: ambulanceTypeUpper,
        severity: severityUpper,
        ...(destinationAddress ? { dest: destinationAddress } : {}),
        ...(destinationLatitude ? { destLat: String(destinationLatitude) } : {}),
        ...(destinationLongitude ? { destLng: String(destinationLongitude) } : {}),
      });
      router.push(
        `/login?redirect=${encodeURIComponent(
          `/dashboard/patient/book-ambulance?${queryParams.toString()}`
        )}`
      );
      return;
    }

    // Authenticated trip dispatch
    setIsSubmitting(true);
    try {
      const payload: ICreateTripPayload = {
        ambulanceType: ambulanceTypeUpper,
        emergencySeverity: severityUpper,
        pickupAddress: pickupAddress.trim(),
        pickupLatitude: effectiveCoords.lat,
        pickupLongitude: effectiveCoords.lng,
        destinationAddress,
        destinationLatitude,
        destinationLongitude,
        patientNotes: patientNotes.trim() ? patientNotes.trim() : undefined,
      };

      const res = await createTripAction(payload);
      if (res.success && res.data) {
        const trip = res.data.trip || res.data;
        toast.success(`🚨 Emergency dispatch initiated! Trip Code: ${trip.tripCode || 'Active'}`);
        setBooked(true);
        if (trip.id) {
          router.push(`/dashboard/patient/active-trip?tripId=${trip.id}`);
        } else {
          router.push('/dashboard/patient/trips');
        }
      } else {
        toast.error(res.message || 'Failed to dispatch ambulance. Please try again.');
      }
    } catch (err: any) {
      console.error('Trip creation error:', err);
      toast.error(err?.message || 'Emergency dispatch failed. Please check network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeVehicle = VEHICLE_TYPES.find((v) => v.id === selectedVehicle) || VEHICLE_TYPES[2];

  return (
    <section
      id="booking"
      className="relative overflow-hidden bg-[#090D16] pt-8 pb-16 text-white lg:py-20"
    >
      {/* Background Map Graphic Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <Image
          src="/images/hero-map.png"
          alt="Dhaka Map Dispatch Grid"
          fill
          priority
          className="object-cover object-center mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#090D16]/70 via-transparent to-[#090D16]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090D16] via-[#090D16]/60 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Hero Content */}
          <div className="space-y-6 lg:col-span-7 lg:space-y-8">
            {/* Live City Dispatch Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>Dispatch network live in 12 cities</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl leading-[1.15] font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl xl:text-[54px]">
              Every second counts — <br className="hidden sm:inline" />
              <span className="text-white">instant emergency ambulance dispatch near you.</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Verified crews, live GPS telemetry and a fare locked before you move. No phone tree,
              no roadside bargaining.
            </p>

            {/* Key Trust Signals */}
            <div className="flex flex-wrap items-center gap-6 pt-2 sm:gap-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Median dispatch</div>
                  <div className="text-sm font-bold text-white sm:text-base">22 sec</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Crew verification</div>
                  <div className="text-sm font-bold text-white sm:text-base">100%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Ambulance Request Card */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <div className="relative w-full max-w-md rounded-2xl border border-slate-100 bg-white p-5 text-slate-900 shadow-2xl sm:p-6">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Request an ambulance</h3>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600"></span>
                  <span>412 crews online</span>
                </div>
              </div>

              {booked ? (
                <div className="space-y-4 py-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Dispatch Initiated!</h4>
                  <p className="text-sm text-slate-600">
                    Finding the closest {activeVehicle.label} ambulance near{' '}
                    {pickupAddress || 'your area'}. A paramedic is being assigned.
                  </p>
                  <button
                    type="button"
                    onClick={() => setBooked(false)}
                    className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    Create Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFindAmbulance} className="mt-4 space-y-4">
                  {/* Pickup Address */}
                  <div>
                    <GooglePlaceAutocomplete
                      label="Pickup address"
                      value={pickupAddress}
                      onChange={setPickupAddress}
                      onPlaceSelect={(place) => {
                        setPickupCoords({ lat: place.lat, lng: place.lng });
                        setPickupAddress(place.address);
                      }}
                      placeholder="Type building, road, area or hospital"
                      required
                    />
                    {/* Use Current Location trigger */}
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={isLocating}
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-red-600 transition-colors hover:text-red-700 cursor-pointer disabled:opacity-50"
                    >
                      <Crosshair className={`h-3.5 w-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                      <span>{isLocating ? 'Extracting GPS location...' : 'Use current location'}</span>
                    </button>
                  </div>

                  {/* Destination Hospital */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Destination hospital
                    </label>
                    <Select
                      value={selectedHospital}
                      onValueChange={(value) => setSelectedHospital(value)}
                    >
                      <SelectTrigger className="h-10.5 w-full rounded-lg border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 shadow-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/20 data-[placeholder]:text-slate-400">
                        <SelectValue placeholder="Search hospitals & clinics" />
                      </SelectTrigger>
                      <SelectContent className="z-50 rounded-xl border border-slate-200 bg-white text-slate-900 shadow-xl">
                        <SelectItem value="square">Square Hospital, Panthapath</SelectItem>
                        <SelectItem value="evercare">Evercare Hospital, Bashundhara</SelectItem>
                        <SelectItem value="united">United Hospital, Gulshan 2</SelectItem>
                        <SelectItem value="dmc">Dhaka Medical College Hospital (DMCH)</SelectItem>
                        <SelectItem value="bsmmu">BSMMU (PG Hospital), Shahbag</SelectItem>
                        <SelectItem value="labaid">
                          Labaid Specialized Hospital, Dhanmondi
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Ambulance Type Chips */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Ambulance type
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                      {VEHICLE_TYPES.map((v) => {
                        const isSelected = selectedVehicle === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setSelectedVehicle(v.id)}
                            className={`flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-center text-xs font-medium transition-all ${
                              isSelected
                                ? 'border-2 border-red-600 bg-red-50 font-bold text-red-700'
                                : 'border border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 text-red-600" />}
                            <span>{v.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Emergency Severity */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Emergency severity
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSeverity('stable')}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                          severity === 'stable'
                            ? 'bg-slate-800 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Stable
                      </button>
                      <button
                        type="button"
                        onClick={() => setSeverity('urgent')}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                          severity === 'urgent'
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Urgent
                      </button>
                      <button
                        type="button"
                        onClick={() => setSeverity('critical')}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                          severity === 'critical'
                            ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Critical
                      </button>
                    </div>
                  </div>

                  {/* Patient notes expandable */}
                  <div className="overflow-hidden rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setNotesOpen(!notesOpen)}
                      className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                        <span>Patient notes for the crew</span>
                      </div>
                      {notesOpen ? (
                        <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                      )}
                    </button>

                    {notesOpen && (
                      <div className="border-t border-slate-200 bg-slate-50 p-3">
                        <textarea
                          rows={2}
                          value={patientNotes}
                          onChange={(e) => setPatientNotes(e.target.value)}
                          placeholder="Symptoms, floor number, oxygen needed..."
                          className="w-full rounded-md border border-slate-200 bg-white p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Estimated Fare & Route */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 pb-1 text-xs">
                    <div>
                      <span className="block text-slate-500">
                        Estimated fare - {activeVehicle.label}
                      </span>
                      <span className="text-base font-extrabold text-slate-900">
                        BDT {estimatedFareText}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-slate-400">Route</span>
                      <span className="font-semibold text-slate-700">
                        {estimatedDist} km ~{estimatedDuration} min
                      </span>
                    </div>
                  </div>

                  {/* Primary Find Nearest Ambulance CTA */}
                  <DynamicActionButton
                    type="submit"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    icon={Ambulance}
                    showIcon
                    iconPosition="left"
                    rounded="xl"
                    size="lg"
                    fullWidth
                    label={
                      isSubmitting ? 'Locating Nearest Ambulance...' : 'Find Nearest Ambulance'
                    }
                    className="shadow-lg shadow-red-600/25"
                  />
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
