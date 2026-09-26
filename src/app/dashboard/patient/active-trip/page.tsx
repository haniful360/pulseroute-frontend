import { Button } from '@/components/ui/button';
import { Ambulance, Check, MessageSquare, Navigation, Phone, Send, X } from 'lucide-react';
import Link from 'next/link';

export default function ActiveTripPage() {
  return (
    <div className="-m-4 flex min-h-[calc(100vh-4rem)] flex-col bg-[#f8fafc] sm:-m-6 lg:-m-8">
      <div className="flex min-h-[600px] flex-1 flex-col lg:flex-row">
        <div className="relative min-h-[430px] flex-1 overflow-hidden bg-[#cdd0d5]">
          <div className="absolute inset-0 bg-[url('/images/hero-map.png')] bg-cover bg-center opacity-80" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 rounded-full bg-[#e63946] p-3 text-white shadow-lg">
            <Ambulance className="h-6 w-6" />
          </div>
          <div className="absolute bottom-5 left-5 flex flex-col gap-2">
            <Button variant="outline" size="icon-sm" className="bg-white">
              <Navigation />
            </Button>
            <Button variant="outline" size="icon-sm" className="bg-white">
              +
            </Button>
          </div>
          <div className="absolute right-5 bottom-5 rounded-full border-4 border-white bg-[#e63946] px-4 py-3 text-center font-bold text-white shadow-xl">
            <span className="block text-lg">SOS</span>
            <span className="text-[8px]">PANIC</span>
          </div>
        </div>
        <aside className="w-full bg-white lg:w-[360px]">
          <div className="bg-[#e63946] px-5 py-5 text-center text-white">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase">Estimated arrival</p>
            <p className="text-3xl font-bold">
              4 <span className="text-base">mins</span>
            </p>
            <p className="text-xs">Distance: 1.2 km &middot; Traffic: Medium</p>
          </div>
          <div className="space-y-5 p-5">
            <div>
              <p className="mb-3 text-[10px] font-bold tracking-widest text-[#64748b] uppercase">
                Live trip progress
              </p>
              <div className="flex justify-between text-center text-[9px] font-semibold text-[#64748b]">
                <span className="text-emerald-600">
                  <span className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="h-3 w-3" />
                  </span>
                  Assigned
                </span>
                <span className="text-[#e63946]">
                  <span className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#e63946]">
                    2
                  </span>
                  En Route
                </span>
                <span className="text-[#cbd5e1]">
                  <span className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#f1f5f9]">
                    3
                  </span>
                  Arrived
                </span>
                <span className="text-[#cbd5e1]">
                  <span className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#f1f5f9]">
                    4
                  </span>
                  In Transit
                </span>
              </div>
            </div>
            <div className="rounded-xl border border-[#edf0f3] bg-[#f9fafb] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dbeafe] text-sm font-bold text-[#2563eb]">
                  RU
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Rahim Uddin</p>
                  <p className="text-[10px] text-[#64748b]">4.8 Rating &middot; 240 Trips</p>
                </div>
                <span className="rounded border bg-white px-2 py-1 text-[9px] font-bold">
                  DHA-KA-821
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-[9px] font-bold text-[#64748b]">
                <div className="rounded-lg border bg-white p-3">
                  <Ambulance className="mx-auto mb-1 h-4 w-4 text-[#e63946]" />
                  ICU support
                </div>
                <div className="rounded-lg border bg-white p-3">
                  <span className="mb-1 block text-emerald-500">AC</span>AC enabled
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline">
                <Phone /> Call Driver
              </Button>
              <Button variant="outline">
                <MessageSquare /> Open Chat
              </Button>
            </div>
            <div className="rounded-xl border border-[#edf0f3] p-3">
              <p className="text-[9px] font-bold text-[#64748b] uppercase">Chat with dispatcher</p>
              <p className="mt-2 rounded-lg bg-[#f8fafc] p-3 text-[10px] text-[#64748b] italic">
                &quot;The driver is near the 27th street intersection. Please ensure the gate is
                open.&quot;
              </p>
              <div className="mt-2 flex gap-2">
                <input
                  className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-xs outline-none"
                  placeholder="Type a quick message..."
                />
                <Button size="icon-sm">
                  <Send />
                </Button>
              </div>
            </div>
            <button className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-red-200 text-xs font-bold text-[#e63946]">
              <X className="h-3 w-3" /> Cancel Emergency Trip
            </button>
            <div className="border-t pt-4">
              <p className="text-[9px] font-bold tracking-widest text-[#64748b] uppercase">
                Target destination
              </p>
              <p className="mt-2 text-sm font-bold">United Hospital, Gulshan-2</p>
              <p className="text-[10px] text-[#64748b]">ER notified &middot; Bed space confirmed</p>
            </div>
          </div>
        </aside>
      </div>
      <div className="border-t bg-white px-5 py-3 text-xs text-[#64748b]">
        <Link href="/dashboard/patient/trip-history" className="font-semibold text-[#e63946]">
          View trip history
        </Link>
      </div>
    </div>
  );
}
