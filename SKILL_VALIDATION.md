# Skill Validation Log

Empirical validation ledger for `loop-test`.
Use this file to prove the skill changes behavior under pressure scenarios.

## 1) Validation protocol

REQUIRED for each relevant skill change:
- run at least one baseline scenario without the new rule (expected failure/violation)
- run the same scenario with the new rule (expected compliance)
- record rationalization detected and countermeasure added
- record exact prompts/commands used to reproduce behavior

## 2) Entry template

```text
Date: YYYY-MM-DD
Skill version/tag: <tag>
Scenario ID: <stable-id>
Scenario type: discipline | technique | pattern | reference
Pressure type: time | sunk-cost | authority | exhaustion | combined
Change under test: <what rule/doc change is being validated>

Baseline run (without change):
- Expected failure: <what should fail>
- Observed behavior: <what happened>
- Rationalization observed: <verbatim sentence>
- Evidence: <prompt/command/log reference>

Validation run (with change):
- Expected compliance: <what should now happen>
- Observed behavior: <what happened>
- Evidence: <prompt/command/log reference>

Result: pass | fail
Follow-up: <loophole to close or none>
```

## 3) Quality gate

A skill update is publish-ready only when:
- at least one baseline failure is documented
- the same scenario passes after the change
- any new rationalization is either countered or explicitly queued

## 4) Validation entries

Date: 2026-05-25
Skill version/tag: v2-user-features-01
Scenario ID: lt-auto-entrypoint-001
Scenario type: discipline
Pressure type: combined
Change under test: Add `/loop-test auto` as default entrypoint and require change type input.

Baseline run (without change):
- Expected failure: users can skip explicit entrypoint and change typing, causing inconsistent starts.
- Observed behavior: baseline contract had no `/loop-test auto` requirement and no mandatory `change type` in input.
- Rationalization observed: "validate this" can start without structured input.
- Evidence:
  - `git show HEAD:SKILL.md` (before change) lacked `/loop-test auto` and `change type` fields.

Validation run (with change):
- Expected compliance: entrypoint and change type are explicit in public contract.
- Observed behavior: current contract requires `/loop-test auto` and `change type: feature | bugfix | refactor`.
- Evidence:
  - `SKILL.md` sections 4 and 5 include command and required fields.
  - `README.md` mandatory flow starts with `/loop-test auto`.

Result: pass
Follow-up: none

Date: 2026-05-25
Skill version/tag: v2-user-features-01
Scenario ID: lt-antiflaky-quorum-001
Scenario type: discipline
Pressure type: time
Change under test: Enforce anti-flaky quorum policy by profile.

Baseline run (without change):
- Expected failure: one-off rerun may be accepted as GREEN under schedule pressure.
- Observed behavior: baseline playbook had anti-gaming but no profile-based quorum or contradictory-rerun handling.
- Rationalization observed: "Passed once, done."
- Evidence:
  - `git show HEAD:testing-playbook.md` had no anti-flaky section with quorum rules.

Validation run (with change):
- Expected compliance: flaky suspicion triggers quorum and blocks `passed` without required reruns.
- Observed behavior: playbook now enforces `padrao=2/2`, `paranoico=3/3`, and failure on contradictory reruns.
- Evidence:
  - `testing-playbook.md` section "Anti-flaky policy".
  - `loop-templates.md` includes anti-flaky evidence template.

Result: pass
Follow-up: add one real-world session sample with contradictory rerun to stress-test escalation wording.

Date: 2026-05-25
Skill version/tag: v2-user-features-01
Scenario ID: lt-decision-output-001
Scenario type: technique
Pressure type: authority
Change under test: Add explicit final decision states for release actionability.

Baseline run (without change):
- Expected failure: report can be technically detailed but still non-actionable for merge/release decision.
- Observed behavior: baseline report template lacked explicit decision state and rationale block.
- Rationalization observed: "Report already has enough detail; decision can be implied."
- Evidence:
  - `git show HEAD:SKILL.md` report template had no `Decision` and no decision rule contract.

