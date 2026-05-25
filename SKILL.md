---
name: loop-test
description: Use when a feature, bugfix, or refactor needs end-to-end validation in an automated fix->test->fix loop. This skill chooses the cheapest test level that still validates behavior, builds and validates a scenario matrix with the user, tracks progress with a checklist, and only exits when all approved scenarios pass or a hard escalation gate is hit.
---

# loop-test

## Principle

**Full validation with minimum cost and time, without masking bugs.**  
Loop: choose method -> build scenarios -> validate scenarios with user -> run -> if failed, diagnose root cause -> fix -> rerun.

**Non-negotiable rule:** do not relax assertions, add fake mocks to force green, shrink scope silently, or abuse skip/xfail to close the loop.

## When to use

- A feature/bugfix/refactor was just implemented and must be validated before merge.
- User asks for looped validation (`/loop-test`, "validate this", "test until stable").
- Flaky behavior must become deterministic through real root-cause fixes.

Do not use for one isolated unit test, non-loop debugging, or visual-only UI review.

## Public contract (input/output)

Expected input:
- change summary (feature/bugfix/refactor)
- minimal context (spec/task/PR/files)

Required intermediate output:
- scenario matrix proposed in chat
- explicit user validation options:
  - approve scenario list
  - add scenario(s)
  - remove scenario(s)
  - edit scenario(s)

Required final output:
- `loop-test report` with method chosen, scenarios covered, iterations, failures fixed, escalations, and regression command(s).

## Mandatory flow

1. Understand scope from code and spec/task context.
2. Choose the cheapest test level that still proves behavior.
3. Generate initial scenario matrix.
4. Present scenarios in chat and request user validation (approve/add/remove/edit).
5. Build scenario todo checklist from approved matrix.
6. Execute one scenario at a time in a fix->test->fix loop.
7. Update checklist state after each scenario.
8. Run full regression once all scenarios pass.
9. Publish final structured report.

## Test-level ladder (low cost -> high cost)

1. Unit tests for pure logic/helpers.
2. Service/integration tests for APIs, auth, data access, and policies.
3. End-to-end UI/API flow tests for user journeys.
4. External dependency validation (real provider) only when mocking would hide real behavior.

Do not use a higher level when a lower level can prove the same behavior.

## Scenario matrix baseline

Always consider:
- golden path
- empty/null/undefined inputs
- boundary values (min/max/length/range)
- unicode/special chars
- concurrency/race conditions
- authorization/permission boundaries
- idempotency/retries/duplicate requests
- external failure modes (timeout/5xx/network/rate limit)
- malicious payload class (XSS/SQLi/injection where relevant)

## Scenario checklist model

Track each scenario with one state:
- `pending`
- `running`
- `passed`
- `failed`
- `blocked`
- `skipped-with-reason`

Process rule:
- execute scenarios sequentially
- mark status immediately after each run
- if failed, iterate on root cause for that scenario before moving on
- never mark passed without a successful rerun

## Cost and escalation gates

Define configurable limits before starting:
- max paid-test budget per session (currency + threshold)
- max no-progress iterations per scenario

Escalate and stop loop when:
- no measurable progress after max iterations on one scenario
- paid budget threshold is reached
- resolution requires product/spec decision, not engineering correction
- critical external dependency is unavailable beyond retry window
- required credential/config is missing and cannot be provisioned safely

## Security and privacy rules

- Never print secrets, tokens, real credentials, PII, or private endpoints.
- Use placeholders in docs/logs (`<TEST_ACCOUNT_EMAIL>`, `<API_TOKEN>`, `<PROJECT_PATH>`).
- Do not call real customer channels in test mode unless explicitly approved and isolated.
- Avoid writing sensitive data to test artifacts or screenshots.

## Red flags (stop and reassess)

| Pensamento | Realidade |
|---|---|
| "I will just add `.skip`" | Hides bug, does not fix root cause. |
| "I will add hard sleep to stabilize" | Masks race condition, increases flakiness. |
| "I will lower assertion strength" | Converts regression into false green. |
| "It passed once, done" | Run again to confirm deterministic behavior. |
| "I will increase budget limit ad hoc" | Breaks control, escalate instead. |

## Loop diary template

Keep a structured per-scenario trace:

```text
Scenario: <name>
Iteration: <n>
Hypothesis: <why failing>
Change: <file or component + short summary>
Command: <exact command>
Result: pass | fail (<error summary>)
Next step: <next hypothesis>
```

## Final report template

```
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

This skill orchestrates and can pair with:
- root-cause debugging skills during failed scenarios
- test-construction skills when tests are missing
- final verification/commit workflow skills before merge

Use the environment's available tools to automate as much as possible before asking a human.
