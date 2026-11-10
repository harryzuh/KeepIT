import { createBrowserRouter, Navigate } from 'react-router';
import { ExemploPage } from './pages/ExemploPage';

/**
 * Rotas das 24 telas do protótipo. Cada dono de módulo adiciona as rotas das suas telas.
 *
 * | Tela | Rota sugerida            | Módulo |
 * | ---- | ------------------------ | ------ |
 * | 01   | /                        | M1     |  Boas-vindas
 * | 02   | /entrar                  | M1     |  Entrar
 * | 03   | /criar-conta             | M1     |  Criar conta
 * | 04   | /recuperar-senha         | M1     |  Recuperar senha
 * | 18   | /recuperar-senha/nova    | M1     |  Nova senha
 * | 05   | /inicio                  | M4     |  Início (17 = mesma tela no desktop)
 * | 10   | /estatisticas            | M4     |  Estatísticas
 * | 06   | /produtos                | M3     |  Produtos
 * | 07   | /produtos/:id            | M3     |  Detalhe (23 = modal Excluir produto)
 * | 08   | /produtos/novo           | M3     |  Adicionar produto (09 = modal Duplicado)
 * | 11   | /familia                 | M2     |  Família (22 = modal Gerenciar membro)
 * | 12   | /familia/adicionar       | M2     |  Adicionar membro
 * | 16   | /conta                   | M1     |  Conta (21 = modal Excluir conta)
 * | 20   | /conta/dados             | M1     |  Dados cadastrais
 * | 19   | /conta/senha             | M1     |  Alterar senha
 * | 13   | /planos                  | M5     |  Planos (24 = modal Assinar como membro)
 * | 14   | /planos/pagamento        | M5     |  Pagamento
 * | 15   | /conta/assinatura        | M5     |  Cancelar assinatura (modal)
 */
export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/exemplo" replace /> },
  { path: '/exemplo', element: <ExemploPage /> },
]);
