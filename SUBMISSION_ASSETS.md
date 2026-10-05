# SignalLens — Hackathon Submission Assets
**Sectors Hackathon 2026** · Track 1: AI Agents & AI Assistants

---

## 1. Core Statements

### One-Sentence Problem Statement
When public companies exhibit unusual financial divergence from their peers, analysts face overwhelming filings while generic AI chatbots fabricate speculative explanations without empirical proof.

### One-Sentence Solution Statement
SignalLens is an autonomous forensic investigation agent that audits peer anomalies against real Sectors fundamentals, plans allowlisted verification tests via a bounded 2-call LLM cognitive loop, and outputs an immutable evidence ledger locked to deterministic neutral verdicts.

### Product Signature
> *"SignalLens doesn't tell you what to invest in. It tells you what the data can actually prove."*

---

## 2. Track & Team Information

- **Hackathon:** Sectors Hackathon 2026
- **Track:** Track 1 — AI Agents & AI Assistants
- **Project Name:** SignalLens
- **Team:** SignalLens (Solo participant)
- **Primary Data Source:** Sectors REST API v2 (`GET https://api.sectors.app/v2/company/report/{symbol}/?sections=overview,financials` with `Authorization: <SECTORS_API_KEY>`)
- **Cognitive Layer:** OpenAI Responses API (`/v1/responses`, model: `gpt-4o`)
- **Technology Stack:** Next.js 15.5 App Router, TypeScript, Tailwind CSS, Vitest (61 unit & integration tests)

---

## 3. 1-Minute Teaser Structure (Social / Showcase Video)

- **[00:00 - 00:10] Hook:**  
  *Visual:* Show a stock metric surging +25% while peers grow at +8%.  
  *Voiceover:* "A company reports growth that blows its competitors out of the water. Is it genuine operational excellence, an accounting trick, or a reporting period mismatch? If you ask a chatbot, it will happily invent a story."
- **[00:10 - 00:25] The Problem with AI in Finance:**  
  *Visual:* Red alert over a chatbot hallucinating vague marketing claims.  
  *Voiceover:* "Generic LLMs don't check audited financials. They hallucinate certainty."
- **[00:25 - 00:45] The SignalLens Agent Solution:**  
  *Visual:* SignalLens UI running live Sectors REST v2 query; 5-stage stepper animating.  
  *Voiceover:* "Meet SignalLens. An investigation agent built on Sectors fundamentals. It doesn't chat. It calculates peer dispersion, formulates competing falsifiable hypotheses, executes allowlisted audit tools, and compiles an immutable evidence ledger."
- **[00:45 - 01:00] The Core Guarantee:**  
  *Visual:* Final classification badge locked to `PERSISTENT_DIFFERENCE` with verified evidence proofs.  
  *Voiceover:* "The LLM proposes hypotheses. Deterministic code decides what the data actually proves. SignalLens doesn't tell you what to invest in. It tells you what the data can actually prove."

---

## 4. <=3-Minute Judging Demo Video Script

### [00:00 - 00:30] Introduction & Problem Setup
- **Screen:** SignalLens Header & Setup Panel.
- **Narrator:**
  "Judges, welcome to SignalLens, submitted for Track 1: AI Agents & AI Assistants.
  In equity research, the hardest questions aren't finding the data — it's explaining why a company behaves radically differently from its peer group.
  When BBCA shows revenue growth sharply outpacing other major Indonesian banks, analysts must dig through filings to answer: Is this real operational power, a one-off asset sale, or just misaligned fiscal periods?
  If you paste this into ChatGPT, it invents a plausible-sounding story. That is unacceptable in high-stakes finance. SignalLens solves this with an autonomous forensic falsification agent powered by Sectors."

