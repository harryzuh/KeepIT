import { Router } from 'express';
import { exemploRoutes } from './modules/exemplo/exemplo.routes';

/**
 * Rotas da API por módulo (Tabela 17 da documentação).
 * Cada dono de módulo registra aqui as rotas do seu módulo, uma linha por prefixo.
 */
export const routes = Router();

routes.use('/exemplo', exemploRoutes); // referência de padrão (não é funcionalidade)

// M1 · Autenticação e Conta  → '/auth' e '/me'          (docs/specs/M1-autenticacao-conta.md)
// M2 · Casa e Membros        → '/casa'                  (docs/specs/M2-casa-membros.md)
// M3 · Produtos e Tags       → '/produtos' e '/tags'    (docs/specs/M3-produtos-tags.md)
// M4 · Estatísticas          → '/estatisticas'          (docs/specs/M4-estatisticas.md)
// M5 · Planos e Assinatura   → '/planos', '/assinaturas' e '/internal/jobs' (docs/specs/M5-planos-assinatura.md)
