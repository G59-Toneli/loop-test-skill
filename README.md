# loop-test

Skill pública para validação determinística de feature, bugfix e refactor via ciclo **fix -> test -> fix**, com controle de cenário, evidência e regressão final.

## O que esta skill resolve

- Evita falso verde (passar teste mascarando bug).
- Força correção de causa raiz em vez de patch cosmético.
- Mantém execução rastreável com checklist e estados por cenário.
- Padroniza escalonamento quando há bloqueio real (budget, dependência, decisão de produto).

## Quando usar

Use esta skill quando uma mudança já foi implementada e você precisa validar comportamento real com rigor antes de merge/release:

- nova feature com risco de regressão
- bugfix com histórico de flakiness/nondeterminismo
- refactor que pode quebrar contrato externo
- pedido explícito de validação em loop (`/loop-test`, "valida isso", "testa até estabilizar")

## Quando **não** usar

- teste unitário isolado sem risco multi-cenário
- debugging exploratório sem contrato de aceitação
- ajuste puramente visual/textual sem mudança de comportamento
- caso sem hipótese testável ou sem caminho de execução validável

## Fluxo obrigatório (resumo)

1. Entender escopo da mudança.
2. Escolher o menor nível de teste que prova o comportamento.
3. Propor matriz de cenários.
4. Pedir aprovação explícita da matriz ao usuário.
5. Executar cenário por cenário com estados rastreáveis.
6. Se falhar: diagnosticar raiz, corrigir, rerodar o mesmo cenário.
7. Após todos os aprovados passarem: regressão completa.
8. Entregar `loop-test report` estruturado.

## Estrutura do repositório

- `SKILL.md`: contrato principal da skill e fluxo mandatório.
- `testing-playbook.md`: ladder de níveis de teste, escalonamento e anti-gaming.
- `loop-templates.md`: templates operacionais (RED, REFACTOR, checklist).
- `cso-rules.md`: padrão de descrição/nomeação e regras de eficiência.
- `SKILL_EVOLUTION.md`: histórico e evolução da skill.

## Instalação da skill no Code Agent (Codex)

### 1) Criar diretório de skill

No ambiente do usuário que vai usar a skill:

```bash
mkdir -p ~/.agents/skills/loop-test
```

### 2) Copiar os arquivos da skill

Copie, no mínimo, `SKILL.md`. Recomendado copiar também os companion docs:

- `testing-playbook.md`
- `loop-templates.md`
- `cso-rules.md`

Exemplo (ajuste `<REPO_PATH>`):

```bash
cp <REPO_PATH>/SKILL.md ~/.agents/skills/loop-test/SKILL.md
cp <REPO_PATH>/testing-playbook.md ~/.agents/skills/loop-test/testing-playbook.md
cp <REPO_PATH>/loop-templates.md ~/.agents/skills/loop-test/loop-templates.md
cp <REPO_PATH>/cso-rules.md ~/.agents/skills/loop-test/cso-rules.md
```

### 3) Verificar instalação

```bash
ls ~/.agents/skills/loop-test
```

Você deve ver `SKILL.md` e os docs auxiliares.

### 4) Uso no Code Agent

No prompt do agente, invoque a skill pelo nome:

- `$loop-test`
- ou pedido explícito equivalente (ex.: "use loop-test para validar este bugfix")

## Compatibilidade

- Codex / Code Agent: `~/.agents/skills/<skill-name>/SKILL.md`
- Claude Code: `~/.claude/skills/<skill-name>/SKILL.md`

## Segurança e privacidade

- Nunca registrar segredo/token/PII em logs, prompts, screenshots ou exemplos.
- Sempre usar placeholders (`<API_TOKEN>`, `<TEST_ACCOUNT_EMAIL>`, `<PROJECT_PATH>`).
- Nunca testar em canal real de cliente sem isolamento e aprovação explícita.

## Licença

Defina a licença do projeto (ex.: MIT) em `LICENSE`.