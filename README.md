# SignalLens — Peer Outlier Explanation & Audit Agent

> **Sectors Hackathon 2026** · Track 1 · AI Agents & AI Assistants  
> *Deterministic Peer Outlier Falsification & Cognitive Evidence Audit Agent for Indonesian Public Companies (IDX).*

> **Core Positioning:**  
> *"SignalLens investigates unusual peer differences and shows what the evidence can — and cannot — prove."*  
> *"SignalLens doesn't tell you what to invest in. It tells you what the data can actually prove."*

---

## 1. What is SignalLens?

**SignalLens** is an autonomous forensic financial investigation agent designed to audit and explain unusual peer discrepancies in equity fundamentals. When a company appears radically different from its industry cohort (e.g. an apparent revenue surge while peers grow modestly or contract), human analysts face hundreds of pages of exchange filings, while generic conversational AI models eagerly hallucinate speculative narratives.

SignalLens replaces ungrounded AI chat with a **bounded cognitive falsification loop**:
1. It ingests official fundamental reports directly from the **Sectors REST API v2**.
2. It deterministically calculates historical rate-of-change metrics and verifies peer dispersion bounds.
3. It utilizes a **bounded 2-call LLM cognitive loop** via the **OpenAI Responses API** to formulate competing, falsifiable hypotheses, request verification tools from a strict allowlist, and challenge those hypotheses.
4. It executes allowlisted verification tools locally against audited fundamentals.
5. It compiles an audit-grade **Evidence Ledger** with provenance tags.
6. A deterministic classifier locks the outcome into one of **five neutral classifications**.

> **The Epistemic Rule of SignalLens:**  
> *"The LLM proposes explanations and investigation plans. Deterministic code tests what the available data can actually support."*

---

## 2. Why SignalLens is an AI Agent (Not a Dashboard or Chatbot)

SignalLens is architected as an autonomous goal-directed investigation agent:

- **Autonomous Multi-Stage Pipeline:** Given a target company and peer cohort, the agent decides what hypotheses to formulate, plans which verification tools to dispatch, cross-examines findings against empirical evidence, and synthesizes an audit-grade ledger.
- **Bounded Cognitive Loop:** Uses a strict, non-recursive 2-call architecture (Call 1: Hypothesize & Plan $\rightarrow$ Deterministic Evidence Execution $\rightarrow$ Call 2: Challenge & Revise).
- **Strict Allowlisted Tool Execution:** The LLM cannot execute arbitrary code or browse the open web. It requests tools from a locked allowlist (`verify_period_alignment`, `audit_financial_line_items`, `audit_operating_earnings`, `audit_quarterly_momentum`, `audit_multi_period_cagr`, `check_segment_disclosures`).
- **Epistemic Authority Separation:** LLMs are prone to hallucinating financial certainty. SignalLens solves this by separating **hypothesis proposal** (LLM) from **factual verification and classification** (deterministic code).

---

## 3. Sectors API: The Source of Truth

**Sectors is the core external data source for SignalLens.** SignalLens never fabricates financial data, company reports, or API responses.

- **Endpoint Used:** `GET https://api.sectors.app/v2/company/report/{symbol}/?sections=overview,financials`
- **Authentication Method:** `Authorization: <SECTORS_API_KEY>` (Official Sectors REST v2 header format without `Bearer` prefix)
- **Zero API Quota Waste:** Data is retrieved once per company per investigation and cached in memory. The LLM layer introduces **zero additional Sectors API calls**.
- **Live Failure Isolation:** If the Sectors API request fails (e.g. network disconnect, invalid key, 401/403/404/429/500), the investigation halts with an explicit error. It **never silently falls back to mock data**.
- **Mock Mode Isolation:** Mock fixtures are explicitly selected via `mode="mock"` for zero-credit local development and deterministic judging benchmarks.
- **Retrospective Truth Only:** Historical annual revenue growth is computed deterministically from audited `financials.historical_financials[].revenue`.
- **Zero Forward Speculation:** Forecast fields (`future.company_growth_forecasts`) are **strictly prohibited** from being used as retrospective historical evidence.

