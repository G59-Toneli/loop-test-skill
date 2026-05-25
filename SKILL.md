---
name: loop-test
description: Use when a feature, bugfix, or refactor needs deterministic validation with high regression risk, flaky behavior, or explicit request for looped verification.
---

# loop-test

## 1) Objective

Prove real behavior through real-user flow simulation first (API and/or browser automation), without false green, and produce a merge decision users can act on.

Primary command: `/loop-test`

Loop: context harvest -> risk classify -> auto-select profile -> pre-test grill -> propose matrix -> run -> if fail, fix root cause -> rerun same scenario -> risk-tier regression -> decision.

## 2) Policy levels

- REQUIRED: non-negotiable. Violation invalidates execution.
- RECOMMENDED: default unless a concrete reason is logged.
- OPTIONAL: only when it adds measurable value.

## 3) Trigger boundary

Use when:
- implemented feature/bugfix/refactor needs deterministic validation
- user explicitly requests looped validation (`/loop-test`, "validate this", "test until stable")
- flaky behavior must be converted into deterministic behavior

Do not use when:
- only one isolated assertion is needed
- exploratory debugging has no acceptance contract yet
- change is visual/copy-only with no behavior impact
- there is no runnable hypothesis

REQUIRED: if any "do not use" condition is true, abort loop-test and pick a better method.

## 4) Public contract

Input:
- command: `/loop-test`
- change summary
- change type: `feature | bugfix | refactor`
- available context sources (chat, PRD, spec, task, PR/diff, code files, logs)
- optional execution mode override: `interactive | delegated` (default chosen automatically)
- optional profile override: `rapido | padrao | paranoico` (default chosen automatically)
- optional memory path (defaults to `loop-memory.md` if present)
- optional session board path (defaults to `loop-session.md` if persistence is requested)

Mandatory intermediate output:
- selected profile and selected validation method
- `context dossier` (what was analyzed + gaps + assumptions)
- `grill summary + risk map`
- `execution to-do board` with explicit state per item (always visible in chat)
- scenario matrix with stable `Scenario ID`
- explicit grill validation options: `approve | edit | add risk | add assumption` (interactive mode)
- explicit validation options: `approve | add | remove | edit` (interactive mode)
- explicit acceptance criteria lock and scope lock (delegated mode)

Mandatory final output:
- `loop-test report` with decision state, method, scenarios, failures/fixes, escalations, and regression command(s)

## 5) Execution flow (mandatory)

1. Run context harvest using all available sources (chat, PRD, spec, task, PR/diff, code, logs) and publish `context dossier`.
2. Classify risk (`low | medium | high`) using `testing-playbook.md` signals.
3. Select execution profile (`rapido | padrao | paranoico`) automatically from risk and context, unless user overrides.
4. Run pre-test grill by domain using `testing-playbook.md` and produce `grill summary + risk map`.
5. Validate grill approval path:
   - interactive mode: ask explicit user approval before generating scenario matrix.
   - delegated mode: apply secure defaults for unresolved questions and log assumptions with risk impact.
6. Select real-flow validation method(s) first:
   - API journey validation
   - browser journey validation (Playwright and/or MCP Chrome DevTools)
   - hybrid API + browser when needed for full behavior proof
7. Build scenario matrix from the approved grill output using `loop-templates.md`, mapping each scenario to method(s).
8. Load optional regression memory from `loop-memory.md` if present and add relevant non-regression scenarios.
9. Validate scenario matrix approval path:
   - interactive mode: ask explicit user approval before running any scenario.
   - delegated mode: lock acceptance criteria and proceed if scope is pre-approved.
10. Publish/update the execution to-do board before running scenarios:
   - chat view is mandatory.
   - file view is optional (`loop-session.md`) when persistence is requested.
11. Execute sequentially and update scenario and board state immediately.
12. If fail: diagnose root cause, fix, rerun the same scenario.
13. If flaky evidence appears, apply anti-flaky quorum policy (`padrao=2/2`, `paranoico=3/3`).
14. After all approved scenarios pass, run risk-tier regression (`targeted`, `suite`, or `full`).
15. Publish final `loop-test report`.

## 6) Definition of done (binary gates)

Loop-test is valid only if all gates pass:
- RED captured (conditional):
  - bugfix/refactor: at least one failing scenario recorded before fix.
  - feature: at least one unmet acceptance scenario or negative-path proof recorded before fix.
- GREEN proven: same scenario passes after fix.
- Root cause closed: fix explanation proves causal correction, not symptom patch.
- Scenario completion: no approved scenario left in `pending` or `running`.
- Final regression: risk-tier regression executed after scenario pass closure.
- Decision state emitted: `merge seguro | merge com risco | nao mergear`.
- Context harvest gate passed:
  - all available context sources were analyzed.
  - missing context and assumptions are explicitly logged.
- Execution to-do board closure:
  - no execution item left in `pending` or `running`.
- Pre-test grill gate passed:
  - interactive: grill output approved before matrix generation.
  - delegated: unresolved questions mapped to explicit assumptions with risk impact.
- Real-flow evidence present:
  - at least one approved scenario executed with API and/or browser simulation.
  - if real-flow is not runnable, explicit block or waiver with technical justification is logged.

REQUIRED: if any gate fails, mark execution invalid and escalate.

## 7) Companion docs

- `testing-playbook.md`: pre-test grill policy, test-level ladder, escalation gates, anti-gaming controls.
- `loop-templates.md`: grill summary, scenario matrix, pressure scenario, rationalization, REFACTOR, and final check templates.
- `loop-memory.md`: optional memory format for cross-session regression reuse.
- `loop-session.md`: optional persisted execution to-do board template.
- `cso-rules.md`: discoverability and token-discipline rules.
- `SKILL_VALIDATION.md`: empirical RED/GREEN evidence log for skill-level changes.

## 8) Security and privacy

- REQUIRED: never expose secrets, tokens, credentials, PII, or private endpoints.
- REQUIRED: use placeholders (`<TEST_ACCOUNT_EMAIL>`, `<API_TOKEN>`, `<PROJECT_PATH>`).
- REQUIRED: never hit real customer channels in test mode without explicit approval and isolation.
- RECOMMENDED: avoid sensitive data in logs, artifacts, and screenshots.

## 9) Report template

```text
## loop-test report

Feature: <name>
Change type: <feature | bugfix | refactor>
Execution mode: <interactive | delegated>
Profile: <rapido | padrao | paranoico>
Decision: <merge seguro | merge com risco | nao mergear>
Decision reason:
  - <short reason 1>
  - <short reason 2>
Grill artifact: <summary/risk-map reference>
Method selected: <api-journey | browser-journey | hybrid | mixed>
Regression tier: <targeted | suite | full>
Scenarios approved: <N>
Scenarios result: <P passed, F fixed, B blocked/escalated>
Total iterations: <X>
Estimated paid cost: <amount + currency>
Fixes applied:
  - <issue summary> -> <reference>
Open/escalated items:
  - <reason + owner/action>
Residual risks:
  - <risk + mitigation or owner>
Regression command(s):
  - <command>
```
