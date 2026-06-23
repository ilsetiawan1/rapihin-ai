"use client";

import React, { useState } from "react";
import Link from "next/link";
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

  const openLogin = () => { setAuthTab("login"); setShowAuth(true); };
  const openRegister = () => { setAuthTab("register"); setShowAuth(true); };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-md">
        <div className="w-full flex items-center justify-between h-16 px-4 md:px-6">

          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 -ml-2 rounded-xl text-muted hover:text-foreground hover:bg-accent-light/50 transition-colors"
                title="Toggle Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <button onClick={onLogoClick} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity text-left">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-accent-foreground shadow-sm shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-foreground block">
                  RapihinAI
                </span>
                <span className="text-[10px] text-muted tracking-wider block font-semibold uppercase">
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
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-accent text-white hover:opacity-90 rounded-xl transition-all shadow-sm shadow-accent/20 active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                Masuk
              </button>
            )}

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
