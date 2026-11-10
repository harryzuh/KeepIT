# Jobs agendados

Rotinas chamadas pela rota protegida `POST /internal/jobs` (M5), que o workflow `.github/workflows/jobs.yml` aciona a cada hora:

- renovar ou expirar assinaturas vencidas (RF37) — M5;
- apagar contas com exclusão solicitada há mais de 24 h (RF20, RNF16) — regra do M1, executada aqui.

Cada job é uma função exportada em um arquivo próprio (ex.: `expirarAssinaturas.ts`) e testada como um service.
