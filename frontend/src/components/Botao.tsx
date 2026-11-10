import type { ButtonHTMLAttributes } from 'react';

type Variante = 'primario' | 'secundario' | 'perigo' | 'texto';

const estilos: Record<Variante, string> = {
  primario: 'bg-primaria text-white hover:brightness-110',
  secundario: 'bg-superficie text-texto border border-borda hover:bg-fundo',
  perigo: 'bg-perigo text-white hover:brightness-110',
  texto: 'bg-transparent text-texto-suave hover:text-texto',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  carregando?: boolean;
}

/** Botão padrão do protótipo (altura 52, raio 14). */
export function Botao({
  variante = 'primario',
  carregando = false,
  disabled,
  className = '',
  children,
  ...resto
}: Props) {
  return (
    <button
      type="button"
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
      className={`h-13 w-full rounded-botao px-4 text-base font-semibold transition disabled:opacity-60 ${estilos[variante]} ${className}`}
      {...resto}
    >
      {carregando ? 'Aguarde…' : children}
    </button>
  );
}
