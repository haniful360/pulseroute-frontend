'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Ambulance, 
  HeartPulse, 
  Wind, 
  Wrench, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Activity, 
  Loader2, 
  X,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  getAllVehiclesAction, 
  createVehicleAction, 
  verifyVehicleAction 
} from '@/services/vehicle/vehicle.service';

interface VehicleRow {
  id: string;
  vehicleId: string;
  name: string;
  operator: string;
  type: string;
  status: string;
  verificationStatus: string;
  lastService: string;
  raw: any;
}

export default function FleetView() {
  const [vehiclesList, setVehiclesList] = useState<VehicleRow[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Add Vehicle Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newVehicleNumber, setNewVehicleNumber] = useState('');
  const [newAmbulanceType, setNewAmbulanceType] = useState('ICU');
  const [newModel, setNewModel] = useState('');
  const [newManufacturer, setNewManufacturer] = useState('Toyota');
  const [newYear, setNewYear] = useState('2024');
  const [newHasOxygen, setNewHasOxygen] = useState(true);
  const [newHasVentilator, setNewHasVentilator] = useState(false);
  const [newHasDefibrillator, setNewHasDefibrillator] = useState(false);
  const [newHasSuction, setNewHasSuction] = useState(false);

  // Inspection / Details Modal State
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRow | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await getAllVehiclesAction();
      if (res.success && res.data) {
        const list = Array.isArray((res.data as any).data) ? (res.data as any).data : res.data;
        if (Array.isArray(list)) {
          const mapped: VehicleRow[] = list.map((v: any) => ({
            id: v.vehicleNumber || `VH-${v.id.slice(-4).toUpperCase()}`,
            vehicleId: v.id,
            name: `${v.ambulanceType || 'ICU'} Unit ${v.model || ''}`.trim(),
            operator: v.driver?.name ? `Driver: ${v.driver.name}` : 'PulseRoute Fleet',
            type: v.ambulanceType || 'ICU',
            status: v.status === 'ACTIVE' ? 'Online' : v.status === 'ON_TRIP' ? 'On Dispatch' : 'Maintenance',
            verificationStatus: v.verificationStatus || 'APPROVED',
            lastService: new Date(v.updatedAt || v.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            raw: v,
          }));
          setVehiclesList(mapped);
        }
      }
    } catch (err) {
      console.error('Failed to load fleet vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const tabs = ['All', 'Online', 'On Dispatch', 'Maintenance', 'Pending Verification'];

  const filteredFleet = useMemo(() => {
    return vehiclesList.filter((vehicle) => {
      let matchesTab = true;
      if (activeTab === 'Pending Verification') {
        matchesTab = vehicle.verificationStatus === 'PENDING';
      } else if (activeTab !== 'All') {
        matchesTab = vehicle.status === activeTab;
      }

      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        vehicle.id.toLowerCase().includes(searchLower) ||
        vehicle.name.toLowerCase().includes(searchLower) ||
        vehicle.operator.toLowerCase().includes(searchLower) ||
        vehicle.type.toLowerCase().includes(searchLower);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, vehiclesList]);

  // Dynamic stats
  const totalCount = vehiclesList.length;
  const icuCount = vehiclesList.filter((v) => v.type === 'ICU' || v.type === 'CCU').length;
  const acCount = vehiclesList.filter((v) => v.type === 'AC').length;
  const maintenanceCount = vehiclesList.filter((v) => v.status === 'Maintenance' || v.verificationStatus === 'PENDING').length;

  const handleAddVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicleNumber.trim()) {
      toast.error('Vehicle registration number is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createVehicleAction({
        vehicleNumber: newVehicleNumber.trim().toUpperCase(),
        ambulanceType: newAmbulanceType,
        model: newModel.trim() || 'HiAce Emergency',
        manufacturer: newManufacturer.trim() || 'Toyota',
        year: Number(newYear) || 2024,
        hasOxygen: newHasOxygen,
        hasVentilator: newHasVentilator,
        hasDefibrillator: newHasDefibrillator,
        hasSuctionMachine: newHasSuction,
      });

      if (res.success) {
        toast.success(`Ambulance ${newVehicleNumber} added to fleet successfully.`);
        setIsAddOpen(false);
        setNewVehicleNumber('');
        setNewModel('');
        await fetchVehicles();
      } else {
        toast.error(res.message || 'Failed to add vehicle to fleet.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error creating vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyVehicle = async (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedVehicle) return;
    setIsVerifying(true);
    try {
      const res = await verifyVehicleAction(selectedVehicle.vehicleId, { status });
      if (res.success) {
        toast.success(`Ambulance ${selectedVehicle.id} status updated to ${status}.`);
        setSelectedVehicle(null);
        await fetchVehicles();
      } else {
        toast.error(res.message || 'Failed to update vehicle verification status.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error verifying vehicle');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#E63946]">
            OPERATIONS CONTROL CENTER
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Ambulance Fleet Management
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Monitor, dispatch, and manage ambulance availability, equipment specs, and maintenance schedules.
          </p>
        </div>
        <Button 
          variant="danger" 
          className="shrink-0 h-11 px-5 rounded-2xl cursor-pointer"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </div>

      {/* Dynamic Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total vehicles */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Total vehicles</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Ambulance className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            {loading ? (
              <Skeleton className="h-8 w-16 bg-slate-200 mt-1" />
            ) : (
              <div className="text-2xl font-black text-[#0b132b]">{totalCount}</div>
            )}
            <div className="mt-1 text-xs font-medium text-emerald-600">Active telemetry tracked</div>
          </div>
        </div>

        {/* ICU & CCU units */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">ICU & CCU units</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <HeartPulse className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            {loading ? (
              <Skeleton className="h-8 w-16 bg-slate-200 mt-1" />
            ) : (
              <div className="text-2xl font-black text-[#0b132b]">{icuCount}</div>
            )}
            <div className="mt-1 text-xs font-medium text-amber-600">High acuity response ready</div>
          </div>
        </div>

        {/* AC units */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">AC units</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Wind className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            {loading ? (
              <Skeleton className="h-8 w-16 bg-slate-200 mt-1" />
            ) : (
              <div className="text-2xl font-black text-[#0b132b]">{acCount}</div>
            )}
            <div className="mt-1 text-xs font-medium text-emerald-600">All standard compliant</div>
          </div>
        </div>

        {/* Maintenance / Pending */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold tracking-widest text-[#64748b] uppercase">Audit & Service</div>
            <div className="rounded-lg bg-red-50 p-2 text-[#e63946]">
              <Wrench className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            {loading ? (
              <Skeleton className="h-8 w-16 bg-slate-200 mt-1" />
            ) : (
              <div className="text-2xl font-black text-[#0b132b]">{maintenanceCount}</div>
            )}
            <div className="mt-1 text-xs font-medium text-red-600">Under audit or maintenance</div>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-1 overflow-x-auto rounded-2xl bg-slate-100 p-1 sm:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-shrink-0 rounded-xl px-4 py-1.5 text-xs font-bold transition-all cursor-pointer',
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="w-full sm:max-w-xs">
          <InputField
            placeholder="Search vehicle number, type, driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* Vehicles Grid / Skeleton Loading State */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24 rounded-md bg-slate-200" />
                <Skeleton className="h-3 w-3 rounded-full bg-slate-200" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4 bg-slate-200" />
                <Skeleton className="h-3.5 w-1/2 bg-slate-200" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-4 w-16 rounded bg-slate-200" />
                <Skeleton className="h-4 w-16 rounded bg-slate-200" />
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between">
                <Skeleton className="h-5 w-16 rounded-full bg-slate-200" />
                <Skeleton className="h-5 w-16 rounded-full bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredFleet.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFleet.map((vehicle) => (
            <div 
              key={vehicle.id} 
              onClick={() => setSelectedVehicle(vehicle)}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-slate-100 group-hover:bg-red-50 group-hover:text-[#E63946] px-2.5 py-1 rounded-md text-slate-700 transition-colors">
                    {vehicle.id}
                  </span>
                  {vehicle.verificationStatus === 'PENDING' && (
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-200">
                      Audit Req.
                    </span>
                  )}
                </div>
                <div className="relative flex h-2.5 w-2.5">
                  {(vehicle.status === 'Online' || vehicle.status === 'On Dispatch') && (
                    <span className={cn(
                      "absolute inline-flex h-full w-full rounded-full opacity-75 animate-pulse",
                      vehicle.status === 'Online' ? 'bg-emerald-400' : 'bg-blue-400'
                    )}></span>
                  )}
                  <span className={cn(
                    "relative inline-flex h-2.5 w-2.5 rounded-full",
                    vehicle.status === 'Online' && 'bg-emerald-500',
                    vehicle.status === 'On Dispatch' && 'bg-blue-500',
                    vehicle.status === 'Maintenance' && 'bg-amber-500',
                    vehicle.status === 'Offline' && 'bg-slate-400'
                  )}></span>
                </div>
              </div>
              
              <div className="mt-3">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#E63946] transition-colors">{vehicle.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{vehicle.operator}</p>
              </div>

              {/* Equipment Pills */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {vehicle.raw?.hasOxygen && (
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
                    O₂ Oxygen
                  </span>
                )}
                {vehicle.raw?.hasVentilator && (
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                    Ventilator
                  </span>
                )}
                {vehicle.raw?.hasDefibrillator && (
                  <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">
                    AED Defib
                  </span>
                )}
              </div>

              <div className="border-t border-dashed border-slate-200 my-3"></div>

              <div className="flex items-center justify-between">
                <span className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
                  vehicle.type === 'ICU' && "bg-red-50 text-[#E63946] border-red-200",
                  vehicle.type === 'AC' && "bg-blue-50 text-blue-600 border-blue-200",
                  vehicle.type === 'BASIC' && "bg-slate-100 text-slate-600 border-slate-200",
                  vehicle.type === 'CCU' && "bg-purple-50 text-purple-600 border-purple-200"
                )}>
                  {vehicle.type}
                </span>

                <span className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                  vehicle.status === 'Online' && "bg-emerald-50 text-emerald-600",
                  vehicle.status === 'On Dispatch' && "bg-blue-50 text-blue-600",
                  vehicle.status === 'Maintenance' && "bg-amber-50 text-amber-600",
                  vehicle.status === 'Offline' && "bg-slate-100 text-slate-600"
                )}>
                  {vehicle.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-[#E63946] mb-3">
            <Ambulance className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Ambulances Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
            No registered vehicles match your current filter. Add a new ambulance to the fleet to begin tracking.
          </p>
          <Button 
            variant="danger" 
            className="rounded-xl px-4 text-xs font-bold cursor-pointer"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add First Ambulance
          </Button>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Register Ambulance to Fleet</h3>
                <p className="text-xs text-slate-500">Add an inspected emergency vehicle to active registry</p>
              </div>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddVehicleSubmit} className="space-y-4">
              <div>
                <InputField
                  label="Vehicle Registration Number *"
                  placeholder="e.g. DHAKA-METRO-CHA-11-2345"
                  value={newVehicleNumber}
                  onChange={(e) => setNewVehicleNumber(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Ambulance Type *</label>
                  <select
                    value={newAmbulanceType}
                    onChange={(e) => setNewAmbulanceType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E63946]/20"
                  >
                    <option value="BASIC">Basic Ambulance (BLS)</option>
                    <option value="AC">AC Standard Ambulance</option>
                    <option value="ICU">ICU Advanced Ambulance</option>
                    <option value="CCU">CCU Cardiac Unit</option>
                    <option value="FREEZER">Freezer Ambulance</option>
                    <option value="NEONATAL">Neonatal NICU Unit</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Year</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E63946]/20"
                    placeholder="2024"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <InputField
                    label="Model"
                    placeholder="e.g. HiAce High Roof"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                  />
                </div>
                <div>
                  <InputField
                    label="Manufacturer"
                    placeholder="e.g. Toyota"
                    value={newManufacturer}
                    onChange={(e) => setNewManufacturer(e.target.value)}
                  />
                </div>
              </div>

              {/* Equipment Toggles */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">On-Board Life Support Equipment</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={newHasOxygen}
                      onChange={(e) => setNewHasOxygen(e.target.checked)}
                      className="rounded accent-[#E63946]"
                    />
                    <span className="font-semibold text-slate-700">Oxygen Cylinder</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={newHasVentilator}
                      onChange={(e) => setNewHasVentilator(e.target.checked)}
                      className="rounded accent-[#E63946]"
                    />
                    <span className="font-semibold text-slate-700">ICU Ventilator</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={newHasDefibrillator}
                      onChange={(e) => setNewHasDefibrillator(e.target.checked)}
                      className="rounded accent-[#E63946]"
                    />
                    <span className="font-semibold text-slate-700">AED Defibrillator</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={newHasSuction}
                      onChange={(e) => setNewHasSuction(e.target.checked)}
                      className="rounded accent-[#E63946]"
                    />
                    <span className="font-semibold text-slate-700">Suction Machine</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="rounded-xl px-4 text-xs font-bold"
                  onClick={() => setIsAddOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="danger" 
                  disabled={isSubmitting}
                  className="rounded-xl px-5 text-xs font-bold bg-[#E63946] text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
                    </>
                  ) : (
                    'Add Ambulance'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vehicle Inspection / Details Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold bg-red-50 text-[#E63946] px-2.5 py-0.5 rounded-md">
                  {selectedVehicle.id}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{selectedVehicle.name}</h3>
                <p className="text-xs text-slate-500">{selectedVehicle.operator}</p>
              </div>
              <button 
                onClick={() => setSelectedVehicle(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block font-medium">Type</span>
                  <span className="font-bold text-slate-900">{selectedVehicle.type} Ambulance</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Verification</span>
                  <span className={cn(
                    "font-bold",
                    selectedVehicle.verificationStatus === 'APPROVED' ? "text-emerald-600" : "text-amber-600"
                  )}>
                    {selectedVehicle.verificationStatus}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Model / Make</span>
                  <span className="font-bold text-slate-900">
                    {selectedVehicle.raw?.manufacturer || 'Toyota'} {selectedVehicle.raw?.model || ''} ({selectedVehicle.raw?.year || '2023'})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Operational Status</span>
                  <span className="font-bold text-slate-900">{selectedVehicle.status}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2">Life Support & Medical Compliance</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 bg-white">
                    {selectedVehicle.raw?.hasOxygen ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-slate-300" />
                    )}
                    <span className="font-medium text-slate-700">Oxygen Cylinder</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 bg-white">
                    {selectedVehicle.raw?.hasVentilator ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-slate-300" />
                    )}
                    <span className="font-medium text-slate-700">ICU Ventilator</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 bg-white">
                    {selectedVehicle.raw?.hasDefibrillator ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-slate-300" />
                    )}
                    <span className="font-medium text-slate-700">AED Defibrillator</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 bg-white">
                    {selectedVehicle.raw?.hasSuctionMachine ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-slate-300" />
                    )}
                    <span className="font-medium text-slate-700">Suction Machine</span>
                  </div>
                </div>
              </div>

              {selectedVehicle.raw?.driver && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 block font-medium">Assigned Driver / Paramedic</span>
                  <div className="font-bold text-slate-900">{selectedVehicle.raw.driver.name}</div>
                  <div className="text-slate-500">{selectedVehicle.raw.driver.email} • {selectedVehicle.raw.driver.contactNumber}</div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
              <Button 
                variant="outline" 
                className="rounded-xl px-4 text-xs font-bold cursor-pointer"
                onClick={() => setSelectedVehicle(null)}
              >
                Close
              </Button>

              <div className="flex gap-2">
                {selectedVehicle.verificationStatus !== 'APPROVED' && (
                  <Button 
                    variant="danger"
                    disabled={isVerifying}
                    className="rounded-xl px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                    onClick={() => handleVerifyVehicle('APPROVED')}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Approve Ambulance
                  </Button>
                )}
                {selectedVehicle.verificationStatus !== 'REJECTED' && (
                  <Button 
                    variant="outline"
                    disabled={isVerifying}
                    className="rounded-xl px-4 text-xs font-bold text-red-600 hover:bg-red-50 border-red-200 cursor-pointer"
                    onClick={() => handleVerifyVehicle('REJECTED')}
                  >
                    <XCircle className="h-4 w-4 mr-1" /> Flag / Reject
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
