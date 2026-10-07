'use client';

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { CreditCard, LockKeyhole, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import {
  createPaymentIntentAction,
  confirmPaymentAction,
} from '@/services/payment/payment.service';

interface StripeCardPaymentFormProps {
  invoice: any;
  onPaymentSuccess?: () => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#0f172a',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '15px',
      '::placeholder': {
        color: '#94a3b8',
      },
      iconColor: '#e63946',
    },
    invalid: {
      color: '#dc2626',
      iconColor: '#dc2626',
    },
  },
  hidePostalCode: true,
};

export default function StripeCardPaymentForm({
  invoice,
  onPaymentSuccess,
}: StripeCardPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
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

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
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
          card: cardElement,
          billing_details: {
            name: invoice.patient?.name || 'PulseRoute Patient',
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
          // Even if backend settle confirmation has slight delay, Stripe succeeded
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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Real Stripe Card Element */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="h-4 w-4 text-[#e63946]" />
            Card Information
          </label>
          <span className="text-[11px] font-semibold text-slate-400">
            Visa • Mastercard • AMEX
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition focus-within:border-[#e63946] focus-within:ring-2 focus-within:ring-red-500/20">
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            onChange={(e) => {
              setCardComplete(e.complete);
              if (e.error) {
                setCardError(e.error.message);
              } else {
                setCardError(null);
              }
            }}
          />
        </div>

        {cardError && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{cardError}</span>
          </p>
        )}
      </div>

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
