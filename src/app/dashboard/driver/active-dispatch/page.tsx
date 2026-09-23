import { Button } from '@/components/ui/button';
import { Check, Crosshair, Hospital, Map, Navigation } from 'lucide-react';
import Link from 'next/link';

export default function ActiveDispatchPage() {
  return (
    <div className="-m-4 flex min-h-[calc(100vh-4rem)] flex-col bg-[#cdd2d6] sm:-m-6 lg:-m-8">
      <div className="relative flex flex-1 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/dashboard/driver/dhaka_radar_map.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-slate-900/10" />
        <div className="absolute top-4 left-4 z-10 w-[240px] overflow-hidden rounded-3xl bg-white shadow-2xl sm:top-5 sm:left-5 sm:w-[300px]">
          <div className="bg-[#0b132b] p-5 text-white">
            <p className="text-[9px] tracking-[0.2em] text-slate-400 uppercase">Next turn</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xl font-bold">450m</p>
              <span className="rounded-xl bg-[#e63946] p-3">
                <Navigation className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 text-xs">
              Turn right onto <b>Banani Road 11</b>
            </p>
          </div>
          <div className="space-y-7 p-5 text-xs">
            <div className="flex gap-3">
              <span className="rounded-full bg-slate-100 p-2">↑</span>
              <div>
                <p className="text-[9px] text-slate-400 uppercase">In 1.2 km</p>
                <p className="font-bold">Continue straight on Kemal Ataturk Avenue</p>
              </div>
            </div>
            <div className="flex gap-3 text-slate-500">
              <span className="rounded-full bg-slate-100 p-2">↱</span>
              <div>
                <p className="text-[9px] text-slate-400 uppercase">In 2.1 km</p>
                <p className="font-bold">Slight left toward Gulshan Circle 2</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="rounded-lg bg-red-50 p-2 text-[#e63946]">
                <Hospital className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[9px] text-[#e63946] uppercase">Destination</p>
                <p className="font-bold">United Hospital, Gulshan</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-[#0b132b] px-4 py-2 text-xs font-bold text-white shadow-xl">
          <span className="mr-2 text-emerald-400">●</span>En Route to Pickup{' '}
          <span className="mx-2 text-slate-500">|</span> 6m ETA{' '}
          <span className="mx-2 text-slate-500">|</span> 2.4 km
        </div>
        <div className="absolute top-5 right-4 z-10 flex flex-col gap-2">
          <Button size="icon" variant="outline" className="bg-white">
            <PlusIcon />
          </Button>
          <Button size="icon" variant="outline" className="bg-white">
            −
          </Button>
          <Button size="icon" variant="outline" className="bg-white">
            <Crosshair />
          </Button>
        </div>
        <div className="absolute bottom-5 left-1/2 z-10 flex w-[calc(100%-2rem)] max-w-[610px] -translate-x-1/2 items-center gap-3 rounded-3xl bg-white p-3 shadow-2xl">
          <Button variant="danger" className="h-12 flex-1 text-sm tracking-widest uppercase">
            <Check /> Mark arrived at pickup
          </Button>
          <Button variant="outline" size="sm">
            <Map /> Incident report
          </Button>
        </div>
      </div>
      <div className="border-t bg-white px-4 py-2 text-right text-xs">
        <Link href="/dashboard/driver" className="font-semibold text-[#e63946]">
          Back to duty radar
        </Link>
      </div>
    </div>
  );
}

function PlusIcon() {
  return <span className="text-xl leading-none">+</span>;
}
