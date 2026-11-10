# AGENTS.md — instruções para agentes de IA no KeepIT

Este arquivo vale para qualquer agente (Antigravity, Jules, Copilot, Codex, Claude Code, Cursor). Leia inteiro antes de qualquer tarefa. Ele só muda por PR aprovado pelo grupo.

## O projeto

KeepIT é um inventário virtual dos bens de uma Casa, com fotos, tags e planos de assinatura (Individual, Família, Business). Web responsivo. Projeto da disciplina Engenharia e Arquitetura de Sistemas (FECAP), desenvolvido por 5 pessoas, cada uma dona de um módulo.

## Fonte da verdade

1. `docs/specs/<módulo>.md` — regras de negócio e contrato de cada rota e tela. **Comece por aqui.**
2. `docs/specs/README.md` — convenções que valem para todos os módulos.
3. `docs/` — documentação técnica completa (casos de uso, diagramas, requisitos). Índice em `docs/README.md`.
4. `backend/prisma/schema.prisma` — o modelo de dados que vale.
5. O módulo `exemplo` (`backend/src/modules/exemplo/` e `frontend/src/features/exemplo/`) — o padrão de código a copiar.

Se a spec não responde uma dúvida de regra de negócio, **pergunte em vez de supor**. Nunca invente regra, campo, rota ou código de erro.

## Stack

- Monorepo com npm workspaces: `shared/`, `backend/`, `frontend/`. Node 22. TypeScript estrito em tudo.
- `backend/`: Express 5, Prisma 7 (PostgreSQL, adapter `@prisma/adapter-pg`), Zod 4, JWT, Vitest + Supertest.
- `frontend/`: React 19, Vite, React Router, TanStack Query, React Hook Form + Zod, Tailwind CSS 4, Vitest + Testing Library.
- `shared/`: schemas Zod, tipos, códigos de erro, papéis e planos usados pelos dois lados.

## Módulos e pastas

| Módulo                    | API                                 | Front                                 | Spec                                  |
| ------------------------- | ----------------------------------- | ------------------------------------- | ------------------------------------- |
| M1 · Autenticação e Conta | `backend/src/modules/auth/`         | `frontend/src/features/auth/`         | `docs/specs/M1-autenticacao-conta.md` |
| M2 · Casa e Membros       | `backend/src/modules/casa/`         | `frontend/src/features/casa/`         | `docs/specs/M2-casa-membros.md`       |
| M3 · Produtos e Tags      | `backend/src/modules/produtos/`     | `frontend/src/features/produtos/`     | `docs/specs/M3-produtos-tags.md`      |
| M4 · Estatísticas         | `backend/src/modules/estatisticas/` | `frontend/src/features/estatisticas/` | `docs/specs/M4-estatisticas.md`       |
| M5 · Planos e Assinatura  | `backend/src/modules/assinatura/`   | `frontend/src/features/assinatura/`   | `docs/specs/M5-planos-assinatura.md`  |

Compartilhado: `backend/src/middlewares/`, `backend/src/lib/`, `frontend/src/components/`, `frontend/src/lib/`, `shared/src/`.

## Comandos

```bash
npm install            # instala tudo (raiz)
npm run db:generate    # gera o Prisma Client (depois de instalar ou mudar o schema)
npm run dev            # API em :3333 e front em :5173
npm run verificar      # formatação + lint + tipos + testes (rode antes de entregar)
npm run lint:fix       # corrige o que o ESLint consegue
npm run format         # formata com Prettier
npm test -w backend    # só os testes da API
npm test -w frontend   # só os testes do front
```

## Padrões da API (`backend/`)

