# loop-session

Optional persisted execution board for one loop-test run.

## loop-test execution board

Session:
- Feature/Change: <name>
- Change type: <feature | bugfix | refactor>
- Execution mode: <interactive | delegated>
- Risk class: <low | medium | high>
- Profile: <rapido | padrao | paranoico>
- Primary validation method: <api-journey | browser-journey | hybrid | mixed>

Items:
- [pending|running|passed|failed|blocked|skipped-with-reason] setup-001: scope/profile/method lock
- [pending|running|passed|failed|blocked|skipped-with-reason] grill-001: pre-test grill gate
- [pending|running|passed|failed|blocked|skipped-with-reason] scn-<id>: <scenario name>
- [pending|running|passed|failed|blocked|skipped-with-reason] reg-001: risk-tier regression
- [pending|running|passed|failed|blocked|skipped-with-reason] decision-001: final decision emission

Evidence links:
- scn-<id> -> <command/log ref>
- reg-001 -> <command/log ref>

Notes:
- Keep this file optional. Chat board remains mandatory.
