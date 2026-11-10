import { Router } from 'express';
import { PAPEIS_QUE_EDITAM } from '@keepit/shared';
import { autenticar } from '../../middlewares/autenticar';
import { exigirPapel } from '../../middlewares/exigirPapel';
import { validar } from '../../middlewares/validar';
import * as controller from './exemplo.controller';
import { criarTagExemploSchema, listarTagsExemploQuery } from './exemplo.schema';

/**
 * MÓDULO DE EXEMPLO — ROTAS.
 * Ordem dos middlewares: autenticar → exigirPapel → validar → controller.
 */
export const exemploRoutes = Router();

// Qualquer papel pode listar.
exemploRoutes.get(
  '/tags',
  autenticar,
  validar({ query: listarTagsExemploQuery }),
  controller.listar,
);

// Só ADMIN e EDITOR criam.
exemploRoutes.post(
  '/tags',
  autenticar,
  exigirPapel(...PAPEIS_QUE_EDITAM),
  validar({ body: criarTagExemploSchema }),
  controller.criar,
);
