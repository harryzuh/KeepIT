import { vi } from 'vitest';
import type { PrismaClient } from '../src/generated/prisma/client';

/**
 * Prisma falso para testes: cada `prisma.<modelo>.<método>` vira um vi.fn() criado na hora.
 * `$transaction(fn)` executa a função passando o próprio mock.
 *
 * Uso no topo do arquivo de teste:
 *   vi.mock('../../lib/prisma', async () => {
 *     const { criarPrismaMock } = await import('../../../tests/prismaMock');
 *     return { prisma: criarPrismaMock() };
 *   });
 * Depois: vi.mocked(prisma.tag.findMany).mockResolvedValue([...] as never);
 */
export function criarPrismaMock(): PrismaClient {
  const modelos = new Map<PropertyKey, unknown>();

  const mock: object = new Proxy(
    {},
    {
      get(_alvo, modelo) {
        if (modelo === 'then') return undefined;
        if (modelo === '$transaction') {
          if (!modelos.has(modelo)) {
            modelos.set(
              modelo,
              vi.fn(async (arg: unknown) =>
                typeof arg === 'function' ? arg(mock) : Promise.all(arg as unknown[]),
              ),
            );
          }
          return modelos.get(modelo);
        }
        if (!modelos.has(modelo)) {
          const metodos = new Map<PropertyKey, unknown>();
          modelos.set(
            modelo,
            new Proxy(
              {},
              {
                get(_m, metodo) {
                  if (!metodos.has(metodo)) metodos.set(metodo, vi.fn());
                  return metodos.get(metodo);
                },
              },
            ),
          );
        }
        return modelos.get(modelo);
      },
    },
  );

  return mock as PrismaClient;
}
