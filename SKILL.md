---
name: loop-test
description: Use when a feature, bugfix, or refactor needs deterministic end-to-end validation through an iterative fix-test-fix loop with explicit scenario approval and escalation controls.
---

# loop-test

## Principle

Validate real behavior with the lowest possible cost, without masking bugs.

Loop: scope -> choose test level -> propose scenarios -> user validates scenarios -> execute scenario -> if fail, fix root cause -> rerun -> close with regression.

Never force green by weakening assertions, adding fake stabilizers, shrinking scope silently, or abusing skip/xfail.

## When to use

- Feature/bugfix/refactor just implemented and needs pre-merge validation.
- User asks for looped validation (`/loop-test`, "validate this", "test until stable").
- Flaky behavior must become deterministic via root-cause correction.

Do not use for isolated unit-only checks, non-loop debugging, or visual-only UI review.

## Public contract

Input:
- change summary
- minimal context (spec/task/PR/files)

Required intermediate output:
- scenario matrix
- explicit user validation options: approve/add/remove/edit

Required final output:
- `loop-test report` with test method, coverage, iterations, fixes, escalations, and regression command(s).

## Mandatory flow

1. Understand scope from code + task/spec.
2. Choose the cheapest test level that can prove behavior.
3. Build initial scenario matrix.
4. Ask user to approve/add/remove/edit scenarios.
5. Create checklist from approved scenarios.
6. Execute sequential fix-test-fix per scenario.
7. Update scenario status immediately after each run.
8. Run full regression after all scenarios pass.
9. Publish final structured report.

## Test-level ladder

1. Unit: pure logic/helpers.
2. Service/integration: APIs, auth, data access, policies.
3. End-to-end: user journeys crossing boundaries.
4. Real external dependency: only when mocks hide behavior.

Never use a higher-cost level when a lower level proves the same behavior.

## Scenario baseline

Always consider:
- golden path
- empty/null/undefined inputs
- boundary values
- unicode/special chars
- concurrency/race conditions
- authorization boundaries
- idempotency/retries/duplicates
- external failures (timeout/5xx/network/rate limit)
- malicious payload classes when relevant (XSS/SQLi/injection)

## Checklist state model

Allowed states:
- `pending`
- `running`
- `passed`
- `failed`
- `blocked`
- `skipped-with-reason`

Rules:
- execute scenarios sequentially
- mark status immediately
- if failed, resolve root cause before moving on
- never mark `passed` without successful rerun

## Escalation gates

Define before starting:
- max paid-test budget per session
- max no-progress iterations per scenario

Escalate/stop when:
- no measurable progress after max iterations
- paid budget reached
- fix requires product/spec decision
- critical dependency unavailable beyond retry window
- required credential/config missing and cannot be safely provisioned

## Security and privacy

- Never expose secrets, tokens, credentials, PII, or private endpoints.
- Use placeholders (`<TEST_ACCOUNT_EMAIL>`, `<API_TOKEN>`, `<PROJECT_PATH>`).
- Never hit real customer channels in test mode without explicit approval and isolation.
- Avoid sensitive data in logs, artifacts, and screenshots.

## Red flags

| Thought | Reality |
|---|---|
| "I'll just add `.skip`" | Hides bug, no root-cause fix. |
| "I'll add hard sleep" | Masks race condition, increases flakiness. |
| "I'll lower assertion strength" | Creates false green. |
| "Passed once, done" | Must rerun to confirm determinism. |
| "I'll raise budget ad hoc" | Breaks control; escalate instead. |

## Report template

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

## Integrations

Pairs well with root-cause debugging, test-construction, and verification/commit workflow skills.