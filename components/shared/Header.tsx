"use client";

import React from "react";
import { Zap, Moon, Sun } from "lucide-react";

interface HeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-accent-foreground shadow-sm">
            <Zap className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-foreground block">
              RapihinAI
            </span>
            <span className="text-[10px] text-muted tracking-wider block font-semibold uppercase">
              MVP v1.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#pricing"
            className="ios-spring px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent-light rounded-xl"
          >
            Lihat Harga
          </a>
          <button
            onClick={onToggleTheme}
            className="ios-spring p-2.5 rounded-xl border border-border text-foreground hover:bg-accent-light/50 active:scale-95"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
