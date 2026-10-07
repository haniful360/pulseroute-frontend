'use client';

import React, { useState } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import {
  CreditCard,
  Calendar,
  LockKeyhole,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  User,
} from 'lucide-react';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import {
  createPaymentIntentAction,
  confirmPaymentAction,
} from '@/services/payment/payment.service';

interface StripeCardPaymentFormProps {
  invoice: any;
  onPaymentSuccess?: () => void;
}

const ELEMENT_STYLE = {
  style: {
    base: {
      color: '#0f172a',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '14px',
      '::placeholder': {
        color: '#94a3b8',
      },
    },
    invalid: {
      color: '#dc2626',
    },
  },
};

export default function StripeCardPaymentForm({
  invoice,
  onPaymentSuccess,
}: StripeCardPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [cardholderName, setCardholderName] = useState(
    invoice?.patient?.name || ''
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const amount = invoice ? Number(invoice.totalAmount || 0) : 0;
  const isPaid = invoice?.paymentStatus === 'PAID';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoice?.id) {
      toast.error('No invoice selected for payment.');
      return;
    }

    if (!stripe || !elements) {
      toast.error('Stripe has not initialized yet. Please wait a moment and try again.');
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      toast.error('Card element is unavailable. Please refresh.');
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    try {
      // 1. Create PaymentIntent on the backend for this invoice
      const intentRes = await createPaymentIntentAction({ invoiceId: invoice.id });
      if (!intentRes.success || !intentRes.data?.clientSecret) {
        throw new Error(intentRes.message || 'Failed to create Stripe payment intent.');
      }

      const { clientSecret, paymentIntentId } = intentRes.data;

      // 2. Confirm card payment directly with Stripe client-side
      const stripeResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: cardholderName.trim() || invoice.patient?.name || 'PulseRoute Patient',
          },
        },
      });

      if (stripeResult.error) {
        setCardError(stripeResult.error.message || 'Payment authentication failed.');
        toast.error(stripeResult.error.message || 'Payment declined by card issuer.');
        return;
      }

      const confirmedIntent = stripeResult.paymentIntent;
      if (confirmedIntent && confirmedIntent.status === 'succeeded') {
        // 3. Confirm and settle payment in PulseRoute backend
        const settleRes = await confirmPaymentAction({
          invoiceId: invoice.id,
          paymentIntentId: confirmedIntent.id || paymentIntentId,
        });

        if (settleRes.success) {
          toast.success(
            `💳 Payment of BDT ${amount.toLocaleString()} settled successfully via Stripe!`
          );
          if (onPaymentSuccess) {
            onPaymentSuccess();
          }
        } else {
          toast.info(
            settleRes.message || 'Payment authorized via Stripe! Updating ledger records.'
          );
          if (onPaymentSuccess) {
            onPaymentSuccess();
          }
        }
      } else {
        throw new Error(
          `Payment not finalized. Current Stripe status: ${confirmedIntent?.status || 'Unknown'}`
        );
      }
    } catch (err: any) {
      console.error('Stripe payment error:', err);
      const msg = err?.message || 'Payment processing failed. Please try again.';
      setCardError(msg);
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isPaid) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h4 className="text-base font-bold text-slate-900">Invoice Fully Settled</h4>
        <p className="text-xs text-emerald-800">
          Invoice <span className="font-mono font-bold">{invoice.invoiceNumber}</span> of{' '}
          <span className="font-bold">BDT {amount.toLocaleString()}</span> has been paid via Stripe.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 1. Cardholder Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-slate-500" />
          Cardholder Name
        </label>
        <div className="relative">
          <input
            type="text"
            required
            placeholder="e.g. Abdur Rahman"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#e63946] focus:ring-2 focus:ring-red-500/20"
          />
        </div>
      </div>

      {/* 2. Individual Card Number Element */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5 text-[#e63946]" />
            Card Number
          </label>
          <span className="text-[11px] font-semibold text-slate-400">
            Visa • Mastercard • AMEX
          </span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 shadow-2xs transition focus-within:border-[#e63946] focus-within:ring-2 focus-within:ring-red-500/20">
          <CardNumberElement
            options={{
              ...ELEMENT_STYLE,
              showIcon: true,
            }}
            onChange={(e) => {
              if (e.error) {
                setCardError(e.error.message);
              } else {
                setCardError(null);
              }
            }}
          />
        </div>
      </div>

      {/* 3. Expiration Date & CVC Elements Side by Side */}
      <div className="grid grid-cols-2 gap-3">
        {/* Expiry Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            Expiration Date
          </label>
          <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 shadow-2xs transition focus-within:border-[#e63946] focus-within:ring-2 focus-within:ring-red-500/20">
            <CardExpiryElement
              options={ELEMENT_STYLE}
              onChange={(e) => {
                if (e.error) {
                  setCardError(e.error.message);
                } else {
                  setCardError(null);
                }
              }}
            />
          </div>
        </div>

        {/* CVC / CVV */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <LockKeyhole className="h-3.5 w-3.5 text-slate-500" />
            CVC / CVV
          </label>
          <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 shadow-2xs transition focus-within:border-[#e63946] focus-within:ring-2 focus-within:ring-red-500/20">
            <CardCvcElement
              options={ELEMENT_STYLE}
              onChange={(e) => {
                if (e.error) {
                  setCardError(e.error.message);
                } else {
                  setCardError(null);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Card Error Display */}
      {cardError && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{cardError}</span>
        </p>
      )}

      {/* Security badge and hint */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span className="flex items-center gap-1">
          <LockKeyhole className="h-3 w-3 text-slate-400" />
          End-to-end 256-bit encrypted
        </span>
        <span className="font-semibold text-emerald-600 flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5" />
          Stripe Verified
        </span>
      </div>

      {/* Pay Action Button */}
      <DynamicActionButton
        type="submit"
        variant="danger"
        isLoading={isProcessing}
        disabled={!stripe || isProcessing || amount <= 0}
        className="h-12 text-sm font-bold uppercase tracking-wider shadow-lg shadow-red-500/25 cursor-pointer disabled:opacity-50"
        fullWidth
        label={
          isProcessing
            ? 'Processing Payment...'
            : `Pay BDT ${amount.toLocaleString()} with Card`
        }
      />
    </form>
  );
}
