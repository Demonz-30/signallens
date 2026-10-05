/**
 * SignalLens Domain Enums
 * Strictly aligned with Hackathon Product and Agent Behavior Specifications.
 */

/**
 * The 5 locked neutral final classifications.
 * Prohibited from being extended or altered by LLM hallucinations.
 */
export enum NeutralClassification {
  NO_MATERIAL_OUTLIER = "NO_MATERIAL_OUTLIER",
  PERSISTENT_DIFFERENCE = "PERSISTENT_DIFFERENCE",
  INCOMPARABLE_DATA = "INCOMPARABLE_DATA",
  DATA_QUALITY_RISK = "DATA_QUALITY_RISK",
  INSUFFICIENT_EVIDENCE = "INSUFFICIENT_EVIDENCE",
}

/**
 * Status of a hypothesis during agent falsification loop.
 */
export enum HypothesisStatus {
  PENDING = "PENDING",
  TESTING = "TESTING",
  SUPPORTED = "SUPPORTED",
  REJECTED = "REJECTED",
  UNRESOLVED = "UNRESOLVED",
}

/**
 * Impact / verdict of an evidence item on a tested hypothesis.
 */
export enum EvidenceVerdict {
  SUPPORTED = "SUPPORTED",
  WEAKENED = "WEAKENED",
  INCONCLUSIVE = "INCONCLUSIVE",
  UNAVAILABLE = "UNAVAILABLE",
}

/**
 * Degree of confidence in the final classification or evidence item.
 */
export enum ConfidenceLevel {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

/**
 * Data source provenance indicator.
 */
export enum DataSourceMode {
  MOCK = "MOCK",
  SECTORS_REST = "SECTORS_REST",
}

/**
 * Comparability status for reporting periods and currency/units.
 */
export enum ComparabilityStatus {
  ALIGNED = "ALIGNED",
  MISMATCHED_PERIODS = "MISMATCHED_PERIODS",
  INSUFFICIENT_HISTORY = "INSUFFICIENT_HISTORY",
  UNIT_MISMATCH = "UNIT_MISMATCH",
  MISSING_DATA = "MISSING_DATA",
}
