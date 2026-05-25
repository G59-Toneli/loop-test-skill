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
