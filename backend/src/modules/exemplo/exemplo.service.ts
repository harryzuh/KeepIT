import type { TagExemplo } from '@keepit/shared';
import { AppError } from '../../lib/erros';
import { prisma } from '../../lib/prisma';

/**
 * MÓDULO DE EXEMPLO — MODEL (regras de negócio + acesso ao banco).
 * Não sabe nada de HTTP: recebe dados simples, devolve dados simples e lança AppError.
 */

export async function listarTags(casaId: number, busca?: string): Promise<TagExemplo[]> {
  return prisma.tag.findMany({
    where: {
      casaId,
      ...(busca ? { nome: { contains: busca, mode: 'insensitive' } } : {}),
    },
    select: { id: true, nome: true },
    orderBy: { nome: 'asc' },
  });
}

export async function criarTag(casaId: number, nome: string): Promise<TagExemplo> {
  const existente = await prisma.tag.findUnique({
    where: { casaId_nome: { casaId, nome } },
    select: { id: true },
  });
  if (existente) {
    throw new AppError(409, 'TAG_EXISTENTE', 'Já existe uma tag com esse nome nesta Casa');
  }

  return prisma.tag.create({
    data: { casaId, nome },
    select: { id: true, nome: true },
  });
}
