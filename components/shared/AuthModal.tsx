"use client";

import React, { useState } from "react";
import { X, Zap } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.2c-.6 3-2.4 5.6-4.9 7.3v6h7.9c4.7-4.3 7.3-10.6 7.3-17.6z" fill="#4285F4"/>
      <path d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.3-8 2.3-6.2 0-11.4-4.2-13.3-9.8H2.5v6.2C6.5 42.9 14.7 48 24 48z" fill="#34A853"/>
      <path d="M10.7 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.3.8-4.7V13H2.5C.9 16.2 0 19.9 0 24s.9 7.8 2.5 11l8.2-6.3z" fill="#FBBC05"/>
      <path d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.8-6.8C35.9 2.1 30.5 0 24 0 14.7 0 6.5 5.1 2.5 13l8.2 6.2C12.6 13.7 17.8 9.5 24 9.5z" fill="#EA4335"/>
    </svg>
  );
}

import { signIn } from "next-auth/react";

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Gradient Top Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-accent via-accent/60 to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-muted hover:text-foreground hover:bg-accent-light/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-8 py-10 flex flex-col items-center gap-6">

          {/* Logo & Title */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-accent text-accent-foreground shadow-lg mb-1">
              <Zap className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">Selamat Datang</h2>
            <p className="text-sm text-muted leading-relaxed max-w-[220px]">
              Masuk atau daftar ke <strong>RapihinAI</strong> dengan akun Google kamu
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-border" />

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-5 bg-background border-2 border-border hover:border-accent/50 rounded-2xl text-sm font-bold text-foreground hover:bg-accent-light/20 active:scale-98 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-muted/40 border-t-accent rounded-full animate-spin" />
                <span className="text-muted">Menghubungkan...</span>
              </>
            ) : (
              <>
                <GoogleIcon />
                Lanjutkan dengan Google
              </>
            )}
          </button>

          {/* Terms */}
          <p className="text-[11px] text-muted text-center leading-relaxed">
            Dengan masuk, kamu menyetujui{" "}
            <span className="text-accent font-semibold cursor-pointer hover:underline">Syarat Layanan</span>{" "}
            dan{" "}
            <span className="text-accent font-semibold cursor-pointer hover:underline">Kebijakan Privasi</span>{" "}
            RapihinAI.
          </p>
        </div>
      </div>
    </div>
  );
}
