import {
  NeutralClassification,
  HypothesisStatus,
  EvidenceVerdict,
  ConfidenceLevel,
  DataSourceMode,
  ComparabilityStatus,
} from "./enums";

/**
 * Company entity definition.
 */
export interface Company {
  symbol: string;
  name: string;
  sector?: string;
  subSector?: string;
  industry?: string;
  subIndustry?: string;
  marketCap?: number;
}

/**
 * Annual historical financial snapshot.
 * Directly corresponds to Sectors report financials.historical_financials.
 */
export interface HistoricalFinancialRecord {
  year: number;
  revenue: number | null;
  earnings?: number | null;
  totalAssets?: number | null;
  totalEquity?: number | null;
}

/**
 * Company fundamental report data loaded from Sectors.
 */
export interface CompanyFundamentalData {
  symbol: string;
  name: string;
  industry?: string;
  subIndustry?: string;
  sector?: string;
  subSector?: string;
  historicalFinancials: HistoricalFinancialRecord[];
  yoyQuarterRevenueGrowth?: number | null;
  yoyQuarterEarningsGrowth?: number | null;
  sourceMode: DataSourceMode;
  retrievedAt: string;
}

/**
 * Computed financial metric value for a specific company.
 */
export interface MetricValue {
  symbol: string;
  metricName: string;
  value: number | null;
  formattedValue: string;
  baseYear?: number;
  targetYear?: number;
  periodLabel: string;
  unit: string;
  isValid: boolean;
  notes?: string;
}

/**
 * Detailed outlier detection assessment result.
 */
export interface OutlierResult {
  hasOutlier: boolean;
  targetSymbol: string;
  targetValue: number | null;
  peerValues: { symbol: string; value: number | null }[];
  peerMedian: number | null;
  peerMean: number | null;
  peerMin: number | null;
  peerMax: number | null;
  peerStdDev: number | null;
  deviationFromMedian: number | null;
  zScore: number | null;
  isHighOutlier: boolean;
  isLowOutlier: boolean;
  comparability: ComparabilityStatus;
  comparabilityDetails: string;
  warning?: string;
}

/**
 * Plausible explanation hypothesis formulated by the agent.
 */
export interface Hypothesis {
  id: string;
  category:
    | "REPORTING_PERIOD_MISMATCH"
    | "ONE_OFF_FINANCIAL_EVENT"
    | "BUSINESS_MIX_DIVERGENCE"
    | "DATA_QUALITY_ISSUE"
    | "PERSISTENT_OPERATIONAL_DIFFERENCE"
    | "ORGANIC_VS_INORGANIC_GROWTH";
  title: string;
  description: string;
  whyPlausible: string;
  requiredEvidence: string;
  status: HypothesisStatus;
  supportingEvidenceIds: string[];
  weakeningEvidenceIds: string[];
  qualitativeAssessment?: string;
  falsificationNotes?: string;
}

/**
 * Atomic piece of evidence gathered from Sectors or deterministic calculations.
 */
export interface EvidenceItem {
  id: string;
  title: string;
  source: string;
  sourceMode: DataSourceMode;
  endpointOrTool: string;
  timestamp: string;
  data: Record<string, unknown>;
  observation: string;
  verdict: EvidenceVerdict;
  targetHypothesisId: string;
  rationale: string;
  limitations?: string;
}

/**
 * An immutable ledger entry detailing the evidentiary audit trail.
 */
export interface EvidenceLedgerEntry {
  stepIndex: number;
  evidenceId: string;
  hypothesisId: string;
  hypothesisTitle: string;
  observation: string;
  sourceDataProvenance: string;
  verdict: EvidenceVerdict;
  confidence: ConfidenceLevel;
  remainingUncertainty: string;
}

/**
 * Audit trace event for agent observability.
 */
export interface AuditTraceStep {
  stepId: string;
  stepName: string;
  status: "STARTED" | "COMPLETED" | "WARNING" | "FAILED";
  timestamp: string;
  details: string;
  toolCall?: {
    toolName: string;
    params: Record<string, unknown>;
    resultSummary: string;
  };
}

/**
 * Top-level final analysis payload returned by the SignalLens Agent.
 */
export interface AnalysisResult {
  investigationId: string;
  targetCompany: Company;
  peerGroup: Company[];
  metricName: string;
  metricDefinition: string;
  outlierResult: OutlierResult;
  hypotheses: Hypothesis[];
  evidenceItems: EvidenceItem[];
  evidenceLedger: EvidenceLedgerEntry[];
  classification: NeutralClassification;
  confidence: ConfidenceLevel;
  classificationRationale: string;
  limitations: string[];
  unresolvedQuestions: string[];
  trace: AuditTraceStep[];
  sourceMode: DataSourceMode;
  stopReason: string;
  disclaimer: string;
  llmMetadata?: {
    model: string;
    callsMade: number;
    investigationStrategy?: string;
    qualitativeRationale?: string;
    challengeQuestions?: string[];
  };
}

/**
 * API request payload for starting an investigation.
 */
export interface InvestigationRequest {
  targetSymbol: string;
  peerSymbols: string[];
  metric?: string;
  mode?: "mock" | "live";
}
