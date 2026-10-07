'use client';

import React, { useState, useEffect } from 'react';
import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import DynamicModal from '@/components/dashboard/DynamicModal/DynamicModal';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import CustomTable from '@/components/dashboard/CustomTable/CustomTable';
import {
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Hospital,
  MapPin,
  Search,
  User,
  Ambulance,
} from 'lucide-react';
import { toast } from 'sonner';
import { getMyTripsAction } from '@/services/trip/trip.service';
import {
  exportInvoiceReceiptAction,
  getInvoiceByIdAction,
} from '@/services/invoice/invoice.service';
import { TripHistorySkeleton } from '@/components/dashboard/skeletons/patient';
import { generateInvoicePdf } from '@/lib/pdf/generateInvoicePdf';

interface PatientTrip {
  id: string;
  rawId: string;
  invoiceId?: string;
  date: string;
  ambulance: string;
  pickup: string;
  destination: string;
  driver: string;
  driverPhone?: string;
  fare: string;
  status: string;
  rawFare: number;
}

export default function TripHistoryView() {
  const [query, setQuery] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<PatientTrip | null>(null);
  const [trips, setTrips] = useState<PatientTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadTrips() {
      setLoading(true);
      try {
        const res = await getMyTripsAction();
        if (res.success && Array.isArray(res.data)) {
          const mapped: PatientTrip[] = res.data.map((t: any) => {
            const calculatedFare = Number(
              t.invoice?.totalAmount ?? t.estimatedFare ?? t.fare ?? 0
            );
            return {
              id: `#${t.id.slice(-6).toUpperCase()}`,
              rawId: t.id,
              invoiceId: t.invoice?.id || t.id,
              date: new Date(t.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
              ambulance: t.ambulanceType || 'ICU',
              pickup: t.pickupAddress || 'Current Location',
              destination: t.destinationAddress || 'Hospital',
              driver: t.driver?.name || 'Assigned Driver',
              driverPhone: t.driver?.contactNumber,
              fare: `BDT ${calculatedFare.toLocaleString()}`,
              status:
                t.status === 'COMPLETED'
                  ? 'Completed'
                  : t.status === 'CANCELLED'
                    ? 'Cancelled'
                    : t.status,
              rawFare: calculatedFare,
            };
          });
          setTrips(mapped);
        } else if (!res.success) {
          toast.error(res.message || 'Failed to retrieve trip history');
        }
      } catch (err) {
        console.error('Failed to load trips:', err);
        toast.error('Network error: Unable to load dispatch records');
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, []);

  const handleDownloadReceipt = async (trip: PatientTrip) => {
    try {
      setDownloadingId(trip.rawId);
      toast.info('Downloading official medical trip receipt...');
      const targetId = trip.invoiceId || trip.rawId;
      const res = await exportInvoiceReceiptAction(targetId);
      if (res.success && res.data) {
        const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute(
          'download',
          `pulseroute_receipt_${trip.rawId.slice(0, 8)}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Medical receipt downloaded successfully.');
      } else {
        toast.error(res.message || 'Receipt not available yet for this trip.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error downloading receipt');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadInvoicePdf = async (trip: PatientTrip) => {
    try {
      setDownloadingId(`pdf-${trip.rawId}`);
      toast.info('Generating official PDF invoice...');
      const targetId = trip.invoiceId || trip.rawId;
      const res = await getInvoiceByIdAction(targetId);
      if (res.success && res.data) {
        const inv = res.data;
        generateInvoicePdf({
          invoiceNumber: inv.invoiceNumber || 'INV-PENDING',
          tripId: inv.tripId || trip.rawId,
          tripCode: inv.trip?.tripCode,
          issuedAt: inv.issuedAt || inv.createdAt,
          paidAt: inv.paidAt,
          paymentStatus: inv.paymentStatus || 'PAID',
          paymentMethod: inv.paymentMethod || 'STRIPE',
          totalAmount: Number(inv.totalAmount || trip.rawFare || 0),
          baseFare: Number(inv.baseFare || 2000),
          distanceFare: Number(inv.distanceFare || 0),
          surgeFare: Number(inv.surgeFare || 0),
          discountAmount: Number(inv.discountAmount || 0),
          taxAmount: Number(inv.taxAmount || 0),
          platformCommission: Number(inv.platformCommission || 0),
          driverEarning: Number(inv.driverEarning || 0),
          paidAmount: Number(inv.paidAmount || 0),
          transactionId:
            inv.paymentRecords?.[0]?.gatewayTransactionId ||
            inv.paymentRecords?.[0]?.id ||
            'N/A',
          patient: {
            name: inv.patient?.name || 'PulseRoute Patient',
            email: inv.patient?.email,
            contactNumber: inv.patient?.contactNumber,
          },
          driver: {
            name: inv.driver?.name || trip.driver,
            contactNumber: inv.driver?.contactNumber || trip.driverPhone,
            licenseNumber: inv.driver?.licenseNumber,
          },
          trip: {
            tripCode: inv.trip?.tripCode,
            ambulanceType: inv.trip?.ambulanceType || trip.ambulance,
            emergencySeverity: inv.trip?.emergencySeverity || 'HIGH',
            pickupAddress: inv.trip?.pickupAddress || trip.pickup,
            destinationAddress: inv.trip?.destinationAddress || trip.destination,
            distanceKm: inv.trip?.distanceKm,
            estimatedDurationMins: inv.trip?.estimatedDurationMins,
          },
        });
        toast.success('Official invoice PDF downloaded.');
      } else {
        toast.error('Could not load invoice data for PDF generation.');
      }
    } catch (err) {
      console.error('Failed to download invoice PDF:', err);
      toast.error('Error generating PDF.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleExportAllTrips = () => {
    if (!trips.length) {
      toast.error('No trips available to export.');
      return;
    }
    const headers = [
      'Trip ID',
      'Date',
      'Ambulance Tier',
      'Pickup',
      'Destination',
      'Paramedic Driver',
      'Fare',
      'Status',
    ];
    const rows = trips.map((t) => [
      t.id,
      t.date,
      t.ambulance,
      `"${t.pickup.replace(/"/g, '""')}"`,
      `"${t.destination.replace(/"/g, '""')}"`,
      `"${t.driver.replace(/"/g, '""')}"`,
      `"${t.fare}"`,
      t.status,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join(
      '\n'
    );
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `pulseroute_trip_history_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Trip history logs exported successfully.');
  };

  const filteredTrips = trips.filter(
    (trip) =>
      trip.id.toLowerCase().includes(query.toLowerCase()) ||
      trip.destination.toLowerCase().includes(query.toLowerCase()) ||
      trip.driver.toLowerCase().includes(query.toLowerCase()),
  );

  const columns = [
    {
      header: 'Trip ID',
      cell: (trip: PatientTrip) => (
        <span className="font-mono font-bold text-slate-900">{trip.id}</span>
      ),
    },
    { header: 'Date', accessor: 'date' as keyof PatientTrip },
    {
      header: 'Ambulance Tier',
      cell: (trip: PatientTrip) => (
        <DynamicBadge text={trip.ambulance} color="#e63946" size="xs" />
      ),
    },
    {
      header: 'Destination',
      cell: (trip: PatientTrip) => (
        <span className="block max-w-[200px] truncate text-slate-700" title={trip.destination}>
          {trip.destination}
        </span>
      ),
    },
    {
      header: 'Paramedic Driver',
      cell: (trip: PatientTrip) => (
        <span className="block max-w-[150px] truncate text-slate-700" title={trip.driver}>
          {trip.driver}
        </span>
      ),
    },
    {
      header: 'Fare',
      cell: (trip: PatientTrip) => <span className="font-bold text-slate-900">{trip.fare}</span>,
    },
    {
      header: 'Status',
      cell: (trip: PatientTrip) => (
        <DynamicBadge
          text={trip.status}
          color={trip.status === 'Completed' ? '#10b981' : '#64748b'}
          size="sm"
        />
      ),
    },
    {
      header: 'Actions',
      cell: (trip: PatientTrip) => (
        <button
          onClick={() => setSelectedTrip(trip)}
          aria-label="View trip details"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-[#e63946] hover:text-[#e63946]"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  if (loading) {
    return <TripHistorySkeleton />;
  }

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <DynamicPageHeader
            title="Patient Trip History"
            description="View records, paramedic telemetry logs, and hospital invoices of your previous emergency responses."
          />
        </div>
        <DynamicActionButton
          variant="outline"
          icon={Download}
          iconPosition="left"
          onClick={handleExportAllTrips}
          label="Download Invoice Logs"
          className="self-start sm:self-auto shrink-0"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            TOTAL DISPATCHES
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">{trips.length}</p>
          <p className="mt-1 text-xs font-semibold text-emerald-600">All recorded transports</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            SUCCESS RATE
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {trips.length ? Math.round((trips.filter((t) => t.status === 'Completed').length / trips.length) * 100) : 100}%
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {trips.filter((t) => t.status === 'Completed').length} Successful ER transports
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            TOTAL EXPENDITURE
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            BDT {trips.reduce((sum, t) => sum + (t.status === 'Completed' ? t.rawFare : 0), 0).toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-slate-500">Emergency transport fares</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900">Completed Emergency Dispatches</h3>
            <p className="text-xs text-slate-500">Official hospital arrival telemetry and invoice details</p>
          </div>

          <div className="w-full sm:w-72 shrink-0">
            <InputField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, hospital, or driver..."
              icon={<Search className="h-4 w-4 text-slate-400" />}
            />
          </div>
        </div>

        <CustomTable
          columns={columns}
          data={filteredTrips}
          emptyTitle="No Emergency Dispatches Found"
          emptyDescription="You haven't requested any ambulance dispatches yet or no trips matched your filter."
          emptyIcon={Ambulance}
        />
      </div>

      {/* Trip Details Modal */}
      <DynamicModal
        isOpen={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
        title={`Emergency Trip Details ${selectedTrip?.id || ''}`}
        description="Comprehensive dispatch logs and hospital triage confirmation."
        variant="light"
      >
        {selectedTrip && (
          <div className="space-y-4 pt-2 text-xs">
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Trip Date</span>
                <p className="font-bold text-slate-900">{selectedTrip.date}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                <p className="font-bold text-emerald-600">{selectedTrip.status}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Ambulance Tier</span>
                <p className="font-bold text-[#e63946]">{selectedTrip.ambulance} Support</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Fare Paid</span>
                <p className="font-bold text-slate-900">{selectedTrip.fare}</p>
              </div>
            </div>

            <div className="space-y-2 rounded-2xl border border-slate-100 p-4">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#e63946] shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Pickup</p>
                  <p className="text-slate-500">{selectedTrip.pickup}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Hospital className="h-4 w-4 text-blue-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Destination Hospital</p>
                  <p className="text-slate-500">{selectedTrip.destination}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
              <DynamicActionButton
                variant="outline"
                onClick={() => setSelectedTrip(null)}
                label="Close"
              />
              <DynamicActionButton
                variant="outline"
                icon={Download}
                iconPosition="left"
                isLoading={downloadingId === selectedTrip.rawId}
                onClick={() => handleDownloadReceipt(selectedTrip)}
                label="Download CSV"
              />
              <DynamicActionButton
                variant="danger"
                icon={Download}
                iconPosition="left"
                isLoading={downloadingId === `pdf-${selectedTrip.rawId}`}
                onClick={() => handleDownloadInvoicePdf(selectedTrip)}
                label="Download Invoice PDF"
              />
            </div>
          </div>
        )}
      </DynamicModal>
    </div>
  );
}
