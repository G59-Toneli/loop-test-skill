---
name: loop-test
description: Use when a feature, bugfix, or refactor needs deterministic end-to-end validation through an iterative fix-test-fix loop with explicit scenario approval and escalation controls.
---

# loop-test

## 1) Principle

Validate real behavior with the lowest possible cost, without masking bugs.

Loop: scope -> choose test level -> propose scenarios -> user validates scenarios -> execute scenario -> if fail, fix root cause -> rerun -> close with regression.

## 2) Policy levels

- REQUIRED: mandatory behavior. Violations invalidate execution quality.
- RECOMMENDED: strong default. Deviate only with explicit reason.
- OPTIONAL: situational enhancement.

## 3) Required rules

- Never force green by weakening assertions, adding fake stabilizers, shrinking scope silently, or abusing skip/xfail.
- Ask explicit user validation on the scenario matrix before execution.
- Run full regression after all approved scenarios pass.

## 4) Environment compatibility

| Agent | Personal skill path |
|---|---|
| Codex | `~/.agents/skills/<skill-name>/SKILL.md` |
| Claude Code | `~/.claude/skills/<skill-name>/SKILL.md` |

REQUIRED:
- Keep instructions tool-agnostic unless a tool is explicitly mandatory.
- Avoid hardcoding project-private paths in examples.
- Use placeholders for machine/user-specific locations.

## 5) When to use

- Feature/bugfix/refactor just implemented and needs pre-merge validation.
- User asks for looped validation (`/loop-test`, "validate this", "test until stable").
- Flaky behavior must become deterministic via root-cause correction.

## 6) When not to use (strict)

- Single isolated unit assertion with no multi-scenario risk.
- Exploratory debugging where no acceptance contract exists yet.
- Pure visual/style checks better handled by UI review.
- Copy/text tweaks with no behavior change.
- Cases with no testable hypothesis or no runnable validation path.

REQUIRED: if this section matches the request, do not invoke loop-test.

## 7) Public contract

Input:
- change summary
- minimal context (spec/task/PR/files)

REQUIRED intermediate output:
- scenario matrix
- explicit user validation options: approve/add/remove/edit

REQUIRED final output:
- `loop-test report` with test method, coverage, iterations, fixes, escalations, and regression command(s).

## 8) Mandatory flow

1. Understand scope from code + task/spec.
2. Choose the cheapest test level that can prove behavior.
3. Build initial scenario matrix.
4. Ask user to approve/add/remove/edit scenarios.
5. Create checklist from approved scenarios.
6. Execute sequential fix-test-fix per scenario.
7. Update scenario status immediately after each run.
8. Run full regression after all scenarios pass.
9. Publish final structured report.

## 9) Companion docs

- `testing-playbook.md` for test-level choice, scenario model, and escalation details.
- `cso-rules.md` for discovery, naming, and token-efficiency rules.
- `loop-templates.md` for copy/paste execution templates.

## 10) Security and privacy

- REQUIRED: never expose secrets, tokens, credentials, PII, or private endpoints.
- REQUIRED: use placeholders (`<TEST_ACCOUNT_EMAIL>`, `<API_TOKEN>`, `<PROJECT_PATH>`).
- REQUIRED: never hit real customer channels in test mode without explicit approval and isolation.
- RECOMMENDED: avoid sensitive data in logs, artifacts, and screenshots.

## 11) Report template

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