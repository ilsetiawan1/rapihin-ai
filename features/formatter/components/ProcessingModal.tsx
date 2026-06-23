"use client";

import React from "react";
import { RefreshCw, Download, FileCheck } from "lucide-react";

interface ProcessingModalProps {
  show: boolean;
  isProcessing: boolean;
  processStep: number;
  processingSteps: string[];
  isFinished: boolean;
  fileName: string;
  onDownload: () => void;
  onReset: () => void;
}

export default function ProcessingModal({
  show,
  isProcessing,
  processStep,
  processingSteps,
  isFinished,
  fileName,
  onDownload,
  onReset,
}: ProcessingModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground border border-border rounded-3xl p-8 max-w-md w-full text-center shadow-2xl flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
        {isProcessing ? (
          <div className="flex flex-col items-center gap-5 w-full">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-accent-light text-accent">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <h3 className="text-lg font-bold text-foreground">Sedang Merapikan Dokumen</h3>
              <div className="w-full bg-background h-2 rounded-full overflow-hidden mt-3 border border-border">
                <div
                  className="bg-accent h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((processStep + 1) / processingSteps.length) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-muted min-h-[36px] mt-3 leading-relaxed">
                {processingSteps[processStep]}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 w-full">
            <div className="w-16 h-16 rounded-full bg-success-light text-success flex items-center justify-center">
              <FileCheck className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground">Format Selesai Dirapikan!</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed px-4">
                Berkas baru <strong className="text-foreground">Repaired_{fileName}</strong> berhasil
                dikompresi & diunduh secara otomatis.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 w-full mt-4">
              <button
                onClick={onDownload}
                className="ios-spring py-3 bg-accent hover:opacity-90 text-accent-foreground font-semibold rounded-xl text-sm flex items-center justify-center gap-2 active:scale-95"
              >
                <Download className="w-4 h-4" /> Unduh Ulang Dokumen
              </button>
              <button
                onClick={onReset}
                className="ios-spring py-3 border border-border bg-card hover:bg-accent-light/50 text-foreground font-semibold rounded-xl text-sm active:scale-95"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
