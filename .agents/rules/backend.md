---
trigger: glob
globs: backend/**
description: Padrões da API do KeepIT (Express + Prisma)
---

# Regras ao trabalhar em backend/

- Copie a estrutura de `backend/src/modules/exemplo/`: routes → controller → service → Prisma, com `.schema.ts` e `.test.ts`.
- Ordem dos middlewares na rota: `autenticar` → `exigirPapel(...)` → `validar({...})` → controller.
- Controller não acessa o Prisma nem decide regra; service não conhece `req`/`res`.
- Erro de negócio: `throw new AppError(status, 'CODIGO', 'mensagem')` com código de `shared/src/erros.ts`.
- Toda consulta filtra pelo `casaId` de `usuarioDa(req)`; recurso de outra Casa responde 404.
- Gravação em mais de uma tabela: `prisma.$transaction(async (tx) => ...)`.
- Mudança de plano, assinatura, cancelamento ou exclusão de produto: grave `LogAuditoria` (RNF05).
- Testes com `criarPrismaMock()` e `entrarComo(papel)`; cubra 401, 403, 422, cada erro do contrato e o caminho feliz.
- Não altere `prisma/schema.prisma`, migrations nem `package.json`.
