"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Crown, Loader2, Rocket } from "lucide-react";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: PlanFeature[];
  buttonText: string;
  popular: boolean;
}

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("/api/pricing")
        .then((res) => {
          if (!res.ok) throw new Error("Gagal mengambil data");
          return res.json();
        })
        .then((data) => {
          setPlans(data);
          setError(false);
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleCheckout = (planId: string) => {
    if (planId === "free") return onClose();

    setCheckoutLoading(planId);
    // Mock Checkout Delay
    setTimeout(() => {
      alert("Integrasi Payment Gateway (Midtrans/Stripe) akan segera hadir di versi final MVP!");
      setCheckoutLoading(null);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-card border border-border shadow-2xl rounded-[2rem] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted/20 text-muted transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-accent-light text-accent rounded-2xl mb-6">
            <Crown className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">
            Selesaikan Skripsi Lebih Cepat
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Upgrade ke Pro untuk mendapatkan akses penuh ke seluruh jenis font, batas ukuran file lebih besar, dan bantuan prioritas server.
          </p>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <p className="text-sm text-muted">Memuat paket harga...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-error font-medium">Gagal memuat paket harga.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 mt-12 text-left">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col p-8 rounded-3xl border-2 transition-all ${
                    plan.popular
                      ? "border-accent bg-accent/5 shadow-xl shadow-accent/10 scale-100 md:scale-105 z-10"
                      : "border-border bg-card"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 shadow-md">
                      <Rocket className="w-3.5 h-3.5" /> Paling Laris
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-foreground mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-3xl font-black text-foreground">{plan.price}</span>
                      <span className="text-sm text-muted font-medium">/ {plan.period}</span>
                    </div>
                    <p className="text-sm text-muted leading-relaxed">{plan.description}</p>
                  </div>

                  <ul className="flex-1 space-y-4 mb-8">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 shrink-0 rounded-full p-0.5 ${
                            feat.included
                              ? "bg-success/20 text-success"
                              : "bg-muted/20 text-muted/50"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span
                          className={`text-sm ${
                            feat.included ? "text-foreground font-medium" : "text-muted/60"
                          }`}
                        >
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={checkoutLoading === plan.id}
                    className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                      plan.popular
                        ? "bg-accent text-white hover:bg-accent/90 shadow-md shadow-accent/20"
                        : "bg-muted/10 text-foreground hover:bg-muted/20"
                    }`}
                  >
                    {checkoutLoading === plan.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      plan.buttonText
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