### [00:30 - 01:15] The 5-Stage Agent Workflow & Live Sectors Ingestion
- **Screen:** Click "Live Sectors REST v2", enter `BBCA` with peers `BMRI, BBRI, BBNI`, click Investigate.
- **Narrator:**
  "Notice we are in Live Sectors REST v2 mode. In just 1.5 seconds, the agent executes four authenticated queries directly to Sectors API v2.
  Watch the 5-stage pipeline:
  First, DATA: Retrospective audited annual financials are retrieved. SignalLens strictly uses historical filings — never forward forecasts.
  Second, OUTLIER: Deterministic arithmetic computes cohort median, spreads, and z-scores. No AI guessing.
  Third, HYPOTHESES: The agent activates a bounded two-call cognitive loop via OpenAI's Responses API. Call 1 formulates competing, testable explanations and requests specific tools from a strict allowlist.
  Fourth, EVIDENCE: SignalLens executes allowlisted verification tools locally against the audited statements, evaluating operating earnings consistency and multi-period trends.
  Fifth, CHALLENGE & VERDICT: Call 2 cross-examines the hypotheses against the empirical results. Finally, our deterministic classifier locks the outcome into one of five neutral classifications."

### [01:15 - 02:00] Deep Dive: The Evidence Ledger & Epistemic Honesty
- **Screen:** Scroll to Evidence Ledger and Classification Card.
- **Narrator:**
  "Here is our Evidence Ledger. Every row is an immutable audit point with source provenance, mathematical observations, and explicit verdicts — SUPPORTED, WEAKENED, or INCONCLUSIVE.
  Notice the outcome for this live query: `INSUFFICIENT_EVIDENCE`.
  Why? Because while BBCA outpaces peers, granular fee-income and CASA disclosures require audited footnote notes not present in summary overview reports.
  An ordinary AI would invent an answer. SignalLens declares epistemic uncertainty. It tells you exactly what public data can prove, and lists its unresolved questions."

### [02:00 - 02:30] Controlled Scenario: The Power of Persistent Difference
- **Screen:** Click preset "Big Banks (Primary)" in Mock Mode.
- **Narrator:**
  "Now watch our verified benchmark scenario where 3 consecutive years of financial records are audited.
  Tool execution verifies that operating earnings expanded by +20% and quarterly momentum sustained at +15%, refuting the one-off paper gain hypothesis.
  Because consecutive expansion across multiple audited cycles is mathematically verified, the classifier securely confirms `PERSISTENT_DIFFERENCE` with HIGH confidence."

### [02:30 - 03:00] Conclusion & Why SignalLens Wins Track 1
- **Screen:** Executive Summary Hero & Audit Timeline with 14 observable state transitions.
- **Narrator:**
  "SignalLens is a true agent:
  - It uses a bounded 2-call cognitive loop with OpenAI Responses API.
  - It enforces strict allowlisted tool execution with zero code execution vulnerabilities.
  - It makes Sectors API its indispensable foundation.
  - Most importantly, it enforces our core principle: The LLM proposes explanations; deterministic code decides what the data actually proves.
  Thank you."

---

## 5. Demo Sequence Checklist for Presenters

1. **Step 1: Open Localhost / Demo URL**
   - Confirm Header displays "Track 1 · AI Agents" and "Mock Mode / Live Sectors REST v2".
2. **Step 2: Run Mock Benchmark Preset (`Big Banks`)**
   - Click "Big Banks (Primary)" preset chip.
   - Click "Run Investigation".
   - Highlight:
     - 640 ms execution latency.
     - Outlier confirmed (+17.5% deviation).
     - 3 candidate hypotheses generated.
     - Operating earnings tool refutes one-off spike.
     - Multi-period CAGR tool confirms consecutive expansion.
     - Final verdict: `PERSISTENT_DIFFERENCE`.
     - Expand Audit Timeline to show 14 deterministic state transitions.
3. **Step 3: Run Live Sectors Mode (`BBCA`)**
   - Toggle to "Live Sectors REST v2".
   - Target: `BBCA` | Peers: `BMRI, BBRI, BBNI`.
   - Click "Run Investigation".
   - Highlight:
     - 1.5s real round-trip to Sectors API v2.
     - Real audited financial figures parsed.
     - Agent declares `INSUFFICIENT_EVIDENCE` due to missing segment footnote breakdowns.
     - Demonstrates epistemic honesty: refuses to hallucinate certainty.
