import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

interface Schemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

/**
 * Valida body, query e params com Zod e troca os valores pelos dados já convertidos.
 * Erro de validação vira 422 DADOS_INVALIDOS no middleware tratarErros.
 *
 * @example router.post('/', validar({ body: criarTagExemploSchema }), controller.criar)
 */
export function validar(schemas: Schemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }
    if (schemas.query) {
      // No Express 5, req.query é somente leitura: redefinimos a propriedade.
      Object.defineProperty(req, 'query', {
        value: schemas.query.parse(req.query),
        writable: true,
        configurable: true,
      });
    }
    if (schemas.params) {
      req.params = schemas.params.parse(req.params) as Request['params'];
    }
    next();
  };
}
