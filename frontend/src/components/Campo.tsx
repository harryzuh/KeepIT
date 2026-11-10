import { forwardRef, useId, type InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  rotulo: string;
  erro?: string;
}

/**
 * Campo de formulário com rótulo e mensagem de erro (RNF11, RNF19).
 * Funciona com React Hook Form: <Campo rotulo="Nome" {...register('nome')} erro={errors.nome?.message} />
 */
export const Campo = forwardRef<HTMLInputElement, Props>(function Campo(
  { rotulo, erro, id, className = '', ...resto },
  ref,
) {
  const idGerado = useId();
  const idCampo = id ?? idGerado;
  const idErro = `${idCampo}-erro`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={idCampo} className="text-[13px] font-semibold text-texto-medio">
        {rotulo}
      </label>
      <input
        ref={ref}
        id={idCampo}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idErro : undefined}
        className={`h-12.5 rounded-campo border bg-superficie px-4 text-[15.5px] outline-none focus:border-primaria ${erro ? 'border-perigo' : 'border-borda'} ${className}`}
        {...resto}
      />
      {erro && (
        <p id={idErro} role="alert" className="text-[12.5px] text-perigo">
          {erro}
        </p>
      )}
    </div>
  );
});