4. **Step 4: Run Guardrail Presets (`Period Mismatch` & `Data Quality`)**
   - Click "Period Mismatch" $\rightarrow$ shows immediate halt with `INCOMPARABLE_DATA`.
   - Click "Data Quality Issue" $\rightarrow$ shows null-safety halt with `DATA_QUALITY_RISK`.
   - Demonstrates that the agent cannot be tricked by corrupted data.

---

## 6. Final Project Description (for Devpost / Hackathon Portal)

**Title:** SignalLens — Peer Outlier Explanation & Audit Agent  
**Tagline:** Deterministic peer outlier falsification and cognitive evidence audit agent for Indonesian equities powered by Sectors.

**Description:**  
When an Indonesian public company displays sudden financial divergence from its peer cohort, investors and research analysts are forced to comb through hundreds of pages of exchange disclosures. Generative AI chatbots make this worse: they hallucinate compelling explanations without verifying whether the audited balance sheet or multi-year figures actually support the claim.

SignalLens is an autonomous forensic investigation agent built on the official Sectors REST API v2. It replaces chat speculation with a bounded cognitive falsification loop:
1. **Audited Fundamentals Ingestion:** Direct retrieval of annual historical reports from Sectors API v2.
2. **Deterministic Outlier Detection:** Pure mathematical calculation of rate of change, peer median, interquartile spread, and z-score. Outliers are never forced.
3. **Bounded Two-Call Cognitive Loop:** Uses the new OpenAI Responses API (`/v1/responses`) with strict JSON schemas. Call 1 formulates competing falsifiable hypotheses and requests verification tools. Call 2 cross-examines findings against empirical evidence.
4. **Allowlisted Evidence Tool Execution:** The LLM cannot execute arbitrary code or open-web queries. It dispatches strictly allowlisted tools (`verify_period_alignment`, `audit_operating_earnings`, `audit_multi_period_cagr`, etc.) executed locally against the Sectors records.
5. **Immutable Evidence Ledger:** Every test is logged with exact data provenance, quantitative observations, and evidence verdicts.
6. **Deterministic Classification:** The final verdict is locked into one of five neutral enums (`PERSISTENT_DIFFERENCE`, `NO_MATERIAL_OUTLIER`, `INCOMPARABLE_DATA`, `DATA_QUALITY_RISK`, `INSUFFICIENT_EVIDENCE`). The LLM cannot alter this outcome.

**Core Axiom:**  
*"The LLM proposes explanations and investigation plans. Deterministic code decides what the data actually proves."*

---

## 7. Social Post Draft (X / LinkedIn / Discord)

🚨 **Introducing SignalLens — Built for Sectors Hackathon 2026 (Track 1: AI Agents)**

When a stock metric suddenly spikes +25% while its peers grow at +8%, what caused it?
- A one-off paper accounting gain?
- An unaligned fiscal reporting period?
- Or genuine, multi-year operational execution?

If you ask ChatGPT, it hallucinates a persuasive marketing story. In finance, ungrounded speculation is dangerous.

**SignalLens** replaces chat with an autonomous forensic audit loop:
🔹 Real IDX fundamentals from @sectors_app REST API v2
🔹 Deterministic rate-of-change and peer dispersion math
🔹 Bounded 2-call LLM cognitive loop via OpenAI Responses API
🔹 Strict allowlisted verification tool execution
🔹 Immutable Evidence Ledger with cryptographic provenance
🔹 Locked neutral classifications — zero LLM hallucination of verdicts

Because:
*"SignalLens doesn't tell you what to invest in. It tells you what the data can actually prove."*

Built with Next.js 15 App Router, TypeScript, and Vitest.
#SectorsHackathon #AIAgents #FinTech #OpenAI #TypeScript #FinancialAI
