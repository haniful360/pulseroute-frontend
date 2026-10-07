'use client';

import React, { useState, useEffect } from 'react';
import DynamicModal from '@/components/dashboard/DynamicModal/DynamicModal';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import {
  FileText,
  Download,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  Hospital,
  User,
  ShieldCheck,
  Ambulance,
  Phone,
} from 'lucide-react';
import { toast } from 'sonner';
import { getInvoiceByIdAction } from '@/services/invoice/invoice.service';
import { generateInvoicePdf, InvoicePdfData } from '@/lib/pdf/generateInvoicePdf';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/shared/EmptyState/EmptyState';

interface InvoiceDetailsModalProps {
  invoiceId: string | null;
  initialInvoice?: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoiceDetailsModal({
  invoiceId,
  initialInvoice,
  isOpen,
  onClose,
}: InvoiceDetailsModalProps) {
  const [invoice, setInvoice] = useState<any>(initialInvoice || null);
  const [loading, setLoading] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  useEffect(() => {
    if (isOpen && invoiceId) {
      if (initialInvoice && initialInvoice.patient && initialInvoice.driver) {
        setInvoice(initialInvoice);
      } else {
        setLoading(true);
        getInvoiceByIdAction(invoiceId)
          .then((res) => {
            if (res.success && res.data) {
              setInvoice(res.data);
            } else if (initialInvoice) {
              setInvoice(initialInvoice);
            }
          })
          .catch((err) => {
            console.error('Failed to load invoice details:', err);
            if (initialInvoice) setInvoice(initialInvoice);
          })
          .finally(() => setLoading(false));
      }
    }
  }, [isOpen, invoiceId, initialInvoice]);

  if (!isOpen) return null;

  const isPaid = (invoice?.paymentStatus || '').toUpperCase() === 'PAID';
  const totalAmt = Number(invoice?.totalAmount || 0);
  const baseFare = Number(invoice?.baseFare || 2000);
  const distanceFare = Number(invoice?.distanceFare || 0);

  const handleDownloadPdf = () => {
    if (!invoice) {
      toast.error('Invoice details not loaded yet.');
      return;
    }

    try {
      setIsDownloadingPdf(true);
      toast.info('Generating official PDF invoice...');

      const pdfPayload: InvoicePdfData = {
        invoiceNumber: invoice.invoiceNumber || 'INV-PENDING',
        tripId: invoice.tripId,
        tripCode: invoice.trip?.tripCode,
        issuedAt: invoice.issuedAt || invoice.createdAt,
        paidAt: invoice.paidAt,
        paymentStatus: invoice.paymentStatus || 'UNPAID',
        paymentMethod: invoice.paymentMethod || 'STRIPE',
        totalAmount: totalAmt,
        baseFare: baseFare,
        distanceFare: distanceFare,
        surgeFare: Number(invoice.surgeFare || 0),
        discountAmount: Number(invoice.discountAmount || 0),
        taxAmount: Number(invoice.taxAmount || 0),
        platformCommission: Number(invoice.platformCommission || 0),
        driverEarning: Number(invoice.driverEarning || 0),
        paidAmount: Number(invoice.paidAmount || 0),
        transactionId:
          invoice.paymentRecords?.[0]?.gatewayTransactionId ||
          invoice.paymentRecords?.[0]?.id ||
          'N/A',
        patient: {
          name: invoice.patient?.name || 'PulseRoute Patient',
          email: invoice.patient?.email,
          contactNumber: invoice.patient?.contactNumber,
        },
        driver: {
          name: invoice.driver?.name || 'Assigned Driver',
          contactNumber: invoice.driver?.contactNumber,
          licenseNumber: invoice.driver?.licenseNumber,
        },
        trip: {
          tripCode: invoice.trip?.tripCode,
          ambulanceType: invoice.trip?.ambulanceType || 'ICU',
          emergencySeverity: invoice.trip?.emergencySeverity || 'HIGH',
          pickupAddress: invoice.trip?.pickupAddress || 'Emergency Location',
          destinationAddress: invoice.trip?.destinationAddress || 'Hospital',
          distanceKm: invoice.trip?.distanceKm,
          estimatedDurationMins: invoice.trip?.estimatedDurationMins,
        },
      };

      generateInvoicePdf(pdfPayload);
      toast.success('Official invoice PDF downloaded successfully.');
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <DynamicModal
      isOpen={isOpen}
      onClose={onClose}
      title={invoice ? `Emergency Invoice: ${invoice.invoiceNumber || 'INV-PENDING'}` : 'Invoice Details'}
      description="Official medical transport dispatch billing summary and itemized ledger."
      variant="light"
    >
      {loading ? (
        <div className="space-y-4 py-2 animate-in fade-in duration-200">
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-36 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-48 rounded-md" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-3.5 space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-3 w-28 rounded-md" />
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-3.5 space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-3 w-28 rounded-md" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-2.5">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="h-3 w-20 rounded-md" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="h-3 w-20 rounded-md" />
            </div>
          </div>
        </div>
      ) : invoice ? (
        <div className="space-y-5 pt-2 text-slate-800">
          {/* Top Status & Price Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-black text-slate-900">
                  {invoice.invoiceNumber || 'INV-PENDING'}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                    isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {invoice.paymentStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Issued:{' '}
                {new Date(invoice.issuedAt || invoice.createdAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Total Amount
              </span>
              <p className="text-xl font-black text-[#e63946]">
                BDT {totalAmt.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Patient and Driver Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Patient Info */}
            <div className="rounded-2xl border border-slate-100 bg-white p-3.5 space-y-1.5 shadow-2xs">
              <p className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
                <User className="h-3.5 w-3.5 text-slate-500" />
                Billed To (Patient)
              </p>
              <p className="font-bold text-slate-900">{invoice.patient?.name || 'PulseRoute Patient'}</p>
              {invoice.patient?.contactNumber && (
                <p className="text-slate-600 flex items-center gap-1">
                  <Phone className="h-3 w-3 text-slate-400" /> {invoice.patient.contactNumber}
                </p>
              )}
              {invoice.patient?.email && <p className="text-slate-500">{invoice.patient.email}</p>}
            </div>

            {/* Paramedic Driver Info */}
            <div className="rounded-2xl border border-slate-100 bg-white p-3.5 space-y-1.5 shadow-2xs">
              <p className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
                <Ambulance className="h-3.5 w-3.5 text-slate-500" />
                Paramedic Driver
              </p>
              <p className="font-bold text-slate-900">{invoice.driver?.name || 'Assigned Paramedic'}</p>
              {invoice.driver?.contactNumber && (
                <p className="text-slate-600 flex items-center gap-1">
                  <Phone className="h-3 w-3 text-slate-400" /> {invoice.driver.contactNumber}
                </p>
              )}
              {invoice.driver?.licenseNumber && (
                <p className="text-slate-500">License: {invoice.driver.licenseNumber}</p>
              )}
            </div>
          </div>

          {/* Route & Trip Details */}
          {invoice.trip && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <span className="font-bold text-slate-800">
                  Trip Code: {invoice.trip.tripCode || invoice.tripId?.slice(-8)}
                </span>
                <span className="font-semibold text-slate-500">
                  {invoice.trip.ambulanceType || 'ICU'} Tier • {invoice.trip.distanceKm || 0} km
                </span>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[#e63946] shrink-0 mt-0.5" />
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-900">Pickup:</span>{' '}
                    {invoice.trip.pickupAddress || 'Emergency Location'}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Hospital className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-900">Hospital:</span>{' '}
                    {invoice.trip.destinationAddress || 'Hospital'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Itemized Fare Breakdown */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider flex justify-between">
              <span>Item Description</span>
              <span>Amount</span>
            </div>
            <div className="divide-y divide-slate-100 p-3 text-xs space-y-2">
              <div className="flex justify-between pt-1">
                <span className="text-slate-600">Base Dispatch Fare</span>
                <span className="font-semibold text-slate-900">BDT {baseFare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-600">
                  Distance Mileage ({invoice.trip?.distanceKm || 0} km)
                </span>
                <span className="font-semibold text-slate-900">BDT {distanceFare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-600">Surge Pricing &amp; Traffic Factor</span>
                <span className="font-semibold text-emerald-600">BDT 0.00 (Guaranteed)</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-sm font-black text-slate-900">
                <span>Total Fare</span>
                <span className="text-[#e63946]">BDT {totalAmt.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Gateway & Transaction Stamp */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 pt-1 gap-2">
            <div className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-slate-400" />
              <span>Gateway: {invoice.paymentMethod || 'STRIPE'}</span>
              {invoice.paymentRecords?.[0]?.gatewayTransactionId && (
                <span className="font-mono text-slate-600">
                  ({invoice.paymentRecords[0].gatewayTransactionId.slice(0, 15)}...)
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 font-semibold text-emerald-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified PulseRoute Ledger Record</span>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <DynamicActionButton
              variant="outline"
              onClick={onClose}
              label="Close"
            />
            <DynamicActionButton
              variant="danger"
              icon={Download}
              iconPosition="left"
              isLoading={isDownloadingPdf}
              onClick={handleDownloadPdf}
              label="Download Invoice PDF"
            />
          </div>
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="Invoice Record Not Found"
          description="We were unable to locate the itemized invoice record for this dispatch."
          className="border-none shadow-none py-8 bg-transparent"
        />
      )}
    </DynamicModal>
  );
}
