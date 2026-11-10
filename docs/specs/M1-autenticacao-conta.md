# M1 · Autenticação e Conta

> Spec do módulo para o desenvolvimento. Fonte: documentação técnica (Fase 1) em `docs/`. Código em `backend/src/modules/auth/` e `frontend/src/features/auth/`.

Cadastro, login, recuperação e troca de senha, dados cadastrais e exclusão da conta. Também é dono do middleware `autenticar` e de `frontend/src/lib/sessao.ts`.

## Regras de negócio

- Senha com no mínimo 8 caracteres (RNF15), guardada só como hash com bcrypt (RNF02, pacote `bcryptjs`).
- O login devolve um JWT com o id do usuário em `sub`, assinado com `JWT_SECRET` e válido por `JWT_EXPIRA_EM` (padrão 7 dias). Casa e papel não vão no token: o middleware `autenticar` lê do banco a cada requisição.
- O cadastro cria, na mesma transação, o Usuario, uma Casa e o Membro com papel ADMIN; a Casa fica no plano Individual porque não tem assinatura (RF32). A criação da Casa usa a função do `casa.service` (M2).
- Login com limite próprio de tentativas por IP e e-mail (429 MUITAS_TENTATIVAS), além do limite geral do app (RNF14).
- Recuperação: código de 6 dígitos, guardado só como hash em CodigoVerificacao (finalidade RECUPERAR_SENHA), válido por 15 minutos e de uso único; enviado por e-mail (Resend).
- Troca de e-mail exige confirmação por código enviado ao novo endereço (finalidade ALTERAR_EMAIL).
- Exclusão de conta: confirma a senha, grava `exclusaoSolicitadaEm`, encerra as sessões, cancela a assinatura se o usuário for titular e, se ele for ADMIN, dá a cada outro membro uma Casa própria no plano Individual. Os dados pessoais são apagados em até 24 h pelo job (RNF16); nos produtos que ele cadastrou, `adicionadoPorId` vira nulo.
- Conta com exclusão solicitada não faz login.

## Operações da API

Cada operação abaixo vira uma issue (template "Tarefa"). Erros seguem o formato `{ erro: { codigo, mensagem, detalhes? } }` com os códigos de `shared/src/erros.ts`.

### POST /auth/cadastro

- **Quem pode:** Visitante
- **Entrada:** nome, e-mail, senha
- **Pré-condições:** E-mail ainda não cadastrado; senha com 8 ou mais caracteres
- **Pós-condições:** Usuário criado; Casa criada com o plano Individual; usuário é ADMIN da Casa
- **Erros:** 409 EMAIL_EM_USO; 422 DADOS_INVALIDOS
- **Casos de uso e requisitos:** UC008 · RF02, RF32

### POST /auth/login

- **Quem pode:** Visitante
- **Entrada:** e-mail, senha
- **Pré-condições:** Conta ativa (sem exclusão solicitada)
- **Pós-condições:** Token JWT emitido
- **Erros:** 401 CREDENCIAIS_INVALIDAS; 429 MUITAS_TENTATIVAS
- **Casos de uso e requisitos:** UC004, UC005 · RF01

### POST /auth/recuperar-senha

- **Quem pode:** Visitante
- **Entrada:** e-mail
- **Pré-condições:** Conta existente
- **Pós-condições:** Código de 6 dígitos gerado (guardado só o hash), válido por 15 min, enviado por e-mail
- **Erros:** 404 CONTA_NAO_ENCONTRADA; 429
- **Casos de uso e requisitos:** UC006 · RF17

### POST /auth/redefinir-senha

- **Quem pode:** Visitante
- **Entrada:** e-mail, código, nova senha
- **Pré-condições:** Código válido, não usado e dentro do prazo
- **Pós-condições:** Senha trocada; código marcado como usado; sessões encerradas
- **Erros:** 400 CODIGO_INVALIDO
- **Casos de uso e requisitos:** UC007, UC009 · RF17

### POST /auth/logout

- **Quem pode:** Usuário
- **Entrada:** —
- **Pré-condições:** Sessão ativa
- **Pós-condições:** Sessão encerrada
- **Erros:** —
- **Casos de uso e requisitos:** UC012 · RF21

### PATCH /me

- **Quem pode:** Usuário
- **Entrada:** nome, e-mail
- **Pré-condições:** Novo e-mail único e confirmado por código
- **Pós-condições:** Dados atualizados
- **Erros:** 409 EMAIL_EM_USO
- **Casos de uso e requisitos:** UC015 · RF18, RF19

### PATCH /me/senha

- **Quem pode:** Usuário
- **Entrada:** senha atual, nova senha
- **Pré-condições:** Senha atual correta
- **Pós-condições:** Senha atualizada
- **Erros:** 401 SENHA_INCORRETA
- **Casos de uso e requisitos:** UC010, UC011 · RF31

