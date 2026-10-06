# SignalLens — Official Hackathon Submission Package
**Sectors Hackathon 2026** · Track 1: AI Agents & AI Assistants  
**Submission Status:** READY TO SUBMIT (Hard Stop Enforced: Submit Button NOT Clicked)

---

## 1. Repository & Commit Verification

- **Repository URL:** [https://github.com/Demonz-30/signallens](https://github.com/Demonz-30/signallens)
- **Visibility:** Public (confirmed)
- **Commit Hash:** `5a3733221e89334c46502f1238d653e52a132045` (`5a37332`)
- **Git Branch Status:** `origin/main` is up-to-date with local `main`
- **Working Tree:** Clean (0 uncommitted files)
- **Security Audit:** Zero secrets or API keys committed; `.env.local` strictly untracked and gitignored.
- **Test Suite:** 61 / 61 tests passing across 9 test suites via Vitest.
- **Lint & Types:** ESLint passed (0 errors), TypeScript compiler passed (`tsc --noEmit`, 0 errors).
- **Production Build:** Production bundle compiled successfully (`next build`, exit code 0).

---

## 2. Hosted Video URLs & Verifications

Both assets have been published directly to the repository's official GitHub Release v1.0.0 and verified as publicly accessible via HTTP 200:

### A. Judging Demo Video (<= 3 Minutes)
- **Release Page:** [https://github.com/Demonz-30/signallens/releases/tag/v1.0.0](https://github.com/Demonz-30/signallens/releases/tag/v1.0.0)
- **Direct Video URL:** [https://github.com/Demonz-30/signallens/releases/download/v1.0.0/SignalLens_Judging_Video.mp4](https://github.com/Demonz-30/signallens/releases/download/v1.0.0/SignalLens_Judging_Video.mp4)
- **Local Source Path:** `C:\Users\USER\Downloads\SignalLens_Judging_Video.mp4`
- **Duration:** `02:47.60` (Compliant: strictly under 3:00 limit)
- **File Size:** 15,702,438 bytes (14.98 MB)
- **Resolution:** 1080p Full HD (60 fps, H.264 / AAC)
- **HTTP Verification:** `HTTP/1.1 200 OK` (Content-Length: 15702438)
- **Flow Verified:**
  1. Shortened ~7-second opening hook directly to Investigate.
  2. Setup with BBCA and peers (BRI, Mandiri, BNI, BTN).
  3. Controlled Sectors-compatible dataset disclosure.
  4. Deterministic outlier calculation (+17.5% spread, Z-score: 15.90).
  5. LLM hypothesis generation under epistemic boundary.
  6. Deterministic evidence testing & falsification against financials.
  7. Evidence Ledger view displaying deterministic records (no empty filter table).
  8. Final classification: `PERSISTENT_DIFFERENCE`.
  9. Epistemic boundary reminder & closing tagline.

### B. Teaser Video (<= 60 Seconds)
- **Direct Video URL:** [https://github.com/Demonz-30/signallens/releases/download/v1.0.0/SignalLens_Teaser.mp4](https://github.com/Demonz-30/signallens/releases/download/v1.0.0/SignalLens_Teaser.mp4)
- **Local Source Path:** `C:\Users\USER\Downloads\SignalLens_Teaser.mp4`
- **Duration:** `00:54.77` (Compliant: strictly under 60-second limit)
- **File Size:** 6,526,205 bytes (6.22 MB)
- **Resolution:** 1080p Full HD (60 fps, H.264 / AAC)
- **HTTP Verification:** `HTTP/1.1 200 OK` (Content-Length: 6526205)

---

## 3. Submission Portal Field Values

**Target Portal:** [https://hackathon.sectors.app/portal/submit](https://hackathon.sectors.app/portal/submit)

| Field Name | Exact Value |
|---|---|
| **Track** | `Track 1 — AI Agents & AI Assistants` |
| **Participation Mode** | `Solo` |
| **Team Name** | `SignalLens` |
| **Project Title** | `SignalLens` |
| **Tagline** | `Deterministic peer outlier falsification and cognitive evidence audit agent for Indonesian equities powered by Sectors.` |
| **GitHub Repository URL** | `https://github.com/Demonz-30/signallens` |
| **Judging Video URL** | `https://github.com/Demonz-30/signallens/releases/download/v1.0.0/SignalLens_Judging_Video.mp4` |
| **Teaser Video URL** | `https://github.com/Demonz-30/signallens/releases/download/v1.0.0/SignalLens_Teaser.mp4` |
| **Release Page URL** | `https://github.com/Demonz-30/signallens/releases/tag/v1.0.0` |

### One-Sentence Problem Statement
```text
When public companies exhibit unusual financial divergence from their peers, analysts face overwhelming filings while generic AI chatbots fabricate speculative explanations without empirical verification.
```

### One-Sentence Solution Statement
```text
SignalLens is an autonomous forensic investigation agent that audits peer anomalies against real Sectors fundamentals, plans allowlisted verification tests via a bounded 2-call LLM cognitive loop, and outputs an audit-grade evidence ledger locked to deterministic neutral verdicts.
```

### Product Signature
```text
SignalLens doesn't tell you what to invest in. It tells you what the data can actually support.
```

### Full Project Description
```markdown
When an Indonesian public company displays sudden financial divergence from its peer cohort, investors and research analysts are forced to comb through hundreds of pages of exchange disclosures. Generative AI chatbots make this worse: they hallucinate compelling explanations without verifying whether the balance sheet or multi-year figures actually support the claim.

SignalLens is an autonomous forensic investigation agent built on the official Sectors REST API v2. It replaces chat speculation with a bounded cognitive falsification loop:

1. Fundamentals Ingestion: Direct retrieval of annual historical reports from Sectors API v2 (GET /v2/company/report/{symbol}/?sections=overview,financials).
2. Deterministic Outlier Detection: Mathematical calculation of rate of change, peer median, interquartile spread, and z-score. Outliers are never forced.
3. Bounded Two-Call Cognitive Loop: Uses OpenAI Responses API (/v1/responses) with strict JSON schemas. Call 1 formulates competing falsifiable hypotheses and requests verification tools. Call 2 cross-examines findings against empirical evidence.
4. Allowlisted Evidence Tool Execution: The LLM cannot execute arbitrary code or open-web queries. It dispatches strictly allowlisted tools (verify_period_alignment, audit_operating_earnings, audit_multi_period_cagr, etc.) executed locally against Sectors records.
5. Audit-Grade Evidence Ledger: Every test is logged with exact data provenance, quantitative observations, and evidence verdicts.
6. Deterministic Classification: The final verdict is locked into one of five neutral enums (PERSISTENT_DIFFERENCE, NO_MATERIAL_OUTLIER, INCOMPARABLE_DATA, DATA_QUALITY_RISK, INSUFFICIENT_EVIDENCE). The LLM cannot alter this outcome.

Core Axiom:
"The LLM proposes explanations and investigation plans. Deterministic code tests what the available data can actually support."
```

---

## 4. Official Social Media Post (Factual Compliance Pass)

```text
Introducing SignalLens, developed for the Sectors Hackathon 2026 in Track 1: AI Agents & AI Assistants.

Generic AI systems can produce plausible explanations without establishing whether the underlying data actually supports them. SignalLens is designed to test those explanations against available evidence.

Built on the official Sectors REST API v2, SignalLens implements an autonomous forensic investigation loop:
- Retrospective financial ingestion from @sectors_app REST API v2
- Deterministic rate-of-change and peer dispersion analysis
- Bounded 2-call LLM cognitive loop via OpenAI Responses API
- Strict allowlisted tool execution against fundamental disclosures
- Audit-grade Evidence Ledger with source provenance and explicit uncertainty boundaries
- Deterministic neutral classification

For reproducibility, our primary judging walkthrough uses a controlled Sectors-compatible dataset, while live Sectors mode retrieves real IDX filings and transparently flags data depth boundaries.

SignalLens provides empirical financial analysis and decision support only; it does not provide investment advice or automated trading execution.

GitHub: https://github.com/Demonz-30/signallens
Judging Demo: https://github.com/Demonz-30/signallens/releases/download/v1.0.0/SignalLens_Judging_Video.mp4
Teaser: https://github.com/Demonz-30/signallens/releases/download/v1.0.0/SignalLens_Teaser.mp4

#SectorsHackathon #AIAgents #FinTech #OpenAI #TypeScript #FinancialAI
```

---

## 5. Final Verification & Submission Freeze Status

- [x] Repository created after August 19, 2026 and public.
- [x] Zero API keys or private credentials tracked.
- [x] 61 of 61 automated tests pass.
- [x] No investment advice or automated trading code.
- [x] Sectors REST API v2 verified as indispensable data source.
- [x] Judging video <= 3 minutes (actual: 02:47.60).
- [x] Teaser video <= 60 seconds (actual: 00:54.77).
- [x] Both videos publicly hosted on GitHub Releases and verified with HTTP 200.
- [x] Social post drafted with strictly factual language, no emojis, no sweeping claims, tagging `@sectors_app`.
- [x] **SUBMISSION HARD STOP:** The final "Submit" button on `https://hackathon.sectors.app/portal/submit` has **NOT** been pressed. Everything is staged and frozen awaiting your final click.