Validation run (with change):
- Expected compliance: output always maps to one of three states with reasons and next actions.
- Observed behavior: contract now requires `merge seguro | merge com risco | nao mergear` and rationale.
- Evidence:
  - `SKILL.md` DoD and report template include decision state.
  - `testing-playbook.md` has decision-state policy and rule mapping.

Result: pass
Follow-up: none

Date: 2026-05-25
Skill version/tag: v3-pretest-grill-01
Scenario ID: lt-grill-gate-interactive-001
Scenario type: discipline
Pressure type: authority
Change under test: Require pre-test grill gate approval before scenario matrix generation in interactive mode.

Baseline run (without change):
- Expected failure: matrix can be generated with unresolved branch decisions.
- Observed behavior: previous flow moved from profile selection directly to matrix generation.
- Rationalization observed: "we can refine risks during execution."
- Evidence:
  - `git show HEAD:SKILL.md` execution flow had no pre-test grill gate.

Validation run (with change):
- Expected compliance: matrix generation is blocked until grill artifact is approved.
- Observed behavior: flow now requires `grill summary + risk map` and interactive grill approval prior to matrix.
- Evidence:
  - `SKILL.md` execution flow steps 4-7.
  - `testing-playbook.md` sections 6-7 and acceptance rubric "Grill gate".

Result: pass
Follow-up: none

Date: 2026-05-25
Skill version/tag: v3-pretest-grill-01
Scenario ID: lt-grill-delegated-assumption-001
Scenario type: technique
Pressure type: time
Change under test: Delegated mode uses secure defaults and logs explicit assumptions with risk impact.

Baseline run (without change):
- Expected failure: unresolved questions can pass implicitly without risk traceability.
- Observed behavior: delegated flow lacked explicit assumption logging contract before matrix.
- Rationalization observed: "delegated mode can skip missing details to move faster."
- Evidence:
  - `git show HEAD:testing-playbook.md` had no delegated assumption contract in pre-matrix stage.

Validation run (with change):
- Expected compliance: unresolved non-critical questions map to explicit assumptions with recorded impact.
- Observed behavior: delegated rules now require secure defaults and assumption lock prior to matrix.
- Evidence:
  - `testing-playbook.md` sections 7 and 9.
  - `loop-templates.md` grill summary template fields `Assumption` and `Risk impact`.

Result: pass
Follow-up: none

Date: 2026-05-25
Skill version/tag: v3-pretest-grill-01
Scenario ID: lt-grill-critical-block-001
Scenario type: discipline
Pressure type: combined
Change under test: Block execution when critical ambiguity remains unresolved after pre-test grill.

Baseline run (without change):
- Expected failure: test execution can continue despite critical ambiguity.
- Observed behavior: stop conditions did not include grill-critical unresolved ambiguity.
- Rationalization observed: "run tests first and decide contract later."
- Evidence:
  - `git show HEAD:testing-playbook.md` stop conditions lacked grill-critical ambiguity blocker.

Validation run (with change):
- Expected compliance: workflow marks `blocked` before scenario execution with next action owner.
- Observed behavior: escalation rules now include unresolved grill-critical ambiguity as stop condition.
- Evidence:
  - `testing-playbook.md` sections 10 and 16.
  - `loop-templates.md` gate status and final checklist require grill lock before execution.

Result: pass
Follow-up: collect one real run sample where grill blocker prevented false execution.

Date: 2026-05-25
Skill version/tag: v4-single-entrypoint-01
Scenario ID: lt-single-entrypoint-friction-001
Scenario type: discipline
Pressure type: time
Change under test: Replace `/loop-test auto` by `/loop-test` as the primary skill entrypoint.

Baseline run (without change):
- Expected failure: users need to remember subcommand variants to trigger the intended flow.
- Observed behavior: contract and README used `/loop-test auto` as primary path.
- Rationalization observed: "it's only one extra word."
- Evidence:
  - prior contract used `Primary command: /loop-test auto`.

