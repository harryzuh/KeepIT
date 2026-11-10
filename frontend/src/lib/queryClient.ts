import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      // Erro 4xx não melhora tentando de novo.
      retry: (tentativas, erro) =>
        !(erro instanceof ApiError && erro.status < 500) && tentativas < 2,
    },
  },
});