### DELETE /me

- **Quem pode:** Usuário
- **Entrada:** senha
- **Pré-condições:** Senha correta
- **Pós-condições:** Exclusão registrada; sessões encerradas; assinatura cancelada se for titular; outros membros recebem Casa própria se for ADMIN
- **Erros:** 401 SENHA_INCORRETA
- **Casos de uso e requisitos:** UC013, UC014 · RF20

## Telas

| Tela | Nome |
| --- | --- |
| 01 | Boas-vindas |
| 02 | Entrar |
| 03 | Criar conta |
| 04 | Recuperar senha |
| 18 | Nova senha |
| 16 | Conta |
| 20 | Dados cadastrais |
| 19 | Alterar senha |
| 21 | Excluir conta (modal) |

Prints em `docs/01-modelagem-produto/` (proto-*.png) e no Figma "KeepIT — Protótipo MVP". Navegação entre telas: `docs/05-diagramas/processos-telas.png`.

## Requisitos funcionais

| ID | Nome | Prioridade | Descrição | Telas |
| --- | --- | --- | --- | --- |
| RF01 | Efetuar Login | Essencial | Permitir que o usuário acesse o sistema utilizando seus dados de login. | 01, 02 |
| RF02 | Efetuar Cadastro | Essencial | Permitir que um novo usuário crie uma conta no sistema. | 03 |
| RF17 | Recuperar Senha | Essencial | Permitir que o usuário recupere o acesso à conta caso esqueça a senha. | 04, 18 |
| RF18 | Acessar Informações da Conta | Importante | Permitir que o usuário visualize as informações da sua conta. | 16 |
| RF19 | Alterar Email | Importante | Permitir que o usuário altere o endereço de e-mail cadastrado. | 20 |
| RF20 | Excluir Conta | Essencial | Permitir que o usuário exclua sua conta do sistema. Os dados pessoais são apagados em até 24 horas. | 21 |
| RF21 | Encerrar Sessão | Importante | Permitir que o usuário saia da conta e encerre sua sessão. | 16 |
| RF29 | Entrar em Contato com KeepIt | Desejável | Permitir que o usuário entre em contato com a equipe do KeepIt. | 13, 16 |
| RF30 | Exibir Termos de Uso e Privacidade | Desejável | Permitir que o usuário visualize os termos de uso e a política de privacidade. | 01, 16 |
| RF31 | Alterar a senha | Desejável | Permitir que o usuário altere a senha de sua conta. | 19 |

## Casos de uso

Detalhe completo (fluxos, validações) em `docs/05-diagramas/5.1-casos-de-uso.md`.

- **UC001 - Tela de Login** — Ser direcionado para a tela de login
- **UC002 - Tela de Cadastro** — Ser direcionado para a tela de cadastro
- **UC003 - Termos de Uso** — Ler os Termos de Uso
- **UC004 - Login** — Permitir que o usuário acesse sua conta no KeepIt.
- **UC006 - Esqueci Minha Senha** — Permitir a recuperação do acesso à conta quando o usuário esquecer a senha.
- **UC007 - Validação de Email e Código** — Confirmar a identidade do usuário por meio do e-mail e código de recuperação.
- **UC008 - Cadastrar conta** — Criar uma nova conta de usuário no sistema.
- **UC009 - Confirmação de Senha** — Confirmar a nova senha antes de concluir sua alteração.
- **UC010 - Alterar Senha** — Alterar a senha de acesso do usuário.
- **UC011 - Confirmação de Senha Anterior e Nova** — Confirmar a senha anterior e validar a nova senha durante a alteração.
- **UC012 - Encerrar Sessão** — Encerrar a sessão atual do usuário no KeepIt.
- **UC013 - Excluir Conta** — Permitir que o usuário solicite a exclusão de sua conta.
- **UC014 - Confirmação da Exclusão de Conta** — Confirmar a intenção do usuário antes da exclusão da conta.
- **UC015 - Alteração de Dados Cadastrais** — Permitir que o usuário atualize seus dados cadastrais.
- **UC032 - Contatar Equipe KeepIt** — Permitir que o usuário entre em contato com a equipe do KeepIt.

## Dependências com outros módulos

- Usa `casa.service` (M2) para criar a Casa Individual no cadastro e para redistribuir membros na exclusão.
- Usa o cancelamento de assinatura do `assinatura.service` (M5) na exclusão.

## Dúvidas em aberto

Resolva com o grupo antes de implementar a parte afetada e registre a resposta aqui, por PR.

- [ ] Como "encerrar sessões" com JWT sem estado? Sugestão: campo `tokenVersao` em Usuario, conferido no `autenticar` (exige issue de schema).
- [ ] O usuário pode cancelar a exclusão dentro das 24 h? A documentação não prevê.
