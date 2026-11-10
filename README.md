# KeepIT

Inventário virtual dos bens da Casa: produtos com fotos, tags, estatísticas do patrimônio e planos de assinatura para dividir a Casa com a família. Web responsivo.

Projeto da disciplina **Engenharia e Arquitetura de Sistemas** (FECAP, CCOMP 4 Noturno), com o Prof. MSc. Luis Fernando dos Santos Pires.

| Integrante        | RA       |
| ----------------- | -------- |
| Gabriel Diniz     | 25027858 |
| Gian Lemes        | 25027511 |
| Harry             | 25027808 |
| Letícia Rodrigues | 25027748 |
| Said Sales        | 25027606 |

## Estrutura

```
KeepIT/
├── AGENTS.md          instruções para agentes de IA (leia antes de usar qualquer IA)
├── .agents/           regras por pasta e o workflow /implementar-issue (Antigravity)
├── .github/           CI, jobs agendados, templates de issue e PR
├── docs/              documentação técnica (Fase 1) e specs dos módulos
├── shared/            schemas Zod, códigos de erro, papéis e planos (front + API)
├── backend/           API REST: Express 5 + Prisma 7 + PostgreSQL
└── frontend/          SPA: React 19 + Vite + TanStack Query + Tailwind
```

O módulo `exemplo` (`backend/src/modules/exemplo/` e `frontend/src/features/exemplo/`) é a referência de padrão para todos os módulos. Não é funcionalidade do produto e não deve ser apagado.

## Rodando na sua máquina

Pré-requisitos: Node 22 (veja `.nvmrc`), Git e um PostgreSQL (Docker local ou um banco gratuito no [Neon](https://neon.tech)).

```bash
git clone https://github.com/harryzuh/KeepIT.git
cd KeepIT
npm install
npm run db:generate

cp backend/.env.example backend/.env      # preencha DATABASE_URL e JWT_SECRET
docker compose up -d db                   # se for usar o Postgres local

npm run db:migrate                        # aplica as migrations no seu banco
npm run db:seed                           # cria os planos
npm run dev                               # API em http://localhost:3333 e front em http://localhost:5173
```

A página `http://localhost:5173/exemplo` usa o módulo de exemplo. Ela precisa de login, então só funciona por completo depois que o M1 existir.

## Comandos

| Comando                                        | O que faz                                                   |
| ---------------------------------------------- | ----------------------------------------------------------- |
| `npm run dev`                                  | API e front juntos, com recarga automática                  |
| `npm run verificar`                            | Formatação, lint, tipos e testes (o mesmo que a CI confere) |
| `npm run format` / `npm run lint:fix`          | Corrige formatação e lint                                   |
| `npm test -w backend` / `npm test -w frontend` | Testes de um lado só                                        |
| `npm run build`                                | Build da API e do front                                     |
| `npm run db:generate`                          | Gera o Prisma Client                                        |
| `npm run db:migrate`                           | Cria/aplica migrations (`-- --name <nome>` para nomear)     |
| `npm run db:seed`                              | Cria ou atualiza os planos                                  |
| `npm run db:studio -w backend`                 | Abre o Prisma Studio para ver o banco                       |

## Como o grupo trabalha

1. Cada integrante é dono de um módulo (M1 a M5). O contrato de cada rota e tela está em [`docs/specs/`](docs/specs/README.md).
2. Uma tarefa = uma issue (template **Tarefa**) = uma branch = um PR.
3. O código é escrito pelo agente no **Google Antigravity** com o workflow `/implementar-issue <número>`, que planeja, espera aprovação, implementa, testa e para antes do commit.
4. A pessoa verifica, faz o commit e abre o PR. Outro integrante revisa. A `main` só recebe PR com CI verde e uma aprovação.

Detalhes, configuração do Antigravity e checklist de revisão: playbook do grupo (KeepIT — Playbook de desenvolvimento com IA).

## Configuração inicial (uma vez, pelo responsável do repositório)

- [ ] **Primeira migration.** Com um banco vazio no `.env`, rode `npm run db:migrate -- --name init --create-only`. Cole o conteúdo de `backend/prisma/sql/indices-extras.sql` no final do `backend/prisma/migrations/<data>_init/migration.sql` e rode `npm run db:migrate` de novo. Faça commit da pasta `migrations/`.
- [ ] **Proteger a `main`** (Settings → Branches → Add rule): exigir PR, 1 aprovação e o check **CI** verde; bloquear push direto.
- [ ] **Colaboradores** (Settings → Collaborators): adicionar os outros 4 integrantes.
- [ ] **Labels:** criar a label `tarefa` (usada pelo template de issue).
- [ ] **Deploy:** front na Vercel (pasta `frontend`, variável `VITE_API_URL`) e API no Render (pasta `backend`, build `npm ci && npm run db:generate && npm run build -w backend`, start `npm run db:deploy -w backend && npm start -w backend`, variáveis do `backend/.env.example`).
- [ ] **Jobs agendados:** quando o M5 implementar `POST /internal/jobs`, configurar as variáveis descritas em `.github/workflows/jobs.yml`.

## Documentação

- [Índice da documentação técnica](docs/README.md)
- [Specs dos módulos](docs/specs/README.md)
- [Documentação técnica em PDF](docs/entregas/)
- [Instruções para agentes de IA](AGENTS.md)
