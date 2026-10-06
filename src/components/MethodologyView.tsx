"use client";

import React from "react";
import {
  Database,
  Calculator,
  Compass,
  Lightbulb,
  FileCheck,
  Flame,
  ShieldCheck,
  BrainCircuit,
  Lock,
  ArrowRight,
} from "lucide-react";

export function MethodologyView() {
  const pipelineSteps = [
    {
      num: "01",
      name: "Data Ingestion & Provenance",
      icon: Database,
      authority: "Deterministic Engine",
      authorityColor: "text-cyan-400 bg-cyan-950/40 border-cyan-800",
      description:
        "Official fundamental statements are retrieved directly from the Sectors REST v2 API (GET /v2/company/report/{symbol}/?sections=overview,financials). Ingested records preserve authentic source provenance and raw API data integrity.",
      guardrail:
        "Zero synthetic data generation; live failures halt with explicit errors rather than silently falling back to mock fixtures.",
    },
    {
      num: "02",
      name: "Deterministic Analysis",
      icon: Calculator,
      authority: "Deterministic Engine",
      authorityColor: "text-cyan-400 bg-cyan-950/40 border-cyan-800",
      description:
        "Strict mathematical rate-of-change formulas compute Year-over-Year (YoY) revenue and earnings trajectories across all cohort members. Historical financials are parsed from audited statement lines.",
      guardrail:
        "Prohibits forward-looking analyst forecasts or speculation from being treated as historical fact.",
    },
    {
      num: "03",
      name: "Outlier Detection & Dispersion",
      icon: Compass,
      authority: "Deterministic Engine",
      authorityColor: "text-cyan-400 bg-cyan-950/40 border-cyan-800",
      description:
        "Calculates cohort median, arithmetic mean, standard deviation, and Z-score dispersion. Tests whether the subject company crosses the empirical threshold (±5.0% spread from median).",
      guardrail:
        "If no material deviation exists, the pipeline halts immediately with NO_MATERIAL_OUTLIER, preventing unnecessary narrative generation.",
    },
    {
      num: "04",
      name: "Targeted Hypotheses Formulation",
      icon: Lightbulb,
      authority: "LLM Cognitive Loop (Call 1)",
      authorityColor: "text-amber-400 bg-amber-950/40 border-amber-800",
      description:
        "Given the observed mathematical spread, the LLM proposes competing, falsifiable hypotheses (e.g. reporting period mismatch, one-off accounting item, organic vs inorganic growth, business mix shift) and selects verification tools from an allowlist.",
      guardrail:
        "Hypotheses are strictly categorized and marked as PENDING propositions. The LLM cannot declare truth or assert facts.",
    },
    {
      num: "05",
      name: "Evidence Testing & Verification",
      icon: FileCheck,
      authority: "Deterministic Tool Runner",
      authorityColor: "text-cyan-400 bg-cyan-950/40 border-cyan-800",
      description:
        "The runtime executes allowlisted deterministic tools locally against audited statements: verifying reporting period alignment, auditing operating earnings consistency, checking quarterly momentum, and examining multi-year CAGR.",
      guardrail:
        "LLMs cannot execute arbitrary network calls or bash scripts; tools operate solely on Sectors audited statements.",
    },
    {
      num: "06",
      name: "Falsification & Challenge",
      icon: Flame,
      authority: "LLM Cognitive Loop (Call 2)",
      authorityColor: "text-amber-400 bg-amber-950/40 border-amber-800",
      description:
        "The cognitive loop cross-examines leading explanations against verified empirical evidence. Specifically tests whether apparent growth was driven by isolated non-operating gains or one-off accounting spikes.",
      guardrail:
        "Adversarial falsification requires active refutation before any persistent divergence hypothesis can be accepted.",
    },
    {
      num: "07",
      name: "Locked Neutral Classification",
      icon: ShieldCheck,
      authority: "Deterministic Classifier",
      authorityColor: "text-emerald-400 bg-emerald-950/40 border-emerald-800",
      description:
        "A deterministic rule engine evaluates the final evidence states and maps them strictly to one of the five locked neutral classifications.",
      guardrail:
        "The LLM is structurally barred from selecting, altering, or hallucinating the final classification enum.",
    },
  ];

  const classifications = [
    {
      code: "NO_MATERIAL_OUTLIER",
      badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-700/80",
      condition: "Target company metric is within ±5.0% of cohort median.",
      implication:
        "Subject company behaves within normal industry peer dispersion. Agent stops early without inventing narratives.",
    },
    {
      code: "PERSISTENT_DIFFERENCE",
      badgeColor: "bg-violet-950 text-violet-300 border-violet-600/80",
      condition:
        "Outlier confirmed; one-off spikes refuted; aligned reporting periods verified; supported across multiple operating periods.",
      implication:
        "Empirically corroborated operational divergence grounded in recurring core fundamental growth.",
    },
    {
      code: "INCOMPARABLE_DATA",
      badgeColor: "bg-amber-950 text-amber-300 border-amber-700/80",
      condition: "Mismatched fiscal reporting periods or conflicting accounting bases.",
      implication:
        "Investigation halts immediately to prevent mathematically misleading cross-period comparisons (e.g. comparing FY2023 with FY2024).",
    },
    {
      code: "DATA_QUALITY_RISK",
      badgeColor: "bg-rose-950 text-rose-300 border-rose-700/80",
      condition: "Missing, null, corrupted, or internally inconsistent financial filing data.",
      implication:
        "Integrity guardrail flags data anomalies rather than silently coercing nulls to zero or inventing figures.",
    },
    {
      code: "INSUFFICIENT_EVIDENCE",
      badgeColor: "bg-indigo-950 text-indigo-300 border-indigo-700/80",
      condition:
        "Statistical deviation exists, but public disclosures cannot conclusively isolate the underlying cause.",
      implication:
        "Preserves epistemic neutrality and documents remaining uncertainty rather than fabricating an explanation.",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Header */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 lg:p-10 overflow-hidden shadow-2xl border border-white/10 space-y-4">
        <span className="text-[10px] font-mono uppercase tracking-wider text-violet-300 font-semibold block">
          Epistemic Boundary & Forensic Architecture
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight">
          SignalLens Investigation Methodology
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed font-sans">
          Financial research demands absolute separation between generative hypothesis formation and verifiable factual proof:{" "}
          <strong className="text-white font-medium">
            &quot;The LLM proposes explanations and investigation plans; deterministic code decides what the data actually proves.&quot;
          </strong>
        </p>
      </div>

      {/* The Epistemic Boundary (LLM vs Deterministic) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Generative LLM Territory */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-amber-500/30 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="p-2.5 rounded-2xl bg-amber-950/60 border border-amber-700/60 text-amber-300">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                Generative / Cognitive Role
              </span>
              <h3 className="text-lg font-bold text-white font-mono">
                Large Language Model (LLM)
              </h3>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            <p className="text-slate-400">
              The LLM acts as an investigative strategist and adversarial challenger within a bounded 2-call loop:
            </p>
            <ul className="space-y-2 pt-1">
              <li className="flex items-start gap-2.5">
                <ArrowRight className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Generates Hypotheses:</strong> Formulates plausible explanations for peer divergence.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ArrowRight className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Proposes Strategy:</strong> Requests verification tools from a strict allowlist.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ArrowRight className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Challenges Explanations:</strong> Questions whether anomalies are one-off paper spikes.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ArrowRight className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Qualitative Nuance:</strong> Synthesizes analytical observations while preserving uncertainty bounds.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Deterministic System Territory */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-cyan-500/30 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="p-2.5 rounded-2xl bg-cyan-950/60 border border-cyan-700/60 text-cyan-300">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                Verifiable Ground Truth
              </span>
              <h3 className="text-lg font-bold text-white font-mono">
                Deterministic System
              </h3>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            <p className="text-slate-400">
              Deterministic code maintains absolute authority over math, evidence execution, and final classification:
            </p>
            <ul className="space-y-2 pt-1">
              <li className="flex items-start gap-2.5">
                <ArrowRight className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Calculations:</strong> Precise arithmetic rate-of-change and dispersion metrics.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ArrowRight className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Evidence Validation:</strong> Executes allowlisted verification tools against raw statements.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ArrowRight className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Period Compatibility:</strong> Enforces fiscal year alignment before comparisons.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ArrowRight className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Outlier Determination:</strong> Objective Z-score and median spread thresholds.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ArrowRight className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Final Classification:</strong> Locks verdict into 5 neutral enums without LLM intervention.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* The 7-Stage Pipeline Breakdown */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 lg:p-10 overflow-hidden shadow-2xl border border-white/10 space-y-6">
        <div className="pb-4 border-b border-white/10">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
            End-to-End Execution Sequence
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white font-mono mt-1">
            The 7-Stage Investigation Pipeline
          </h3>
        </div>

        <div className="space-y-4">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-violet-500/30 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-violet-300">
                      {step.num}
                    </span>
                    <Icon className="h-4 w-4 text-violet-400" />
                    <h4 className="text-sm sm:text-base font-semibold text-white font-mono">
                      {step.name}
                    </h4>
                  </div>
                  <span
                    className={`inline-block text-[10px] font-mono px-2.5 py-1 rounded-full border uppercase font-bold self-start sm:self-auto ${step.authorityColor}`}
                  >
                    {step.authority}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {step.description}
                </p>

                <div className="text-xs font-mono text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-white/5">
                  <strong className="text-slate-300">Guardrail:</strong> {step.guardrail}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The 5 Neutral Classifications */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 lg:p-10 overflow-hidden shadow-2xl border border-white/10 space-y-6">
        <div className="pb-4 border-b border-white/10">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
            Objective Non-Advisory Verdicts
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white font-mono mt-1">
            The 5 Locked Neutral Classifications
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
            SignalLens does not provide buy/sell signals, target prices, or speculative opinions. It delivers only verified forensic classifications.
          </p>
        </div>

        <div className="space-y-4">
          {classifications.map((c) => (
            <div
              key={c.code}
              className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span
                  className={`inline-block px-3 py-1 rounded-lg text-xs font-bold font-mono border self-start ${c.badgeColor}`}
                >
                  {c.code}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Trigger: {c.condition}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {c.implication}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
