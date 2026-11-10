# M4 · Estatísticas

> Spec do módulo para o desenvolvimento. Fonte: documentação técnica (Fase 1) em `docs/`. Código em `backend/src/modules/estatisticas/` e `frontend/src/features/estatisticas/`.

Números do patrimônio da Casa nas telas Início e Estatísticas. O dono do M4 também faz o layout base do front-end (barra de navegação, estrutura responsiva das telas), usado por todos.

## Regras de negócio

- Qualquer papel vê as estatísticas da própria Casa.
- Indicadores: valor total, maior gasto, valor médio, valor por tag, tag mais comprada, produtos mais antigos e armazenamento usado contra o limite do plano (RF23, RF24).
- A tela 05 mostra também os últimos produtos adicionados, com quem adicionou (RF11); a tela 17 é a mesma tela no desktop.
- Os cálculos ficam no service, com consultas agregadas do Prisma; o front só exibe.

## Operações da API

Cada operação abaixo vira uma issue (template "Tarefa"). Erros seguem o formato `{ erro: { codigo, mensagem, detalhes? } }` com os códigos de `shared/src/erros.ts`.

### GET /estatisticas

- **Quem pode:** Qualquer papel
- **Entrada:** —
- **Pré-condições:** Usuário logado
- **Pós-condições:** Valor total, maior gasto, valor médio, valor por tag, tag mais comprada, mais antigos, armazenamento
- **Erros:** —
- **Casos de uso e requisitos:** UC017, UC027 · RF23, RF24

## Telas

| Tela | Nome |
| --- | --- |
| 05 | Início |
| 10 | Estatísticas |
| 17 | Início (desktop) |

Prints em `docs/01-modelagem-produto/` (proto-*.png) e no Figma "KeepIT — Protótipo MVP". Navegação entre telas: `docs/05-diagramas/processos-telas.png`.

## Requisitos funcionais

| ID | Nome | Prioridade | Descrição | Telas |
| --- | --- | --- | --- | --- |
| RF23 | Acessar Estatísticas | Desejável | Permitir que o usuário visualize estatísticas relacionadas à sua conta e produtos. | 10 |
| RF24 | Acessar Dashboard | Importante | Permitir que o usuário acesse o painel principal com informações do sistema. | 05, 17 |

## Casos de uso

Detalhe completo (fluxos, validações) em `docs/05-diagramas/5.1-casos-de-uso.md`.

- **UC017 - Acessar Dashboard** — Apresentar um resumo das informações do inventário.
- **UC027 - Visualizar estatísticas** — Consultar os dados estatísticos do usuário.

## Dependências com outros módulos

- Layout base: barra inferior (Início, Produtos, +, Família, Conta) e cabeçalho, em `frontend/src/components/`. Os outros módulos dependem disso para montar as telas; priorize.

## Dúvidas em aberto

Resolva com o grupo antes de implementar a parte afetada e registre a resposta aqui, por PR.

- [ ] Valor total considera preço × quantidade ou só o preço? (O protótipo mostra o total da Casa; confirmar a regra.)
- [ ] Tag mais comprada é por número de produtos ou por valor?
