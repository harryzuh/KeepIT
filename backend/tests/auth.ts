import jwt from 'jsonwebtoken';
import { vi } from 'vitest';
import type { Papel } from '@keepit/shared';
import { prisma } from '../src/lib/prisma';

/**
 * Prepara um usuário logado para o teste: devolve o cabeçalho Authorization e configura
 * o mock de prisma.membro.findUnique, que o middleware `autenticar` consulta.
 * Só funciona em arquivos de teste que fizeram vi.mock do módulo lib/prisma.
 */
export function entrarComo(papel: Papel, { usuarioId = 1, casaId = 10 } = {}) {
  vi.mocked(prisma.membro.findUnique).mockResolvedValue({ casaId, papel } as never);
  const token = jwt.sign({ sub: String(usuarioId) }, process.env.JWT_SECRET as string);
  return { Authorization: `Bearer ${token}` };
}
