"use client";

import React, { useState } from "react";
import { AuditTraceStep } from "@/domain";
import {
  ChevronDown,
  ChevronRight,
  Terminal,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  BrainCircuit,
  Activity,
} from "lucide-react";

interface AuditTimelineProps {
  trace: AuditTraceStep[];
}

interface StepSemantic {
  stage:
    | "ACTION"
    | "OBSERVATION"
    | "ANALYSIS"
    | "DETECTION"
    | "PLAN"
    | "CHALLENGE"
    | "CONCLUSION";
  label: string;
  isCognitive: boolean;
  color: string;
}

function resolveStepSemantic(step: AuditTraceStep): StepSemantic {
  const sid = step.stepId;
  const isStarted = step.status === "STARTED";

  if (sid.includes("STEP_01")) {
    return {
      stage: "ACTION",
      label: "Validate Investigation Scope & Cohort",
      isCognitive: false,
      color: "border-slate-700 text-slate-300 bg-slate-900/60",
    };
  }
  if (sid.includes("STEP_02")) {
    return isStarted
      ? {
          stage: "ACTION",
          label: "Query Sectors Fundamentals",
          isCognitive: false,
          color: "border-cyan-800 text-cyan-300 bg-cyan-950/40",
        }
      : {
          stage: "OBSERVATION",
          label: "Audited Fundamentals Ingested",
          isCognitive: false,
          color: "border-blue-800 text-blue-300 bg-blue-950/40",
        };
  }
  if (sid.includes("STEP_03")) {
    return isStarted
      ? {
          stage: "ANALYSIS",
          label: "Revenue Growth Calculated Deterministically",
          isCognitive: false,
          color: "border-indigo-800 text-indigo-300 bg-indigo-950/40",
        }
      : {
          stage: "DETECTION",
          label: "Peer Outlier Dispersion Evaluated",
          isCognitive: false,
          color: "border-purple-800 text-purple-300 bg-purple-950/40",
        };
  }
  if (sid.includes("STEP_04")) {
    return {
      stage: "PLAN",
      label: "Hypotheses & Tool Requests Formulated (Call 1)",
      isCognitive: true,
      color: "border-amber-800 text-amber-300 bg-amber-950/40",
    };
  }
  if (sid.includes("STEP_05")) {
    return {
      stage: "CHALLENGE",
      label: "Falsifying Leading Explanations (Call 2)",
      isCognitive: true,
      color: "border-orange-800 text-orange-300 bg-orange-950/40",
    };
  }
  if (sid.includes("STEP_06")) {
    return {
      stage: "OBSERVATION",
      label: "Evidence Ledger Provenance Verified",
      isCognitive: false,
      color: "border-teal-800 text-teal-300 bg-teal-950/40",
    };
  }
  if (sid.includes("STEP_07")) {
    return {
      stage: "CONCLUSION",
      label: "Deterministic Classification Locked",
      isCognitive: false,
      color: "border-emerald-800 text-emerald-300 bg-emerald-950/40",
    };
  }

  return {
    stage: "ACTION",
    label: step.stepName,
    isCognitive: false,
    color: "border-slate-800 text-slate-300 bg-slate-900/60",
  };
}

export function AuditTimeline({ trace }: AuditTimelineProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-3xl glass-panel p-6 sm:p-8 overflow-hidden shadow-2xl border border-white/10 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-violet-400" />
            <h3 className="text-base sm:text-lg font-bold text-white font-mono tracking-tight">
              Agent Execution Audit Trace ({trace.length} State Transitions)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Authentic provenance log: query $\rightarrow$ deterministic detection $\rightarrow$ cognitive plan $\rightarrow$ empirical falsification $\rightarrow$ locked verdict.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-950 text-violet-300 border border-white/10">
            Autonomous Investigation Instrument
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-white/5 transition-colors cursor-pointer"
            title={isOpen ? "Collapse trace" : "Expand trace"}
          >
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-3 font-mono text-xs">
          {trace.map((step, idx) => {
            const semantic = resolveStepSemantic(step);
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-white/20 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    {step.status === "COMPLETED" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : step.status === "WARNING" ? (
                      <AlertCircle className="h-4 w-4 text-amber-400" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${semantic.color}`}
                      >
                        {semantic.stage}
                      </span>
                      <span className="text-white font-semibold text-xs font-mono">
                        {semantic.label}
                      </span>
                      {semantic.isCognitive && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-sans">
                          <BrainCircuit className="h-3 w-3" /> Cognitive Loop
                        </span>
                      )}
                      {!semantic.isCognitive && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-sans">
                          <ShieldCheck className="h-3 w-3" /> Deterministic
                        </span>
                      )}
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed font-sans">
                      {step.details}
                    </p>

                    {step.toolCall && (
                      <div className="mt-2.5 p-3 rounded-xl bg-slate-900/90 border border-white/5 text-[11px] text-slate-300 space-y-1">
                        <div className="flex items-center gap-1.5 text-cyan-300 font-semibold font-mono">
                          <Terminal className="h-3.5 w-3.5" />
                          <span>Tool Invocation: {step.toolCall.toolName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 overflow-x-auto font-mono">
                          params: {JSON.stringify(step.toolCall.params)}
                        </div>
                        {step.toolCall.resultSummary && (
                          <div className="text-[10px] text-slate-300 italic font-mono">
                            result: {step.toolCall.resultSummary}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 whitespace-nowrap self-end md:self-start shrink-0 font-mono">
                  {new Date(step.timestamp).toLocaleTimeString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
