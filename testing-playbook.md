# testing-playbook

## 1) Policy levels

- REQUIRED: mandatory for valid execution.
- RECOMMENDED: default behavior when context allows.
- OPTIONAL: situational enhancement.

## 2) Session tracking contract

REQUIRED:
- Track scenario progress in a session task tracker (checklist, table, or todo system).
- Update tracker state immediately after each scenario run.
- Keep evidence links/commands attached to each state transition.

RECOMMENDED:
- Use the environment-native tracker when available.

OPTIONAL:
- Use automation to synchronize tracker state with command outputs.

## 3) Execution mode contract

REQUIRED:
- `interactive` mode: explicit matrix approval before the first scenario run.
- `delegated` mode: acceptance criteria and scope must be locked before execution.
- Record selected mode in the final report.

RECOMMENDED:
- Default to `interactive` when scope ambiguity exists.

## 4) Test-level ladder (low cost -> high cost)

1. Unit: pure logic/helpers.
2. Service/integration: APIs, auth, data access, policies.
3. End-to-end: user journeys crossing boundaries.
4. Real external dependency: only when mocks hide behavior.

REQUIRED: never use a higher-cost level when a lower level can prove the same behavior.

## 5) Pressure scenario contract (required fields)

Every scenario spec MUST include:

| Field | Rule |
|---|---|
| `Scenario ID` | Stable ID reused in RED and GREEN |
| `Trigger` | Condition that activates the scenario |
| `Expected behavior` | Verifiable outcome (not vague intent) |
| `Failure signal` | Concrete assertion/log/state showing RED |
| `Pressure type` | Time, sunk-cost, authority, or exhaustion |
| `Countermeasure` | Rule that blocks the expected rationalization |
| `Result` | `pending/running/passed/failed/blocked/skipped-with-reason` |
| `Evidence` | Command + output/log reference for each transition |

REQUIRED:
- same `Scenario ID`, success criteria, and test level from RED to GREEN
- explicit justification if test level changes
- for feature validations, RED can be unmet acceptance criteria or negative-path proof

## 6) Scenario baseline

RECOMMENDED candidates for every matrix:
- golden path
- empty/null/undefined inputs
- boundary values
- unicode/special chars
- concurrency/race conditions
- authorization boundaries
- idempotency/retries/duplicates
- external failures (timeout/5xx/network/rate limit)
- malicious payload classes where relevant (XSS/SQLi/injection)

## 7) Scenario checklist model

REQUIRED states:
- `pending`
- `running`
- `passed`
- `failed`
- `blocked`
- `skipped-with-reason`

REQUIRED execution rules:
- run scenarios sequentially
- update state immediately after each run
- if one fails, diagnose and fix root cause before moving on
- never mark `passed` without successful rerun

## 8) Escalation gates

REQUIRED before starting:
- max paid-test budget per session
- max no-progress iterations per scenario

REQUIRED stop conditions:
- no measurable progress after max iterations
- paid budget reached
- fix requires product/spec decision
- critical dependency unavailable beyond retry window
- required credential/config missing and cannot be safely provisioned

## 9) Acceptance rubric (objective)

A loop-test execution is only valid when all REQUIRED checks pass:

| Check | Rule | Evidence |
|---|---|---|
| RED baseline | bugfix/refactor: failing scenario before fix; feature: unmet acceptance or negative-path proof before fix | failing command output + scenario state `failed` |
| GREEN validation | Same scenario passes after fix | successful rerun command output + state `passed` |
| REFACTOR closure | Root cause documented, not symptom patch | loop diary hypothesis/change/result fields filled |
| Scenario completeness | Every approved scenario ends with terminal state | no scenario left in `pending` or `running` |
| Final regression | Full regression runs after all scenario passes | regression command + result in final report |

REQUIRED release condition: all checks above pass, otherwise escalate.

## 10) Anti-gaming checks (false GREEN prevention)

REQUIRED integrity checks:
- Same scenario identity in RED and GREEN (`Scenario ID` unchanged).
- Same success criteria in RED and GREEN (no weakened assertions).
- Same test level in RED and GREEN unless explicitly justified and logged.
- Same failure class resolved (do not swap to another scenario to claim success).

REQUIRED invalidation triggers:
- assertion weakened after RED without approval
- scenario renamed/reframed to bypass failure
- flaky pass claimed from one-off run only
- skipped failing scenario without escalation

If any invalidation trigger occurs, mark scenario `failed`, log anti-gaming violation, and restart from RED.

## 11) Red flags

| Thought | Reality |
|---|---|
| "I'll just add `.skip`" | Hides bug, no root-cause fix. |
| "I'll add hard sleep" | Masks race condition, increases flakiness. |
| "I'll lower assertion strength" | Creates false green. |
| "Passed once, done" | Must rerun to confirm determinism. |
| "I'll raise budget ad hoc" | Breaks control; escalate instead. |
