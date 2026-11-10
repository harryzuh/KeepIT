import type { Request, Response } from 'express';
import type { CriarTagExemplo, ListarTagsExemploQuery } from '@keepit/shared';
import { usuarioDa } from '../../middlewares/autenticar';
import * as service from './exemplo.service';

/**
 * MÓDULO DE EXEMPLO — CONTROLLER.
 * Só repassa os dados (já validados) ao service e escolhe o status HTTP. Sem regra de negócio.
 */

export async function listar(req: Request, res: Response) {
  const { casaId } = usuarioDa(req);
  const { busca } = req.query as ListarTagsExemploQuery;
  const tags = await service.listarTags(casaId, busca);
  res.json({ tags });
}

export async function criar(req: Request, res: Response) {
  const { casaId } = usuarioDa(req);
  const { nome } = req.body as CriarTagExemplo;
  const tag = await service.criarTag(casaId, nome);
  res.status(201).json({ tag });
}
