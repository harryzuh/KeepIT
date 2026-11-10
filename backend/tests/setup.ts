// Variáveis de ambiente dos testes. Os testes não usam banco real: o Prisma é substituído por mocks.
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://teste:teste@localhost:5432/teste';
process.env.JWT_SECRET = 'segredo-somente-para-testes';
process.env.JOBS_KEY = 'chave-somente-para-testes';
