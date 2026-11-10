# M3 · Produtos e Tags

> Spec do módulo para o desenvolvimento. Fonte: documentação técnica (Fase 1) em `docs/`. Código em `backend/src/modules/produtos/` e `frontend/src/features/produtos/`.

Cadastro, consulta, edição e exclusão de produtos, com fotos e tags.

## Regras de negócio

- Só ADMIN e EDITOR criam, editam e excluem produtos e tags; LEITOR só consulta.
- Produto duplicado = outro produto com o mesmo nome na mesma Casa, sem diferenciar maiúsculas de minúsculas. A API responde 409 PRODUTO_DUPLICADO com o produto existente, e o front abre o modal da tela 09 com três opções: somar a quantidade ao existente, cadastrar mesmo assim ou cancelar. A opção escolhida volta no reenvio.
- Até 3 fotos por produto, JPEG ou PNG, até 5 MB cada (RNF08, RNF09).
- Upload: o front pede uma URL assinada (válida por 5 minutos) e envia a foto direto ao armazenamento S3; a API só guarda a chave e o tamanho em Foto.
- Cota de armazenamento por plano: soma de `Foto.tamanhoBytes` da Casa contra o limite do plano (Individual 1 GB, Família 20 GB, Business 100 GB). Sem espaço: 422 COTA_EXCEDIDA.
- Criar produto grava produto, fotos e vínculos de tags em uma única transação.
- Excluir produto remove fotos e vínculos e registra log de auditoria (RNF05). A exclusão no front sempre passa pelo modal de confirmação (tela 23, RNF12).
- Tags são únicas por Casa (409 TAG_EXISTENTE). Busca de produtos por nome e filtro por tag (RF34).
- Produtos de quem saiu ou excluiu a conta continuam na Casa; o autor aparece como nulo.

## Operações da API

Cada operação abaixo vira uma issue (template "Tarefa"). Erros seguem o formato `{ erro: { codigo, mensagem, detalhes? } }` com os códigos de `shared/src/erros.ts`.

### GET /produtos

- **Quem pode:** Qualquer papel
- **Entrada:** busca, tag
- **Pré-condições:** Usuário logado
- **Pós-condições:** Produtos da Casa filtrados
- **Erros:** —
- **Casos de uso e requisitos:** UC016 · RF10, RF34

### GET /produtos/:id

- **Quem pode:** Qualquer papel
- **Entrada:** —
- **Pré-condições:** Produto da Casa do usuário
- **Pós-condições:** Detalhe com fotos, tags e autor
- **Erros:** 404
- **Casos de uso e requisitos:** UC024 · RF36

### POST /produtos/fotos/upload-url

- **Quem pode:** ADMIN, EDITOR
- **Entrada:** tipo, tamanho
- **Pré-condições:** JPEG ou PNG com até 5 MB; espaço disponível no plano
- **Pós-condições:** URL assinada válida por 5 minutos
- **Erros:** 403; 422 ARQUIVO_INVALIDO; 422 COTA_EXCEDIDA
- **Casos de uso e requisitos:** UC021 · RF05, RF39

### POST /produtos

- **Quem pode:** ADMIN, EDITOR
- **Entrada:** dados, fotos (até 3), tags, opção para duplicado
- **Pré-condições:** Dados válidos; se houver duplicado, opção escolhida
- **Pós-condições:** Produto criado, ou quantidade somada ao existente; log registrado
- **Erros:** 403; 409 PRODUTO_DUPLICADO; 422
- **Casos de uso e requisitos:** UC020, UC022 · RF03, RF33

### PATCH /produtos/:id

- **Quem pode:** ADMIN, EDITOR
- **Entrada:** campos alterados
- **Pré-condições:** Produto da Casa do usuário
- **Pós-condições:** Produto atualizado; log registrado
- **Erros:** 403; 404; 422
- **Casos de uso e requisitos:** UC025 · RF04 a RF08

### DELETE /produtos/:id

- **Quem pode:** ADMIN, EDITOR
- **Entrada:** —
- **Pré-condições:** Produto da Casa do usuário
- **Pós-condições:** Produto, fotos e vínculos com tags removidos; log registrado
- **Erros:** 403; 404
- **Casos de uso e requisitos:** UC026 · RF09

### POST /tags

- **Quem pode:** ADMIN, EDITOR
- **Entrada:** nome
- **Pré-condições:** Nome ainda não usado na Casa
- **Pós-condições:** Tag criada
- **Erros:** 403; 409 TAG_EXISTENTE
- **Casos de uso e requisitos:** UC023 · RF35

