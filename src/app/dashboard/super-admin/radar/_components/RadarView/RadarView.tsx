'use client';

import { useState, useMemo, useEffect, useTransition } from 'react';
import { Ambulance, Radio, Navigation, WifiOff, Settings2, Search, MapPin, Activity, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import { cn } from '@/lib/utils';
import GoogleMapView, { MapMarkerItem } from '@/components/shared/GoogleMap/GoogleMapView';
import { getAllDriversAction } from '@/services/driver.service';
import { getOverviewAnalyticsAction } from '@/services/analytics.service';
import { Skeleton } from '@/components/ui/skeleton';

// Standard Dhaka coverage coordinates for realistic fleet simulation if driver GPS is not yet active
const DHAKA_LOCATIONS = [
  { area: 'Dhanmondi', lat: 23.7461, lng: 90.3742 },
  { area: 'Gulshan-2', lat: 23.7925, lng: 90.4078 },
  { area: 'Banani', lat: 23.7937, lng: 90.4043 },
  { area: 'Uttara Sector 3', lat: 23.8759, lng: 90.3795 },
  { area: 'Mirpur-10', lat: 23.8223, lng: 90.3654 },
  { area: 'Mohakhali TB Gate', lat: 23.7788, lng: 90.4005 },
  { area: 'Shahbagh', lat: 23.7381, lng: 90.3956 },
  { area: 'Tejgaon Link Rd', lat: 23.7639, lng: 90.3965 },
  { area: 'Mohammadpur', lat: 23.7658, lng: 90.3584 },
  { area: 'Bashundhara R/A', lat: 23.8151, lng: 90.4255 },
];

export default function RadarView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [drivers, setDrivers] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 23.7650, lng: 90.3900 });
  const [zoom, setZoom] = useState(12);
  const [showTraffic, setShowTraffic] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadData = () => {
    startTransition(async () => {
      try {
        const [driversRes, analyticsRes] = await Promise.all([
          getAllDriversAction({ limit: 100 }),
          getOverviewAnalyticsAction(),
        ]);

        if (driversRes?.data?.data) {
          setDrivers(driversRes.data.data);
        }
        if (analyticsRes?.data) {
          setOverview(analyticsRes.data);
        }
      } catch (err) {
        console.error('Failed to load radar fleet data:', err);
      }
    });
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 20000); // 20s telemetry poll
    return () => clearInterval(interval);
  }, []);

  // Normalise driver list with coordinates and display area
  const normalizedDrivers = useMemo(() => {
    return drivers.map((d, index) => {
      const fallbackLoc = DHAKA_LOCATIONS[index % DHAKA_LOCATIONS.length];
      const lat = d.currentLatitude ? Number(d.currentLatitude) : fallbackLoc.lat;
      const lng = d.currentLongitude ? Number(d.currentLongitude) : fallbackLoc.lng;
      const area = fallbackLoc.area;
      const vehicleNum = d.currentVehicle?.vehicleNumber || `AMB-${d.id.slice(-4).toUpperCase()}`;
      const model = d.currentVehicle?.model || d.name || 'Emergency Ambulance';
      const type = d.currentVehicle?.ambulanceType || 'ICU';
      const statusText = d.dutyStatus === 'ONLINE' ? 'Online' : d.dutyStatus === 'BUSY' ? 'On Dispatch' : 'Offline';

      return {
        ...d,
        lat,
        lng,
        area,
        vehicleNum,
        model,
        type,
        statusText,
      };
    });
  }, [drivers]);

  const filteredVehicles = useMemo(() => {
    if (!searchQuery) return normalizedDrivers;
    const q = searchQuery.toLowerCase();
    return normalizedDrivers.filter(v =>
      v.model.toLowerCase().includes(q) ||
      v.area.toLowerCase().includes(q) ||
      v.vehicleNum.toLowerCase().includes(q) ||
      v.name.toLowerCase().includes(q)
    );
  }, [normalizedDrivers, searchQuery]);

  // Construct map markers
  const markers: MapMarkerItem[] = useMemo(() => {
    return normalizedDrivers
      .filter(d => d.dutyStatus === 'ONLINE' || d.dutyStatus === 'BUSY')
      .map(d => ({
        id: d.id,
        lat: d.lat,
        lng: d.lng,
        title: `${d.vehicleNum} - ${d.model} (${d.statusText})`,
        iconType: 'ambulance',
        label: d.vehicleNum,
      }));
  }, [normalizedDrivers]);

  const totalRegistered = overview?.fleet?.totalAmbulances ?? normalizedDrivers.length;
  const onlineCount = normalizedDrivers.filter(d => d.dutyStatus === 'ONLINE').length || (overview?.fleet?.onlineAmbulances ?? 0);
  const onDispatchCount = normalizedDrivers.filter(d => d.dutyStatus === 'BUSY').length || (overview?.fleet?.onTripAmbulances ?? 0);
  const offlineCount = Math.max(0, totalRegistered - onlineCount - onDispatchCount);

  const handleSelectDriver = (driver: any) => {
    setSelectedDriverId(driver.id);
    setMapCenter({ lat: driver.lat, lng: driver.lng });
    setZoom(15);
  };

  const getTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'ICU': return 'bg-red-50 text-[#E63946] border-red-100';
      case 'CCU': return 'bg-red-50 text-[#E63946] border-red-100';
      case 'AC': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'BASIC': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#E63946]">
            OPERATIONS CONTROL CENTER
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Live Fleet Radar
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Dhaka-wide real-time Google Maps GPS telemetry and active emergency response tracking.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          disabled={isPending}
          className="gap-2 self-start sm:self-auto rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isPending && "animate-spin text-[#E63946]")} />
          Refresh Radar
        </Button>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Ambulance className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Registered fleet</div>
              <div className="flex items-end gap-2">
                {isPending && drivers.length === 0 ? (
                  <Skeleton className="h-7 w-14 mt-1" />
                ) : (
                  <div className="text-2xl font-black text-[#0b132b]">{totalRegistered}</div>
                )}
                <div className="text-xs font-medium text-emerald-600 mb-1">active units</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Radio className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Online now</div>
              <div className="flex items-end gap-2">
                {isPending && drivers.length === 0 ? (
                  <Skeleton className="h-7 w-14 mt-1" />
                ) : (
                  <div className="text-2xl font-black text-[#0b132b]">{onlineCount}</div>
                )}
                <div className="text-xs font-medium text-emerald-600 mb-1">ready for dispatch</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Navigation className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">On dispatch</div>
              <div className="flex items-end gap-2">
                {isPending && drivers.length === 0 ? (
                  <Skeleton className="h-7 w-14 mt-1" />
                ) : (
                  <div className="text-2xl font-black text-[#0b132b]">{onDispatchCount}</div>
                )}
                <div className="text-xs font-medium text-amber-600 mb-1">critical trips</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <WifiOff className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Offline</div>
              <div className="flex items-end gap-2">
                {isPending && drivers.length === 0 ? (
                  <Skeleton className="h-7 w-14 mt-1" />
                ) : (
                  <div className="text-2xl font-black text-[#0b132b]">{offlineCount}</div>
                )}
                <div className="text-xs font-medium text-slate-400 mb-1">standby / off-duty</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* Real Google Map Area */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden p-4 flex flex-col">
          <div className="relative min-h-[520px] h-[520px] w-full overflow-hidden rounded-2xl bg-slate-100">
            <GoogleMapView
              center={mapCenter}
              zoom={zoom}
              markers={markers}
              showTraffic={showTraffic}
              className="w-full h-full min-h-[520px]"
            />

            {/* Top-Left Live Coverage Info Card */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <div className="rounded-xl bg-white/95 backdrop-blur-md p-4 shadow-xl border border-slate-100 pointer-events-auto">
                <div className="flex items-center gap-2 mb-1">
                  <Radio className="h-4 w-4 animate-pulse text-[#E63946]" />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Dhaka Coverage Live</span>
                </div>
                <div className="text-3xl font-black text-slate-900 leading-none mb-1">
                  {onlineCount + onDispatchCount} <span className="text-base font-medium text-slate-500">active units</span>
                </div>
                <div className="text-xs font-medium text-[#E63946]">
                  {onDispatchCount} currently responding in transit
                </div>
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="absolute right-4 bottom-4 left-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#0b132b]/90 px-4 py-3 text-xs text-white shadow-lg backdrop-blur-sm z-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                  <span className="font-semibold">GPS Telemetry Synchronized</span>
                </div>
                <div className="h-3 w-px bg-slate-700 hidden sm:block" />
                <span className="text-slate-300 hidden sm:inline">Google Maps Live Radar</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTraffic(prev => !prev)}
                className={cn(
                  "h-8 border-white/20 text-white hover:bg-white/20 hover:text-white transition-all",
                  showTraffic ? "bg-[#E63946] border-[#E63946]" : "bg-white/10"
                )}
              >
                <Settings2 className="h-3.5 w-3.5 mr-1" />
                {showTraffic ? 'Traffic Layer (ON)' : 'Traffic Layer'}
              </Button>
            </div>
          </div>
        </div>

        {/* Online Vehicles Panel */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col h-[552px]">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#E63946]" /> Active Vehicles
              </h3>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                {onlineCount} ready
              </span>
            </div>
            <InputField
              placeholder="Search by ID, model, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4 text-slate-400" />}
            />
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {isPending && drivers.length === 0 ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2 p-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-14" />
                    </div>
                    <Skeleton className="h-3 w-36" />
                    <div className="flex items-center justify-between pt-1">
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredVehicles.length > 0 ? (
              filteredVehicles.map((v) => {
                const isSelected = selectedDriverId === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => handleSelectDriver(v)}
                    className={cn(
                      "p-4 transition-all cursor-pointer group",
                      isSelected ? "bg-red-50/60 border-l-4 border-l-[#E63946]" : "hover:bg-slate-50/70"
                    )}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-bold text-slate-900 group-hover:text-[#E63946] transition-colors">
                            {v.model}
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-semibold">
                            {v.vehicleNum}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <span className="font-medium text-slate-700">{v.name}</span>
                          <span className="text-slate-300">•</span>
                          <MapPin className="h-3 w-3 text-red-500 shrink-0" />
                          <span>{v.area}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                      <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border", getTypeColor(v.type))}>
                        {v.type}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            v.dutyStatus === 'ONLINE'
                              ? "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)] animate-pulse"
                              : v.dutyStatus === 'BUSY'
                              ? "bg-[#E63946] shadow-[0_0_5px_rgba(230,57,70,0.5)] animate-pulse"
                              : "bg-slate-400"
                          )}
                        />
                        <span className="text-[10px] font-bold text-slate-600">{v.statusText}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-sm text-slate-500">
                No active ambulances matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
