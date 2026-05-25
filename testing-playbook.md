# testing-playbook

## 1) Policy levels

- REQUIRED: mandatory for valid execution.
- RECOMMENDED: default behavior when context allows.
- OPTIONAL: situational enhancement.

## 2) Command contract

REQUIRED:
- Use `/loop-test auto` as the default entrypoint.
- Require change summary and change type (`feature | bugfix | refactor`) before scenario execution.

RECOMMENDED:
- Include touched files/modules to improve risk classification.

## 3) Session tracking contract

REQUIRED:
- Track scenario progress in a session tracker (checklist, table, or todo system).
- Update tracker state immediately after each scenario run.
- Keep evidence links/commands attached to each state transition.

RECOMMENDED:
- Use the environment-native tracker when available.

OPTIONAL:
- Use automation to synchronize tracker state with command outputs.

## 4) Execution mode contract

REQUIRED:
- `interactive` mode: explicit matrix approval before the first scenario run.
- `delegated` mode: acceptance criteria and scope must be locked before execution.
- Record selected mode in the final report.

RECOMMENDED:
- Default to `interactive` when scope ambiguity exists.

## 5) Risk classification and profile policy

Risk signals:
- `high`: auth/data-policy touch, cross-boundary contracts, uncertain blast radius
- `medium`: module-level contract change, integration surface changes
- `low`: localized pure-logic changes with stable interfaces

Profile selection rules:
- `rapido`: low risk by default, may be user-selected
- `padrao`: default for medium risk or ambiguous scope
- `paranoico`: high risk, flaky history, or explicit user request

REQUIRED:
- Record chosen risk class and profile in the report.

## 6) Test-level ladder (low cost -> high cost)

1. Unit: pure logic/helpers.
2. Service/integration: APIs, auth, data access, policies.
3. End-to-end: user journeys crossing boundaries.
4. Real external dependency: only when mocks hide behavior.

REQUIRED: never use a higher-cost level when a lower level can prove the same behavior.

## 7) Scenario matrix policy

REQUIRED candidates in the matrix:
- golden path
- one boundary/input-quality scenario
- one negative-path or external failure scenario

Conditional required candidates:
- include authorization boundary if auth/policy surface changed
- include idempotency/retry if write/reprocess behavior changed
- include concurrency/race if async/shared-state behavior changed
- include bug reproduction scenario for bugfix changes

RECOMMENDED:
- Add relevant scenarios from `loop-memory.md` when present.

## 8) Pressure scenario contract (required fields)

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

## 9) Scenario baseline

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

## 10) Scenario checklist model

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

## 11) Anti-flaky policy

Flaky suspicion triggers:
- same scenario alternates between pass/fail without code/config change
- time-sensitive assertions pass only after arbitrary sleep/retry
- one-off pass after prior deterministic failure

REQUIRED quorum by profile:
- `rapido`: 1/1 for non-suspect scenarios, escalate on flaky suspicion
- `padrao`: 2/2 for flaky-suspect scenarios
- `paranoico`: 3/3 for flaky-suspect scenarios

REQUIRED:
- Do not promote scenario to `passed` if quorum is not satisfied.
- If contradictory reruns persist after quorum attempt, mark `failed` and reopen root-cause loop.

## 12) Escalation gates

REQUIRED before starting:
- max paid-test budget per session
- max no-progress iterations per scenario
- regression tier selected (`targeted`, `suite`, `full`) with justification

REQUIRED defaults when not provided by user/spec:
- `max_no_progress_iterations_per_scenario = 2`
- `max_paid_test_budget_per_session = 0` (no paid test by default)

REQUIRED stop conditions:
- no measurable progress after max iterations
- paid budget reached
- fix requires product/spec decision
- critical dependency unavailable beyond retry window
- required credential/config missing and cannot be safely provisioned

RECOMMENDED tier mapping:
- `targeted`: localized change with low blast radius and no external contract change
- `suite`: medium blast radius or module-level contract touch
- `full`: cross-boundary change, auth/data-policy changes, or uncertain blast radius

## 13) Acceptance rubric (objective)

A loop-test execution is only valid when all REQUIRED checks pass:

| Check | Rule | Evidence |
|---|---|---|
| RED baseline | bugfix/refactor: failing scenario before fix; feature: unmet acceptance or negative-path proof before fix | failing command output + scenario state `failed` |
| GREEN validation | Same scenario passes after fix | successful rerun command output + state `passed` |
| REFACTOR closure | Root cause documented, not symptom patch | loop diary hypothesis/change/result fields filled |
| Scenario completeness | Every approved scenario ends with terminal state | no scenario left in `pending` or `running` |
| Final regression | Selected regression tier runs after all scenario passes | regression command + result in final report |
| Decision state | Final decision emitted with rationale | one of `merge seguro | merge com risco | nao mergear` plus reasons |

REQUIRED release condition: all checks above pass, otherwise escalate.

## 14) Decision-state policy

Decision rules:
- `merge seguro`: all required gates pass and no critical residual risk remains
- `merge com risco`: required gates pass, but explicit non-critical residual risks remain
- `nao mergear`: required gate fails, unresolved flakiness, or critical blocker remains

REQUIRED:
- Include actionable next step for any `merge com risco` or `nao mergear` decision.

## 15) Anti-gaming checks (false GREEN prevention)

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

## 16) Red flags

| Thought | Reality |
|---|---|
| "I'll just add `.skip`" | Hides bug, no root-cause fix. |
| "I'll add hard sleep" | Masks race condition, increases flakiness. |
| "I'll lower assertion strength" | Creates false green. |
| "Passed once, done" | Must rerun to confirm determinism. |
| "I'll raise budget ad hoc" | Breaks control; escalate instead. |
