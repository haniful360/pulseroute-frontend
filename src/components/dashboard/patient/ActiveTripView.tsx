'use client';

import React, { useState } from 'react';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import DynamicBackBtn from '@/components/dashboard/DynamicBackBtn/DynamicBackBtn';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import DynamicModal from '@/components/dashboard/DynamicModal/DynamicModal';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';
import { toast } from 'sonner';

export default function ActiveTripView() {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([
    'The paramedic driver is near the 27th street intersection. Please ensure the gate is open.',
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setMessages((prev) => [...prev, chatMessage.trim()]);
    setChatMessage('');
    toast.success('Message sent to dispatcher & driver.');
  };

  const handleConfirmCancel = () => {
    setCancelModalOpen(false);
    toast.error('Emergency trip cancelled.');
  };

  return (
    <div className="-m-4 flex min-h-[calc(100vh-4rem)] flex-col bg-[#f8fafc] sm:-m-6 lg:-m-8">
      <div className="flex min-h-[600px] flex-1 flex-col lg:flex-row">
        {/* Left Interactive Map Radar View */}
        <div className="relative min-h-[430px] flex-1 overflow-hidden bg-[#cdd0d5]">
          <div className="absolute inset-0 bg-[url('/images/hero-map.png')] bg-cover bg-center opacity-85" />
          <div className="absolute inset-0 bg-slate-900/10" />

          {/* Centered Ambulance Beacon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <span className="absolute h-14 w-14 animate-ping rounded-full bg-[#e63946]/30" />
            <div className="relative rounded-full bg-[#e63946] p-3 text-white shadow-xl shadow-red-500/40">
              <Ambulance className="h-6 w-6" />
            </div>
            <span className="mt-2 rounded-full bg-[#0b132b] px-3 py-1 text-[10px] font-bold text-white shadow-md">
              Ambulance DHA-KA-821
            </span>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-5 left-5 flex flex-col gap-2">
            <Button variant="outline" size="icon-sm" className="h-9 w-9 rounded-xl bg-white shadow-md">
              <Navigation className="h-4 w-4 text-slate-700" />
            </Button>
            <Button variant="outline" size="icon-sm" className="h-9 w-9 rounded-xl bg-white shadow-md">
              <span className="text-base font-bold text-slate-700">+</span>
            </Button>
          </div>

          {/* SOS Panic Trigger */}
          <button
            onClick={() => toast.warning('SOS Broadcast triggered to emergency contacts!')}
            className="absolute right-5 bottom-5 flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-full border-4 border-white bg-[#e63946] text-white shadow-2xl transition hover:scale-105 active:scale-95"
          >
            <span className="text-sm font-black">SOS</span>
            <span className="text-[8px] font-bold uppercase tracking-wider">PANIC</span>
          </button>
        </div>

        {/* Right Sidebar: Live Trip Details & Dispatch Telemetry */}
        <aside className="w-full bg-white lg:w-[380px] border-l border-slate-200">
          {/* Header ETA Banner */}
          <div className="bg-[#e63946] p-6 text-center text-white">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/80">
              Estimated Paramedic Arrival
            </p>
            <p className="mt-1 text-4xl font-extrabold">
              4 <span className="text-lg font-bold">mins</span>
            </p>
            <p className="mt-1 text-xs text-white/90">
              Distance: 1.2 km &middot; Traffic: Medium (Green Wave Active)
            </p>
          </div>

          <div className="space-y-6 p-6">
            {/* Step Progress Tracker */}
            <div>
              <p className="mb-3 text-[10px] font-bold tracking-widest text-[#64748b] uppercase">
                Trip Progress
              </p>
              <div className="flex justify-between text-center text-[10px] font-bold">
                <span className="text-emerald-600">
                  <span className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  Assigned
                </span>
                <span className="text-[#e63946]">
                  <span className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#e63946] bg-red-50 text-[#e63946]">
                    2
                  </span>
                  En Route
                </span>
                <span className="text-slate-300">
                  <span className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    3
                  </span>
                  Arrived
                </span>
                <span className="text-slate-300">
                  <span className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    4
                  </span>
                  In Transit
                </span>
              </div>
            </div>

            {/* Paramedic & Vehicle Details Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-sm font-bold text-blue-700">
                  RU
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">Rahim Uddin</h4>
                    <DynamicBadge text="4.8 ★" color="#f59e0b" size="xs" />
                  </div>
                  <p className="text-[11px] text-slate-500">Certified Paramedic • 240+ Trips</p>
                </div>
                <span className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-mono font-bold text-slate-800">
                  DHA-KA-821
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-[10px] font-bold text-slate-700">
                <div className="rounded-xl border border-slate-200/80 bg-white p-2.5">
                  <Ambulance className="mx-auto mb-1 h-4 w-4 text-[#e63946]" />
                  ICU Life Support
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-white p-2.5">
                  <ShieldCheck className="mx-auto mb-1 h-4 w-4 text-emerald-500" />
                  AC &amp; Oxygen Ready
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <DynamicActionButton
                variant="outline"
                icon={Phone}
                iconPosition="left"
                onClick={() => toast.info('Connecting call to Paramedic Driver...')}
                label="Call Driver"
              />
              <DynamicActionButton
                variant="outline"
                icon={Hospital}
                iconPosition="left"
                onClick={() => toast.info('Target ER notified of incoming ICU transport.')}
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
              <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Quick message to driver..."
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:border-red-500 focus:bg-white focus:outline-none"
                />
                <DynamicActionButton
                  type="submit"
                  size="sm"
                  variant="danger"
                  icon={Send}
                  className="h-9 w-9 p-0 flex items-center justify-center rounded-xl"
                />
              </form>
            </div>

            {/* Cancel Button */}
            <DynamicActionButton
              variant="outline"
              onClick={() => setCancelModalOpen(true)}
              className="w-full text-xs font-bold text-[#e63946] border-red-200 hover:bg-red-50"
              icon={X}
              iconPosition="left"
              label="Cancel Emergency Trip"
            />
          </div>
        </aside>
      </div>

      {/* Footer Navigation Link */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3 text-xs">
        <DynamicBackBtn label="Back to Patient Dashboard" />
        <span className="text-slate-400">Emergency Dispatch Monitored 24/7</span>
      </div>

      {/* Cancel Confirmation Modal */}
      <DynamicModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Emergency Trip?"
        description="Are you sure you want to cancel this dispatch? Paramedic unit DHA-KA-821 is currently en route."
        variant="light"
      >
        <div className="flex flex-col items-center py-2 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#e63946]">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div className="mt-4 flex w-full gap-3">
            <DynamicActionButton
              variant="outline"
              onClick={() => setCancelModalOpen(false)}
              className="flex-1"
              label="Keep Trip"
            />
            <DynamicActionButton
              variant="danger"
              onClick={handleConfirmCancel}
              className="flex-1"
              label="Confirm Cancel"
            />
          </div>
        </div>
      </DynamicModal>
    </div>
  );
}
