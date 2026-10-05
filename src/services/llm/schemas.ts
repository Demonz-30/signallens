import { Hypothesis } from "@/domain";

export type AllowlistedToolName =
  | "verify_period_alignment"
  | "audit_financial_line_items"
  | "audit_operating_earnings"
  | "audit_quarterly_momentum"
  | "audit_multi_period_cagr"
  | "check_segment_disclosures";

export const ALLOWLISTED_TOOLS: readonly AllowlistedToolName[] = [
  "verify_period_alignment",
  "audit_financial_line_items",
  "audit_operating_earnings",
  "audit_quarterly_momentum",
  "audit_multi_period_cagr",
  "check_segment_disclosures",
] as const;

export function isAllowlistedTool(tool: string): tool is AllowlistedToolName {
  return (ALLOWLISTED_TOOLS as readonly string[]).includes(tool);
}

export type HypothesisCategory = Hypothesis["category"];

export const ALLOWED_HYPOTHESIS_CATEGORIES: readonly HypothesisCategory[] = [
  "REPORTING_PERIOD_MISMATCH",
  "ONE_OFF_FINANCIAL_EVENT",
  "BUSINESS_MIX_DIVERGENCE",
  "DATA_QUALITY_ISSUE",
  "PERSISTENT_OPERATIONAL_DIFFERENCE",
  "ORGANIC_VS_INORGANIC_GROWTH",
] as const;

/**
 * Call 1 Output: Candidate hypotheses, requested verification tools, and challenge questions.
 */
export interface HypothesizeAndPlanOutput {
  hypotheses: Array<{
    id: string;
    category: HypothesisCategory;
    title: string;
    description: string;
    whyPlausible: string;
    targetToolExecution: AllowlistedToolName;
  }>;
  challengeQuestions: string[];
  investigationStrategy: string;
}

export const HYPOTHESIZE_AND_PLAN_SCHEMA = {
  type: "object",
  properties: {
    hypotheses: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          category: {
            type: "string",
            enum: ALLOWED_HYPOTHESIS_CATEGORIES,
          },
          title: { type: "string" },
          description: { type: "string" },
          whyPlausible: { type: "string" },
          targetToolExecution: {
            type: "string",
            enum: ALLOWLISTED_TOOLS,
          },
        },
        required: [
          "id",
          "category",
          "title",
          "description",
          "whyPlausible",
          "targetToolExecution",
        ],
        additionalProperties: false,
      },
    },
    challengeQuestions: {
      type: "array",
      items: { type: "string" },
    },
    investigationStrategy: { type: "string" },
  },
  required: ["hypotheses", "challengeQuestions", "investigationStrategy"],
  additionalProperties: false,
};

/**
 * Call 2 Output: Falsification assessment against verified evidence.
 */
export interface ChallengeAndReviseOutput {
  hypothesisAssessments: Array<{
    hypothesisId: string;
    evaluatedEvidenceIds: string[];
    evidentiaryAssessment:
      | "STRONGLY_SUPPORTED"
      | "REFUTED_BY_EVIDENCE"
      | "INCONCLUSIVE_DATA";
    falsificationNotes: string;
  }>;
  qualitativeInvestigationRationale: string;
  remainingUncertainties: string[];
  investigationLimitations: string[];
}

export const CHALLENGE_AND_REVISE_SCHEMA = {
  type: "object",
  properties: {
    hypothesisAssessments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          hypothesisId: { type: "string" },
          evaluatedEvidenceIds: {
            type: "array",
            items: { type: "string" },
          },
          evidentiaryAssessment: {
            type: "string",
            enum: [
              "STRONGLY_SUPPORTED",
              "REFUTED_BY_EVIDENCE",
              "INCONCLUSIVE_DATA",
            ],
          },
          falsificationNotes: { type: "string" },
        },
        required: [
          "hypothesisId",
          "evaluatedEvidenceIds",
          "evidentiaryAssessment",
          "falsificationNotes",
        ],
        additionalProperties: false,
      },
    },
    qualitativeInvestigationRationale: { type: "string" },
    remainingUncertainties: {
      type: "array",
      items: { type: "string" },
    },
    investigationLimitations: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: [
    "hypothesisAssessments",
    "qualitativeInvestigationRationale",
    "remainingUncertainties",
    "investigationLimitations",
  ],
  additionalProperties: false,
};
