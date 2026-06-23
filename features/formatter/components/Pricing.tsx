"use client";

import React from "react";
import { Check } from "lucide-react";

interface PricingProps {
  hasFileSelected: boolean;
  onProcessDocument: () => void;
}

export default function Pricing({ hasFileSelected, onProcessDocument }: PricingProps) {
  return (
    <section id="pricing" className="border-t border-border pt-14 pb-4 flex flex-col gap-10">
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Pilih Paket Kamu</h2>
        <p className="text-sm text-muted">Sesuaikan dengan kebutuhan pengerjaan tugas akhirmu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
        <div className="bg-card text-card-foreground border border-border rounded-3xl p-8 flex flex-col justify-between gap-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Free Tier</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold text-foreground">Rp 0</span>
              <span className="text-xs text-muted">/ selamanya</span>
            </div>
            <p className="text-xs text-muted mt-2">Cocok untuk cek awal format dan perbaikan skala kecil.</p>

            <ul className="flex flex-col gap-2.5 mt-4 text-xs">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success shrink-0" />
                <span>Limit 2 dokumen / bulan</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success shrink-0" />
                <span>Semua template kampus preset</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success shrink-0" />
                <span>Kecepatan standar (15-30 detik)</span>
              </li>
            </ul>
          </div>
          <button
            disabled={!hasFileSelected}
            onClick={onProcessDocument}
            className="ios-spring w-full py-3 bg-background hover:bg-accent-light border border-border text-foreground rounded-xl text-sm font-semibold active:scale-97 disabled:opacity-50"
          >
            Gunakan Gratis
          </button>
        </div>

        <div className="bg-card text-card-foreground border-2 border-accent rounded-3xl p-8 flex flex-col justify-between gap-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
            Pro
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">Pro Tier</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold text-foreground">Rp 19.000</span>
              <span className="text-xs text-muted">/ sekali bayar</span>
            </div>
            <p className="text-xs text-muted mt-2">
              Dukungan kustom penuh untuk mahasiswa tingkat akhir super sibuk.
            </p>

            <ul className="flex flex-col gap-2.5 mt-4 text-xs">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent shrink-0" />
                <span>Tanpa batas unggah dokumen</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent shrink-0" />
                <span>Akses template Kustom Mandiri</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent shrink-0" />
                <span>Prioritas pemrosesan instan</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent shrink-0" />
                <span>Backup histori file 30 hari</span>
              </li>
            </ul>
          </div>
          <button className="ios-spring w-full py-3 bg-accent hover:opacity-90 text-accent-foreground rounded-xl text-sm font-semibold shadow-sm active:scale-97">
            Upgrade Sekarang
          </button>
        </div>
      </div>
    </section>
  );
}
