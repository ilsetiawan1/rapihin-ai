"use client";

import React, { useState } from "react";
import { Plus, MessageSquare, Trash2, User, Zap, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const DUMMY_HISTORY = [
  { id: 1, title: "Format Skripsi Telkom", date: "Hari Ini" },
  { id: 2, title: "Revisi Margin Bab 1-3", date: "Hari Ini" },
  { id: 3, title: "Draft Jurnal AI", date: "Kemarin" },
  { id: 4, title: "Tugas Akhir Final", date: "7 Hari Lalu" },
  { id: 5, title: "Laporan KP Format", date: "7 Hari Lalu" },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { data: session } = useSession();
  const [activeChat, setActiveChat] = useState<number | null>(null);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}

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
          <button className="flex items-center justify-center gap-2 w-full px-3 py-2.5 bg-accent text-accent-foreground rounded-xl text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Chat Baru</span>
          </button>

          {/* History List */}
          <div>
            <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider px-2 mb-2">History</h4>
            <div className="flex flex-col gap-1">
              {DUMMY_HISTORY.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`group flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-colors
                    ${activeChat === chat.id ? "bg-accent-light/50 text-foreground font-medium" : "text-muted hover:bg-accent-light/30 hover:text-foreground"}
                  `}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MessageSquare className="w-4 h-4 shrink-0 opacity-70" />
                    <span className="truncate text-left text-[13px]">{chat.title}</span>
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
        <div className="p-3 border-t border-border/50 bg-background/50">
          {/* User Info */}
          <div className="flex items-center gap-3 px-2 py-2 mb-3 rounded-xl hover:bg-accent-light/30 transition-colors cursor-pointer">
            {session?.user?.image ? (
              <img src={session.user.image} alt="User" className="w-9 h-9 rounded-full object-cover shrink-0 border border-accent/30" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 border border-accent/30">
                <User className="w-4.5 h-4.5" />
              </div>
            )}
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-sm font-bold text-foreground truncate">
                {session?.user?.name || "Mahasiswa"}
              </span>
              <span className="text-[10px] text-muted font-medium uppercase tracking-wider">
                {session ? "Free Plan" : "Belum Login"}
              </span>
            </div>
          </div>
          
          {/* Action Button */}
          {session ? (
            <button 
              onClick={() => signOut()}
              className="w-full py-2.5 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background text-muted text-xs font-bold hover:bg-error/10 hover:text-error hover:border-error/30 transition-all shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" /> 
              Keluar
            </button>
          ) : (
            <button className="w-full py-2.5 flex items-center justify-center gap-1.5 rounded-xl border border-accent/50 bg-accent-light/10 text-accent text-xs font-bold hover:bg-accent hover:text-white transition-all shadow-sm">
              <Zap className="w-3.5 h-3.5" /> 
              Upgrade Pro
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
