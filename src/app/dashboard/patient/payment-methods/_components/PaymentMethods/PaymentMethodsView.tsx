'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DynamicActionButton from '@/components/shared/DynamicActionButton/DynamicActionButton';
import DynamicBackBtn from '@/components/dashboard/DynamicBackBtn/DynamicBackBtn';
import DynamicBadge from '@/components/dashboard/DynamicBadge/DynamicBadge';
import DynamicModal from '@/components/dashboard/DynamicModal/DynamicModal';
import InputField from '@/components/dashboard/Fields/InputField/InputField';
import {
  ArrowLeft,
  Check,
  CreditCard,
  LockKeyhole,
  Plus,
  ShieldCheck,
  Smartphone,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { createPaymentIntentAction, confirmPaymentAction } from '@/services/payment.service';

export default function PaymentMethodsView() {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bkash' | 'insurance'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paid, setPaid] = useState(false);
  const [addCardModalOpen, setAddCardModalOpen] = useState(false);

  // Add Card State
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      // Authorize payment through PulseRoute Payment Gateway
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPaid(true);
      toast.success('Payment authorized via Stripe Gateway! Emergency dispatch priority locked.');
    } catch (err: any) {
      toast.error(err?.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    setAddCardModalOpen(false);
    toast.success('Payment card saved to your PulseRoute wallet.');
  };

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5">
          <DynamicBackBtn label="Back to Emergency Booking" />
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
              {/* Payment Method Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Select Payment Method
                </label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { id: 'card', label: 'Debit / Credit Card', sub: '•••• 4242', icon: CreditCard },
                    { id: 'bkash', label: 'bKash Wallet', sub: 'Instant Mobile Pay', icon: Smartphone },
                    { id: 'insurance', label: 'Health Insurance', sub: 'Pre-Authorization', icon: ShieldCheck },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = paymentMethod === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPaymentMethod(item.id as any)}
                        className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? 'border-[#e63946] bg-red-50/50 text-[#e63946] shadow-xs'
                            : 'border-slate-200 text-slate-700 hover:border-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon className="h-5 w-5" />
                          {isSelected && <Check className="h-4 w-4 text-[#e63946]" />}
                        </div>
                        <div className="mt-3">
                          <p className="text-xs font-bold">{item.label}</p>
                          <p className="text-[10px] text-slate-400">{item.sub}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Content by Method */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                  <InputField
                    label="Card Number"
                    placeholder="4242 4242 4242 4242"
                    icon={<CreditCard className="h-4 w-4 text-slate-400" />}
                    value="•••• •••• •••• 4242"
                    readOnly
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Expiration Date" placeholder="12 / 28" value="12 / 28" readOnly />
                    <InputField label="Security CVC" placeholder="•••" value="•••" readOnly />
                  </div>
                </div>
              )}

              {paymentMethod === 'bkash' && (
                <div className="rounded-2xl border border-pink-100 bg-pink-50 p-5 text-sm text-[#831843]">
                  <p className="font-bold">bKash Seamless Gateway</p>
                  <p className="mt-1 text-xs text-pink-700">
                    You will be redirected to bKash OTP verification to authorize this emergency transaction.
                  </p>
                </div>
              )}

              {paymentMethod === 'insurance' && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-800">
                  <p className="font-bold">Guardian Health Plus (GH-992-0045-881)</p>
                  <p className="mt-1 text-xs text-emerald-700">
                    Your insurance policy provides 100% cashless coverage for emergency ICU transport.
                  </p>
                </div>
              )}

              {/* Pay Action Button */}
              <DynamicActionButton
                variant="danger"
                onClick={handlePay}
                isLoading={isProcessing}
                className="h-12 text-sm font-bold uppercase tracking-wider shadow-lg shadow-red-500/25"
                fullWidth
                label={paid ? 'Payment Authorized ✓' : 'Authorize BDT 3,500'}
              />

              <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
                <LockKeyhole className="h-3.5 w-3.5 text-slate-400" />
                Payments are end-to-end 256-bit encrypted.
              </p>
            </div>
          </section>

          {/* Right Summary Panel */}
          <aside className="border-t border-slate-800 bg-[#0b132b] p-6 text-white sm:p-9 lg:border-t-0">
            <p className="text-[10px] font-bold tracking-[0.18em] text-slate-400 uppercase">
              Order Summary
            </p>
            <h3 className="mt-2 text-xl font-black text-white">ICU Ambulance Dispatch</h3>

            <div className="mt-8 space-y-4 border-b border-white/10 pb-6 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle Type</span>
                <span className="font-semibold text-white">ICU Life Support</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Route</span>
                <span className="font-semibold text-white">Dhanmondi to Gulshan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Duration</span>
                <span className="font-semibold text-white">8-12 mins</span>
              </div>
            </div>

            <div className="flex items-end justify-between pt-6">
              <span className="text-sm text-slate-400">Total Due</span>
              <span className="text-2xl font-black text-white">BDT 3,500</span>
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

        <button
          type="button"
          onClick={() => setAddCardModalOpen(true)}
          className="mx-auto mt-6 flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#e63946]"
        >
          <Plus className="h-4 w-4" /> Add or replace payment card
        </button>
      </div>

      {/* Add Card Modal */}
      <DynamicModal
        isOpen={addCardModalOpen}
        onClose={() => setAddCardModalOpen(false)}
        title="Add Payment Card"
        description="Enter card information for future emergency dispatches."
        variant="light"
      >
        <form onSubmit={handleSaveCard} className="space-y-4 pt-2">
          <InputField
            label="Cardholder Name"
            placeholder="e.g. Abdur Rahman"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
            required
          />
          <InputField
            label="Card Number"
            placeholder="4242 4242 4242 4242"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Expiry (MM/YY)"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              required
            />
            <InputField
              label="CVC"
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <DynamicActionButton
              variant="outline"
              onClick={() => setAddCardModalOpen(false)}
              label="Cancel"
            />
            <DynamicActionButton
              type="submit"
              variant="danger"
              label="Save Card"
            />
          </div>
        </form>
      </DynamicModal>
    </div>
  );
}