- Camadas por módulo, nesta ordem: `<m>.routes.ts` → middlewares → `<m>.controller.ts` → `<m>.service.ts` → Prisma. Arquivos `<m>.schema.ts` (Zod) e `<m>.test.ts` no mesmo diretório.
- **Rotas:** ligam URL a controller com `autenticar`, `exigirPapel(...)` e `validar({ body, query, params })`, nesta ordem. Registre o router do módulo em `backend/src/routes.ts`.
- **Controller:** lê `usuarioDa(req)`, `req.body`, `req.query`, chama o service e escolhe o status. Sem regra de negócio, sem Prisma.
- **Service:** regra de negócio e acesso ao banco via `import { prisma } from '../../lib/prisma'`. Sem `req`/`res`. Erro de negócio = `throw new AppError(status, 'CODIGO', 'mensagem')`.
- **Erros:** o middleware `tratarErros` responde `{ erro: { codigo, mensagem, detalhes? } }`. Use só códigos de `shared/src/erros.ts`.
- **Respostas:** recurso embrulhado pelo nome (`{ produto }`, `{ produtos }`). Criação 201, exclusão 204.
- **Escopo:** toda consulta filtra pelo `casaId` do usuário logado. Recurso de outra Casa → 404.
- **Entre módulos:** um módulo só importa outro pelo `<outro>.service` (o ESLint bloqueia o resto).
- **Variáveis de ambiente:** só por `env` (`backend/src/config/env.ts`), nunca `process.env` direto.

## Padrões do front-end (`frontend/`)

- `src/features/<módulo>/`: `<m>.api.ts` (uma função por rota, via `api()` de `src/lib/api.ts`), `<m>.hooks.ts` (TanStack Query), componentes da feature e seus testes.
- `src/pages/`: uma página por tela do protótipo; só monta layout e junta componentes da feature. Rotas em `src/routes.tsx` (tabela de telas no topo do arquivo).
- `src/components/`: componentes reutilizáveis (`Botao`, `Campo`, `Cartao`…). Antes de criar um novo, procure um existente.
- Formulários com React Hook Form + `zodResolver` e o schema de `@keepit/shared`.
- Erros da API chegam como `ApiError` com `codigo`; decida a mensagem ou a tela pelo código, não pelo texto.
- Estilo só com as classes do tema (`bg-primaria`, `text-texto-suave`, `border-borda`…), definidas em `src/index.css`. Sem cores soltas em hexadecimal.
- Acessibilidade: todo campo com rótulo, toda imagem com `alt`, erros com `role="alert"` (RNF19).
- O front nunca importa nada de `backend/` nem do Prisma.

## Testes

- Toda rota tem teste para: sem login (401), papel sem permissão (403), dados inválidos (422), cada erro de negócio do contrato e o caminho feliz.
- Na API, o Prisma é substituído por mock (`tests/prismaMock.ts`) e o login por `entrarComo(papel)` (`tests/auth.ts`). Veja `exemplo.test.ts`.
- No front, mocke o arquivo `<m>.api.ts` e teste pelo que o usuário vê (rótulos, papéis ARIA). Veja `FormTag.test.tsx`.
- Nunca altere ou apague um teste que falha só para ele passar. Explique o motivo e pergunte.

## Git

- Branch: `<tipo>/<módulo>-<resumo>` (tipos: feat, fix, test, docs, chore). Ex.: `feat/m3-post-produtos`.
- Commit: Conventional Commits em português. Ex.: `feat(m3): cria produto com fotos e tags`.
- **O agente não faz commit, push nem abre PR.** A pessoa revisa, faz o commit e abre o PR.

## O agente NÃO pode

- Mexer fora do módulo da tarefa, exceto o mínimo combinado no plano aprovado.
- Alterar `backend/prisma/schema.prisma`, `package.json`, `package-lock.json`, configs (ESLint, TypeScript, Vite, CI) ou este arquivo. Se precisar, diga o que precisaria mudar para a pessoa abrir uma issue.
- Instalar dependência nova.
- Criar código de erro, rota ou campo que não está na spec.
- Ler, criar ou commitar `.env` ou qualquer segredo.
- Apagar o módulo `exemplo`.

## Como trabalhar uma tarefa

No Antigravity, rode o workflow `/implementar-issue <número>` (`.agents/workflows/implementar-issue.md`). Em outra ferramenta, siga as instruções desse mesmo arquivo. O fluxo é: ler a issue e a spec → planejar e esperar aprovação → implementar seguindo o `exemplo` → testar com `npm run verificar` → entregar o walkthrough e parar antes do commit.
