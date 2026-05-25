# testing-playbook

## 1) Policy levels

- REQUIRED: mandatory for valid execution.
- RECOMMENDED: default behavior when context allows.
- OPTIONAL: situational enhancement.

## 2) Command contract

REQUIRED:
- Use `/loop-test` as the default entrypoint.
- Require change summary and change type (`feature | bugfix | refactor`) before scenario execution.

RECOMMENDED:
- Include touched files/modules to improve risk classification.

## 2.1) Context harvest policy

Context harvest is REQUIRED before grill and scenario matrix generation.

Required source sweep (use whatever is available):
- chat context
- PRD
- technical spec
- task/ticket
- PR/diff and changed files
- execution logs/errors

REQUIRED:
- publish a `context dossier` with:
  - sources analyzed
  - objective and acceptance criteria extracted
  - constraints and non-goals identified
  - missing context list
  - explicit assumptions adopted
- no scenario matrix generation before context dossier exists.

RECOMMENDED:
- when source exists but is not read, log reason explicitly.

## 3) Session tracking contract

REQUIRED:
- Track progress in an execution to-do board (checklist/table with explicit states).
- Keep the board visible in chat output during execution.
- Update tracker state immediately after each transition.
- Keep evidence links/commands attached to each state transition.

RECOMMENDED:
- Use the environment-native tracker when available.
- Persist the board in `loop-session.md` when persistence/history is useful.

OPTIONAL:
- Use automation to synchronize tracker state with command outputs.

## 3.1) Execution to-do board contract

REQUIRED board sections:
- setup (scope, mode, profile, method)
- context harvest gate
- pre-test grill gate
- scenario execution items
- regression item
- final decision item

REQUIRED board states:
- `pending`
- `running`
- `passed`
- `failed`
- `blocked`
- `skipped-with-reason`

REQUIRED:
- one board line per approved scenario (`Scenario ID`).
- board refresh after every scenario transition.
- final report must reconcile board terminal states.

## 4) Execution mode contract

REQUIRED:
- `interactive` mode: explicit approval gates before execution phases.
- `delegated` mode: acceptance criteria and scope must be locked before scenario execution.
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

## 6) Pre-test grill policy

Pre-test grill is REQUIRED for `/loop-test` before scenario matrix generation.

Required domain blocks:
1. contract/api
2. data/state
3. auth/policy
4. external failures
5. concurrency/idempotency
6. observability/recovery

REQUIRED:
- Walk all six blocks before matrix generation.
- For each unresolved question, provide a recommended default.
- If a question can be answered from code/context, resolve it without asking the user.

## 7) Grill interaction rules

`interactive` mode:
- Ask and resolve decisions in domain blocks.
- Present `grill summary + risk map`.
- Require explicit approval (`approve | edit | add risk | add assumption`) before generating matrix.

`delegated` mode:
- Do not block on missing non-critical answers.
- Apply secure defaults and log assumptions with risk impact.
- Promote unresolved high-impact ambiguity to blocking condition.

## 8) Grill budget by profile

REQUIRED limits:
- `rapido`: 1 decision-question per block (max 6)
- `padrao`: 2 decision-questions per block (max 12)
- `paranoico`: 3 decision-questions per block (max 18)

REQUIRED:
- Respect profile limits unless user explicitly upgrades profile.
- Prioritize high-risk branches first if budget is exhausted.

## 9) Grill output contract

`grill summary + risk map` MUST include, per block:
- decision
- evidence source (`code | context | user input | assumption`)
- assumption (if any)
- risk impact (`low | medium | high`)
- scenario derivation flag (`required | optional | none`)

REQUIRED:
- No scenario matrix generation before this artifact exists.

## 10) Scenario matrix derivation policy

REQUIRED derivation rules:
- each `high` risk item in grill output => at least one required scenario
- each critical assumption => at least one assumption-validation scenario
- each bugfix reproduction branch => one mandatory RED reproduction scenario
- each unresolved critical ambiguity => `blocked` before scenario execution
- at least one primary scenario must be mapped to real-flow validation (`api-journey` and/or `browser-journey`)
- context-dossier assumptions must map to explicit scenario coverage or accepted waivers

RECOMMENDED:
- Add relevant scenarios from `loop-memory.md` when present.

## 11) Validation method policy (real-flow first)

Primary methods:
1. `api-journey`: real endpoint flow with realistic request/response sequence.
2. `browser-journey`: UI flow automation (Playwright and/or MCP Chrome DevTools).
3. `hybrid`: browser + API combined to validate full cross-boundary behavior.

Supportive methods:
4. `service-integration`: lower-level service checks.
5. `unit`: pure logic/helper checks.

REQUIRED:
- Use real-flow methods (`api-journey`, `browser-journey`, or `hybrid`) as primary evidence.
- Supportive methods cannot be the only evidence for user-facing behavior unless no runnable real-flow path exists.
- If real-flow path is unavailable, log explicit block or waiver with technical reason and owner.

