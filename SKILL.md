---
name: loop-test
description: Use when a feature, bugfix, or refactor needs deterministic validation with high regression risk, flaky behavior, or explicit request for looped verification.
---

# loop-test

## 1) Objective

Prove real behavior with the lowest-cost test level, without false green.

Loop: scope -> choose level -> propose matrix -> get approval -> run scenario -> if fail, fix root cause -> rerun same scenario -> final regression.

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
- change summary
- minimal context (spec/task/PR/files)
- execution mode: `interactive` or `delegated`

Mandatory intermediate output:
- scenario matrix
- explicit validation options: `approve`, `add`, `remove`, `edit` (interactive mode)
- explicit acceptance criteria lock and scope lock (delegated mode)

Mandatory final output:
- `loop-test report` with method, scenarios, failures/fixes, escalations, and regression command(s)

## 5) Execution flow (mandatory)

1. Understand scope from code and task/spec.
2. Choose the cheapest test level that can prove behavior.
3. Build scenario matrix using `loop-templates.md`.
4. Validate scenario matrix approval path:
   - interactive mode: ask explicit user approval before running any scenario.
   - delegated mode: lock acceptance criteria and proceed if scope is pre-approved.
5. Execute sequentially and update scenario state immediately.
6. If fail: diagnose root cause, fix, rerun the same scenario.
7. After all approved scenarios pass, run full regression.
8. Publish final `loop-test report`.

## 6) Definition of done (binary gates)

Loop-test is valid only if all gates pass:
- RED captured (conditional):
  - bugfix/refactor: at least one failing scenario recorded before fix.
  - feature: at least one unmet acceptance scenario or negative-path proof recorded before fix.
- GREEN proven: same scenario passes after fix.
- Root cause closed: fix explanation proves causal correction, not symptom patch.
- Scenario completion: no approved scenario left in `pending` or `running`.
- Final regression: executed after scenario pass closure.

REQUIRED: if any gate fails, mark execution invalid and escalate.

## 7) Companion docs

- `testing-playbook.md`: test-level ladder, escalation gates, anti-gaming controls.
- `loop-templates.md`: pressure scenario, rationalization, REFACTOR, and final check templates.
- `cso-rules.md`: discoverability and token-discipline rules.

## 8) Security and privacy

- REQUIRED: never expose secrets, tokens, credentials, PII, or private endpoints.
- REQUIRED: use placeholders (`<TEST_ACCOUNT_EMAIL>`, `<API_TOKEN>`, `<PROJECT_PATH>`).
- REQUIRED: never hit real customer channels in test mode without explicit approval and isolation.
- RECOMMENDED: avoid sensitive data in logs, artifacts, and screenshots.

## 9) Report template

```text
## loop-test report

Feature: <name>
Method selected: <test level>
Scenarios approved: <N>
Scenarios result: <P passed, F fixed, B blocked/escalated>
Total iterations: <X>
Estimated paid cost: <amount + currency>
Fixes applied:
  - <issue summary> -> <reference>
Open/escalated items:
  - <reason + owner/action>
Regression command(s):
  - <command>
```
