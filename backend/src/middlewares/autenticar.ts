import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../lib/erros';
import { prisma } from '../lib/prisma';

interface PayloadToken {
  sub: string;
}

/**
 * Confere o token JWT (cabeçalho Authorization: Bearer <token>) e carrega a Casa e o papel
 * atuais do usuário a partir do banco. O token guarda só o id do usuário, porque Casa e papel
 * podem mudar (membro removido, papel alterado, assinatura feita por membro).
 */
export async function autenticar(req: Request, _res: Response, next: NextFunction) {
  const [tipo, token] = req.headers.authorization?.split(' ') ?? [];
  if (tipo !== 'Bearer' || !token) {
    throw new AppError(401, 'NAO_AUTENTICADO', 'Faça login para continuar');
  }

  let payload: PayloadToken;
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as PayloadToken;
  } catch {
    throw new AppError(401, 'NAO_AUTENTICADO', 'Sessão expirada. Faça login de novo');
  }

  const usuarioId = Number(payload.sub);
  const membro = await prisma.membro.findUnique({
    where: { usuarioId },
    select: { casaId: true, papel: true },
  });
  if (!membro) {
    throw new AppError(401, 'NAO_AUTENTICADO', 'Sessão inválida. Faça login de novo');
  }

  req.usuario = { id: usuarioId, casaId: membro.casaId, papel: membro.papel };
  next();
}

/** Lê o usuário autenticado dentro de um controller (rotas com `autenticar`). */
export function usuarioDa(req: Request) {
  if (!req.usuario) {
    throw new AppError(401, 'NAO_AUTENTICADO', 'Faça login para continuar');
  }
  return req.usuario;
}
