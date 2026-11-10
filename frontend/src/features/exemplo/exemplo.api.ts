import type { CriarTagExemplo, TagExemplo } from '@keepit/shared';
import { api } from '../../lib/api';

/** MÓDULO DE EXEMPLO — chamadas à API. Uma função por rota, sem lógica de tela. */

export function listarTags(busca?: string) {
  const query = busca ? `?busca=${encodeURIComponent(busca)}` : '';
  return api<{ tags: TagExemplo[] }>(`/exemplo/tags${query}`);
}

export function criarTag(dados: CriarTagExemplo) {
  return api<{ tag: TagExemplo }>('/exemplo/tags', { method: 'POST', body: dados });
}
