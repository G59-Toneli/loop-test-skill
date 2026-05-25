# loop-memory

Optional cross-session memory for regression scenarios.  
If this file does not exist, loop-test must still run normally.

## 1) Usage rules

- REQUIRED: memory only adds or reprioritizes scenarios; it never replaces mandatory current-scope scenarios.
- REQUIRED: keep entries sanitized (no secrets, no PII, no private URLs).
- RECOMMENDED: keep only high-signal regressions that can repeat.

## 2) Entry template

```text
Memory ID: <mem-YYYYMMDD-XX>
Area fingerprint: <module/feature/API surface>
Change type: <feature | bugfix | refactor>
Failure class: <auth | race | idempotency | boundary | external-timeout | contract-break | other>
Scenario ID reference: <stable-id>
Scenario summary: <one-line scenario intent>
Failure signal: <assertion/log/state class>
Pass criteria: <verifiable condition>
Suggested test level: <unit | integration | e2e | real dependency>
Last validation date: <YYYY-MM-DD>
Last result: <passed | failed | escalated>
Evidence ref: <report/log reference>
Retention: <keep | archive>
```

## 3) Selection heuristics

- Prefer entries matching changed modules/contracts first.
- Prefer entries with recurring failure classes.
- Skip archived entries unless user explicitly requests full historical replay.

## 4) Minimal example

```text
Memory ID: mem-20260525-01
Area fingerprint: billing-webhook-handler
Change type: bugfix
Failure class: idempotency
Scenario ID reference: scn-billing-dup-001
Scenario summary: duplicate webhook delivery must not double-charge
Failure signal: charge count > 1 for same idempotency key
Pass criteria: exactly one persisted successful charge
Suggested test level: integration
Last validation date: 2026-05-25
Last result: passed
Evidence ref: reports/loop-test-2026-05-25.md
Retention: keep
```
