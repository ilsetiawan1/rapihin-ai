"use client";

import React, { useState, useEffect } from "react";
import { Settings, Award, Compass, ChevronDown, Check } from "lucide-react";

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
    name: "Template Standar Akademik (General)",
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
    name: "Kustom Mandiri (Atur Sendiri)",
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
}

export default function TemplateSelector({ onConfigChange }: TemplateSelectorProps) {
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

  return (
    <div className="flex flex-col gap-6 bg-card text-card-foreground rounded-3xl p-6 border border-border shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-accent-light text-accent">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Konfigurasi Perbaikan
          </h2>
          <p className="text-xs text-muted">Sesuaikan standardisasi format akademik</p>
        </div>
      </div>

      <div className="relative">
        <label className="text-xs font-semibold text-muted block mb-2 uppercase tracking-wider">
          Pilihan Template Dokumen
        </label>
        <button
          onClick={() => setShowPresetsMenu(!showPresetsMenu)}
          className="ios-spring flex items-center justify-between w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium text-foreground hover:border-accent hover:bg-accent-light/10 text-left active:scale-99"
        >
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-accent" />
            {selectedPreset.name}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showPresetsMenu ? "rotate-180" : ""}`} />
        </button>

        {showPresetsMenu && (
          <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-2xl shadow-xl overflow-hidden py-1">
            {CAMPUS_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset.id)}
                className="flex items-center justify-between w-full px-4 py-3 text-sm text-left hover:bg-accent-light/30 text-foreground"
              >
                <span>{preset.name}</span>
                {selectedId === preset.id && <Check className="w-4 h-4 text-accent" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 border-t border-border pt-4">
        <div>
          <label className="text-xs font-semibold text-muted block mb-3 uppercase tracking-wider">
            Pengaturan Margin (cm)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Kiri", key: "marginLeft" as const },
              { label: "Atas", key: "marginTop" as const },
              { label: "Kanan", key: "marginRight" as const },
              { label: "Bawah", key: "marginBottom" as const },
            ].map((m) => (
              <div key={m.key} className="flex flex-col gap-1.5 bg-background p-2.5 rounded-xl border border-border">
                <span className="text-[10px] font-semibold text-muted text-center uppercase">
                  {m.label}
                </span>
                <input
                  type="number"
                  step="0.1"
                  disabled={selectedId !== "custom"}
                  value={config[m.key]}
                  onChange={(e) => handleCustomChange(m.key, parseFloat(e.target.value) || 0)}
                  className="w-full bg-transparent text-center font-bold text-sm focus:outline-none disabled:text-muted"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="flex flex-col gap-1.5 bg-background p-3 rounded-xl border border-border">
            <span className="text-[10px] font-semibold text-muted uppercase">Font Dokumen</span>
            <select
              disabled={selectedId !== "custom"}
              value={config.fontFamily}
              onChange={(e) => handleCustomChange("fontFamily", e.target.value)}
              className="bg-transparent font-bold text-sm focus:outline-none w-full disabled:text-muted"
            >
              <option value="Times New Roman">Times New Roman</option>
              <option value="Arial" disabled>Arial (🔒 Pro)</option>
              <option value="Calibri" disabled>Calibri (🔒 Pro)</option>
              <option value="Georgia" disabled>Georgia (🔒 Pro)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 bg-background p-3 rounded-xl border border-border">
            <span className="text-[10px] font-semibold text-muted uppercase">Spasi Baris</span>
            <select
              disabled={selectedId !== "custom"}
              value={config.lineSpacing}
              onChange={(e) => handleCustomChange("lineSpacing", parseFloat(e.target.value))}
              className="bg-transparent font-bold text-sm focus:outline-none w-full disabled:text-muted"
            >
              <option value={1.0}>1.0 (Single)</option>
              <option value={1.5}>1.5 (1.5 Lines)</option>
              <option value={2.0}>2.0 (Double)</option>
            </select>
          </div>
        </div>

        {selectedId !== "custom" && (
          <div className="flex items-start gap-2.5 bg-accent-light/50 border border-accent/15 rounded-2xl p-3 text-xs text-muted leading-relaxed">
            <Compass className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <span>
              Parameter di atas dikunci otomatis sesuai pedoman <strong>{selectedPreset.name}</strong>. Ingin mengubah? Pilih template "Kustom Mandiri".
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
