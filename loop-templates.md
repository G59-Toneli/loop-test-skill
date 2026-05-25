# loop-templates

## Grill summary + risk map template

```text
Feature/Change: <name>
Change type: <feature | bugfix | refactor>
Execution mode: <interactive | delegated>
Risk class: <low | medium | high>
Profile: <rapido | padrao | paranoico>

Block decisions:
- Block: contract/api
  Decision: <resolved decision>
  Evidence source: <code | context | user input | assumption>
  Assumption: <none | explicit assumption>
  Risk impact: <low | medium | high>
  Scenario derivation: <required | optional | none>

- Block: data/state
  Decision: <resolved decision>
  Evidence source: <code | context | user input | assumption>
  Assumption: <none | explicit assumption>
  Risk impact: <low | medium | high>
  Scenario derivation: <required | optional | none>

- Block: auth/policy
  Decision: <resolved decision>
  Evidence source: <code | context | user input | assumption>
  Assumption: <none | explicit assumption>
  Risk impact: <low | medium | high>
  Scenario derivation: <required | optional | none>

- Block: external failures
  Decision: <resolved decision>
  Evidence source: <code | context | user input | assumption>
  Assumption: <none | explicit assumption>
  Risk impact: <low | medium | high>
  Scenario derivation: <required | optional | none>

- Block: concurrency/idempotency
  Decision: <resolved decision>
  Evidence source: <code | context | user input | assumption>
  Assumption: <none | explicit assumption>
  Risk impact: <low | medium | high>
  Scenario derivation: <required | optional | none>

- Block: observability/recovery
  Decision: <resolved decision>
  Evidence source: <code | context | user input | assumption>
  Assumption: <none | explicit assumption>
  Risk impact: <low | medium | high>
  Scenario derivation: <required | optional | none>

Gate status:
- Interactive approval: <approved | needs-edit>
- Delegated assumption lock: <locked | blocked>
```

## Scenario matrix template

```text
Feature/Change: <name>
Change type: <feature | bugfix | refactor>
Execution mode: <interactive | delegated>
Risk class: <low | medium | high>
Profile: <rapido | padrao | paranoico>
Primary test level: <unit | integration | e2e | real dependency>
Regression tier: <targeted | suite | full>
Source grill artifact: <reference>

Scenarios:
- Scenario ID: <id-01>
  Name: <clear name>
  Class: <golden-path | boundary | negative-path | auth | concurrency | idempotency | bug-repro | memory-regression | assumption-validation>
  Trigger: <condition>
  Failure signal (RED): <assertion/log/state>
  Pass criteria (GREEN): <verifiable pass rule>
  Test level: <unit | integration | e2e | real dependency>
  Derived from: <block/risk/assumption>
  Status: pending
```

## Pressure scenario spec template

```text
Scenario ID: <stable-id>
Scenario Name: <clear-name>
Trigger: <when this scenario must run>
Expected behavior: <verifiable expected outcome>
Failure signal (RED): <assertion/log/state that proves failure>
Pressure type: <time | sunk-cost | authority | exhaustion>
Expected rationalization: <likely shortcut/excuse>
Countermeasure rule: <explicit rule that blocks shortcut>
Test level: <unit | integration | e2e | real dependency>
Evidence references:
- RED command + output
- GREEN rerun command + output
Status: pending | running | passed | failed | blocked | skipped-with-reason
```

## RED scenario template

```text
Scenario ID: <id>
Scenario Name: <name>
Goal: <expected behavior>
Preconditions:
- <condition 1>
- <condition 2>
Command:
- <exact command>
Expected failure signal:
- <error/assertion/state>
Observed result:
- pass | fail
Evidence:
- <log path/output snippet reference>
```

## Rationalization log template

```text
Timestamp: <YYYY-MM-DD HH:MM>
Scenario ID: <id>
Pressure context: <time/sunk-cost/authority/exhaustion>
Rationalization detected: <exact sentence>
Why invalid: <technical reason>
Counter rule added: <new REQUIRED statement>
Retest command: <exact command>
Retest result: pass | fail
```

## Anti-flaky evidence template

```text
Scenario ID: <id>
Profile: <rapido | padrao | paranoico>
Flaky suspicion trigger:
- <why this looked flaky>
Quorum target:
- <1/1 | 2/2 | 3/3>
Reruns:
- run 1: pass | fail (<evidence ref>)
- run 2: pass | fail (<evidence ref>)
- run 3: pass | fail (<evidence ref>)
Conclusion:
- stable-pass | unstable-fail | escalate
Action:
- <next step>
```

## REFACTOR evidence template

```text
Scenario ID: <id>
Root cause:
- <technical cause>
Fix:
- <code/config/test change>
Why this fixes root cause:
- <causal explanation>
Regression risk:
- <what could break>
Mitigation:
- <test or guardrail>
Verification:
- <rerun command + result>
```

## Final checklist template

```text
[ ] Risk class and profile recorded
[ ] Grill summary + risk map created
[ ] Grill gate approved/locked per mode
[ ] Scenario matrix approved/locked per mode
[ ] RED baseline captured
[ ] GREEN rerun passed on same scenario
[ ] Anti-flaky quorum satisfied when applicable
[ ] REFACTOR evidence logged
[ ] Scenario terminal state set
[ ] Final risk-tier regression passed
[ ] Decision state emitted (merge seguro | merge com risco | nao mergear)
```
