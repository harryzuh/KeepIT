import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { env } from './config/env';
import { rotaNaoEncontrada, tratarErros } from './middlewares/tratarErros';
import { routes } from './routes';

/** Monta o app sem abrir a porta (os testes usam o app direto com supertest). */
export function criarApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN.split(',') }));
  app.use(express.json({ limit: '1mb' }));

  // RNF14: limite geral de requisições por IP. Rotas sensíveis (login) têm limite próprio no módulo.
  if (env.NODE_ENV !== 'test') {
    app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-8' }));
  }

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use(routes);

  app.use(rotaNaoEncontrada);
  app.use(tratarErros);

  return app;
}
