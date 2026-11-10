import type { Papel } from '@keepit/shared';

/** Usuário autenticado, preenchido pelo middleware `autenticar`. */
export interface UsuarioAutenticado {
  id: number;
  casaId: number;
  papel: Papel;
}

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioAutenticado;
    }
  }
}
