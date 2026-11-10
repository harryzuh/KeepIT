# Documentação do KeepIT

Documentação técnica da Fase 1 (disciplina Engenharia e Arquitetura de Sistemas, FECAP), em Markdown para ser lida por pessoas e por agentes de IA. O PDF entregue está em [`entregas/`](entregas/).

**Para desenvolver, comece pelas [specs dos módulos](specs/README.md).** Elas reúnem, por módulo, o que está espalhado nas seções abaixo.

| Seção | Conteúdo | Use para |
| --- | --- | --- |
| [1.1 Sitemap](01-modelagem-produto/1.1-sitemap.md) | Mapa das telas | Navegação e rotas do front |
| [1.2 Wireframe](01-modelagem-produto/1.2-wireframe.md) | Estrutura das telas | Layout |
| [1.3 Prototipação](01-modelagem-produto/1.3-prototipacao.md) | As 24 telas do protótipo | Visual de cada tela |
| [2.1 Arquitetura funcional](02-arquitetura/2.1-arquitetura-funcional.md) | Módulos M1 a M5 | Saber de quem é cada parte |
| [2.2 Arquitetura técnica](02-arquitetura/2.2-arquitetura-tecnica.md) | Stack e hospedagem | Tecnologias |
| [2.3 MVC](02-arquitetura/2.3-mvc.md) | Camadas e pastas | Onde cada código fica |
| [3.1 Requisitos funcionais](03-requisitos/3.1-requisitos-funcionais.md) | RF01 a RF39 | O que o sistema faz |
| [3.2 Requisitos não funcionais](03-requisitos/3.2-requisitos-nao-funcionais.md) | RNF01 a RNF31 | Segurança, desempenho, usabilidade |
| [3.3 Requisitos associados](03-requisitos/3.3-requisitos-associados.md) | RF × RNF | Rastreabilidade |
| [3.4 Projeto linear](03-requisitos/3.4-projeto-linear.md) | Hierarquia do projeto | Escopo |
| [4.1 Macroprocesso](04-processos/4.1-macroprocesso.md) e [4.2 BPMN](04-processos/4.2-bpmn.md) | Processos de negócio | Fluxos ponta a ponta |
| [5.1 Casos de uso](05-diagramas/5.1-casos-de-uso.md) | UC001 a UC037 com fluxos | Detalhe de cada funcionalidade |
| [5.2 Classes](05-diagramas/5.2-diagrama-classes.md) e [5.3 ER](05-diagramas/5.3-diagrama-er.md) | Modelo de dados | Entender o banco |
| [5.4 Estados](05-diagramas/5.4-diagrama-estados.md) | Assinatura e conta | Transições de status |
| [5.5 Operação](05-diagramas/5.5-diagrama-operacao.md) | Sequências e Tabela 17 (contratos da API) | Contrato de cada rota |
| [5.6 DFD](05-diagramas/5.6-dfd.md) e [5.9 Contexto](05-diagramas/5.9-diagrama-contexto.md) | Fluxo de dados | Integrações externas |
| [5.7 Processos (telas)](05-diagramas/5.7-processos-telas.md) | Fluxo entre telas | Navegação |
| [Backlog](backlog.md) | O que ficou fora do MVP | Não implementar sem decisão do grupo |

O schema do banco que vale é [`backend/prisma/schema.prisma`](../backend/prisma/schema.prisma), gerado a partir do Diagrama ER (5.3). Os arquivos `.drawio` abrem no [draw.io](https://app.diagrams.net).
