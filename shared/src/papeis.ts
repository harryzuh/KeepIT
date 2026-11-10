/** Papéis de um membro na Casa (RNF31: conferidos sempre na API). */
export const PAPEIS = ['ADMIN', 'EDITOR', 'LEITOR'] as const;

export type Papel = (typeof PAPEIS)[number];

/** Papéis que podem criar, editar e excluir produtos e tags. */
export const PAPEIS_QUE_EDITAM: readonly Papel[] = ['ADMIN', 'EDITOR'];
