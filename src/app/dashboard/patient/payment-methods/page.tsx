'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, LockKeyhole, Plus, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function PaymentMethodsPage() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paid, setPaid] = useState(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] p-2 sm:p-4">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard/patient/book-ambulance"
          className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-[#64748b] hover:text-[#e63946]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to booking
        </Link>
        <div className="grid overflow-hidden rounded-2xl border bg-white shadow-sm lg:grid-cols-[1fr_380px]">
          <section className="p-6 sm:p-9">
            <div className="mb-8">
              <p className="text-[10px] font-bold tracking-[0.18em] text-[#e63946] uppercase">
                PulseRoute checkout
              </p>
              <h1 className="mt-2 text-2xl font-bold text-[#0b132b]">Complete your payment</h1>
              <p className="mt-1 text-sm text-[#64748b]">
                Securely pay for your emergency ambulance dispatch.
              </p>
            </div>
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-bold">Payment method</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ['card', 'Card'],
                    ['bkash', 'bKash'],
                    ['insurance', 'Insurance'],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setPaymentMethod(value)}
                      className={`rounded-xl border p-4 text-left text-xs font-bold transition ${paymentMethod === value ? 'border-[#e63946] bg-red-50 text-[#e63946]' : 'border-[#e5e7eb] text-[#64748b] hover:border-red-200'}`}
                    >
                      {label}
                      <span className="mt-2 block text-[10px] font-normal">
                        {value === 'card'
                          ? '•••• 4242'
                          : value === 'bkash'
                            ? 'Mobile wallet'
                            : 'Policy coverage'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              {paymentMethod === 'card' && (
                <div className="space-y-4 rounded-xl border bg-[#f9fafb] p-4">
                  <label className="block text-xs font-semibold">
                    Card number
                    <input
                      className="mt-2 h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none"
                      placeholder="4242 4242 4242 4242"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-xs font-semibold">
                      Expiry
                      <input
                        className="mt-2 h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none"
                        placeholder="MM / YY"
                      />
                    </label>
                    <label className="text-xs font-semibold">
                      CVC
                      <input
                        className="mt-2 h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none"
                        placeholder="123"
                      />
                    </label>
                  </div>
                </div>
              )}
              {paymentMethod === 'bkash' && (
                <div className="rounded-xl border border-pink-100 bg-pink-50 p-4 text-sm text-[#831843]">
                  You will be redirected to bKash to authorize this payment.
                </div>
              )}
              {paymentMethod === 'insurance' && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
                  Your insurance policy is eligible for pre-authorization. Coverage will be verified
                  before dispatch.
                </div>
              )}
              <Button
                className="h-12 w-full bg-[#e63946] text-base hover:bg-red-600"
                onClick={() => setPaid(true)}
              >
                {paid ? (
                  <>
                    <Check /> Payment authorized
                  </>
                ) : (
                  <>Pay BDT 3,500</>
                )}
              </Button>
              <p className="flex items-center justify-center gap-2 text-center text-[10px] text-[#64748b]">
                <LockKeyhole className="h-3 w-3" /> Payments are encrypted and processed securely by
                Stripe.
              </p>
            </div>
          </section>
          <aside className="border-t bg-[#0b132b] p-6 text-white lg:border-t-0 lg:p-9">
            <p className="text-[10px] font-bold tracking-[0.18em] text-[#94a3b8] uppercase">
              Order summary
            </p>
            <h2 className="mt-2 text-lg font-bold">Emergency dispatch</h2>
            <div className="mt-8 space-y-4 border-b border-white/10 pb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-[#94a3b8]">Ambulance</span>
                <span>ICU support</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94a3b8]">Route</span>
                <span>Dhanmondi to Gulshan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94a3b8]">Estimated ETA</span>
                <span>8-12 mins</span>
              </div>
            </div>
            <div className="flex items-end justify-between pt-5">
              <span className="text-sm text-[#94a3b8]">Total due</span>
              <span className="text-2xl font-bold">BDT 3,500</span>
            </div>
            <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex gap-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
                <p className="text-xs leading-relaxed text-[#cbd5e1]">
                  Your payment details are protected with industry-standard encryption.
                </p>
              </div>
            </div>
          </aside>
        </div>
        <button className="mx-auto mt-5 flex items-center gap-2 text-xs font-semibold text-[#64748b]">
          <Plus className="h-4 w-4" /> Add another payment method
        </button>
      </div>
    </div>
  );
}
