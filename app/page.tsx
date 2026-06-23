"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  Bot,
  Lock,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Dropzone from "@/features/formatter/components/Dropzone";
import TemplateSelector, {
  TemplateConfig,
} from "@/features/formatter/components/TemplateSelector";
import CompliancePanel from "@/features/formatter/components/CompliancePanel";
import ProcessingModal from "@/features/formatter/components/ProcessingModal";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [config, setConfig] = useState<TemplateConfig | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Modal & Processing States
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const processingSteps = [
    "Mengurai struktur berkas Word (.docx)...",
    "Menganalisis margin halaman saat ini...",
    "Mencocokkan gaya huruf & spasi baris...",
    "Menerapkan konfigurasi margin & font kampus...",
    "Menyusun kembali XML dan mengepak dokumen...",
  ];

  // Initialize theme from document attribute
  useEffect(() => {
    const activeTheme =
      (document.documentElement.getAttribute("data-theme") as
        | "light"
        | "dark") || "light";
    setTheme(activeTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const handleProcessDocument = async () => {
    if (!selectedFile || !config) return;
    setShowModal(true);
    setIsProcessing(true);
    setProcessStep(0);
    setIsFinished(false);

    // Visual ticker
    const interval = setInterval(() => {
      setProcessStep((prev) => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 900);

    // Real API call
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("config", JSON.stringify(config));

      const res = await fetch("/api/process-document", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal memproses dokumen");

      const blob = await res.blob();

      clearInterval(interval);
      setProcessStep(processingSteps.length - 1);

      setTimeout(() => {
        setIsProcessing(false);
        setIsFinished(true);
        triggerDownload(blob, `RapihinAI_${selectedFile.name}`);
      }, 800);
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      alert("Terjadi kesalahan saat memproses dokumen.");
      setShowModal(false);
    }
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const element = document.createElement("a");
    element.href = URL.createObjectURL(blob);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setShowModal(false);
    setIsFinished(false);
    setProcessStep(0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header theme={theme} onToggleTheme={toggleTheme} />

      {/* ── Main Page Area ── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-14">

        {/* ── Hero Section ── */}
        <section className="text-center flex flex-col items-center gap-4 max-w-xl mx-auto mt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-light text-accent rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Otomatisasi Format Dokumen
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            Merapikan Berkas Skripsi Kurang dari 2 Menit
          </h1>
          <p className="text-sm md:text-base text-muted leading-relaxed max-w-md">
            Unggah file{" "}
            <code className="font-mono text-foreground font-semibold">
              .docx
            </code>{" "}
            skripsi kamu, pilih template standar kampus, dan unduh dokumen rapi
            seketika — <strong className="text-foreground">100% gratis</strong>.
          </p>
        </section>

        {/* ── Core Tool Section (Free Feature) ── */}
        <section className="w-full">
          <div
            className={`grid grid-cols-1 gap-6 items-start transition-all duration-500 ${
              selectedFile ? "lg:grid-cols-12" : "max-w-3xl mx-auto grid-cols-1"
            }`}
          >
            {/* Column Left: Dropzone + TemplateSelector */}
            <div
              className={`flex flex-col gap-6 ${selectedFile ? "lg:col-span-7" : "w-full"}`}
            >
              <Dropzone
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
              />
              <TemplateSelector onConfigChange={setConfig} />
            </div>

            {/* Column Right: Compliance + Rapikan Button (only when file selected) */}
            {selectedFile && (
              <div className="lg:col-span-5 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {config && (
                  <CompliancePanel
                    fileName={selectedFile.name}
                    config={config}
                    file={selectedFile}
                  />
                )}

                <button
                  onClick={handleProcessDocument}
                  disabled={!config}
                  className="ios-spring w-full py-4 bg-accent hover:bg-accent/90 disabled:opacity-40 text-accent-foreground rounded-2xl font-bold text-base shadow-md shadow-accent/15 flex items-center justify-center gap-2 active:scale-98"
                >
                  <Sparkles className="w-5 h-5" /> Rapikan Dokumen Sekarang
                </button>

                <p className="text-center text-xs text-muted px-4">
                  🔒 File kamu hanya diproses di memori server dan langsung
                  dihapus setelah selesai.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── Processing Modal ── */}
        <ProcessingModal
          show={showModal}
          isProcessing={isProcessing}
          processStep={processStep}
          processingSteps={processingSteps}
          isFinished={isFinished}
          fileName={selectedFile?.name || "Skripsi.docx"}
          onDownload={() =>
            selectedFile && triggerDownload(new Blob(), selectedFile.name)
          }
          onReset={resetForm}
        />

        {/* ── Benefit Cards ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border pt-12">
          <div className="flex gap-4 items-start">
            <div className="p-2.5 rounded-xl bg-accent-light text-accent shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">
                Garansi Privasi 100%
              </h4>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                File skripsi kamu hanya diproses di dalam memori RAM server dan
                segera dihapus instan setelah file dikirim balik.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-2.5 rounded-xl bg-accent-light text-accent shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">
                Sangat Instan & Gratis
              </h4>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Pemrosesan format selesai dalam 15–30 detik. Gratis tanpa batas
                karena berbasis rule-based engine, bukan AI.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-2.5 rounded-xl bg-accent-light text-accent shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">
                Sesuai Panduan Kampus
              </h4>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Margin 4-3-4-3 cm dan font dikonversi presisi hingga tingkat
                satuan XML Word Processing. Siap langsung diserahkan.
              </p>
            </div>
          </div>
        </section>

        {/* ── Pro Upsell Section ── */}
        <section className="relative border border-border rounded-3xl p-8 bg-card overflow-hidden">
          {/* Decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
          </div>

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="p-3 rounded-2xl bg-accent-light text-accent shrink-0">
              <Bot className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-foreground">
                  Perlu Perbaikan Konten? Coba Fitur Pro AI
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent text-white text-[10px] font-bold rounded-full">
                  <Lock className="w-2.5 h-2.5" /> PRO
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed max-w-xl">
                Setelah layout rapi, masih ada{" "}
                <em>typo</em>, kalimat berbelit, atau Daftar Isi yang nomornya
                kacau? Fitur AI kami bisa memperbaiki substansi konten secara
                otomatis — powered by{" "}
                <strong className="text-foreground">Gemini 2.5 Flash</strong>.
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                {[
                  "AI Academic Reviewer & Auto-Fix",
                  "Smart Citation Finder",
                  "TOC Synchronizer",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-1.5 text-xs text-muted"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <button className="ios-spring shrink-0 flex items-center gap-2 px-5 py-3 bg-accent hover:opacity-90 text-white rounded-xl font-bold text-sm shadow-md shadow-accent/20 active:scale-95 whitespace-nowrap">
              Coba Fitur Pro <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
