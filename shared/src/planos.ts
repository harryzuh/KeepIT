/**
 * Planos do KeepIT (tela 13 do protótipo).
 * O plano Individual não tem assinatura: é o plano da Casa quando não há assinatura vigente.
 */
export const NOMES_PLANO = ['INDIVIDUAL', 'FAMILIA', 'BUSINESS'] as const;

export type NomePlano = (typeof NOMES_PLANO)[number];

export interface LimitesPlano {
  nome: NomePlano;
  rotulo: string;
  precoMensal: number;
  limiteMembros: number;
  limiteArmazenamentoGb: number;
}

export const PLANOS: Record<NomePlano, LimitesPlano> = {
  INDIVIDUAL: {
    nome: 'INDIVIDUAL',
    rotulo: 'Individual',
    precoMensal: 0,
    limiteMembros: 1,
    limiteArmazenamentoGb: 1,
  },
  FAMILIA: {
    nome: 'FAMILIA',
    rotulo: 'Família',
    precoMensal: 19.9,
    limiteMembros: 6,
    limiteArmazenamentoGb: 20,
  },
  BUSINESS: {
    nome: 'BUSINESS',
    rotulo: 'Business',
    precoMensal: 49.9,
    limiteMembros: 15,
    limiteArmazenamentoGb: 100,
  },
};
