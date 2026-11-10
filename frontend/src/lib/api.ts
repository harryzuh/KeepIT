import type { CodigoErro, RespostaErro } from '@keepit/shared';
import { obterToken } from './sessao';

const BASE = import.meta.env.VITE_API_URL ?? '/api';

/** Erro devolvido pela API. Use `codigo` para decidir a mensagem ou a tela (ex.: PRODUTO_DUPLICADO → tela 09). */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly codigo: CodigoErro | 'SEM_CONEXAO',
    mensagem: string,
    public readonly detalhes?: unknown,
  ) {
    super(mensagem);
    this.name = 'ApiError';
  }
}

interface Opcoes {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

/**
 * Única forma de o front-end chamar a API. Envia o token, converte JSON e erros.
 *
 * @example const { tags } = await api<{ tags: TagExemplo[] }>('/exemplo/tags');
 */
export async function api<T>(caminho: string, { method = 'GET', body, signal }: Opcoes = {}) {
  const token = obterToken();
  let resposta: Response;
  try {
    resposta = await fetch(`${BASE}${caminho}`, {
      method,
      signal,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // RNF24: queda de rede vira mensagem amigável.
    throw new ApiError(0, 'SEM_CONEXAO', 'Sem conexão com a internet');
  }

  if (resposta.status === 204) return undefined as T;

  const dados: unknown = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    const erro = (dados as RespostaErro | null)?.erro;
    throw new ApiError(
      resposta.status,
      erro?.codigo ?? 'ERRO_INTERNO',
      erro?.mensagem ?? 'Erro inesperado',
      erro?.detalhes,
    );
  }
  return dados as T;
}