## 12) Pressure scenario contract (required fields)

Every scenario spec MUST include:

| Field | Rule |
|---|---|
| `Scenario ID` | Stable ID reused in RED and GREEN |
| `Trigger` | Condition that activates the scenario |
| `Expected behavior` | Verifiable outcome (not vague intent) |
| `Failure signal` | Concrete assertion/log/state showing RED |
| `Execution method` | `api-journey | browser-journey | hybrid | service-integration | unit` |
| `Pressure type` | Time, sunk-cost, authority, or exhaustion |
| `Countermeasure` | Rule that blocks the expected rationalization |
| `Result` | `pending/running/passed/failed/blocked/skipped-with-reason` |
| `Evidence` | Command + output/log reference for each transition |

REQUIRED:
- same `Scenario ID`, success criteria, and execution method from RED to GREEN
- explicit justification if execution method changes
- for feature validations, RED can be unmet acceptance criteria or negative-path proof

## 13) Scenario baseline

RECOMMENDED candidates for every matrix:
- golden path
- real user journey path
- empty/null/undefined inputs
- boundary values
- unicode/special chars
- concurrency/race conditions
- authorization boundaries
- idempotency/retries/duplicates
- external failures (timeout/5xx/network/rate limit)
- malicious payload classes where relevant (XSS/SQLi/injection)

## 14) Scenario checklist model

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

## 15) Anti-flaky policy

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

## 16) Escalation gates

REQUIRED before starting scenario execution:
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
- pre-test grill critical ambiguity remains unresolved
- context harvest failed to establish objective/acceptance criteria

RECOMMENDED tier mapping:
- `targeted`: localized change with low blast radius and no external contract change
- `suite`: medium blast radius or module-level contract touch
- `full`: cross-boundary change, auth/data-policy changes, or uncertain blast radius

## 17) Acceptance rubric (objective)

A loop-test execution is only valid when all REQUIRED checks pass:

| Check | Rule | Evidence |
|---|---|---|
| Context harvest gate | context dossier exists and covers available sources + assumptions | dossier artifact + source list |
| Grill gate | pre-test grill output exists and gate passed (`interactive` approved or `delegated` assumptions logged) | grill artifact + gate evidence |
| Real-flow evidence | at least one approved scenario validated via `api-journey`, `browser-journey`, or `hybrid` | scenario method + execution evidence |
| RED baseline | bugfix/refactor: failing scenario before fix; feature: unmet acceptance or negative-path proof before fix | failing command output + scenario state `failed` |
| GREEN validation | Same scenario passes after fix | successful rerun command output + state `passed` |
| REFACTOR closure | Root cause documented, not symptom patch | loop diary hypothesis/change/result fields filled |
| Scenario completeness | Every approved scenario ends with terminal state | no scenario left in `pending` or `running` |
| Final regression | Selected regression tier runs after all scenario passes | regression command + result in final report |
| Decision state | Final decision emitted with rationale | one of `merge seguro | merge com risco | nao mergear` plus reasons |

REQUIRED release condition: all checks above pass, otherwise escalate.

## 18) Decision-state policy

Decision rules:
- `merge seguro`: all required gates pass and no critical residual risk remains
- `merge com risco`: required gates pass, but explicit non-critical residual risks remain
- `nao mergear`: required gate fails, unresolved flakiness, or critical blocker remains

REQUIRED:
- Include actionable next step for any `merge com risco` or `nao mergear` decision.

## 19) Anti-gaming checks (false GREEN prevention)

REQUIRED integrity checks:
- Same scenario identity in RED and GREEN (`Scenario ID` unchanged).
- Same success criteria in RED and GREEN (no weakened assertions).
- Same execution method in RED and GREEN unless explicitly justified and logged.
- Same failure class resolved (do not swap to another scenario to claim success).
- Grill-derived required scenarios are not removed without logged approval.

REQUIRED invalidation triggers:
- assertion weakened after RED without approval
- scenario renamed/reframed to bypass failure
- flaky pass claimed from one-off run only
- skipped failing scenario without escalation
- skipping pre-test grill or bypassing grill approval gate
- skipping available context source without logging

If any invalidation trigger occurs, mark scenario `failed`, log anti-gaming violation, and restart from RED.

## 20) Red flags

| Thought | Reality |
|---|---|
| "We'll save time by skipping grill" | Increases blind spots and false-green probability. |
| "I'll just add `.skip`" | Hides bug, no root-cause fix. |
| "I'll add hard sleep" | Masks race condition, increases flakiness. |
| "I'll lower assertion strength" | Creates false green. |
| "Passed once, done" | Must rerun to confirm determinism. |
| "I'll raise budget ad hoc" | Breaks control; escalate instead. |
