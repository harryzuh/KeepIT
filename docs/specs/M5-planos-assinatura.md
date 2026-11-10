# M5 · Planos e Assinatura

> Spec do módulo para o desenvolvimento. Fonte: documentação técnica (Fase 1) em `docs/`. Código em `backend/src/modules/assinatura/` e `frontend/src/features/assinatura/`.

Planos, assinatura, cancelamento, reativação e as rotinas agendadas.

## Regras de negócio

- Planos: Individual (grátis, 1 membro, 1 GB), Família (R$ 19,90, 6 membros, 20 GB) e Business (R$ 49,90, 15 membros, 100 GB). Valores em `shared/src/planos.ts` e no seed.
- O plano Individual não tem assinatura: é o plano da Casa quando não há assinatura vigente.
- Uma Casa tem no máximo uma assinatura vigente (ATIVA ou CANCELADA). Trocar de plano cria uma assinatura nova e encerra a anterior.
- Estados: PENDENTE → ATIVA (pagamento aprovado) → CANCELADA (renovação desligada, vale até a data de renovação) → EXPIRADA. Pagamento recusado: a assinatura PENDENTE é excluída.
- Pagamento simulado no MVP: o "gateway" é uma função do service que aprova ou recusa, mantendo o mesmo fluxo de estados.
- Qualquer papel vê os planos e pode assinar. Se quem assina não é ADMIN, o front mostra o aviso da tela 24; com o pagamento aprovado, a API cria uma Casa nova, move o usuário para ela como ADMIN, e os produtos dele ficam na Casa antiga.
- O plano escolhido precisa comportar os membros e o armazenamento atuais (422 PLANO_NAO_COMPORTA).
- Cancelar e reativar: só ADMIN. Cancelar envia e-mail com a data de término; reativar só antes da data de renovação.
- Rotina horária (`POST /internal/jobs`, chave em `x-jobs-key`): renova as assinaturas ATIVAS vencidas (pagamento simulado) ou as marca como EXPIRADAS; Casa expirada volta ao Individual, desvincula os membros extras (cada um ganha Casa própria) e mantém os produtos (RF37). A mesma rotina apaga as contas com exclusão solicitada há mais de 24 h (RNF16).
- Toda mudança de plano, assinatura ou cancelamento registra log de auditoria (RNF05).

## Operações da API

Cada operação abaixo vira uma issue (template "Tarefa"). Erros seguem o formato `{ erro: { codigo, mensagem, detalhes? } }` com os códigos de `shared/src/erros.ts`.

### GET /planos

- **Quem pode:** Qualquer papel
- **Entrada:** —
- **Pré-condições:** —
- **Pós-condições:** Planos com preço e limites
- **Erros:** —
- **Casos de uso e requisitos:** UC019 · RF12, RF14

### POST /assinaturas

- **Quem pode:** Qualquer papel
- **Entrada:** plano, método de pagamento, confirmação do aviso
- **Pré-condições:** Se não for ADMIN, aviso confirmado; membros e armazenamento cabem no plano
- **Pós-condições:** Assinatura ATIVA; se o titular era membro, Casa nova com ele como ADMIN; assinatura anterior encerrada; log registrado
- **Erros:** 402 PAGAMENTO_RECUSADO; 422 PLANO_NAO_COMPORTA
- **Casos de uso e requisitos:** UC028 a UC030 · RF13, RF15, RF38

### POST /assinaturas/atual/cancelar

- **Quem pode:** ADMIN
- **Entrada:** motivo (opcional)
- **Pré-condições:** Assinatura ATIVA
- **Pós-condições:** Assinatura CANCELADA; renovação desligada; e-mail com a data de término
- **Erros:** 403; 409 ESTADO_INVALIDO
- **Casos de uso e requisitos:** UC031 · RF16

### POST /assinaturas/atual/reativar

- **Quem pode:** ADMIN
- **Entrada:** —
- **Pré-condições:** Assinatura CANCELADA e data de renovação ainda não alcançada
- **Pós-condições:** Assinatura ATIVA; renovação religada
- **Erros:** 403; 409 ESTADO_INVALIDO
- **Casos de uso e requisitos:** UC031 · RF16

### POST /internal/jobs

- **Quem pode:** Rotina agendada (chave interna)
- **Entrada:** —
- **Pré-condições:** Chamada autenticada pelo workflow agendado
- **Pós-condições:** Assinaturas vencidas renovadas ou EXPIRADAS; contas com exclusão solicitada há mais de 24 h apagadas
- **Erros:** 401
- **Casos de uso e requisitos:** RF37 · RNF16

## Telas

| Tela | Nome |
| --- | --- |
| 13 | Planos |
| 14 | Pagamento |
| 15 | Cancelar assinatura (modal) |
| 24 | Assinar como membro (modal) |

Prints em `docs/01-modelagem-produto/` (proto-*.png) e no Figma "KeepIT — Protótipo MVP". Navegação entre telas: `docs/05-diagramas/processos-telas.png`.

## Requisitos funcionais

| ID | Nome | Prioridade | Descrição | Telas |
| --- | --- | --- | --- | --- |
| RF12 | Acessar Planos de Assinaturas | Importante | Permitir que o usuário visualize os planos de assinatura disponíveis. | 13 |
| RF13 | Alterar Plano de Assinatura | Importante | Permitir que o ADMIN troque o plano da Casa. A troca de plano gera uma nova assinatura. | 13, 14 |
| RF14 | Acessar Descrição do Plano | Desejável | Exibir informações e detalhes sobre o plano de assinatura. | 13 |
| RF15 | Configurar Método de Pagamento | Essencial | Permitir que o usuário cadastre ou altere seu método de pagamento. | 14 |
| RF16 | Cancelar Assinatura | Essencial | Permitir que o ADMIN cancele a assinatura atual. Os benefícios do plano continuam até a data de renovação. | 15 |
| RF37 | Expirar Assinatura | Essencial | Quando uma assinatura cancelada ou não renovada chega ao fim do período, o sistema devolve a Casa ao plano Individual, desvincula os membros extras e mantém os produtos. | — (rotina) |
| RF38 | Assinar Plano como Membro | Importante | Quando um EDITOR ou LEITOR assina um plano, o sistema avisa que ele sairá da Casa atual e criará uma Casa nova, da qual será o ADMIN. Cada usuário participa de uma Casa por vez. | 24 |

## Casos de uso

Detalhe completo (fluxos, validações) em `docs/05-diagramas/5.1-casos-de-uso.md`.

- **UC019 - Acessar Planos de Assinatura** — Permitir consultar os planos de assinatura disponíveis no KeepIt.
- **UC028 - Assinar Novo Plano** — Permitir que o usuário contrate um plano de assinatura do KeepIt.
- **UC029 - Plano Família** — Permitir visualizar e contratar o plano voltado para uso em família.
- **UC030 - Plano Business** — Permitir visualizar e contratar o plano Business.
- **UC031 - Cancelar Plano** — Permitir cancelar a assinatura atual do usuário.

## Dependências com outros módulos

- Usa `casa.service` (M2) para criar a Casa nova e mover membros.
- Exporta, no `assinatura.service`, a leitura do plano atual de uma Casa, usada por M2 (limite de membros), M3 (cota) e M4 (armazenamento).

## Dúvidas em aberto

Resolva com o grupo antes de implementar a parte afetada e registre a resposta aqui, por PR.

- [ ] Na expiração, quem são os "membros extras"? Interpretação: todos menos o ADMIN, já que o Individual permite 1 membro. Confirmar.
