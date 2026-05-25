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
