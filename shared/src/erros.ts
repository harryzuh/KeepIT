/**
 * Códigos de erro da API (Tabela 17 da documentação).
 * O front-end usa o código, e não a mensagem, para decidir o que mostrar.
 * Código novo só entra junto com a atualização da spec do módulo.
 */
export const CODIGOS_ERRO = [
  // gerais
  'DADOS_INVALIDOS',
  'NAO_AUTENTICADO',
  'SEM_PERMISSAO',
  'NAO_ENCONTRADO',
  'MUITAS_TENTATIVAS',
  'ERRO_INTERNO',
  // M1 · Autenticação e Conta
  'EMAIL_EM_USO',
  'CREDENCIAIS_INVALIDAS',
  'CONTA_NAO_ENCONTRADA',
  'CODIGO_INVALIDO',
  'SENHA_INCORRETA',
  // M2 · Casa e Membros
  'LIMITE_MEMBROS',
  // M3 · Produtos e Tags
  'ARQUIVO_INVALIDO',
  'COTA_EXCEDIDA',
  'PRODUTO_DUPLICADO',
  'TAG_EXISTENTE',
  // M5 · Planos e Assinatura
  'PAGAMENTO_RECUSADO',
  'PLANO_NAO_COMPORTA',
  'ESTADO_INVALIDO',
] as const;

export type CodigoErro = (typeof CODIGOS_ERRO)[number];

/** Formato de toda resposta de erro da API. */
export interface RespostaErro {
  erro: {
    codigo: CodigoErro;
    mensagem: string;
    detalhes?: unknown;
  };
}
