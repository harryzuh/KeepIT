# KeepIT — Backlog (fora do MVP)

Itens decididos para depois do MVP. Cada um deve virar uma especificação própria quando entrar no desenvolvimento.

| Item | Origem | Motivo de ficar para depois |
|---|---|---|
| Cache em memória (Redis) para busca de produtos | RNF03 | No MVP, índices no PostgreSQL e o cache do TanStack Query atendem; Redis entra se a busca ficar lenta |
| Modo escuro seguindo o sistema operacional | RNF20 | O protótipo tem apenas o tema claro; o Tailwind permite adicionar depois |
| Convite de membro com aceite | Decisão de 04/11/2026 (UC033) | No MVP, o ADMIN adiciona o membro diretamente e a pessoa é transferida da Casa anterior; o aceite exige tela de convite pendente e um caso de uso novo |
| Pagamento real (Stripe ou Mercado Pago) | Arquitetura técnica | No MVP o pagamento é simulado, mantendo o mesmo ciclo de estados da assinatura |
| Disponibilidade de 99,99% | RNF28 | Exige plano pago e redundância; a meta do MVP é 99% |
| Aplicativo nativo para celular | Decisão de 04/11/2026 | O MVP é web responsivo para acelerar a entrega |
| Funcionalidades do documento Desafio (depreciação, revenda, notas fiscais, localização, garantia) | Fase anterior | Fora do escopo definido pelo grupo |
