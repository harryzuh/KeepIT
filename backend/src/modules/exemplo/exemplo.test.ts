import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { criarApp } from '../../app';
import { prisma } from '../../lib/prisma';
import { entrarComo } from '../../../tests/auth';

/**
 * MÓDULO DE EXEMPLO — TESTES.
 * Um teste por regra do contrato: permissão, validação, erro de negócio e caminho feliz.
 */

vi.mock('../../lib/prisma', async () => {
  const { criarPrismaMock } = await import('../../../tests/prismaMock');
  return { prisma: criarPrismaMock() };
});

const app = criarApp();

describe('GET /exemplo/tags', () => {
  it('exige login', async () => {
    const res = await request(app).get('/exemplo/tags');

    expect(res.status).toBe(401);
    expect(res.body.erro.codigo).toBe('NAO_AUTENTICADO');
  });

  it('lista as tags da Casa do usuário para qualquer papel', async () => {
    const cabecalho = entrarComo('LEITOR', { casaId: 7 });
    vi.mocked(prisma.tag.findMany).mockResolvedValue([{ id: 1, nome: 'Eletrônicos' }] as never);

    const res = await request(app).get('/exemplo/tags?busca=ele').set(cabecalho);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ tags: [{ id: 1, nome: 'Eletrônicos' }] });
    expect(prisma.tag.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { casaId: 7, nome: { contains: 'ele', mode: 'insensitive' } },
      }),
    );
  });
});

describe('POST /exemplo/tags', () => {
  it('cria a tag e responde 201 para ADMIN ou EDITOR', async () => {
    const cabecalho = entrarComo('EDITOR', { casaId: 7 });
    vi.mocked(prisma.tag.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.tag.create).mockResolvedValue({ id: 2, nome: 'Ferramentas' } as never);

    const res = await request(app)
      .post('/exemplo/tags')
      .set(cabecalho)
      .send({ nome: '  Ferramentas ' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ tag: { id: 2, nome: 'Ferramentas' } });
    expect(prisma.tag.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: { casaId: 7, nome: 'Ferramentas' } }),
    );
  });

  it('bloqueia LEITOR com 403 SEM_PERMISSAO', async () => {
    const cabecalho = entrarComo('LEITOR');

    const res = await request(app).post('/exemplo/tags').set(cabecalho).send({ nome: 'Móveis' });

    expect(res.status).toBe(403);
    expect(res.body.erro.codigo).toBe('SEM_PERMISSAO');
    expect(prisma.tag.create).not.toHaveBeenCalled();
  });

  it('recusa nome vazio com 422 DADOS_INVALIDOS', async () => {
    const cabecalho = entrarComo('ADMIN');

    const res = await request(app).post('/exemplo/tags').set(cabecalho).send({ nome: '   ' });

    expect(res.status).toBe(422);
    expect(res.body.erro.codigo).toBe('DADOS_INVALIDOS');
    expect(res.body.erro.detalhes.nome).toBeDefined();
  });

  it('recusa nome repetido na Casa com 409 TAG_EXISTENTE', async () => {
    const cabecalho = entrarComo('ADMIN');
    vi.mocked(prisma.tag.findUnique).mockResolvedValue({ id: 1 } as never);

    const res = await request(app).post('/exemplo/tags').set(cabecalho).send({ nome: 'Móveis' });

    expect(res.status).toBe(409);
    expect(res.body.erro.codigo).toBe('TAG_EXISTENTE');
    expect(prisma.tag.create).not.toHaveBeenCalled();
  });
});
