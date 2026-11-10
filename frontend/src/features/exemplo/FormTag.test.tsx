import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../lib/api';
import * as exemploApi from './exemplo.api';
import { FormTag } from './FormTag';

/** MÓDULO DE EXEMPLO — teste de tela: valida o formulário e o erro de negócio vindo da API. */

vi.mock('./exemplo.api');

function renderizar() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <FormTag />
    </QueryClientProvider>,
  );
}

describe('FormTag', () => {
  beforeEach(() => {
    vi.mocked(exemploApi.criarTag).mockReset();
  });

  it('mostra erro de validação sem chamar a API quando o nome está vazio', async () => {
    renderizar();

    await userEvent.click(screen.getByRole('button', { name: 'Criar tag' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Informe o nome da tag');
    expect(exemploApi.criarTag).not.toHaveBeenCalled();
  });

  it('envia o nome e limpa o campo quando a API aceita', async () => {
    vi.mocked(exemploApi.criarTag).mockResolvedValue({ tag: { id: 1, nome: 'Móveis' } });
    renderizar();

    await userEvent.type(screen.getByLabelText('Nova tag'), 'Móveis');
    await userEvent.click(screen.getByRole('button', { name: 'Criar tag' }));

    expect(vi.mocked(exemploApi.criarTag).mock.calls[0]?.[0]).toEqual({ nome: 'Móveis' });
    expect(await screen.findByLabelText('Nova tag')).toHaveValue('');
  });

  it('mostra a mensagem certa quando a API responde TAG_EXISTENTE', async () => {
    vi.mocked(exemploApi.criarTag).mockRejectedValue(
      new ApiError(409, 'TAG_EXISTENTE', 'Já existe uma tag com esse nome nesta Casa'),
    );
    renderizar();

    await userEvent.type(screen.getByLabelText('Nova tag'), 'Móveis');
    await userEvent.click(screen.getByRole('button', { name: 'Criar tag' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Essa tag já existe na sua Casa');
  });
});
