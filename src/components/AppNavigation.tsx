"use client";

import React, { useState } from "react";
import {
  Search,
  FileText,
  BookOpen,
  Menu,
  X,
  Database,
  Globe,
} from "lucide-react";
import { GeometricLens } from "./GeometricLens";

export type NavTab = "investigate" | "evidence" | "methodology";

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  mode: "mock" | "live";
  onModeChange: (mode: "mock" | "live") => void;
}

export function DesktopSidebar({
  activeTab,
  onTabChange,
  mode,
  onModeChange,
}: NavigationProps) {
  const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: "investigate", label: "Investigate", icon: Search },
    { id: "evidence", label: "Evidence Ledger", icon: FileText },
    { id: "methodology", label: "Methodology", icon: BookOpen },
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 glass-panel border-r border-white/10 p-5 shrink-0 h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3.5 px-1 py-1">
          <GeometricLens size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-base text-white tracking-tight">
                SignalLens
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-violet-950/80 text-violet-300 border border-violet-800/60 font-bold">
                v2
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans tracking-tight">
              Peer Outlier Audit Agent
            </p>
          </div>
        </div>

        {/* 3 Core Navigation Items */}
        <nav className="mt-8 space-y-1.5">
          <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-3">
            Core Navigation
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-mono text-xs transition-all cursor-pointer text-left ${
                  isActive
                    ? "bg-violet-950/70 text-violet-200 border border-violet-700/60 font-semibold shadow-lg shadow-violet-950/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? "text-violet-400" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.9)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Operational Mode Toggle & Subtext */}
      <div className="space-y-4 pt-5 border-t border-white/10">
        <div>
          <span className="px-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-2.5">
            Data Source Mode
          </span>
          <div className="bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 text-xs font-mono space-y-1">
            <button
              type="button"
              onClick={() => onModeChange("mock")}
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                mode === "mock"
                  ? "bg-slate-800 text-violet-300 font-semibold border border-white/10 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <Database className="h-3.5 w-3.5" />
                <span className="text-[11px]">Mock Fixtures</span>
              </div>
              {mode === "mock" && (
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onModeChange("live")}
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                mode === "live"
                  ? "bg-emerald-950 text-emerald-300 font-semibold border border-emerald-700/80 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5" />
                <span className="text-[11px]">Live Sectors REST</span>
              </div>
              {mode === "live" && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        <div className="px-1 text-[10px] text-slate-500 font-mono leading-tight">
          Track 1 · Sectors AI Agents
          <br />
          Deterministic Evidence Core
        </div>
      </div>
    </aside>
  );
}

export function MobileHeader({
  activeTab,
  onTabChange,
  mode,
  onModeChange,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: "investigate", label: "Investigate", icon: Search },
    { id: "evidence", label: "Evidence Ledger", icon: FileText },
    { id: "methodology", label: "Methodology", icon: BookOpen },
  ];

  const handleSelect = (tab: NavTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="lg:hidden border-b border-white/10 glass-panel sticky top-0 z-50 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Brand with compact lens */}
        <div className="flex items-center gap-3">
          <GeometricLens size="sm" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-sm text-white">
                SignalLens
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-violet-950 text-violet-300 border border-violet-800">
                v2
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {activeTab === "investigate" && "Investigate"}
              {activeTab === "evidence" && "Evidence Ledger"}
              {activeTab === "methodology" && "Methodology"}
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Compact Mode Pill */}
          <button
            type="button"
            onClick={() => onModeChange(mode === "mock" ? "live" : "mock")}
            className="flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1.5 rounded-xl border bg-slate-900 border-white/10 text-slate-300"
          >
            {mode === "live" ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live REST</span>
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                <span>Mock Data</span>
              </>
            )}
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-white/10 bg-slate-900 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="mt-3 pt-3 border-t border-white/10 space-y-3 animate-fadeIn">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-mono text-xs transition-all ${
                    isActive
                      ? "bg-violet-950/80 text-violet-200 border border-violet-800 font-semibold"
                      : "text-slate-400 hover:text-slate-200 bg-slate-900/40 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mode Switch in Mobile Menu */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 text-[11px]">Active Mode:</span>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => onModeChange("mock")}
                className={`px-3 py-1 rounded-lg text-[10px] ${
                  mode === "mock"
                    ? "bg-slate-800 text-violet-300 font-bold"
                    : "text-slate-400"
                }`}
              >
                Mock
              </button>
              <button
                type="button"
                onClick={() => onModeChange("live")}
                className={`px-3 py-1 rounded-lg text-[10px] ${
                  mode === "live"
                    ? "bg-emerald-950 text-emerald-300 font-bold"
                    : "text-slate-400"
                }`}
              >
                Live REST
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
