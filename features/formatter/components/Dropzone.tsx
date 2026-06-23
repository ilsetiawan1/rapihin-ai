"use client";

import React, { useRef, useState } from "react";
import { FileText, UploadCloud, X, CheckCircle2 } from "lucide-react";

interface DropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  className?: string;
}

export default function Dropzone({ onFileSelect, selectedFile, className = "" }: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension !== "docx") {
      alert("Format berkas harus .docx!");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert("Ukuran berkas melebihi batas 20MB!");
      return;
    }
    onFileSelect(file);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div
      onClick={!selectedFile ? triggerFileInput : undefined}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`ios-spring group relative flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer bg-card text-card-foreground
        ${className || "min-h-[260px] md:min-h-[300px]"}
        ${isDragActive ? "border-accent bg-accent-light scale-102" : "border-border hover:border-accent hover:bg-accent-light/30"}
        ${selectedFile ? "cursor-default" : ""}
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx"
        className="hidden"
        onChange={handleFileInput}
      />

      {!selectedFile ? (
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-accent-light text-accent">
            <div className="absolute inset-0 rounded-full border border-accent/20 animate-ping opacity-75"></div>
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              Unggah Dokumen Kamu
            </h3>
            <p className="mt-2 text-sm text-muted max-w-[280px] mx-auto leading-relaxed">
              Drop file skripsi <strong className="text-foreground">.docx</strong> kamu di sini. Biar kami yang bereskan sisanya.
            </p>
          </div>
          <button className="ios-spring mt-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-xl text-sm font-semibold shadow-sm hover:opacity-90 active:scale-95">
            Pilih Berkas
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md flex flex-col items-center gap-4 p-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-success-light text-success">
            <FileText className="w-8 h-8" />
          </div>
          <div className="w-full text-center">
            <h3 className="text-base font-semibold truncate px-4" title={selectedFile.name}>
              {selectedFile.name}
            </h3>
            <p className="mt-1 text-xs text-muted">
              {formatBytes(selectedFile.size)} • Siap dirapikan
            </p>
          </div>

          <div className="flex gap-3 w-full mt-4 justify-center">
            <button
              onClick={clearFile}
              className="ios-spring flex items-center gap-1.5 px-4 py-2 border border-border bg-card hover:bg-accent-light/50 text-foreground rounded-xl text-sm font-semibold active:scale-95"
            >
              <X className="w-4 h-4" /> Ganti Berkas
            </button>
            <div className="flex items-center gap-1.5 px-4 py-2 bg-success-light text-success rounded-xl text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Terverifikasi
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