---

## 4. End-to-End Architecture

```text
Judge / User Request: POST /api/investigate { target: "BBCA", peers: ["BMRI", "BBRI", "BBNI"] }
       │
       ▼
[ Step 1: Input Validation ] ──> Lock parameters, ensure target not in peers
       │
       ▼
[ Step 2: Sectors Data Ingestion ] ──> Sectors REST v2 API (or Mock Adapter)
       │                              Retrieve audited overview & historical financials
       ▼
[ Step 3: Deterministic Outlier Engine ] ──> Compute YoY arithmetic, cohort median, spread, z-score
       │
       ├─────────────────────────────────────────────────────────────────────────┐
       ▼                                                                         ▼
[ Mode A: Cognitive Loop (OpenAI Responses API) ]        [ Mode B: Deterministic Fallback ]
  │                                                        │
  ├─► CALL 1: HYPOTHESIZE + PLAN (strict JSON Schema)      ├─► Rule-based hypothesis engine
  │   Formulate competing explanations, request tools      │
  │                                                        │
  ├─► DETERMINISTIC TOOL RUNNER (Allowlist execution)      ├─► Deterministic evidence testing
  │   Execute verify_period, audit_earnings, etc.          │
  │                                                        │
  ├─► CALL 2: CHALLENGE + REVISE (strict JSON Schema)      │
  │   Cross-examine hypotheses against verified evidence   │
  │                                                        │
  └────────────────────────────────────────────────────────┴─────────────────────┘
       │
       ▼
[ Step 6: Evidence Ledger Compilation ] ──> Audit-grade ledger with provenance & verdicts
       │
       ▼
[ Step 7: Deterministic Classification ] ──> Strictly locked to 5 neutral classifications
       │
       ▼
UI / JSON Response: Executive Hero · Outlier Card · Hypotheses · Evidence Ledger · Audit Timeline
```

---

## 5. Five Locked Neutral Classifications

The agent's verdict is strictly bound to five objective enums. The LLM is structurally prohibited from altering or hallucinating this verdict:

| Classification | Meaning | Trigger Conditions |
|---|---|---|
| **`PERSISTENT_DIFFERENCE`** | Multi-year structural operational advantage verified. | Outlier confirmed, one-off accounting spike hypothesis rejected by earnings/quarterly momentum, and consecutive multi-period growth confirmed. |
| **`NO_MATERIAL_OUTLIER`** | Subject company tracks normal cohort dispersion. | Target metric falls within cohort min-max bounds or spread from median is <5.0%. |
| **`INCOMPARABLE_DATA`** | Reporting periods or currencies do not align. | Companies report on different fiscal timelines (e.g. FY2024 vs FY2023) or lack synchronized annual statements. Halts immediately to prevent invalid cross-year comparison. |
| **`DATA_QUALITY_RISK`** | Incomplete, null, or corrupted financial statements. | Missing or non-positive revenue values encountered. Halts rather than imputing fabricated numbers. |
| **`INSUFFICIENT_EVIDENCE`** | Discrepancy detected but public disclosures are inconclusive. | Statistical anomaly exists, but multi-year history is fluctuating or segment breakdowns are unavailable in summary data. |

---

## 6. Performance & Reliability Benchmarks

All metrics measured directly on the local execution runtime:

| Metric | Measured Value | Notes |
|---|---|---|
| **Mock Investigation Latency** | **~640 ms** | Deterministic processing with zero network latency. |
| **Live Sectors v2 Latency** | **~1,510 ms** | 4 parallel HTTPS calls to Sectors REST v2 API. |
| **LLM Calls per Investigation** | **$\le$ 2 calls** | Call 1 (Hypothesize & Plan) + Call 2 (Challenge & Revise). Exactly 0 in offline fallback mode. |
| **Sectors Calls per Investigation**| **$1 + N$ calls** | 1 target + $N$ peers (cached in memory). 0 extra calls from LLM. |
| **Security & Privacy** | **Zero exposure** | `SECTORS_API_KEY` and `OPENAI_API_KEY` reside exclusively in server-side Node runtime. Never exposed to browser, client bundle, traces, or logs. |
| **Fallback Guarantee** | **100% resilient** | If OpenAI times out, returns 4xx/5xx, or key is absent, the agent seamlessly executes the deterministic hypothesis generator without throwing an unhandled error. |

