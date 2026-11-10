import type { CodigoErro } from '@keepit/shared';

/**
 * Erro de regra de negócio. Services lançam; o middleware tratarErros responde.
 *
 * @example throw new AppError(409, 'TAG_EXISTENTE', 'Já existe uma tag com esse nome nesta Casa');
 */
export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly codigo: CodigoErro,
    mensagem: string,
    public readonly detalhes?: unknown,
  ) {
    super(mensagem);
    this.name = 'AppError';
  }
}

export const naoEncontrado = (oque = 'Recurso') =>
  new AppError(404, 'NAO_ENCONTRADO', `${oque} não encontrado`);

export const semPermissao = () =>
  new AppError(403, 'SEM_PERMISSAO', 'Seu papel na Casa não permite esta ação');
