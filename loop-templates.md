# loop-templates

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
[ ] RED baseline captured
[ ] GREEN rerun passed on same scenario
[ ] REFACTOR evidence logged
[ ] Scenario terminal state set
[ ] Final full regression passed
```