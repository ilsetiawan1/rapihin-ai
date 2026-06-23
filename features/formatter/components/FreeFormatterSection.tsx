"use client";

import React from "react";
import { Sparkles, ShieldCheck, Zap, TrendingUp, ArrowDown } from "lucide-react";
import Dropzone from "./Dropzone";
import TemplateSelector, { TemplateConfig } from "./TemplateSelector";
import CompliancePanel from "./CompliancePanel";

interface FreeFormatterSectionProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  config: TemplateConfig | null;
  setConfig: (config: TemplateConfig | null) => void;
  onProcessDocument: () => void;
}

export default function FreeFormatterSection({
  selectedFile,
  setSelectedFile,
  config,
  setConfig,
  onProcessDocument,
}: FreeFormatterSectionProps) {
  return (
    <section className="
      flex flex-col
      lg:h-[calc(100vh-64px)] lg:overflow-hidden
      max-w-7xl w-full mx-auto
      px-4 md:px-8
      pt-5 pb-3 lg:pb-0
      gap-4
      scroll-snap-align-start
    ">
      {/* ── Hero Text (compact, shrink-0) ── */}
      <div className="shrink-0 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-light text-accent rounded-full text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" /> 100% Gratis · Tanpa Login
        </div>
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground leading-snug">
          Rapikan Format Skripsi Kamu dalam Hitungan Detik
        </h1>
        <p className="text-xs md:text-sm text-muted mt-1.5">
          Upload <code className="font-mono text-foreground font-semibold">.docx</code> → pilih template kampus → unduh langsung. Margin, font & spasi otomatis presisi.
        </p>
      </div>

      {/* ── Main Tool Area (flex-1, fills remaining height on desktop) ── */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
        {/* LEFT: Dropzone — mengisi seluruh tinggi kolom kiri */}
        <div className="lg:w-[55%] flex flex-col min-h-0">
          <Dropzone
            onFileSelect={setSelectedFile}
            selectedFile={selectedFile}
            className="flex-1 min-h-[220px]"
          />
        </div>

        {/* RIGHT: Config Panel + Compliance (scrollable internally jika overflow) */}
        <div className="lg:w-[45%] flex flex-col gap-3 lg:overflow-y-auto lg:pr-1">
          <TemplateSelector onConfigChange={setConfig} />

          {/* Compliance + Button muncul saat file dipilih */}
          {selectedFile && config && (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <CompliancePanel
                fileName={selectedFile.name}
                config={config}
                file={selectedFile}
              />
              <button
                onClick={onProcessDocument}
                className="ios-spring w-full py-3.5 bg-accent hover:bg-accent/90 text-accent-foreground rounded-2xl font-bold text-sm shadow-md shadow-accent/20 flex items-center justify-center gap-2 active:scale-98"
              >
                <Sparkles className="w-4 h-4" /> Rapikan Dokumen Sekarang
              </button>
              <p className="text-center text-[11px] text-muted">
                🔒 File hanya diproses di memori server, tidak disimpan permanen.
              </p>
            </div>
          )}

          {/* Placeholder saat belum upload */}
          {!selectedFile && (
            <div className="hidden lg:flex flex-col items-center justify-center flex-1 rounded-2xl border border-dashed border-border text-center gap-2 p-6">
              <p className="text-xs text-muted">
                Upload dokumen di sebelah kiri untuk melihat laporan kepatuhan format.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Benefit Pills (shrink-0) ── */}
      <div className="shrink-0 flex flex-wrap justify-center gap-2 py-1">
        {[
          { icon: <ShieldCheck className="w-3 h-3" />, label: "Privasi Terjamin" },
          { icon: <Zap className="w-3 h-3" />, label: "Proses < 30 Detik" },
          { icon: <TrendingUp className="w-3 h-3" />, label: "Presisi Standar Kampus" },
        ].map((b) => (
          <div
            key={b.label}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-full text-[11px] font-medium text-muted"
          >
            <span className="text-accent">{b.icon}</span> {b.label}
          </div>
        ))}
      </div>

      {/* ── Divider → "Mau lebih rapi?" (shrink-0, bottom of screen) ── */}
      <div className="shrink-0 flex flex-col items-center gap-1.5 pb-4 lg:pb-3">
        <p className="text-xs font-semibold text-muted">
          Mau lebih rapi?{" "}
          <span className="text-foreground">Biarkan AI yang bereskan kontennya.</span>
        </p>
        <div className="w-px h-4 bg-border" />
        <div className="p-1 rounded-full border border-border text-muted animate-bounce">
          <ArrowDown className="w-3.5 h-3.5" />
        </div>
      </div>
    </section>
  );
}
