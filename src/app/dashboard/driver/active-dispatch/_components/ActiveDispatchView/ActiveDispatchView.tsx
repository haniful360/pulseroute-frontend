'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import DynamicBackBtn from '@/components/dashboard/DynamicBackBtn/DynamicBackBtn';
import DynamicModal from '@/components/dashboard/DynamicModal/DynamicModal';
import TextAreaField from '@/components/dashboard/Fields/TextAreaField/TextAreaField';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import GoogleMapView from '@/components/shared/GoogleMap/GoogleMapView';
import {
  Check,
  Crosshair,
  Hospital,
  Map,
  Navigation,
  Phone,
  Radio,
  Send,
  Siren,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getDriverDashboardOverviewAction,
  updateDriverLocationAction,
} from '@/services/driver.service';
import {
  updateTripStatusAction,
  getMyTripsAction,
} from '@/services/trip.service';

export default function ActiveDispatchView() {
  const router = useRouter();
  const [activeTrip, setActiveTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [incidentType, setIncidentType] = useState('Traffic Congestion');
  const [incidentNotes, setIncidentNotes] = useState('');

  useEffect(() => {
    async function loadActiveDispatch() {
      try {
        const res = await getDriverDashboardOverviewAction();
        if (res.success && res.data?.activeTrip) {
          setActiveTrip(res.data.activeTrip);
        } else {
          const tripsRes = await getMyTripsAction();
          if (tripsRes.success && Array.isArray(tripsRes.data)) {
            const current = tripsRes.data.find((t: any) =>
              ['ACCEPTED', 'EN_ROUTE', 'ARRIVED', 'IN_TRANSIT'].includes(t.status)
            );
            if (current) setActiveTrip(current);
          }
        }
      } catch (err) {
        console.error('Failed to load active dispatch:', err);
      } finally {
        setLoading(false);
      }
    }
    loadActiveDispatch();
    const interval = setInterval(loadActiveDispatch, 6000);
    return () => clearInterval(interval);
  }, []);

  const getNextAction = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return { next: 'EN_ROUTE', label: 'Start Heading to Pickup' };
      case 'EN_ROUTE':
        return { next: 'ARRIVED', label: 'Mark Arrived at Pickup' };
      case 'ARRIVED':
        return { next: 'IN_TRANSIT', label: 'Start Transit to Hospital' };
      case 'IN_TRANSIT':
        return { next: 'COMPLETED', label: 'Complete Mission / Handover' };
      default:
        return { next: null, label: 'Mission Completed' };
    }
  };

  const handleUpdateStatus = async () => {
    if (!activeTrip) {
      toast.info('No active trip in progress.');
      return;
    }
    const action = getNextAction(activeTrip.status);
    if (!action.next) {
      toast.info('Trip is already completed.');
      router.push('/dashboard/driver');
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const res = await updateTripStatusAction(activeTrip.id, {
        status: action.next as any,
      });
      if (res.success) {
        toast.success(`Status updated: ${action.next}`);
        if (action.next === 'COMPLETED') {
          toast.success('Patient safely transported. Mission concluded!');
          router.push('/dashboard/driver');
        } else {
          setActiveTrip((prev: any) => (prev ? { ...prev, status: action.next } : prev));
        }
      } else {
        toast.error(res.message || 'Failed to update trip status');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error updating status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    setIncidentModalOpen(false);
    toast.warning(`Incident (${incidentType}) logged to central emergency dispatch.`);
  };

  const currentAction = getNextAction(activeTrip?.status || 'EN_ROUTE');

  return (
    <div className="-m-4 flex min-h-[calc(100vh-4rem)] flex-col bg-[#cdd2d6] sm:-m-6 lg:-m-8">
      <div className="relative flex flex-1 overflow-hidden">
        {/* Live Google Map View with Route */}
        <div className="absolute inset-0">
          <GoogleMapView
            center={
              activeTrip?.pickupLatitude && activeTrip?.pickupLongitude
                ? {
                    lat: Number(activeTrip.pickupLatitude),
                    lng: Number(activeTrip.pickupLongitude),
                  }
                : { lat: 23.7508, lng: 90.3800 }
            }
            zoom={14}
            traffic={true}
            route={
              activeTrip?.pickupLatitude && activeTrip?.destinationLatitude
                ? {
                    origin: {
                      lat: Number(activeTrip.pickupLatitude),
                      lng: Number(activeTrip.pickupLongitude),
                    },
                    destination: {
                      lat: Number(activeTrip.destinationLatitude),
                      lng: Number(activeTrip.destinationLongitude),
                    },
                  }
                : undefined
            }
            markers={[
              {
                id: 'driver-unit',
                position: { lat: 23.7508, lng: 90.3800 },
                title: 'Your Ambulance Unit (On Duty)',
                type: 'ambulance',
              },
              ...(activeTrip?.pickupLatitude
                ? [
                    {
                      id: 'pickup-point',
                      position: {
                        lat: Number(activeTrip.pickupLatitude),
                        lng: Number(activeTrip.pickupLongitude),
                      },
                      title: `Pickup: ${activeTrip.pickupAddress || 'Patient'}`,
                      type: 'pickup' as const,
                    },
                  ]
                : []),
              ...(activeTrip?.destinationLatitude
                ? [
                    {
                      id: 'hospital-point',
                      position: {
                        lat: Number(activeTrip.destinationLatitude),
                        lng: Number(activeTrip.destinationLongitude),
                      },
                      title: `Hospital: ${activeTrip.destinationAddress || 'United Hospital'}`,
                      type: 'hospital' as const,
                    },
                  ]
                : []),
            ]}
            className="h-full w-full"
          />
        </div>

        {/* Turn-by-Turn Guidance Navigation Card */}
        <div className="absolute top-4 left-4 z-10 w-[260px] overflow-hidden rounded-3xl bg-white shadow-2xl sm:top-5 sm:left-5 sm:w-[320px]">
          <div className="bg-[#0b132b] p-5 text-white">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                Active Mission Telemetry
              </p>
              <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[9px] font-bold text-red-400 uppercase">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
                {activeTrip?.status || 'EN_ROUTE'}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-xl font-black text-white">
                  {activeTrip?.ambulanceType || 'ICU'} Unit
                </p>
                <p className="text-[11px] text-slate-300">
                  Patient: {activeTrip?.patient?.name || 'Emergency Patient'}
                </p>
              </div>
              <span className="rounded-2xl bg-[#e63946] p-3 text-white shadow-md shadow-red-500/30">
                <Navigation className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-200">
              Pickup: <b className="text-white">{activeTrip?.pickupAddress || 'Banani Road 11'}</b>
            </p>
          </div>

          <div className="space-y-4 p-5 text-xs">
            {activeTrip?.patient?.contactNumber && (
              <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5">
                <Phone className="h-4 w-4 text-emerald-600" />
                <div>
                  <p className="font-semibold text-slate-800">Emergency Contact</p>
                  <p className="text-slate-500">{activeTrip.patient.contactNumber}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-red-50 p-2 text-[#e63946]">
                <Hospital className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[9px] font-bold text-[#e63946] uppercase">Target Hospital</p>
                <p className="font-bold text-slate-900">
                  {activeTrip?.destinationAddress || 'United Hospital, Gulshan'}
                </p>
                <p className="text-[10px] text-slate-500">ICU Bed Protocol Priority</p>
              </div>
            </div>
          </div>
        </div>

        {/* Central Telemetry Ribbon */}
        <div className="absolute top-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-[#0b132b]/95 px-5 py-2.5 text-xs font-bold text-white shadow-2xl backdrop-blur-md">
          <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
          <span>Status: {activeTrip?.status || 'EN_ROUTE'}</span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-300">Live GPS</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Green Corridor Active</span>
        </div>

        {/* Bottom Dispatch Action Bar */}
        <div className="absolute bottom-5 left-1/2 z-10 flex w-[calc(100%-2rem)] max-w-[640px] -translate-x-1/2 items-center gap-3 rounded-3xl border border-white/40 bg-white/95 p-3.5 shadow-2xl backdrop-blur-lg">
          <DynamicActionButton
            variant="danger"
            onClick={handleUpdateStatus}
            disabled={isUpdatingStatus || !activeTrip}
            className="h-12 flex-1 rounded-2xl text-xs font-bold tracking-widest uppercase shadow-lg shadow-red-500/25 disabled:opacity-60"
            icon={Check}
            iconPosition="left"
            label={isUpdatingStatus ? 'Updating Status...' : currentAction.label}
          />

          <DynamicActionButton
            variant="outline"
            onClick={() => setIncidentModalOpen(true)}
            className="h-12 rounded-2xl border-slate-200 bg-white px-5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            icon={Map}
            iconPosition="left"
            label="Incident Report"
          />
        </div>
      </div>

      {/* Footer Return Link */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3 text-xs">
        <DynamicBackBtn label="Back to Duty Cockpit" />
        <span className="text-slate-400">Emergency Protocol Active • Unit DHA-129</span>
      </div>

      {/* Incident Report Modal */}
      <DynamicModal
        isOpen={incidentModalOpen}
        onClose={() => setIncidentModalOpen(false)}
        title="Report Route Incident"
        description="Notify Dhaka central dispatch of blockages, road accidents, or route deviations."
        variant="light"
      >
        <form onSubmit={handleReportIncident} className="space-y-4 pt-2">
          <InputField
            label="Incident Type"
            value={incidentType}
            onChange={(e) => setIncidentType(e.target.value)}
            placeholder="e.g. VIP Movement, Waterlogging, Road Construction"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Incident Notes & Details
            </label>
            <textarea
              value={incidentNotes}
              onChange={(e) => setIncidentNotes(e.target.value)}
              placeholder="Describe road conditions and requested alternative green corridor..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 focus:outline-none min-h-[90px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <DynamicActionButton
              variant="outline"
              onClick={() => setIncidentModalOpen(false)}
              label="Cancel"
            />
            <DynamicActionButton
              type="submit"
              variant="danger"
              icon={Send}
              iconPosition="right"
              label="Submit Incident"
            />
          </div>
        </form>
      </DynamicModal>
    </div>
  );
}
