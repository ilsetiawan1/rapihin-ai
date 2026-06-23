"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { TemplateConfig } from "@/features/formatter/components/TemplateSelector";
import ChatPanel from "@/features/formatter/components/ChatPanel";
import CompliancePanel from "@/features/formatter/components/CompliancePanel";
import ProcessingModal from "@/features/formatter/components/ProcessingModal";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [config, setConfig] = useState<TemplateConfig | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const handleProcessDocument = async () => {
    if (!selectedFile || !config) return;
    setShowModal(true);
    setIsProcessing(true);
    setProcessStep(0);
    setIsFinished(false);

    // 1. Start the visual ticker
    const interval = setInterval(() => {
      setProcessStep((prev) => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 900);

    // 2. Perform the actual API call
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

      // Ensure at least some time has passed for UX
      clearInterval(interval);
      setProcessStep(processingSteps.length - 1);
      
      setTimeout(() => {
        setIsProcessing(false);
        setIsFinished(true);
        triggerRealDownload(blob, `RapihinAI_${selectedFile.name}`);
      }, 800);

    } catch (err) {
      console.error(err);
      clearInterval(interval);
      alert("Terjadi kesalahan saat memproses dokumen.");
      setShowModal(false);
    }
  };

  const triggerRealDownload = (blob: Blob, filename: string) => {
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
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* ── App Sidebar ── */}
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <Header 
          theme={theme} 
          onToggleTheme={toggleTheme} 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col items-center">
          <div className={`w-full h-full flex flex-col lg:flex-row gap-6 items-center justify-center transition-all duration-500 max-w-6xl`}>
            
            {/* Chat Panel Area */}
            <div className={`flex-1 w-full h-full max-h-[800px] flex items-center justify-center transition-all duration-500`}>
              <ChatPanel
                onConfigChange={setConfig}
                onProcessDocument={handleProcessDocument}
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
              />
            </div>

            {/* Compliance Panel Area (Only shows when file is selected) */}
            {selectedFile && (
              <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 flex flex-col gap-5 animate-in fade-in slide-in-from-right-8 duration-500 max-h-[800px]">
                {config && <CompliancePanel fileName={selectedFile.name} config={config} />}

                <button
                  onClick={handleProcessDocument}
                  className="ios-spring w-full py-4 bg-accent hover:bg-accent/90 text-accent-foreground rounded-2xl font-bold text-base shadow-lg shadow-accent/20 flex items-center justify-center gap-2 active:scale-98"
                >
                  <Sparkles className="w-5 h-5" /> Rapikan Dokumen
                </button>
                
                <div className="bg-accent-light/30 border border-accent/20 rounded-2xl p-4 text-xs text-foreground/80 text-center leading-relaxed">
                  <p>Sistem AI membantu proses perbaikan secara lokal tanpa mengunggah isi dokumen ke server publik.</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── Fullscreen Overlay Modal ── */}
      <ProcessingModal
        show={showModal}
        isProcessing={isProcessing}
        processStep={processStep}
        processingSteps={processingSteps}
        isFinished={isFinished}
        fileName={selectedFile?.name || "Skripsi.docx"}
        onDownload={() => {}} // Download happens automatically now
        onReset={resetForm}
      />
    </div>
  );
}