---

## 7. Local Setup & Installation

### Prerequisites
- Node.js >= 18 (Tested on Node.js v24 LTS)
- npm >= 9

### 1. Installation
```bash
git clone <repository-url>
cd signallens
npm install
```

### 2. Environment Variables
Create `.env.local`:
```env
# Sectors REST API Key (Required for Live Sectors REST v2 Mode)
SECTORS_API_KEY=your_sectors_api_key_here

# OpenAI API Key (Optional; enables the 2-call cognitive loop)
OPENAI_API_KEY=your_openai_api_key_here

# OpenAI Model Configuration (Optional; defaults to gpt-4o)
OPENAI_MODEL=gpt-4o

# Default Data Source Mode ("mock" or "live")
SECTORS_MODE=mock
```

> **Security Note:** Keys are never prefixed with `NEXT_PUBLIC_` and never leak to the client bundle.

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 8. Verification & Test Suite

SignalLens features comprehensive test coverage:

```bash
# Run unit & integration tests (61 tests across 9 suites)
npm test

# Run ESLint (0 errors, 0 warnings)
npm run lint

# Run TypeScript static typechecking (0 errors)
npm run typecheck

# Build optimized production bundle
npm run build
```


---

## 9. Demo Scenarios & Judging Walkthrough

The UI provides pre-configured presets for a **90-second judging presentation**:

1. **Primary Mock Demo: Big Banks (BBCA vs BMRI, BBRI, BBNI, BBTN)**
   - **Verdict:** `PERSISTENT_DIFFERENCE` (Confidence: HIGH)
   - **Narrative:** BBCA shows +17.5% deviation. Call 1 hypothesizes one-off gains vs business mix vs multi-year execution. Allowlisted tool `audit_operating_earnings` confirms net earnings expansion (+20.0%) and quarterly momentum (+15.0%), refuting paper gain. `audit_multi_period_cagr` confirms consecutive 3-period expansion.
2. **Uniform Peer Group: Consumer Staples (ICBP vs INDF, MYOR, CMRY, UNVR)**
   - **Verdict:** `NO_MATERIAL_OUTLIER` (Confidence: HIGH)
   - **Narrative:** All companies report steady 5.1%–5.9% growth. The agent halts immediately without fabricating speculative anomalies.
3. **Period Mismatch: TECH_A vs PEER_B, PEER_C, PEER_D**
   - **Verdict:** `INCOMPARABLE_DATA` (Confidence: HIGH)
   - **Narrative:** Subject company reports FY2023 while peers report FY2024. Agent immediately halts to prevent invalid cross-year comparison.
4. **Data Quality Issue: CORRUPT_A vs PEER_X, PEER_Y, PEER_Z**
   - **Verdict:** `DATA_QUALITY_RISK` (Confidence: HIGH)
   - **Narrative:** Null or missing financial values detected. Agent halts rather than guessing or interpolating numbers.
5. **Live Sectors REST v2 Mode (Real IDX Data)**
   - Click the **Live Sectors REST v2** toggle in the header.
   - Enter `BBCA` (real audited financials parsed $\rightarrow$ `INSUFFICIENT_EVIDENCE` because granular CASA fee breakdowns require exchange footnotes).
   - Shows real HTTP queries to Sectors REST v2 with complete authentic source provenance.

---

## 10. License & Disclaimers

Built for **Sectors Hackathon 2026** (Track 1: AI Agents & AI Assistants).  
Financial data powered by [Sectors.app](https://sectors.app).

*SignalLens provides informational retrospective data auditing only. Strictly NOT financial advice, a trading recommendation, price target, or investment signal.*
