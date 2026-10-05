"use client";

import React from "react";
import { Database, Globe, Terminal } from "lucide-react";

interface HeaderProps {
  mode: "mock" | "live";
  onModeChange: (mode: "mock" | "live") => void;
}

export function Header({ mode, onModeChange }: HeaderProps) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand Identity & Framing */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-md shadow-violet-950/40 shrink-0 border border-violet-500/30">
            <Terminal className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white font-mono">
                SignalLens
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-950/80 text-violet-300 border border-violet-800/60 font-mono font-semibold">
                Track 1: AI Agents
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800 font-mono hidden md:inline">
                Sectors REST v2
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Autonomous Investigation Agent for Peer Financial Differences
            </p>
          </div>
        </div>

        {/* Operational Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => onModeChange("mock")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === "mock"
                  ? "bg-slate-800 text-violet-300 font-semibold border border-slate-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              <span>Mock Fixtures</span>
              {mode === "mock" && (
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onModeChange("live")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === "live"
                  ? "bg-emerald-950 text-emerald-300 font-semibold border border-emerald-700/80 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Live Sectors REST v2</span>
              {mode === "live" && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
