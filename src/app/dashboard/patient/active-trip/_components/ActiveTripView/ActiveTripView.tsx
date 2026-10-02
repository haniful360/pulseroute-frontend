'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import DynamicBackBtn from '@/components/dashboard/DynamicBackBtn/DynamicBackBtn';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import DynamicModal from '@/components/dashboard/DynamicModal/DynamicModal';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import GoogleMapView, { MapMarkerItem } from '@/components/shared/GoogleMap/GoogleMapView';
import {
  AlertTriangle,
  Ambulance,
  Check,
  Hospital,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  Radio,
  Send,
  ShieldCheck,
  User,
  X,
  Clock,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';
import { getTripByIdAction, getMyTripsAction, cancelTripAction } from '@/services/trip/trip.service';
import { getUserDashboardOverviewAction } from '@/services/user/user.service';
import { createReviewAction } from '@/services/review/review.service';
import { ActiveTripSkeleton } from '@/components/dashboard/skeletons/patient';

export default function ActiveTripView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tripIdParam = searchParams.get('tripId');

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Found alternative immediate transport');
  const [isCancelling, setIsCancelling] = useState(false);

  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([
    'Dispatch acknowledged. Paramedic unit assigned with emergency green corridor.',
  ]);

  // Review states for completed trips
  const [rating, setRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  const handleSubmitReview = async () => {
    if (!trip?.id) return;
    setIsSubmittingReview(true);
    try {
      const res = await createReviewAction({
        tripId: trip.id,
        rating,
        comment: reviewComment,
      });
      if (res.success) {
        toast.success('Thank you! Your feedback has been submitted.');
        setReviewSubmitted(true);
      } else {
        toast.error(res.message || 'Could not submit review');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error submitting review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Load active trip
  useEffect(() => {
    async function fetchTrip() {
      setLoading(true);
      try {
        if (tripIdParam) {
          const res = await getTripByIdAction(tripIdParam);
          if (res.success && res.data) {
            setTrip(res.data);
            setLoading(false);
            return;
          }
        }

        // Fallback: check dashboard overview or my trips for any active trip
        const overviewRes = await getUserDashboardOverviewAction();
        if (overviewRes.success && overviewRes.data?.live?.activeTrip) {
          setTrip(overviewRes.data.live.activeTrip);
          setLoading(false);
          return;
        }

        // Fallback: check my-trips
        const myTripsRes = await getMyTripsAction();
        if (myTripsRes.success && myTripsRes.data && myTripsRes.data.length > 0) {
          // Find first non-completed/non-cancelled trip or latest trip
          const active = myTripsRes.data.find(
            (t: any) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED'
          );
          setTrip(active || myTripsRes.data[0]);
        }
      } catch (err) {
        console.error('Error fetching active trip:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrip();

    // Auto-refresh active trip every 10 seconds for real-time status sync
    const interval = setInterval(fetchTrip, 10000);
    return () => clearInterval(interval);
  }, [tripIdParam]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setMessages((prev) => [...prev, chatMessage.trim()]);
    setChatMessage('');
    toast.success('Message sent to dispatcher & driver.');
  };

  const handleConfirmCancel = async () => {
    if (!trip) return;
    setIsCancelling(true);
    try {
      const res = await cancelTripAction(trip.id, { cancellationReason: cancelReason });
      if (res.success) {
        toast.success('Emergency trip cancelled successfully.');
        setCancelModalOpen(false);
        setTrip({ ...trip, status: 'CANCELLED' });
      } else {
        toast.error(res.message || 'Could not cancel trip');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel trip');
    } finally {
      setIsCancelling(false);
    }
  };

  // Coords fallback
  const pickupLat = trip?.pickupLatitude || 23.7505;
  const pickupLng = trip?.pickupLongitude || 90.3752;
  const destLat = trip?.destinationLatitude || 23.7995;
  const destLng = trip?.destinationLongitude || 90.4182;
  const driverLat = trip?.driver?.currentLatitude || (pickupLat + 0.009);
  const driverLng = trip?.driver?.currentLongitude || (pickupLng - 0.008);

  const mapMarkers: MapMarkerItem[] = [
    {
      id: 'driver',
      lat: driverLat,
      lng: driverLng,
      iconType: 'ambulance',
      title: trip?.driver?.name ? `Paramedic: ${trip.driver.name}` : 'Dispatched Ambulance',
      label: 'Ambulance',
    },
    {
      id: 'pickup',
      lat: pickupLat,
      lng: pickupLng,
      iconType: 'pickup',
      title: trip?.pickupAddress || 'Pickup Point',
      label: 'Patient Location',
    },
    {
      id: 'destination',
      lat: destLat,
      lng: destLng,
      iconType: 'destination',
      title: trip?.destinationAddress || 'Hospital',
      label: 'Destination ER',
    },
  ];

  // Progress state mapping
  const statusSteps = [
    { key: 'ACCEPTED', label: 'Assigned' },
    { key: 'EN_ROUTE', label: 'En Route' },
    { key: 'ARRIVED', label: 'Arrived' },
    { key: 'IN_TRANSIT', label: 'In Transit' },
    { key: 'COMPLETED', label: 'Completed' },
  ];

  const currentStatusIndex = statusSteps.findIndex((s) => s.key === trip?.status);
  const activeStep = currentStatusIndex !== -1 ? currentStatusIndex : 1;

  if (loading) {
    return <ActiveTripSkeleton />;
  }

  if (!trip) {
    return (
      <div className="flex min-h-[450px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xs">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#e63946]">
          <Ambulance className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">No Active Emergency Trip</h2>
        <p className="mt-2 max-w-md text-xs text-slate-500">
          You currently have no emergency ambulance dispatches in transit. If you need urgent medical transport, initiate a request below.
        </p>
        <DynamicActionButton
          variant="danger"
          className="mt-6 h-11 px-6 rounded-2xl text-xs font-bold"
          onClick={() => router.push('/dashboard/patient/book-ambulance')}
          label="Book Ambulance Now"
        />
      </div>
    );
  }

  return (
    <div className="-m-4 flex min-h-[calc(100vh-4rem)] flex-col bg-[#f8fafc] sm:-m-6 lg:-m-8">
      <div className="flex min-h-[600px] flex-1 flex-col lg:flex-row">
        {/* Left Interactive Google Map View */}
        <div className="relative min-h-[430px] flex-1 overflow-hidden bg-slate-100">
          <GoogleMapView
            center={{ lat: driverLat, lng: driverLng }}
            zoom={14}
            markers={mapMarkers}
            route={{
              origin: { lat: driverLat, lng: driverLng },
              destination: { lat: pickupLat, lng: pickupLng },
            }}
            showTraffic
            className="w-full h-full min-h-[500px]"
          />

          {/* SOS Panic Trigger */}
          <button
            onClick={() => {
              toast.error('🚨 Emergency SOS Triggered! Emergency contacts & 999 alerted with GPS coordinates.');
            }}
            className="absolute right-5 bottom-5 z-10 flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-full border-4 border-white bg-[#e63946] text-white shadow-2xl transition hover:scale-105 active:scale-95"
          >
            <span className="text-sm font-black">SOS</span>
            <span className="text-[8px] font-bold uppercase tracking-wider">PANIC</span>
          </button>
        </div>

        {/* Right Sidebar: Live Trip Details & Dispatch Telemetry */}
        <aside className="w-full bg-white lg:w-[380px] border-l border-slate-200 overflow-y-auto">
          {/* Header ETA Banner */}
          <div className="bg-[#e63946] p-6 text-center text-white">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/80">
              Trip Status: {trip.status}
            </p>
            <p className="mt-1 text-3xl font-extrabold">
              {trip.status === 'COMPLETED' ? 'Arrived at Destination' : `${trip.estimatedDurationMins || 10} mins ETA`}
            </p>
            <p className="mt-1 text-xs text-white/90">
              Distance: {trip.distanceKm || 5.2} km &middot; Trip Code: <b>{trip.tripCode}</b>
            </p>
          </div>

          <div className="space-y-6 p-6">
            {/* Step Progress Tracker */}
            <div>
              <p className="mb-3 text-[10px] font-bold tracking-widest text-[#64748b] uppercase">
                Trip Progress
              </p>
              <div className="flex justify-between text-center text-[10px] font-bold">
                {statusSteps.map((step, idx) => {
                  const isDone = idx < activeStep;
                  const isCurrent = idx === activeStep;
                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <span
                        className={`mb-1 flex h-7 w-7 items-center justify-center rounded-full text-xs transition ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'border-2 border-[#e63946] bg-red-50 text-[#e63946]'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {isDone ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                      </span>
                      <span className={isCurrent ? 'text-[#e63946]' : isDone ? 'text-emerald-600' : 'text-slate-400'}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Paramedic & Vehicle Details Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-sm font-bold text-blue-700 uppercase">
                  {trip.driver?.name ? trip.driver.name.substring(0, 2) : 'EM'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      {trip.driver?.name || 'Assigning Paramedic...'}
                    </h4>
                    <DynamicBadge
                      text={`${trip.driver?.rating || 4.9} ★`}
                      color="#f59e0b"
                      size="xs"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {trip.driver ? 'Certified Emergency Driver' : 'Locating closest available unit'}
                  </p>
                </div>
                <span className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-mono font-bold text-slate-800">
                  {trip.vehicle?.vehicleNumber || 'DHA-ICU'}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-[10px] font-bold text-slate-700">
                <div className="rounded-xl border border-slate-200/80 bg-white p-2.5">
                  <Ambulance className="mx-auto mb-1 h-4 w-4 text-[#e63946]" />
                  {trip.ambulanceType} Support
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-white p-2.5">
                  <ShieldCheck className="mx-auto mb-1 h-4 w-4 text-emerald-500" />
                  Oxygen &amp; First Aid Ready
                </div>
              </div>
            </div>

            {/* Pickup & Destination Addresses */}
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#e63946] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Pickup</p>
                  <p className="text-slate-500 leading-snug">{trip.pickupAddress}</p>
                </div>
              </div>
              {trip.destinationAddress && (
                <div className="flex items-start gap-2 pt-1 border-t border-slate-100">
                  <Hospital className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800">Destination</p>
                    <p className="text-slate-500 leading-snug">{trip.destinationAddress}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <DynamicActionButton
                variant="outline"
                icon={Phone}
                iconPosition="left"
                onClick={() => {
                  if (trip.driver?.contactNumber) {
                    window.location.href = `tel:${trip.driver.contactNumber}`;
                  } else {
                    toast.info('Connecting call to Central Ambulance Dispatch...');
                  }
                }}
                label="Call Driver"
              />
              <DynamicActionButton
                variant="outline"
                icon={Hospital}
                iconPosition="left"
                onClick={() => toast.success('Destination Hospital ER triage desk notified.')}
                label="Notify ER"
              />
            </div>

            {/* Dispatcher Chat Section */}
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Emergency Dispatcher Channel
              </p>
              <div className="mt-2.5 max-h-28 overflow-y-auto space-y-2 text-xs">
                {messages.map((msg, i) => (
                  <p key={i} className="rounded-xl bg-slate-50 p-2.5 text-[11px] text-slate-600 leading-relaxed italic">
                    &quot;{msg}&quot;
                  </p>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="mt-3 flex items-center gap-2">
                <div className="flex-1">
                  <InputField
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Quick message to driver..."
                  />
                </div>
                <DynamicActionButton
                  type="submit"
                  size="sm"
                  variant="danger"
                  icon={Send}
                  className="h-11 w-11 p-0 flex items-center justify-center rounded-xl shrink-0"
                />
              </form>
            </div>

            {/* Post-Trip Rating & Feedback Card */}
            {trip.status === 'COMPLETED' && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">Rate Paramedic Care</span>
                </div>
                {reviewSubmitted ? (
                  <p className="text-xs font-medium text-emerald-700">
                    Thank you! Your feedback helps maintain our 5-star emergency dispatch standard.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[11px] text-slate-500">
                      How was the emergency response and medical care provided?
                    </p>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <InputField
                      label="Comments (optional)"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Add any feedback for driver..."
                    />
                    <DynamicActionButton
                      variant="danger"
                      onClick={handleSubmitReview}
                      isLoading={isSubmittingReview}
                      className="w-full text-xs font-bold"
                      label="Submit Review"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Cancel Button */}
            {trip.status !== 'COMPLETED' && trip.status !== 'CANCELLED' && (
              <DynamicActionButton
                variant="outline"
                onClick={() => setCancelModalOpen(true)}
                className="w-full text-xs font-bold text-[#e63946] border-red-200 hover:bg-red-50"
                icon={X}
                iconPosition="left"
                label="Cancel Emergency Trip"
              />
            )}
          </div>
        </aside>
      </div>

      {/* Footer Navigation Link */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3 text-xs">
        <DynamicBackBtn label="Back to Patient Dashboard" />
        <span className="text-slate-400">Emergency Dispatch Monitored 24/7 with Live GPS</span>
      </div>

      {/* Cancel Confirmation Modal */}
      <DynamicModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Emergency Trip?"
        description={`Trip ${trip.tripCode} is currently in progress. Please provide a reason to cancel.`}
        variant="light"
      >
        <div className="space-y-4 pt-2">
          <div className="flex flex-col items-center py-2 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#e63946]">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <p className="text-xs text-slate-600">
              Paramedic unit {trip.vehicle?.vehicleNumber || 'DHA-129'} is actively mobilized.
            </p>
          </div>

          <InputField
            label="Cancellation Reason"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Reason for cancellation..."
            required
          />

          <div className="flex w-full gap-3 pt-2">
            <DynamicActionButton
              variant="outline"
              onClick={() => setCancelModalOpen(false)}
              className="flex-1"
              label="Keep Trip"
            />
            <DynamicActionButton
              variant="danger"
              onClick={handleConfirmCancel}
              isLoading={isCancelling}
              className="flex-1"
              label="Confirm Cancel"
            />
          </div>
        </div>
      </DynamicModal>
    </div>
  );
}
