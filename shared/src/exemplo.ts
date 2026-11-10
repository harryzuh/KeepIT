import { z } from 'zod';

/**
 * MÓDULO DE EXEMPLO — referência de padrão, não é funcionalidade do produto.
 * O mesmo schema valida o formulário no front-end e o corpo da requisição na API.
 */
export const criarTagExemploSchema = z.object({
  nome: z
    .string({ error: 'Informe o nome da tag' })
    .trim()
    .min(1, 'Informe o nome da tag')
    .max(40, 'Use no máximo 40 caracteres'),
});

export type CriarTagExemplo = z.infer<typeof criarTagExemploSchema>;

export const listarTagsExemploQuery = z.object({
  busca: z.string().trim().max(40).optional(),
});

export type ListarTagsExemploQuery = z.infer<typeof listarTagsExemploQuery>;

export interface TagExemplo {
  id: number;
  nome: string;
}