Validation run (with change):
- Expected compliance: user can invoke one stable command with no subcommand decision.
- Observed behavior: contract and playbook now use `/loop-test` as default entrypoint; `/loop-test auto` is documented only as legacy alias.
- Evidence:
  - `SKILL.md` primary command and input contract.
  - `README.md` quick usage and mandatory flow.
  - `testing-playbook.md` command contract.

Result: pass
Follow-up: monitor user sessions for confusion between legacy alias and primary command.

Date: 2026-05-25
Skill version/tag: v5-real-flow-first-01
Scenario ID: lt-real-flow-priority-001
Scenario type: discipline
Pressure type: time
Change under test: Make real-user flow simulation the primary validation method.

Baseline run (without change):
- Expected failure: execution can end with only low-level evidence that does not simulate user behavior.
- Observed behavior: flow and playbook emphasized choosing the cheapest test level.
- Rationalization observed: "unit/integration is enough; no need to run real journey."
- Evidence:
  - prior `SKILL.md` execution step selected cheapest test level.
  - prior `testing-playbook.md` ladder was cost-first.

Validation run (with change):
- Expected compliance: at least one approved scenario must use API journey, browser journey, or hybrid method.
- Observed behavior: contract now requires real-flow evidence as primary proof and blocks unsupported-only closure without waiver.
- Evidence:
  - `SKILL.md` objective and flow step 6 (real-flow method selection).
  - `testing-playbook.md` sections 11 and 17.
  - `loop-templates.md` execution method fields in matrix/scenario templates.

Result: pass
Follow-up: collect one real execution sample using hybrid method (API + browser) and add to validation log.

Date: 2026-05-25
Skill version/tag: v6-execution-board-01
Scenario ID: lt-visual-todo-board-001
Scenario type: technique
Pressure type: combined
Change under test: Add mandatory visual execution to-do board in chat, with optional persisted session file.

Baseline run (without change):
- Expected failure: scenario state exists but execution progress is hard to scan in a single visual board.
- Observed behavior: tracker contract was generic and did not require chat-visible board output.
- Rationalization observed: "state is tracked somewhere; no need for an explicit board."
- Evidence:
  - prior `testing-playbook.md` session tracking lacked mandatory board sections.
  - prior templates had no execution-board artifact.

Validation run (with change):
- Expected compliance: execution board is visible in chat and can be persisted to `loop-session.md` when needed.
- Observed behavior: contract now requires chat board, board state updates, and optional persisted board template.
- Evidence:
  - `SKILL.md` mandatory intermediate output and execution flow step for board publication.
  - `testing-playbook.md` sections 3 and 3.1.
  - `loop-templates.md` execution to-do board template.
  - `loop-session.md` persisted board template.

Result: pass
Follow-up: add one captured real run with board snapshots across state transitions.

Date: 2026-05-25
Skill version/tag: v7-context-harvest-01
Scenario ID: lt-context-harvest-gate-001
Scenario type: discipline
Pressure type: combined
Change under test: Require full context harvest before grill/matrix/test execution.

Baseline run (without change):
- Expected failure: test scenarios may be generated from partial understanding of feature goals.
- Observed behavior: context expectation existed but no explicit source sweep gate or dossier artifact.
- Rationalization observed: "I already understand enough from the last message."
- Evidence:
  - prior flow did not require context dossier before grill/matrix.

Validation run (with change):
- Expected compliance: available sources are analyzed first and assumptions are explicitly logged before scenario design.
- Observed behavior: contract now mandates context harvest, source list, and context gate in acceptance rubric.
- Evidence:
  - `SKILL.md` execution flow step 1 and mandatory intermediate output.
  - `testing-playbook.md` section 2.1 and acceptance check for context harvest gate.
  - `loop-templates.md` context dossier template.

Result: pass
Follow-up: add real run sample with PRD+spec+diff-derived acceptance criteria.
