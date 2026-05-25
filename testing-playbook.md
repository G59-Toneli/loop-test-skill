# testing-playbook

## Test-level ladder (low cost -> high cost)

1. Unit: pure logic/helpers.
2. Service/integration: APIs, auth, data access, policies.
3. End-to-end: user journeys crossing boundaries.
4. Real external dependency: only when mocks hide behavior.

Rule: never use a higher-cost level when a lower level can prove the same behavior.

## Scenario baseline

Always evaluate:
- golden path
- empty/null/undefined inputs
- boundary values
- unicode/special chars
- concurrency/race conditions
- authorization boundaries
- idempotency/retries/duplicates
- external failures (timeout/5xx/network/rate limit)
- malicious payload classes where relevant (XSS/SQLi/injection)

## Scenario checklist model

Allowed states:
- `pending`
- `running`
- `passed`
- `failed`
- `blocked`
- `skipped-with-reason`

Execution rules:
- run scenarios sequentially
- update state immediately after each run
- if one fails, diagnose and fix root cause before moving on
- never mark `passed` without successful rerun

## Escalation gates

Define before starting:
- max paid-test budget per session
- max no-progress iterations per scenario

Escalate and stop when:
- no measurable progress after max iterations
- paid budget reached
- fix requires product/spec decision
- critical dependency unavailable beyond retry window
- required credential/config missing and cannot be safely provisioned

## Red flags

| Thought | Reality |
|---|---|
| "I'll just add `.skip`" | Hides bug, no root-cause fix. |
| "I'll add hard sleep" | Masks race condition, increases flakiness. |
| "I'll lower assertion strength" | Creates false green. |
| "Passed once, done" | Must rerun to confirm determinism. |
| "I'll raise budget ad hoc" | Breaks control; escalate instead. |