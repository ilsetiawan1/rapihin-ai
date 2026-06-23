"use client";

import React, { useState } from "react";
import { Plus, MessageSquare, Trash2, User, Zap, LogOut, Settings, HelpCircle, Moon, Sun, ChevronUp } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import PricingModal from "./PricingModal";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat?: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

const DUMMY_HISTORY = [
  { id: 1, title: "Format Skripsi Telkom", date: "Hari Ini" },
  { id: 2, title: "Revisi Margin Bab 1-3", date: "Hari Ini" },
  { id: 3, title: "Draft Jurnal AI", date: "Kemarin" },
  { id: 4, title: "Tugas Akhir Final", date: "7 Hari Lalu" },
  { id: 5, title: "Laporan KP Format", date: "7 Hari Lalu" },
];

export default function Sidebar({ isOpen, onToggle, onNewChat, theme, onToggleTheme }: SidebarProps) {
  const { data: session } = useSession();
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-full bg-card transition-all duration-300 flex flex-col shrink-0 overflow-hidden
          ${isOpen ? "w-[260px] translate-x-0 border-r border-border" : "w-0 -translate-x-full border-r-0"}
        `}
      >
        {/* Top Header */}
        <div className="h-16 flex items-center px-5 shrink-0 border-b border-border/50">
          <span className="font-bold text-xs tracking-widest text-muted uppercase">
            Menu
          </span>
        </div>

        {/* Main List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar py-4 px-3 flex flex-col gap-5">
          
          {/* Chat Baru Button */}
          <button 
            onClick={() => onNewChat && onNewChat()}
            className="flex items-center justify-center gap-2 w-full px-3 py-2.5 bg-accent text-accent-foreground rounded-xl text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Chat Baru</span>
          </button>

          {/* History List */}
          <div className="flex flex-col gap-2">
            <span className="px-2 text-[10px] font-bold tracking-widest text-muted uppercase">Riwayat Berkas</span>
            <div className="flex flex-col gap-1">
              {DUMMY_HISTORY.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    activeChat === chat.id 
                      ? "bg-accent/10 text-accent font-semibold shadow-sm" 
                      : "text-foreground hover:bg-accent-light/30 hover:text-accent font-medium"
                  }`}
                >
                  <MessageSquare className={`w-4 h-4 shrink-0 ${activeChat === chat.id ? "text-accent" : "text-muted group-hover:text-accent"}`} />
                  <div className="flex-1 flex flex-col items-start overflow-hidden">
                    <span className="text-sm truncate w-full text-left leading-tight">{chat.title}</span>
                    <span className={`text-[10px] mt-0.5 ${activeChat === chat.id ? "text-accent/70" : "text-muted"}`}>{chat.date}</span>
                  </div>
                  {activeChat === chat.id && (
                    <Trash2 className="w-3.5 h-3.5 text-muted hover:text-error shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Profile Section */}
        <div className="p-3 border-t border-border/50 bg-background/50 flex flex-col gap-2 relative">
          
          {/* Profile Menu Popover */}
          {showProfileMenu && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-card border border-border rounded-xl shadow-lg p-2 flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 z-50">
              <button className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent-light/30 rounded-lg transition-colors text-left">
                <Settings className="w-4 h-4 text-muted" />
                Pengaturan
              </button>
              <button className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent-light/30 rounded-lg transition-colors text-left">
                <HelpCircle className="w-4 h-4 text-muted" />
                Bantuan
              </button>
              <button 
                onClick={onToggleTheme}
                className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent-light/30 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  {theme === "light" ? <Moon className="w-4 h-4 text-muted" /> : <Sun className="w-4 h-4 text-muted" />}
                  Tema
                </div>
                <span className="text-[10px] uppercase font-bold text-muted bg-border px-1.5 py-0.5 rounded">{theme}</span>
              </button>
              
              {session && (
                <>
                  <div className="h-px bg-border/50 my-1 mx-2" />
                  <button 
                    onClick={() => signOut()}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-error hover:bg-error/10 rounded-lg transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </>
              )}
            </div>
          )}

          {/* User Info (Clickable) */}
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`flex items-center gap-3 px-2 py-2 rounded-xl transition-colors cursor-pointer ${showProfileMenu ? "bg-accent-light/50" : "hover:bg-accent-light/30"}`}
          >
            {session?.user?.image ? (
              <img src={session.user.image} alt="User" className="w-9 h-9 rounded-full object-cover shrink-0 border border-accent/30" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 border border-accent/30">
                <User className="w-4.5 h-4.5" />
              </div>
            )}
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-sm font-bold text-foreground truncate">
                {session?.user?.name || "Guest"}
              </span>
              <span className="text-[10px] text-muted font-medium uppercase tracking-wider">
                {session ? "Free Plan" : "Free"}
              </span>
            </div>
            <ChevronUp className={`w-4 h-4 text-muted transition-transform shrink-0 ${showProfileMenu ? "rotate-180" : ""}`} />
          </div>
          
          {/* Upgrade Button */}
          <button 
            onClick={() => setIsPricingOpen(true)}
            className="w-full py-2.5 flex items-center justify-center gap-1.5 rounded-xl border border-accent/50 bg-accent-light/10 text-accent text-xs font-bold hover:bg-accent hover:text-white transition-all shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" /> 
            Upgrade Pro
          </button>
        </div>
      </aside>
    </>
  );
}
