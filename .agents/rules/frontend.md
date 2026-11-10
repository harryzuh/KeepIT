---
trigger: glob
globs: frontend/**
description: Padrões do front-end do KeepIT (React + TanStack Query + Tailwind)
---

# Regras ao trabalhar em frontend/

- Copie a estrutura de `frontend/src/features/exemplo/`: `<m>.api.ts` → `<m>.hooks.ts` → componentes → página em `src/pages/`.
- Chamadas à API só por `api()` de `src/lib/api.ts`, dentro de `<m>.api.ts`. Componentes usam os hooks, nunca `fetch`.
- Formulários: React Hook Form + `zodResolver` com o schema de `@keepit/shared`.
- Erros: trate `ApiError` pelo `codigo` (ex.: `PRODUTO_DUPLICADO` abre o modal da tela 09).
- Reaproveite `src/components/` (`Botao`, `Campo`, `Cartao`) antes de criar componente novo.
- Cores, raios e fonte só pelas classes do tema em `src/index.css` (ex.: `bg-primaria`, `rounded-botao`). Nada de hexadecimal solto.
- Siga o protótipo da tela (prints em `docs/01-modelagem-produto/`) e mantenha o layout responsivo (RNF10).
- Acessibilidade: rótulo em todo campo, `alt` em toda imagem, `role="alert"` nas mensagens de erro (RNF19).
- Ações destrutivas sempre com modal de confirmação (RNF12).
- Testes com Testing Library, mockando `<m>.api.ts`; teste pelo que o usuário vê.
