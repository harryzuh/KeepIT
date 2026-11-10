import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { env } from '../config/env';

/**
 * Única instância do Prisma Client na API.
 * Services importam `prisma` daqui; testes substituem este módulo com vi.mock.
 */
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });

/** Tipo do cliente dentro de uma transação: prisma.$transaction(async (tx) => ...). */
export type Transacao = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];
