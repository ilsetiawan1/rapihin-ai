"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Settings,
  Sparkles,
  ChevronDown,
  X,
  Paperclip,
  FileText,
  Image as ImageIcon,
  Bot,
  User,
  Loader2,
} from "lucide-react";
import { useChat } from "ai/react";
import TemplateSelector, { TemplateConfig } from "./TemplateSelector";

// ── Types ──
interface ChatPanelProps {
  onConfigChange: (config: TemplateConfig) => void;
  onProcessDocument: () => void;
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

// ── AI Models ──
const AI_MODELS = [
  { id: "gemini", name: "Gemini 1.5 Pro" },
  { id: "claude", name: "Claude 3.5 Sonnet" },
  { id: "gpt4", name: "GPT-4o" },
];

function renderText(text: string): React.ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    return part.split("\n").map((line, j, arr) => (
      <React.Fragment key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  });
}

export default function ChatPanel({
  onConfigChange,
  onProcessDocument,
  onFileSelect,
  selectedFile,
}: ChatPanelProps) {
  const { messages, input: inputValue, handleInputChange, handleSubmit, isLoading: isTyping } = useChat();
  const [chatMode, setChatMode] = useState(false);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [showModelMenu, setShowModelMenu] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const getFileTypeIcon = (name: string): "image" | "document" => {
    const ext = name.split(".").pop()?.toLowerCase();
    return ["png", "jpg", "jpeg", "gif", "webp"].includes(ext || "") ? "image" : "document";
  };

  const handleAttachmentClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.size > 20 * 1024 * 1024) { alert("Ukuran berkas melebihi batas 20MB!"); return; }
      setStagedFile(file);
      if (file.name.toLowerCase().endsWith(".docx")) onFileSelect(file);
      inputRef.current?.focus();
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeStagedFile = () => { setStagedFile(null); onFileSelect(null); };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() && !stagedFile && !selectedFile) return;

    // Switch to chat mode on first send
    if (!chatMode) setChatMode(true);

    const lower = inputValue.toLowerCase();
    if (lower.includes("konfig") || lower.includes("pengaturan")) {
      setTimeout(() => setShowConfig(true), 500);
    } else if ((lower.includes("rapikan") || lower.includes("proses")) && (stagedFile || selectedFile)) {
      setTimeout(() => onProcessDocument(), 500);
    }

    // Pass event to useChat handleSubmit
    if (inputValue.trim()) {
      handleSubmit(e as any);
    }
    setStagedFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { 
      e.preventDefault(); 
      handleSend(e as unknown as React.FormEvent); 
    }
  };

  const handleQuickProcess = () => {
    if (!stagedFile && !selectedFile) { alert("Harap lampirkan file .docx terlebih dahulu!"); return; }
    onProcessDocument();
  };

  // ─── Shared Input Box ───────────────────────────────────────
  const InputBox = (
    <div className={`w-full ${chatMode ? "" : "max-w-3xl"} relative z-10`}>
      <div className="flex flex-col bg-card border-2 border-border rounded-[2rem] shadow-xl focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10 transition-all p-2">

        {/* Staged File Preview */}
        {(stagedFile || selectedFile) && (
          <div className="m-2 flex items-center justify-between p-3 bg-background border border-border rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-light text-accent rounded-xl">
                {getFileTypeIcon((stagedFile || selectedFile)!.name) === "image"
                  ? <ImageIcon className="w-5 h-5" />
                  : <FileText className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-sm font-bold text-foreground truncate max-w-[200px] block">
                  {(stagedFile || selectedFile)!.name}
                </span>
                <span className="text-[10px] text-muted">Siap diproses</span>
              </div>
            </div>
            <button onClick={removeStagedFile} className="p-1.5 hover:bg-error-light text-error rounded-xl transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder=""
          className="w-full bg-transparent text-base text-foreground placeholder:text-muted/70 focus:outline-none px-5 pt-4 resize-none max-h-40 min-h-[60px]"
          rows={1}
          style={{ fieldSizing: "content" } as React.CSSProperties}
        />

        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 pb-2 pt-4">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {/* Attach */}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".docx,.pdf,.png,.jpg,.jpeg" />
            <button onClick={handleAttachmentClick} className="p-2.5 text-muted hover:text-accent hover:bg-accent-light rounded-xl transition-colors shrink-0" title="Lampirkan file">
              <Paperclip className="w-5 h-5" />
            </button>

            <div className="w-px h-5 bg-border mx-1 shrink-0" />

            {/* Model */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowModelMenu(!showModelMenu)}
                className="flex items-center gap-1.5 px-3 py-2 bg-background border border-border hover:border-accent text-xs font-semibold text-foreground rounded-xl transition-colors"
              >
                {selectedModel.name}
                <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform ${showModelMenu ? "rotate-180" : ""}`} />
              </button>
              {showModelMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-48 bg-card border border-border rounded-xl shadow-xl overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95">
                  {AI_MODELS.map((m) => (
                    <button key={m.id} onClick={() => { setSelectedModel(m); setShowModelMenu(false); }}
                      className={`w-full px-4 py-2.5 text-xs text-left hover:bg-accent-light/30 transition-colors ${selectedModel.id === m.id ? "text-accent font-bold" : "text-foreground font-medium"}`}>
                      {m.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-px h-5 bg-border mx-1 shrink-0" />

            {/* Config */}
            <button onClick={() => setShowConfig(!showConfig)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors shrink-0 ${showConfig ? "bg-accent-light text-accent" : "text-muted hover:text-foreground hover:bg-accent-light/50"}`}>
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Konfigurasi</span>
            </button>

            {/* Rapikan */}
            <button onClick={handleQuickProcess}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-accent bg-accent-light/50 hover:bg-accent-light rounded-xl transition-colors shrink-0">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Rapikan Sekarang</span>
            </button>
          </div>

          {/* Send */}
          <button
            onClick={handleSend}
            disabled={(!inputValue.trim() && !stagedFile && !selectedFile) || isTyping}
            className="p-3 rounded-2xl bg-accent text-white disabled:opacity-30 hover:opacity-90 active:scale-95 transition-all shrink-0 ml-2 shadow-md shadow-accent/20"
          >
            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <p className="text-center text-[10px] text-muted mt-2">
        Tekan <kbd className="px-1 py-0.5 bg-border rounded text-[10px]">Enter</kbd> untuk kirim ·{" "}
        <kbd className="px-1 py-0.5 bg-border rounded text-[10px]">Shift+Enter</kbd> baris baru
      </p>
    </div>
  );

  // ─── HERO MODE (sebelum kirim) ───────────────────────────────
  if (!chatMode) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full min-h-[500px] px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-14 h-14 bg-accent-light text-accent rounded-full flex items-center justify-center mb-5">
            <Bot className="w-7 h-7" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight mb-2">
            Rapihkan Skripsimu Sekarang
          </h2>
          <p className="text-sm text-muted">
            Chat dengan AI atau langsung lampirkan dokumen untuk diformat otomatis.
          </p>
        </div>

        <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-6">
          {InputBox}
        </div>

        {/* Config Panel */}
        {showConfig && (
          <div className="w-full max-w-3xl mt-4 animate-in fade-in slide-in-from-top-4">
            <div className="bg-card border border-border shadow-lg rounded-[2rem] p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-accent-light text-accent"><Settings className="w-5 h-5" /></div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Pengaturan Format</h3>
                    <p className="text-[10px] text-muted">Sesuaikan dengan panduan kampusmu</p>
                  </div>
                </div>
                <button onClick={() => setShowConfig(false)} className="p-2 hover:bg-muted/10 text-muted rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <TemplateSelector onConfigChange={onConfigChange} compact={false} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── CHAT MODE (setelah kirim pertama) ───────────────────────
  return (
    <div className="flex flex-col w-full h-full max-h-[calc(100vh-64px)]">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id}
            className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar user only */}
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-accent-light text-accent border border-accent/30 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}

            <div className={`flex flex-col gap-1 max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
              {/* Text */}
              {msg.content && (
                <div className={`text-sm leading-relaxed ${msg.role === "user"
                  ? "bg-accent text-white px-4 py-3 rounded-2xl rounded-tr-sm"
                  : "text-foreground py-1"}`}>
                  {renderText(msg.content)}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2 animate-in fade-in pl-1">
            <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Config Panel */}
      {showConfig && (
        <div className="px-4 md:px-8 pb-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-card border border-border shadow-lg rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-accent-light text-accent"><Settings className="w-4 h-4" /></div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Pengaturan Format</h3>
                  <p className="text-[10px] text-muted">Sesuaikan dengan panduan kampusmu</p>
                </div>
              </div>
              <button onClick={() => setShowConfig(false)} className="p-1.5 hover:bg-muted/10 text-muted rounded-xl transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <TemplateSelector onConfigChange={onConfigChange} compact={false} />
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 md:px-8 pb-5 pt-2 shrink-0">
        {InputBox}
      </div>
    </div>
  );
}
