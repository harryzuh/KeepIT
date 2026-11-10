Closes #

## O que mudou

<!-- Cole o resumo do walkthrough do agente, em linguagem simples. -->

## Decisões que não estavam na spec

<!-- Se nenhuma, escreva "nenhuma". Se houve, a spec precisa ser atualizada neste PR ou em outra issue. -->

## Como testar

1.

## Agente usado

- Ferramenta e modelo: <!-- ex.: Antigravity · Gemini Pro -->
- Prompt: <!-- ex.: /implementar-issue 42 + observações -->

## Checklist (autor marca, revisor confere)

**Escopo**

- [ ] Resolve uma issue só e fecha ela (`Closes #`)
- [ ] Só mexe em arquivos do módulo da issue, ou a mudança fora dele foi combinada antes
- [ ] Não adiciona dependência nem muda o `schema.prisma` sem issue própria

**Contrato**

- [ ] Rota, entrada e resposta batem com a spec
- [ ] Cada erro do contrato devolve o código certo
- [ ] A permissão por papel é conferida na API, não só escondida na tela

**Qualidade**

- [ ] CI verde (formatação, lint, tipos, testes, build)
- [ ] Existe teste para cada pré-condição e cada erro
- [ ] Segue o padrão do módulo `exemplo`
- [ ] Sem código morto, `console.log` ou comentário sem sentido

**Autoria**

- [ ] Sei explicar qualquer trecho deste PR
