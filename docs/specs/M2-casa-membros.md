# M2 · Casa e Membros

> Spec do módulo para o desenvolvimento. Fonte: documentação técnica (Fase 1) em `docs/`. Código em `backend/src/modules/casa/` e `frontend/src/features/casa/`.

Membros da Casa, papéis e as funções que garantem que todo usuário sempre tenha exatamente uma Casa.

## Regras de negócio

- Todo usuário participa de exatamente uma Casa por vez (`Membro.usuarioId` é único).
- Papéis: ADMIN (tudo), EDITOR (produtos e tags), LEITOR (só visualiza). As permissões são conferidas na API (RNF31).
- O ADMIN adiciona um usuário que já tem conta, pelo e-mail, escolhendo o papel. Esse usuário sai da Casa anterior e entra nesta (UC033, opção "por enquanto"; o fluxo de convite com aceite está no backlog). Ele recebe um aviso por e-mail.
- O número de membros não pode passar do limite do plano atual da Casa (RNF13): Individual 1, Família 6, Business 15. O plano atual vem da assinatura vigente; sem assinatura, é o Individual.
- O ADMIN não altera o próprio papel nem remove a si mesmo.
- Membro removido recebe uma Casa própria no plano Individual, como ADMIN. Os produtos que ele cadastrou continuam na Casa de onde saiu.
- Toda troca de Casa acontece dentro de uma transação, para nunca deixar um usuário sem Casa.

## Operações da API

Cada operação abaixo vira uma issue (template "Tarefa"). Erros seguem o formato `{ erro: { codigo, mensagem, detalhes? } }` com os códigos de `shared/src/erros.ts`.

### GET /casa/membros

- **Quem pode:** Qualquer papel
- **Entrada:** —
- **Pré-condições:** Usuário logado
- **Pós-condições:** Lista de membros, papéis e limite do plano
- **Erros:** —
- **Casos de uso e requisitos:** UC018, UC037 · RF25

### POST /casa/membros

- **Quem pode:** ADMIN
- **Entrada:** e-mail, papel
- **Pré-condições:** Conta existente; número de membros abaixo do limite do plano
- **Pós-condições:** Membro vinculado com o papel; sai da Casa anterior; aviso por e-mail
- **Erros:** 403 SEM_PERMISSAO; 404; 409 LIMITE_MEMBROS
- **Casos de uso e requisitos:** UC033, UC034 · RF26

### PATCH /casa/membros/:id

- **Quem pode:** ADMIN
- **Entrada:** papel
- **Pré-condições:** Membro da mesma Casa e diferente do próprio ADMIN
- **Pós-condições:** Papel alterado; log registrado
- **Erros:** 403; 404
- **Casos de uso e requisitos:** UC036 · RF28

### DELETE /casa/membros/:id

- **Quem pode:** ADMIN
- **Entrada:** —
- **Pré-condições:** Membro da mesma Casa e diferente do próprio ADMIN
- **Pós-condições:** Membro desvinculado e com Casa própria no plano Individual; produtos dele continuam na Casa
- **Erros:** 403; 404
- **Casos de uso e requisitos:** UC035 · RF27

## Telas

| Tela | Nome |
| --- | --- |
| 11 | Família |
| 12 | Adicionar membro |
| 22 | Gerenciar membro (modal) |

Prints em `docs/01-modelagem-produto/` (proto-*.png) e no Figma "KeepIT — Protótipo MVP". Navegação entre telas: `docs/05-diagramas/processos-telas.png`.

## Requisitos funcionais

| ID | Nome | Prioridade | Descrição | Telas |
| --- | --- | --- | --- | --- |
| RF25 | Acessar Membros da Familia | Importante | Permitir que o usuário visualize os membros cadastrados na família. | 11 |
| RF26 | Adicionar Membros na Familia | Importante | Permitir que o ADMIN adicione membros à Casa, definindo o papel de cada um (EDITOR ou LEITOR) e respeitando o limite de membros do plano. | 12 |
| RF27 | Remover Membros na Familia | Importante | Permitir que o ADMIN remova membros da Casa. Os produtos cadastrados pelo membro continuam na Casa. | 22 |
| RF28 | Editar permissões de Membros da Familia | Importante | Permitir que o ADMIN altere o papel de um membro da Casa (EDITOR ou LEITOR). | 22 |
| RF32 | Criar Casa Automaticamente | Essencial | Ao concluir o cadastro, o sistema cria uma Casa para o usuário com o plano Individual gratuito, e o usuário passa a ser o ADMIN dessa Casa. | 03 |

## Casos de uso

Detalhe completo (fluxos, validações) em `docs/05-diagramas/5.1-casos-de-uso.md`.

- **UC008 - Cadastrar conta** — Criar uma nova conta de usuário no sistema.
- **UC018 - Acessar Família/Grupo** — Permitir o acesso ao grupo ou família do usuário.
- **UC033 - Adicionar Novo Membro** — Permitir adicionar um novo membro ao grupo/família.
- **UC034 - Definir Papel do Membro** — Definir o papel de um membro da Casa (EDITOR ou LEITOR), que determina o que ele pode fazer no sistema.
- **UC035 - Remover Membro** — Remover um membro do grupo/família.
- **UC036 - Modificar Permissões (Papel) dos Membros** — Permitir alterar as permissões de acesso dos membros do grupo.
- **UC037 - Visualizar Membros do Grupo/Família** — Permitir visualizar os membros pertencentes ao grupo/família.

## Dependências com outros módulos

- Exporta, no `casa.service`, as funções `criarCasaIndividual(usuarioId, tx)` e `moverParaNovaCasa(usuarioId, tx)`, usadas por M1 (cadastro e exclusão) e M5 (assinatura feita por membro e expiração). Combine a assinatura dessas funções com M1 e M5 antes de implementar.

## Dúvidas em aberto

Resolva com o grupo antes de implementar a parte afetada e registre a resposta aqui, por PR.

- [ ] Se o usuário adicionado é ADMIN de outra Casa com membros, o que acontece com esses membros? Sugestão: bloquear com erro até ele remover os membros (exige código de erro novo na spec).
