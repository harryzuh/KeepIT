---
description: Implementa uma issue do KeepIT seguindo o AGENTS.md e a spec do módulo. Para antes do commit.
---

# Implementar issue

Uso: `/implementar-issue <número da issue>`, seguido de observações opcionais.

Siga o AGENTS.md em todos os passos. Não faça commit, push nem abra PR: a pessoa faz isso depois de verificar.

## 1. Ler a issue

// turbo
Rode `gh issue view <número> --json number,title,body,labels`.

Se o gh não estiver disponível ou der erro, pare e peça para a pessoa colar o texto da issue.

Extraia da issue: módulo (M1 a M5), rota ou tela, quem pode, entrada, pré-condições, pós-condições, erros, casos de uso/RF e a seção da spec.
Se faltar algum desses campos, pare e liste o que falta. Não complete com suposição.

## 2. Ler o contexto

Leia, nesta ordem:

1. `AGENTS.md`
2. `docs/specs/README.md` e a seção da spec indicada na issue (`docs/specs/<módulo>.md`), incluindo "Regras de negócio", "Dependências" e "Dúvidas em aberto"
3. O módulo de exemplo: `backend/src/modules/exemplo/` (API) e/ou `frontend/src/features/exemplo/` e `frontend/src/pages/ExemploPage.tsx` (tela)
4. O código que já existe no módulo da issue
5. Se for tela: o print correspondente em `docs/01-modelagem-produto/`

Não altere outros módulos. Ler o `<outro>.service.ts` para usar uma função exportada é permitido.

## 3. Preparar a branch

Rode `git status` e `git branch --show-current`.

- Se houver mudanças não commitadas, pare e avise.
- Se estiver na `main`, rode `git pull` e crie a branch `<tipo>/<módulo>-<resumo>`, por exemplo `feat/m3-post-produtos`.
- Se já estiver na branch da issue, continue nela.

## 4. Planejar e esperar aprovação

Escreva o plano de implementação com:

- os arquivos que vai criar ou alterar, todos dentro do escopo do módulo;
- como cada pré-condição, pós-condição e erro do contrato será atendido;
- a lista de testes, com pelo menos um por pré-condição e um por erro;
- as dúvidas de regra de negócio que a spec não responde.

Pare e espere a aprovação. Se a pessoa comentar no plano, revise e espere de novo.

Se o trabalho exigir mudar `schema.prisma`, `package.json`, `AGENTS.md`, configs ou outro módulo, não faça a mudança. Diga o que precisaria mudar, para a pessoa abrir uma issue própria.

## 5. Implementar

Siga o padrão do módulo de exemplo:

- API: `<m>.routes.ts` → middlewares → `<m>.controller.ts` → `<m>.service.ts` → Prisma; registre o router em `backend/src/routes.ts`.
- Front: `<m>.api.ts` → `<m>.hooks.ts` (TanStack Query) → componentes (React Hook Form + Zod) → página em `src/pages/` → rota em `src/routes.tsx`.

Use os códigos de erro exatamente como estão na spec. Schemas Zod usados pelo front e pela API ficam em `shared/src/`.

## 6. Testar

Escreva os testes listados no plano.

// turbo
Rode `npm run verificar`.

Corrija até tudo passar. Se só a formatação falhar, rode `npm run format`. Não altere nem apague um teste que falha só para ele passar. Se achar que o teste está errado, explique e pergunte.

Se a issue for de tela, rode `npm run dev`, abra no navegador e confira o fluxo principal e pelo menos um caso de erro.

## 7. Entregar o walkthrough

Termine com um walkthrough contendo:

- o que foi feito, em linguagem simples;
- cada decisão que não estava escrita na spec;
- a lista de arquivos alterados;
- como testar manualmente;
- a mensagem de commit sugerida (Conventional Commits, em português);
- a descrição do PR preenchida no template (`.github/pull_request_template.md`), com `Closes #<número>`.

Não faça commit, push nem abra PR. Pare aqui.
