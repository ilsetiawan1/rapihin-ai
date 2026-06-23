"use client";

import React, { useState } from "react";
import { Zap, Moon, Sun, Menu, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import AuthModal from "./AuthModal";

interface HeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onToggleSidebar?: () => void;
  onLogoClick?: () => void;
}

export default function Header({ theme, onToggleTheme, onToggleSidebar, onLogoClick }: HeaderProps) {
  const { data: session } = useSession();
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  const openLogin = () => {
    setAuthTab("login");
    setShowAuth(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full pt-4 px-4 md:px-8 bg-transparent pointer-events-none">
        {/* Floating Capsule with Navy Dark background in both themes for supreme look */}
        <div className="pointer-events-auto max-w-7xl mx-auto bg-[#0a1128]/90 backdrop-blur-xl border border-white/10 rounded-full px-5 md:px-6 py-3.5 flex items-center justify-between shadow-xl shadow-black/20 text-white">
          
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Toggle Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={onLogoClick}
              className="flex items-center gap-2.5 hover:opacity-85 transition-opacity text-left cursor-pointer"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white shadow-sm shrink-0">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-white block">
                  RapihinAI
                </span>
                <span className="text-[9px] text-slate-400 tracking-wider block font-semibold uppercase leading-none mt-0.5">
                  MVP v1.0
                </span>
              </div>
            </button>
          </div>

          {/* Right: Auth Buttons + Theme Toggle */}
          <div className="flex items-center gap-2">
            {!session && (
              <button
                onClick={openLogin}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-accent hover:bg-accent/90 text-white rounded-full transition-all shadow-md shadow-accent/25 active:scale-95 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                Masuk
              </button>
            )}

            <button
              onClick={onToggleTheme}
              className="ios-spring p-2 rounded-full border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultTab={authTab}
      />
    </>
  );
}
