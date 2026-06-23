"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/shared/Header";
import FreeFormatterSection from "@/features/formatter/components/FreeFormatterSection";
import ProUpsellSection from "@/features/formatter/components/ProUpsellSection";
import ProcessingModal from "@/features/formatter/components/ProcessingModal";
import PricingModal from "@/components/shared/PricingModal";
import { TemplateConfig } from "@/features/formatter/components/TemplateSelector";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [config, setConfig] = useState<TemplateConfig | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Modal & Processing States
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [showPricing, setShowPricing] = useState(false);

  const processingSteps = [
    "Mengurai struktur berkas Word (.docx)...",
    "Menganalisis margin halaman saat ini...",
    "Mencocokkan gaya huruf & spasi baris...",
    "Menerapkan konfigurasi margin & font kampus...",
    "Menyusun kembali XML dan mengepak dokumen...",
  ];

  useEffect(() => {
    const saved = document.documentElement.getAttribute("data-theme") as "light" | "dark";
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const handleProcessDocument = async () => {
    if (!selectedFile || !config) return;
    setShowModal(true);
    setIsProcessing(true);
    setProcessStep(0);
    setIsFinished(false);
    setProcessedBlob(null);

    const interval = setInterval(() => {
      setProcessStep((prev) => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 900);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("config", JSON.stringify(config));

      const res = await fetch("/api/process-document", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      clearInterval(interval);
      setProcessStep(processingSteps.length - 1);
      setProcessedBlob(blob);

      setTimeout(() => {
        setIsProcessing(false);
        setIsFinished(true);
        triggerDownload(blob, `RapihinAI_${selectedFile.name}`);
      }, 800);
    } catch {
      clearInterval(interval);
      alert("Terjadi kesalahan saat memproses dokumen.");
      setShowModal(false);
    }
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setShowModal(false);
    setIsFinished(false);
    setProcessStep(0);
    setProcessedBlob(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      {/* Main Sections Wrapper */}
      <main className="flex-1">
        {/* Section 1: Free Formatter */}
        <FreeFormatterSection
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          config={config}
          setConfig={setConfig}
          onProcessDocument={handleProcessDocument}
        />

        {/* Section 2: Pro Upsell */}
        <ProUpsellSection onShowPricing={() => setShowPricing(true)} />
      </main>

      {/* Modals */}
      <ProcessingModal
        show={showModal}
        isProcessing={isProcessing}
        processStep={processStep}
        processingSteps={processingSteps}
        isFinished={isFinished}
        fileName={selectedFile?.name || "Skripsi.docx"}
        onDownload={() => processedBlob && selectedFile && triggerDownload(processedBlob, `RapihinAI_${selectedFile.name}`)}
        onReset={resetForm}
      />

      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
