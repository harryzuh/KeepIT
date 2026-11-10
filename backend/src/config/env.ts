import { z } from 'zod';

/**
 * Variáveis de ambiente validadas na inicialização.
 * Variável nova: adicione aqui, no .env.example e no README.
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET precisa de pelo menos 16 caracteres'),
  JWT_EXPIRA_EM: z.string().default('7d'),
  JOBS_KEY: z.string().min(8).optional(),
  S3_ENDPOINT: z.string().optional(),
  S3_REGIAO: z.string().default('auto'),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_REMETENTE: z.string().optional(),
});

const resultado = schema.safeParse(process.env);

if (!resultado.success) {
  console.error('Variáveis de ambiente inválidas:', z.flattenError(resultado.error).fieldErrors);
  throw new Error('Configure o arquivo backend/.env a partir do backend/.env.example');
}

export const env = resultado.data;
