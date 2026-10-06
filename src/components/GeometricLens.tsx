"use client";

import React from "react";

interface GeometricLensProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  interactive?: boolean;
}

export function GeometricLens({
  className = "",
  size = "md",
}: GeometricLensProps) {
  const sizeMap = {
    sm: "w-9 h-9",
    md: "w-14 h-14",
    lg: "w-28 h-28",
    hero: "w-44 h-44 sm:w-56 sm:h-56",
  };

  const isHero = size === "hero";

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 select-none pointer-events-none group ${sizeMap[size]} ${className}`}
      aria-hidden="true"
    >
      {/* 1. Deep Optical Backlight Halo (Subtle, non-gaming) */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-tr from-violet-600/20 via-indigo-500/15 to-transparent blur-2xl transition-opacity duration-1000 ${
          isHero ? "animate-pulse-halo" : "opacity-60"
        }`}
      />

      {/* 2. Concentric Orbit / Reticle Ring */}
      {isHero && (
        <div className="absolute inset-2 rounded-full border border-violet-500/15 border-dashed motion-safe:animate-[spin_60s_linear_infinite]" />
      )}

      {/* 3. 3D Geometric Crystal Structure with layered depth and refraction */}
      <div className={`relative w-full h-full flex items-center justify-center ${isHero ? "animate-float-lens" : ""}`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full relative z-10 drop-shadow-[0_12px_24px_rgba(79,70,229,0.18)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Primary Optical Refraction Gradients */}
            <linearGradient id="facetNorth" x1="100" y1="20" x2="40" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#818cf8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#4338ca" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="facetEast" x1="100" y1="20" x2="160" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ede9fe" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="facetSouthWest" x1="40" y1="100" x2="100" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4338ca" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#1e1b4b" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="facetSouthEast" x1="160" y1="100" x2="100" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#312e81" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.85" />
            </linearGradient>

            {/* Internal Core Refractive Facet */}
            <linearGradient id="facetCoreTop" x1="100" y1="52" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="facetCoreBottom" x1="100" y1="100" x2="100" y2="148" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3730a3" stopOpacity="0.7" />
            </linearGradient>

            {/* Specular Edge Filter */}
            <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Ambient Geometric Grid (Editorial Research Framing) */}
          <circle
            cx="100"
            cy="100"
            r="82"
            stroke="#475569"
            strokeWidth="0.75"
            strokeDasharray="3 4"
            strokeOpacity="0.25"
          />

          <circle
            cx="100"
            cy="100"
            r="55"
            stroke="#818cf8"
            strokeWidth="0.5"
            strokeDasharray="1 3"
            strokeOpacity="0.2"
          />

          {/* 1. Deep Crystal Back Facets (Translucent internal volume) */}
          <polygon
            points="100,20 100,100 40,100"
            fill="#312e81"
            fillOpacity="0.3"
          />
          <polygon
            points="100,20 100,100 160,100"
            fill="#4338ca"
            fillOpacity="0.35"
          />

          {/* 2. Outer Crystal Facets with Refraction */}
          {/* Top-Left Facet */}
          <polygon
            points="100,20 40,100 100,100"
            fill="url(#facetNorth)"
            stroke="#a78bfa"
            strokeWidth="0.85"
            strokeOpacity="0.7"
          />

          {/* Top-Right Facet (Specular Light Face) */}
          <polygon
            points="100,20 160,100 100,100"
            fill="url(#facetEast)"
            stroke="#c4b5fd"
            strokeWidth="1.1"
            strokeOpacity="0.85"
          />

          {/* Bottom-Left Facet */}
          <polygon
            points="40,100 100,180 100,100"
            fill="url(#facetSouthWest)"
            stroke="#6366f1"
            strokeWidth="0.85"
            strokeOpacity="0.6"
          />

          {/* Bottom-Right Facet */}
          <polygon
            points="160,100 100,180 100,100"
            fill="url(#facetSouthEast)"
            stroke="#818cf8"
            strokeWidth="0.85"
            strokeOpacity="0.75"
          />

          {/* 3. Central Octahedral Focus Lens (Inner Diamond Core) */}
          <polygon
            points="100,56 138,100 100,100"
            fill="url(#facetCoreTop)"
            stroke="#ffffff"
            strokeWidth="0.75"
            strokeOpacity="0.8"
          />
          <polygon
            points="100,56 62,100 100,100"
            fill="#c084fc"
            fillOpacity="0.45"
            stroke="#e0e7ff"
            strokeWidth="0.75"
            strokeOpacity="0.7"
          />
          <polygon
            points="62,100 100,144 100,100"
            fill="url(#facetCoreBottom)"
            stroke="#818cf8"
            strokeWidth="0.75"
            strokeOpacity="0.6"
          />
          <polygon
            points="138,100 100,144 100,100"
            fill="#4f46e5"
            fillOpacity="0.55"
            stroke="#a78bfa"
            strokeWidth="0.75"
            strokeOpacity="0.7"
          />

          {/* 4. Precision Optics Reticle / Lens Crosshairs */}
          <line x1="100" y1="8" x2="100" y2="28" stroke="#c4b5fd" strokeWidth="1" strokeOpacity="0.8" />
          <line x1="100" y1="172" x2="100" y2="192" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.6" />
          <line x1="16" y1="100" x2="36" y2="100" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.6" />
          <line x1="164" y1="100" x2="184" y2="100" stroke="#c4b5fd" strokeWidth="1" strokeOpacity="0.8" />

          {/* 5. Center Optical Focal Node */}
          <circle cx="100" cy="100" r="3" fill="#ffffff" fillOpacity="0.95" />
          <circle cx="100" cy="100" r="6" stroke="#c4b5fd" strokeWidth="0.75" strokeOpacity="0.6" />

          {/* 6. Light Dispersion Sparkles (Top apex) */}
          <circle cx="100" cy="20" r="2" fill="#ffffff" fillOpacity="0.9" />
          <circle cx="160" cy="100" r="1.5" fill="#ffffff" fillOpacity="0.8" />
        </svg>
      </div>
    </div>
  );
}
