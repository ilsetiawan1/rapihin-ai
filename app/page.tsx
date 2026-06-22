"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Dropzone from "@/features/formatter/components/Dropzone";
import TemplateSelector, { TemplateConfig } from "@/features/formatter/components/TemplateSelector";
import CompliancePanel from "@/features/formatter/components/CompliancePanel";
import ProcessingModal from "@/features/formatter/components/ProcessingModal";
import Pricing from "@/features/formatter/components/Pricing";

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
      (document.documentElement.getAttribute("data-theme") as "light" | "dark") || "light";
    setTheme(activeTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const handleProcessDocument = () => {
    if (!selectedFile) return;
    setShowModal(true);
    setIsProcessing(true);
    setProcessStep(0);
    setIsFinished(false);

    // Simulated processing ticker
    const interval = setInterval(() => {
      setProcessStep((prev) => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            setIsFinished(true);
            triggerMockDownload();
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 900);
  };

  const triggerMockDownload = () => {
    const element = document.createElement("a");
    const file = new Blob(["mock docx content"], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Repaired_${selectedFile?.name || "Skripsi.docx"}`;
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
    <div className="flex flex-col min-h-screen bg-background text-foreground animate-in fade-in duration-300">
      {/* Header */}
      <Header theme={theme} onToggleTheme={toggleTheme} />

      {/* Main Page Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-14">
        
        {/* Hero Section */}
        <section className="text-center flex flex-col items-center gap-4 max-w-xl mx-auto mt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-light text-accent rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Otomatisasi Format Dokumen
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            Merapikan Berkas Skripsi Kurang dari 2 Menit
          </h1>
          <p className="text-sm md:text-base text-muted leading-relaxed max-w-md">
            Unggah file <code className="font-mono text-foreground font-semibold">.docx</code> skripsi
            kamu, pilih kampus tujuan, dan unduh dokumen rapi seketika.
          </p>
        </section>

        {/* Core Tool Section */}
        <section className="w-full">
          <div
            className={`grid grid-cols-1 gap-6 items-start transition-all duration-500 ${
              selectedFile ? "lg:grid-cols-12" : "max-w-3xl mx-auto grid-cols-1"
            }`}
          >
            {/* Column Left (Dropzone & Selector) */}
            <div className={`flex flex-col gap-6 ${selectedFile ? "lg:col-span-7" : "w-full"}`}>
              <Dropzone onFileSelect={setSelectedFile} selectedFile={selectedFile} />
              <TemplateSelector onConfigChange={setConfig} />
            </div>

            {/* Column Right (Compliance Report & Action Button) */}
            {selectedFile && (
              <div className="lg:col-span-5 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {config && <CompliancePanel fileName={selectedFile.name} config={config} />}

                <button
                  onClick={handleProcessDocument}
                  className="ios-spring w-full py-4 bg-accent hover:bg-accent/90 text-accent-foreground rounded-2xl font-bold text-base shadow-md shadow-accent/15 flex items-center justify-center gap-2 active:scale-98"
                >
                  <Sparkles className="w-5 h-5" /> Rapikan Dokumen Sekarang
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Fullscreen Overlay Modal for Processing & Success */}
        <ProcessingModal
          show={showModal}
          isProcessing={isProcessing}
          processStep={processStep}
          processingSteps={processingSteps}
          isFinished={isFinished}
          fileName={selectedFile?.name || "Skripsi.docx"}
          onDownload={triggerMockDownload}
          onReset={resetForm}
        />

        {/* Benefits Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border pt-12">
          <div className="flex gap-4 items-start">
            <div className="p-2.5 rounded-xl bg-accent-light text-accent shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">Garansi Privasi 100%</h4>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                File skripsi kamu hanya diproses di dalam memori RAM server, segera dihapus instan
                setelah file dikirim balik.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-2.5 rounded-xl bg-accent-light text-accent shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">Sangat Instan & Gratis</h4>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Pemrosesan format dihitung instan (15-30 detik) gratis tanpa biaya API karena berbasis
                rule-based engine.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-2.5 rounded-xl bg-accent-light text-accent shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">Sesuai Panduan Kampus</h4>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Margin 4-3-4-3 cm dan format standardisasi spasi dikonversi presisi hingga tingkat
                satuan XML Word Processing.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <Pricing hasFileSelected={!!selectedFile} onProcessDocument={handleProcessDocument} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
