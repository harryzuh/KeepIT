import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { criarTag, listarTags } from './exemplo.api';

/**
 * MÓDULO DE EXEMPLO — hooks de dados (TanStack Query).
 * As telas usam estes hooks; nunca chamam fetch nem a api direto.
 */

export const chavesExemplo = {
  tags: (busca?: string) => ['exemplo', 'tags', busca ?? ''] as const,
};

export function useTags(busca?: string) {
  return useQuery({
    queryKey: chavesExemplo.tags(busca),
    queryFn: () => listarTags(busca),
    select: (dados) => dados.tags,
  });
}

export function useCriarTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: criarTag,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['exemplo', 'tags'] }),
  });
}
