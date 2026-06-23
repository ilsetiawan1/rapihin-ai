"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, FileCheck2, Loader2, RefreshCw } from "lucide-react";
import { TemplateConfig } from "./TemplateSelector";

interface ComplianceItem {
  id: string;
  label: string;
  status: "success" | "warning";
  detected: string;
  expected: string;
  desc: string;
}

interface ComplianceResult {
  items: ComplianceItem[];
  overallStatus: "compliant" | "needs_revision";
  issueCount: number;
}

interface CompliancePanelProps {
  fileName: string;
  config: TemplateConfig;
  file: File | null; // the real File object for API
}

export default function CompliancePanel({ fileName, config, file }: CompliancePanelProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkCompliance = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("config", JSON.stringify(config));

      const res = await fetch("/api/check-compliance", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Gagal menganalisis dokumen.");
      }

      const data: ComplianceResult = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-check when file or config changes
  useEffect(() => {
    if (file) {
      checkCompliance();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, config.id]);

  return (
    <div className="flex flex-col gap-6 bg-card text-card-foreground rounded-3xl p-6 border border-border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-success-light text-success">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Laporan Kepatuhan Format
            </h2>
            <p className="text-xs text-muted">Hasil analisis berkas: {fileName}</p>
          </div>
        </div>
        <button
          onClick={checkCompliance}
          disabled={loading || !file}
          title="Periksa ulang"
          className="p-2 rounded-xl text-muted hover:text-accent hover:bg-accent-light/30 transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
          <p className="text-sm text-muted font-medium">Menganalisis struktur dokumen...</p>
          <p className="text-xs text-muted/70">Membaca margin, font, spasi, dan bab</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <AlertTriangle className="w-8 h-8 text-error" />
          <p className="text-sm text-error font-semibold">{error}</p>
          <button
            onClick={checkCompliance}
            className="text-xs text-accent underline hover:no-underline"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Results */}
      {!loading && result && (
        <>
          {/* Summary badge */}
          <div
            className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold border
              ${result.overallStatus === "compliant"
                ? "bg-success-light/40 border-success/20 text-success"
                : "bg-error-light/40 border-error/20 text-error"
              }`}
          >
            <span>
              {result.overallStatus === "compliant"
                ? "✅ Semua format sudah sesuai standar"
                : `⚠️ ${result.issueCount} poin perlu diperbaiki`}
            </span>
            <span className="opacity-70">{result.items.length} poin diperiksa</span>
          </div>

          <div className="flex flex-col gap-4">
            {result.items.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col gap-2 p-4 border rounded-2xl transition-all duration-300
                  ${item.status === "success"
                    ? "border-success/20 bg-success-light/30"
                    : "border-error/20 bg-error-light/30"
                  }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {item.status === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-error shrink-0" />
                    )}
                    <span className="text-sm font-semibold text-foreground">{item.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0
                      ${item.status === "success"
                        ? "bg-success text-success-foreground"
                        : "bg-error text-error-foreground"
                      }`}
                  >
                    {item.status === "success" ? "Sesuai" : "Revisi"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1 text-xs border-t border-border/20 pt-2 text-muted">
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider font-semibold opacity-85">
                      Terdeteksi
                    </span>
                    <span className="font-medium text-foreground">{item.detected}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider font-semibold opacity-85">
                      Target Format
                    </span>
                    <span className="font-medium text-foreground">{item.expected}</span>
                  </div>
                </div>

                <p className="text-[11px] leading-relaxed text-muted mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
