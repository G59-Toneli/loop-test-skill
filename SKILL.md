---
name: loop-test
description: Use when a feature, bugfix, or refactor needs deterministic validation with high regression risk, flaky behavior, or explicit request for looped verification.
---

# loop-test

## 1) Objective

Prove real behavior with the lowest-cost test level, without false green, and produce a merge decision users can act on.

Primary command: `/loop-test auto`

Loop: scope -> risk classify -> choose profile -> choose level -> propose matrix -> run -> if fail, fix root cause -> rerun same scenario -> risk-tier regression -> decision.

## 2) Policy levels

- REQUIRED: non-negotiable. Violation invalidates execution.
- RECOMMENDED: default unless a concrete reason is logged.
- OPTIONAL: only when it adds measurable value.

## 3) Trigger boundary

Use when:
- implemented feature/bugfix/refactor needs deterministic validation
- user explicitly requests looped validation (`/loop-test`, `/loop-test auto`, "validate this", "test until stable")
- flaky behavior must be converted into deterministic behavior

Do not use when:
- only one isolated assertion is needed
- exploratory debugging has no acceptance contract yet
- change is visual/copy-only with no behavior impact
- there is no runnable hypothesis

REQUIRED: if any "do not use" condition is true, abort loop-test and pick a better method.

## 4) Public contract

Input:
- command: `/loop-test auto`
- change summary
- change type: `feature | bugfix | refactor`
- minimal context (spec/task/PR/files)
- execution mode: `interactive | delegated`
- optional profile override: `rapido | padrao | paranoico`
- optional memory path (defaults to `loop-memory.md` if present)

Mandatory intermediate output:
- selected profile and selected test level
- scenario matrix with stable `Scenario ID`
- explicit validation options: `approve | add | remove | edit` (interactive mode)
- explicit acceptance criteria lock and scope lock (delegated mode)

Mandatory final output:
- `loop-test report` with decision state, method, scenarios, failures/fixes, escalations, and regression command(s)

## 5) Execution flow (mandatory)

1. Understand scope from code and task/spec.
2. Classify risk (`low | medium | high`) using `testing-playbook.md` signals.
3. Select execution profile (`rapido | padrao | paranoico`) from user input or defaults.
4. Choose the cheapest test level that can prove behavior.
5. Build scenario matrix using `loop-templates.md`.
6. Load optional regression memory from `loop-memory.md` if present and add relevant non-regression scenarios.
7. Validate scenario matrix approval path:
   - interactive mode: ask explicit user approval before running any scenario.
   - delegated mode: lock acceptance criteria and proceed if scope is pre-approved.
8. Execute sequentially and update scenario state immediately.
9. If fail: diagnose root cause, fix, rerun the same scenario.
10. If flaky evidence appears, apply anti-flaky quorum policy (`padrao=2/2`, `paranoico=3/3`).
11. After all approved scenarios pass, run risk-tier regression (`targeted`, `suite`, or `full`).
12. Publish final `loop-test report`.

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

REQUIRED: if any gate fails, mark execution invalid and escalate.

## 7) Companion docs

- `testing-playbook.md`: test-level ladder, escalation gates, anti-gaming controls.
- `loop-templates.md`: scenario matrix, pressure scenario, rationalization, REFACTOR, and final check templates.
- `loop-memory.md`: optional memory format for cross-session regression reuse.
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
Method selected: <test level>
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
