'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import DynamicBackBtn from '@/components/dashboard/DynamicBackBtn/DynamicBackBtn';
import {
  Check,
  CreditCard,
  FileText,
  ShieldCheck,
  Eye,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getMyInvoicesAction,
  getInvoiceByIdAction,
} from '@/services/invoice/invoice.service';
import { PaymentMethodsSkeleton } from '@/components/dashboard/skeletons/patient';
import StripeCardPaymentForm from '@/components/payment/StripeCardPaymentForm';
import InvoiceDetailsModal from '@/components/payment/InvoiceDetailsModal';
import { generateInvoicePdf } from '@/lib/pdf/generateInvoicePdf';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    'pk_test_51UCG2ZGq4WtGBuFRXigLeicjwUgsp5lM1grFEx7Iyy2jOGuSdQanfYt8hxwLaopeuiDlHoCWoN1N3K0w7oPRzXBk00F9KAzs0o'
);

export default function PaymentMethodsView() {
  const searchParams = useSearchParams();
  const queryInvoiceId = searchParams.get('invoiceId');
  const queryTripId = searchParams.get('tripId');

  const [paid, setPaid] = useState(false);

  // Invoices state
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  // Invoice Details Modal & PDF State
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [modalInvoiceId, setModalInvoiceId] = useState<string | null>(null);
  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<any>(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);

  // Fetch real invoices
  const loadInvoices = useCallback(async () => {
    setLoadingInvoices(true);
    try {
      const res = await getMyInvoicesAction();
      if (res.success && Array.isArray(res.data)) {
        setInvoices(res.data);
        if (queryInvoiceId) {
          const match = res.data.find((inv) => inv.id === queryInvoiceId);
          if (match) {
            setSelectedInvoice(match);
            return;
          }
        }
        if (queryTripId) {
          const match = res.data.find((inv) => inv.tripId === queryTripId);
          if (match) {
            setSelectedInvoice(match);
            return;
          }
        }
        const unpaid = res.data.find(
          (inv) => inv.paymentStatus === 'UNPAID' || inv.paymentStatus === 'PENDING'
        );
        if (unpaid) {
          setSelectedInvoice(unpaid);
        } else if (res.data.length > 0) {
          setSelectedInvoice(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load invoices:', err);
    } finally {
      setLoadingInvoices(false);
    }
  }, [queryInvoiceId, queryTripId]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const dueAmount = selectedInvoice ? Number(selectedInvoice.totalAmount || 0) : 0;
  const tripVehicle =
    selectedInvoice?.trip?.vehicle?.ambulanceType ||
    selectedInvoice?.trip?.ambulanceType ||
    'ICU Life Support';
  const tripRoute = selectedInvoice?.trip?.destinationAddress
    ? `${selectedInvoice.trip.pickupAddress || 'Pickup'} to ${selectedInvoice.trip.destinationAddress}`
    : 'Emergency Dispatch Route';

  const handleOpenDetails = (inv: any) => {
    setSelectedInvoiceForModal(inv);
    setModalInvoiceId(inv.id);
    setDetailsModalOpen(true);
  };

  const handleQuickDownloadPdf = async (inv: any) => {
    try {
      setDownloadingInvoiceId(inv.id);
      toast.info('Preparing official PDF invoice...');
      let fullInvoice = inv;
      if (!inv.patient || !inv.driver) {
        const res = await getInvoiceByIdAction(inv.id);
        if (res.success && res.data) {
          fullInvoice = res.data;
        }
      }
      generateInvoicePdf({
        invoiceNumber: fullInvoice.invoiceNumber || 'INV-PENDING',
        tripId: fullInvoice.tripId,
        tripCode: fullInvoice.trip?.tripCode,
        issuedAt: fullInvoice.issuedAt || fullInvoice.createdAt,
        paidAt: fullInvoice.paidAt,
        paymentStatus: fullInvoice.paymentStatus || 'UNPAID',
        paymentMethod: fullInvoice.paymentMethod || 'STRIPE',
        totalAmount: Number(fullInvoice.totalAmount || 0),
        baseFare: Number(fullInvoice.baseFare || 2000),
        distanceFare: Number(fullInvoice.distanceFare || 0),
        surgeFare: Number(fullInvoice.surgeFare || 0),
        discountAmount: Number(fullInvoice.discountAmount || 0),
        taxAmount: Number(fullInvoice.taxAmount || 0),
        platformCommission: Number(fullInvoice.platformCommission || 0),
        driverEarning: Number(fullInvoice.driverEarning || 0),
        paidAmount: Number(fullInvoice.paidAmount || 0),
        transactionId:
          fullInvoice.paymentRecords?.[0]?.gatewayTransactionId ||
          fullInvoice.paymentRecords?.[0]?.id ||
          'N/A',
        patient: {
          name: fullInvoice.patient?.name || 'PulseRoute Patient',
          email: fullInvoice.patient?.email,
          contactNumber: fullInvoice.patient?.contactNumber,
        },
        driver: {
          name: fullInvoice.driver?.name || 'Assigned Driver',
          contactNumber: fullInvoice.driver?.contactNumber,
          licenseNumber: fullInvoice.driver?.licenseNumber,
        },
        trip: {
          tripCode: fullInvoice.trip?.tripCode,
          ambulanceType: fullInvoice.trip?.ambulanceType || 'ICU',
          emergencySeverity: fullInvoice.trip?.emergencySeverity || 'HIGH',
          pickupAddress: fullInvoice.trip?.pickupAddress || 'Emergency Location',
          destinationAddress: fullInvoice.trip?.destinationAddress || 'Hospital',
          distanceKm: fullInvoice.trip?.distanceKm,
          estimatedDurationMins: fullInvoice.trip?.estimatedDurationMins,
        },
      });
      toast.success('Invoice PDF downloaded.');
    } catch (err) {
      console.error('Failed to download PDF:', err);
      toast.error('Failed to download invoice PDF.');
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  if (loadingInvoices) {
    return <PaymentMethodsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5">
          <DynamicBackBtn label="Back to Emergency Cockpit" />
        </div>

        <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs lg:grid-cols-[1fr_380px]">
          {/* Main Payment Section */}
          <section className="p-6 sm:p-9">
            <div className="mb-8">
              <p className="text-[11px] font-bold tracking-[0.18em] text-[#e63946] uppercase">
                PulseRoute Checkout
              </p>
              <h1 className="mt-1 text-2xl font-black text-[#0b132b] sm:text-3xl">
                Emergency Dispatch Payment
              </h1>
              <p className="mt-1 text-sm text-[#64748b]">
                Securely authorize billing for your priority ambulance dispatch.
              </p>
            </div>

            <div className="space-y-6">
              {/* Payment Method Selector (Stripe Only) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Payment Method
                </label>
                <div className="flex items-center justify-between rounded-2xl border border-[#e63946] bg-red-50/50 p-4 text-left shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-red-100 text-[#e63946] shadow-xs">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Debit / Credit Card (Stripe Gateway)</p>
                      <p className="text-[11px] text-slate-500">Supports Visa, Mastercard, AMEX &amp; International Cards</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    <Check className="h-3 w-3" />
                    <span>Active Gateway</span>
                  </div>
                </div>
              </div>

              {/* Real Stripe Elements Form with Auto-Selected Invoice Price */}
              {selectedInvoice ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Invoice Reference
                      </span>
                      <p className="font-mono text-xs font-bold text-slate-900">
                        {selectedInvoice.invoiceNumber || 'INV-PENDING'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Auto-Selected Amount
                      </span>
                      <p className="text-sm font-black text-[#e63946]">
                        BDT {dueAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <Elements stripe={stripePromise}>
                    <StripeCardPaymentForm
                      invoice={selectedInvoice}
                      onPaymentSuccess={() => {
                        setPaid(true);
                        loadInvoices();
                      }}
                    />
                  </Elements>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 p-8 text-center space-y-2">
                  <CreditCard className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="text-xs font-bold text-slate-700">No Pending Invoices</p>
                  <p className="text-[11px] text-slate-400">
                    All your emergency ambulance dispatches are currently settled.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Right Summary Panel */}
          <aside className="border-t border-slate-800 bg-[#0b132b] p-6 text-white sm:p-9 lg:border-t-0">
            <p className="text-[10px] font-bold tracking-[0.18em] text-slate-400 uppercase">
              Order Summary
            </p>
            <h3 className="mt-2 text-xl font-black text-white">{tripVehicle} Dispatch</h3>

            <div className="mt-8 space-y-4 border-b border-white/10 pb-6 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle Type</span>
                <span className="font-semibold text-white">{tripVehicle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Route</span>
                <span className="font-semibold text-white max-w-[200px] truncate text-right">
                  {tripRoute}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="font-semibold text-white">
                  {selectedInvoice?.paymentStatus || 'Pending Authorization'}
                </span>
              </div>
            </div>

            <div className="flex items-end justify-between pt-6">
              <span className="text-sm text-slate-400">Total Due</span>
              <span className="text-2xl font-black text-white">
                BDT {dueAmount.toLocaleString()}
              </span>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex gap-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
                <p className="text-xs leading-relaxed text-slate-300">
                  PulseRoute guarantees zero-surge locked pricing for life-saving emergency dispatches.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Invoices List / Payment History */}
        {invoices.length > 0 && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Emergency Trip Invoices</h3>
                <p className="text-xs text-slate-500">
                  Review your recent ambulance dispatch payment receipts
                </p>
              </div>
              <FileText className="h-5 w-5 text-slate-400" />
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex flex-col justify-between gap-3 py-3 sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {inv.invoiceNumber || `#INV-${inv.id.slice(-6).toUpperCase()}`}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          inv.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(inv.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-black text-slate-900 mr-1.5">
                      BDT {Number(inv.totalAmount || 0).toLocaleString()}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenDetails(inv)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
                      title="View all invoice details"
                    >
                      <Eye className="h-3.5 w-3.5 text-slate-500" />
                      <span>Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDownloadPdf(inv)}
                      disabled={downloadingInvoiceId === inv.id}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-red-50 hover:text-[#e63946] hover:border-red-200 transition cursor-pointer disabled:opacity-50"
                      title="Download Invoice PDF"
                    >
                      <Download className="h-3.5 w-3.5 text-slate-500" />
                      <span>{downloadingInvoiceId === inv.id ? 'PDF...' : 'PDF'}</span>
                    </button>

                    {inv.paymentStatus !== 'PAID' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setPaid(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                          selectedInvoice?.id === inv.id
                            ? 'bg-[#e63946] text-white shadow-xs'
                            : 'bg-red-50 text-[#e63946] hover:bg-red-100'
                        }`}
                      >
                        {selectedInvoice?.id === inv.id ? 'Selected ✓' : 'Pay Invoice'}
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 ml-0.5">
                        <Check className="h-3.5 w-3.5" /> Settled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Invoice Details & PDF Download Modal */}
      <InvoiceDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        invoiceId={modalInvoiceId}
        initialInvoice={selectedInvoiceForModal}
      />
    </div>
  );
}
