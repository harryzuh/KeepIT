import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PLANOS } from '@keepit/shared';
import { PrismaClient } from '../src/generated/prisma/client';

/** Cria ou atualiza os três planos. Rode com: npm run db:seed */
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL as string }),
});

async function main() {
  for (const plano of Object.values(PLANOS)) {
    const dados = {
      preco: plano.precoMensal,
      limiteMembros: plano.limiteMembros,
      limiteArmazenamentoGb: plano.limiteArmazenamentoGb,
    };
    await prisma.plano.upsert({
      where: { nome: plano.nome },
      update: dados,
      create: { nome: plano.nome, ...dados },
    });
  }
  console.info('Planos criados/atualizados:', Object.keys(PLANOS).join(', '));
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
