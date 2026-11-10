# Specs dos módulos

Uma spec por módulo, montada a partir da documentação técnica: regras de negócio, contrato de cada rota (Tabela 17), telas, requisitos, casos de uso, dependências e dúvidas em aberto. É daqui que saem as issues e é isto que o agente lê antes de implementar.

| Módulo | Spec | Rotas | Telas |
| --- | --- | --- | --- |
| M1 · Autenticação e Conta | [M1-autenticacao-conta.md](M1-autenticacao-conta.md) | 8 | 01, 02, 03, 04, 16, 18, 19, 20, 21 |
| M2 · Casa e Membros | [M2-casa-membros.md](M2-casa-membros.md) | 4 | 11, 12, 22 |
| M3 · Produtos e Tags | [M3-produtos-tags.md](M3-produtos-tags.md) | 7 | 06, 07, 08, 09, 23 |
| M4 · Estatísticas | [M4-estatisticas.md](M4-estatisticas.md) | 1 | 05, 10, 17 |
| M5 · Planos e Assinatura | [M5-planos-assinatura.md](M5-planos-assinatura.md) | 5 | 13, 14, 15, 24 |

## Convenções que valem para todos os módulos

- **Autenticação:** toda rota, exceto as de visitante e a da rotina, usa o middleware `autenticar`, que preenche `req.usuario` com `{ id, casaId, papel }` lidos do banco.
- **Permissão:** papéis conferidos na API com `exigirPapel(...)` (RNF31). Esconder botão no front não substitui isso.
- **Escopo da Casa:** toda consulta filtra por `casaId` do usuário logado. Recurso de outra Casa responde 404, nunca 403, para não revelar que existe.
- **Validação:** schemas Zod; os usados também no front ficam em `shared/src/`. Erro de validação é sempre 422 DADOS_INVALIDOS.
- **Erros:** `{ erro: { codigo, mensagem, detalhes? } }`, com o código de `shared/src/erros.ts`. Código novo só entra com atualização da spec.
- **Respostas:** o recurso vai embrulhado pelo nome: `{ produto }`, `{ produtos }`, `{ assinatura, casa }`. Criação responde 201; exclusão, 204.
- **Auditoria:** mudanças de plano, assinatura, cancelamento e exclusão de produto gravam um LogAuditoria (RNF05).
- **Transações:** operação que grava em mais de uma tabela usa `prisma.$transaction`.

## Como uma linha da spec vira issue

1. Escolha uma operação (`### POST /produtos`) ou uma tela.
2. Abra uma issue com o template **Tarefa** e copie os campos: quem pode, entrada, pré-condições, pós-condições, erros e rastreio.
3. Em "Seção da spec", cole o link da operação (ex.: `docs/specs/M3-produtos-tags.md#post-produtos`).
4. Rode `/implementar-issue <número>` no Antigravity.

Se a implementação revelar uma regra que a spec não tem, a resposta vai para a spec, por PR, e não só para a conversa com o agente.