## Telas

| Tela | Nome |
| --- | --- |
| 06 | Produtos |
| 07 | Detalhe do produto |
| 08 | Adicionar produto |
| 09 | Produto duplicado (modal) |
| 23 | Excluir produto (modal) |

Prints em `docs/01-modelagem-produto/` (proto-*.png) e no Figma "KeepIT — Protótipo MVP". Navegação entre telas: `docs/05-diagramas/processos-telas.png`.

## Requisitos funcionais

| ID | Nome | Prioridade | Descrição | Telas |
| --- | --- | --- | --- | --- |
| RF03 | Adicionar Produto | Essencial | Permitir que o ADMIN ou o EDITOR cadastre um novo produto na Casa, com foto, nome, descrição, preço, quantidade, data de compra e tags. | 08 |
| RF04 | Editar Nome do Produto | Importante | Permitir que o usuário altere o nome de um produto cadastrado. | 08 |
| RF05 | Editar Foto do Produto | Importante | Permitir que o usuário altere a foto de um produto cadastrado. | 08 |
| RF06 | Editar Descrição do Produto | Importante | Permitir que o usuário altere a descrição de um produto cadastrado. | 08 |
| RF07 | Editar Preço do Produto | Importante | Permitir que o usuário altere o preço de um produto cadastrado. | 08 |
| RF08 | Editar Tag de Item | Importante | Permitir que o usuário altere ou atualize as tags de um item. | 08 |
| RF09 | Remover Produto | Essencial | Permitir que o usuário exclua um produto cadastrado. | 07, 23 |
| RF10 | Mostrar Produtos | Essencial | Exibir os produtos cadastrados na Casa do usuário. | 06, 17 |
| RF11 | Acessar Histórico de Adições | Desejável | Permitir que o usuário consulte os produtos adicionados recentemente na Casa, com quem adicionou e quando. | 05, 07 |
| RF33 | Detectar Produto Duplicado | Importante | Ao cadastrar um produto com o mesmo nome de outro da mesma Casa, o sistema avisa o usuário e oferece somar à quantidade, cadastrar mesmo assim ou cancelar. | 09 |
| RF34 | Buscar e Filtrar Produtos | Importante | Permitir que o usuário busque produtos pelo nome e filtre a lista por tag. | 06, 17 |
| RF35 | Criar Tag | Importante | Permitir que o ADMIN ou o EDITOR crie uma nova tag na Casa para categorizar os produtos. | 08 |
| RF36 | Visualizar Detalhe do Produto | Essencial | Permitir que o usuário veja todas as informações de um produto: fotos, tags, preço, quantidade, data de compra, quem adicionou e descrição. | 07 |
| RF39 | Controlar Armazenamento do Plano | Importante | Exibir o espaço de fotos usado pela Casa e bloquear o envio de novas fotos quando o limite do plano for atingido. | 05, 08 |

## Casos de uso

Detalhe completo (fluxos, validações) em `docs/05-diagramas/5.1-casos-de-uso.md`.

- **UC016 - Acessar Itens** — Permitir visualizar os produtos cadastrados no inventário.
- **UC017 - Acessar Dashboard** — Apresentar um resumo das informações do inventário.
- **UC020 - Adicionar Produto** — Adicionar um novo produto ao inventário do usuário.
- **UC021 - Enviar Foto do Produto** — Permitir enviar uma foto para auxiliar o cadastro de um produto.
- **UC022 - Informar Dados do Produto** — Permitir informar os dados necessários para cadastrar um produto.
- **UC023 - Criar ou Selecionar uma Tag(Produto)** — Organizar o produto por meio de uma tag existente ou nova.
- **UC024 - Selecionar Produto** — Permitir selecionar um produto para visualizar ou realizar ações.
- **UC025 - Editar Produto** — Permitir alterar as informações de um produto cadastrado.
- **UC026 - Deletar Produto** — Remover um produto do inventário.

## Dependências com outros módulos

- Lê o plano atual da Casa por meio do `assinatura.service` (M5) para calcular a cota.

## Dúvidas em aberto

Resolva com o grupo antes de implementar a parte afetada e registre a resposta aqui, por PR.

- [ ] Na opção "somar quantidade", as fotos e tags enviadas no cadastro duplicado são descartadas ou acrescentadas ao existente?
