"use client";

import React, { useState, useEffect } from "react";
import { Settings, Award, ChevronDown, Check, Columns, Type, Hash } from "lucide-react";

export interface TemplateConfig {
  id: string;
  name: string;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  fontFamily: string;
  fontSize: number;
  lineSpacing: number;
}

const CAMPUS_PRESETS: TemplateConfig[] = [
  {
    id: "standard",
    name: "Standard Akademik (Umum)",
    marginTop: 4,
    marginBottom: 3,
    marginLeft: 4,
    marginRight: 3,
    fontFamily: "Times New Roman",
    fontSize: 12,
    lineSpacing: 1.5,
  },
  {
    id: "custom",
    name: "Kustom Mandiri (Bebas)",
    marginTop: 4,
    marginBottom: 3,
    marginLeft: 4,
    marginRight: 3,
    fontFamily: "Times New Roman",
    fontSize: 12,
    lineSpacing: 1.5,
  },
];

interface TemplateSelectorProps {
  onConfigChange: (config: TemplateConfig) => void;
  compact?: boolean; // Prop is kept for backwards compatibility but we'll use a unified premium look
}

export default function TemplateSelector({ onConfigChange, compact = false }: TemplateSelectorProps) {
  const [selectedId, setSelectedId] = useState<string>("standard");
  const [config, setConfig] = useState<TemplateConfig>(CAMPUS_PRESETS[0]);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);

  useEffect(() => {
    onConfigChange(config);
  }, [config, onConfigChange]);

  const selectPreset = (presetId: string) => {
    const preset = CAMPUS_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSelectedId(presetId);
      setConfig({ ...preset });
    }
    setShowPresetsMenu(false);
  };

  const handleCustomChange = (key: keyof TemplateConfig, value: string | number) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const selectedPreset = CAMPUS_PRESETS.find((p) => p.id === selectedId) || CAMPUS_PRESETS[0];
  const isCustom = selectedId === "custom";

  return (
    <div className={`flex flex-col gap-6 w-full ${!compact ? "bg-card text-card-foreground p-2" : ""}`}>
      
      {/* ── Preset Selector ── */}
      <div className="relative">
        <label className="text-xs font-bold text-foreground block mb-2">
          Pilih Template Pedoman
        </label>
        <button
          onClick={() => setShowPresetsMenu(!showPresetsMenu)}
          className="w-full flex items-center justify-between px-4 py-3 bg-background border border-border hover:border-accent hover:ring-1 hover:ring-accent/30 rounded-xl text-sm font-semibold text-foreground transition-all focus:outline-none"
        >
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-accent" />
            {selectedPreset.name}
          </span>
          <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-200 ${showPresetsMenu ? "rotate-180" : ""}`} />
        </button>

        {showPresetsMenu && (
          <div className="absolute z-20 w-full mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in zoom-in-95">
            {CAMPUS_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset.id)}
                className={`flex items-center justify-between w-full px-4 py-3 text-sm text-left hover:bg-accent-light/30 transition-colors ${
                  selectedId === preset.id ? "text-accent font-bold bg-accent-light/10" : "text-foreground font-medium"
                }`}
              >
                <span>{preset.name}</span>
                {selectedId === preset.id && <Check className="w-4 h-4 text-accent" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Margin Settings ── */}
        <div className="flex flex-col gap-4 bg-background/50 border border-border rounded-2xl p-5 relative overflow-hidden group hover:border-accent/30 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-accent-light text-accent rounded-lg">
              <Columns className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-foreground">Ukuran Margin (cm)</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-1">
            {[
              { label: "Kiri (Left)", key: "marginLeft" as const },
              { label: "Atas (Top)", key: "marginTop" as const },
              { label: "Kanan (Right)", key: "marginRight" as const },
              { label: "Bawah (Bottom)", key: "marginBottom" as const },
            ].map((m) => (
              <div key={m.key} className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider pl-1">
                  {m.label}
                </label>
                <div className={`flex items-center bg-background border rounded-xl overflow-hidden transition-colors ${isCustom ? "focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20 border-border" : "border-border/50 opacity-80"}`}>
                  <input
                    type="number"
                    step="0.1"
                    disabled={!isCustom}
                    value={config[m.key]}
                    onChange={(e) => handleCustomChange(m.key, parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent px-3 py-2.5 font-semibold text-sm text-foreground focus:outline-none disabled:text-muted"
                  />
                  <span className="text-xs font-medium text-muted pr-3">cm</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Typography Settings ── */}
        <div className="flex flex-col gap-5 bg-background/50 border border-border rounded-2xl p-5 relative overflow-hidden group hover:border-accent/30 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-accent-light text-accent rounded-lg">
              <Type className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-foreground">Tipografi & Spasi</h4>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider pl-1">
              Font Family
            </label>
            <div className={`relative flex items-center bg-background border rounded-xl overflow-hidden transition-colors ${isCustom ? "focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20 border-border" : "border-border/50 opacity-80"}`}>
              <select
                disabled={!isCustom}
                value={config.fontFamily}
                onChange={(e) => handleCustomChange("fontFamily", e.target.value)}
                className="w-full bg-transparent px-3 py-2.5 font-semibold text-sm text-foreground focus:outline-none appearance-none disabled:text-muted z-10"
              >
                <option value="Times New Roman">Times New Roman</option>
                <option value="Arial" disabled>Arial (🔒 Pro)</option>
                <option value="Calibri" disabled>Calibri (🔒 Pro)</option>
                <option value="Georgia" disabled>Georgia (🔒 Pro)</option>
              </select>
              <ChevronDown className="absolute right-3 w-4 h-4 text-muted z-0 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider pl-1">
              Spasi Baris (Line Spacing)
            </label>
            <div className={`relative flex items-center bg-background border rounded-xl overflow-hidden transition-colors ${isCustom ? "focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20 border-border" : "border-border/50 opacity-80"}`}>
              <Hash className="absolute left-3 w-4 h-4 text-muted z-0" />
              <select
                disabled={!isCustom}
                value={config.lineSpacing}
                onChange={(e) => handleCustomChange("lineSpacing", parseFloat(e.target.value))}
                className="w-full bg-transparent pl-9 pr-3 py-2.5 font-semibold text-sm text-foreground focus:outline-none appearance-none disabled:text-muted z-10"
              >
                <option value={1.0}>1.0 — Single Space</option>
                <option value={1.5}>1.5 — Satu Setengah</option>
                <option value={2.0}>2.0 — Double Space</option>
              </select>
              <ChevronDown className="absolute right-3 w-4 h-4 text-muted z-0 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      {!isCustom && (
        <div className="flex items-center justify-center p-3 rounded-xl bg-accent-light/50 border border-accent/20 text-xs font-medium text-muted">
          <Settings className="w-3.5 h-3.5 mr-2 text-accent" />
          Setelan dikunci pada mode <strong>&nbsp;{selectedPreset.name}&nbsp;</strong>. Pilih mode kustom untuk mengubah.
        </div>
      )}
    </div>
  );
}
