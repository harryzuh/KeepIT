import type { NextFunction, Request, Response } from 'express';
import { ZodError, z } from 'zod';
import type { RespostaErro } from '@keepit/shared';
import { AppError } from '../lib/erros';

/** Rota inexistente → 404 no formato padrão. */
export function rotaNaoEncontrada(_req: Request, res: Response<RespostaErro>) {
  res.status(404).json({ erro: { codigo: 'NAO_ENCONTRADO', mensagem: 'Rota não encontrada' } });
}

/** Converte qualquer erro em { erro: { codigo, mensagem, detalhes? } }. Fica por último no app. */
export function tratarErros(
  erro: unknown,
  _req: Request,
  res: Response<RespostaErro>,
  _next: NextFunction,
) {
  if (erro instanceof AppError) {
    res.status(erro.status).json({
      erro: { codigo: erro.codigo, mensagem: erro.message, detalhes: erro.detalhes },
    });
    return;
  }

  if (erro instanceof ZodError) {
    res.status(422).json({
      erro: {
        codigo: 'DADOS_INVALIDOS',
        mensagem: 'Confira os dados enviados',
        detalhes: z.flattenError(erro).fieldErrors,
      },
    });
    return;
  }

  if (erro instanceof SyntaxError && 'body' in erro) {
    res.status(400).json({ erro: { codigo: 'DADOS_INVALIDOS', mensagem: 'JSON inválido' } });
    return;
  }

  console.error(erro);
  res.status(500).json({ erro: { codigo: 'ERRO_INTERNO', mensagem: 'Erro inesperado' } });
}
