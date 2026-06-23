"use client";

import React from "react";
import { Bot, Lock, ArrowRight } from "lucide-react";
import Footer from "@/components/shared/Footer";

interface ProUpsellSectionProps {
  onShowPricing: () => void;
}

export default function ProUpsellSection({ onShowPricing }: ProUpsellSectionProps) {
  return (
    <section className="
      bg-card border-t border-border
      flex flex-col
      lg:h-screen lg:overflow-hidden
      pt-20 lg:pt-24
    ">
      {/* Centered Content Container */}
      <div className="flex-1 flex flex-col justify-center items-center max-w-4xl w-full mx-auto px-4 md:px-8 py-8 gap-6 text-center">
        
        <div className="p-3.5 rounded-2xl bg-accent-light text-accent shrink-0 animate-in fade-in duration-500">
          <Bot className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent text-white rounded-full text-[11px] font-bold">
            <Lock className="w-3 h-3" /> FITUR PRO
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
            Layout Sudah Rapi. <br className="hidden md:block" />
            Sekarang Giliran Isi Kontennya.
          </h2>
          <p className="text-xs md:text-sm text-muted leading-relaxed max-w-lg mx-auto">
            Typo, kalimat berbelit, dan Daftar Isi yang kacau? Fitur AI kami memperbaiki substansi dokumen secara otomatis — powered by{" "}
            <strong className="text-foreground">Gemini 2.5 Flash</strong>.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left mt-2">
          {[
            {
              emoji: "✍️",
              title: "AI Academic Reviewer",
              desc: "Perbaiki typo, kalimat tidak baku, dan ejaan KBBI/PUEBI secara otomatis.",
            },
            {
              emoji: "📚",
              title: "Smart Citation Finder",
              desc: "Deteksi klaim tanpa sitasi dan rekomendasikan jurnal ilmiah yang relevan.",
            },
            {
              emoji: "📋",
              title: "TOC Synchronizer",
              desc: "Sinkronkan nomor halaman Daftar Isi dengan posisi riil setiap bab secara otomatis.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-background border border-border rounded-2xl p-5 flex flex-col gap-2 hover:border-accent/30 transition-colors"
            >
              <div className="text-2xl">{f.emoji}</div>
              <h3 className="font-bold text-sm text-foreground">{f.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex flex-col items-center gap-3 mt-2">
          <button
            onClick={onShowPricing}
            className="ios-spring flex items-center gap-2 px-7 py-3.5 bg-accent hover:bg-accent/90 text-white rounded-2xl font-bold text-sm shadow-lg shadow-accent/20 active:scale-95"
          >
            Lihat Paket & Harga <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[11px] text-muted">
            Mulai dari gratis · Bayar hanya saat butuh · Tanpa langganan bulanan
          </p>
        </div>
      </div>

      {/* Footer is embedded inside this section to keep desktop view exactly 1vh */}
      <div className="shrink-0 w-full mt-auto">
        <Footer />
      </div>
    </section>
  );
}
