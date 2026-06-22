"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, FileCheck2 } from "lucide-react";
import { TemplateConfig } from "./TemplateSelector";

interface CompliancePanelProps {
  fileName: string;
  config: TemplateConfig;
}

export default function CompliancePanel({ fileName, config }: CompliancePanelProps) {
  const complianceItems = [
    {
      id: "margin",
      label: "Batas Margin Halaman",
      status: "warning",
      detected: "Kiri 3cm, Kanan 3cm, Atas 3cm, Bawah 3cm",
      expected: `Kiri ${config.marginLeft}cm, Kanan ${config.marginRight}cm, Atas ${config.marginTop}cm, Bawah ${config.marginBottom}cm`,
      desc: "Dokumen kamu saat ini menggunakan margin default Word. Kami akan menyesuaikan ukurannya.",
    },
    {
      id: "font",
      label: "Tipe & Ukuran Font Utama",
      status: "warning",
      detected: "Calibri 11pt & Times New Roman 12pt (Campuran)",
      expected: `${config.fontFamily} ${config.fontSize}pt`,
      desc: "Ditemukan font tidak seragam pada teks paragraf utama. Seluruh teks isi akan diseragamkan.",
    },
    {
      id: "spacing",
      label: "Spasi Baris (Line Spacing)",
      status: "warning",
      detected: "1.15 Spasi",
      expected: `${config.lineSpacing} Spasi`,
      desc: "Jarak spasi paragraf belum seragam. Kami akan menyejajarkan spasi baris dokumen.",
    },
    {
      id: "structure",
      label: "Struktur Penulisan Bab",
      status: "success",
      detected: "BAB I, BAB II, BAB III terdeteksi",
      expected: "Struktur Bab Terbaca",
      desc: "Sistem berhasil mengidentifikasi bab dan sub-bab menggunakan struktur Regex.",
    },
  ];

  return (
    <div className="flex flex-col gap-6 bg-card text-card-foreground rounded-3xl p-6 border border-border shadow-sm">
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

      <div className="flex flex-col gap-4">
        {complianceItems.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col gap-2 p-4 border rounded-2xl transition-all duration-300
              ${
                item.status === "success"
                  ? "border-success/20 bg-success-light/30"
                  : "border-error/20 bg-error-light/30"
              }
            `}
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
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full
                  ${
                    item.status === "success"
                      ? "bg-success text-success-foreground"
                      : "bg-error text-error-foreground"
                  }
                `}
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
    </div>
  );
}
