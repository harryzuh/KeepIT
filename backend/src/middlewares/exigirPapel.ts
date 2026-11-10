import type { NextFunction, Request, Response } from 'express';
import type { Papel } from '@keepit/shared';
import { AppError, semPermissao } from '../lib/erros';

/**
 * Libera a rota só para os papéis informados (RNF31). Use depois de `autenticar`.
 *
 * @example router.post('/', autenticar, exigirPapel('ADMIN', 'EDITOR'), ...)
 */
export function exigirPapel(...papeis: Papel[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.usuario) {
      throw new AppError(401, 'NAO_AUTENTICADO', 'Faça login para continuar');
    }
    if (!papeis.includes(req.usuario.papel)) {
      throw semPermissao();
    }
    next();
  };
}
