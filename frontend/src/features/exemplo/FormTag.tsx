import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { criarTagExemploSchema, type CriarTagExemplo } from '@keepit/shared';
import { Botao } from '../../components/Botao';
import { Campo } from '../../components/Campo';
import { ApiError } from '../../lib/api';
import { useCriarTag } from './exemplo.hooks';

/**
 * MÓDULO DE EXEMPLO — formulário com React Hook Form + o mesmo schema Zod da API.
 * Erros de negócio chegam pelo `codigo` e viram mensagem no campo certo.
 */
export function FormTag() {
  const criar = useCriarTag();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CriarTagExemplo>({ resolver: zodResolver(criarTagExemploSchema) });

  const enviar = handleSubmit(async (dados) => {
    try {
      await criar.mutateAsync(dados);
      reset();
    } catch (erro) {
      if (erro instanceof ApiError && erro.codigo === 'TAG_EXISTENTE') {
        setError('nome', { message: 'Essa tag já existe na sua Casa' });
        return;
      }
      setError('root', {
        message: erro instanceof Error ? erro.message : 'Não foi possível salvar',
      });
    }
  });

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
      <Campo
        rotulo="Nova tag"
        placeholder="Ex.: Eletrônicos"
        {...register('nome')}
        erro={errors.nome?.message}
      />
      {errors.root && (
        <p role="alert" className="text-[12.5px] text-perigo">
          {errors.root.message}
        </p>
      )}
      <Botao type="submit" carregando={criar.isPending}>
        Criar tag
      </Botao>
    </form>
  );
}
