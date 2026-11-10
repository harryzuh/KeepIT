import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // `prisma generate` não precisa de banco; migrate e seed precisam de DATABASE_URL no .env.
    url: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/keepit',
  },
});
