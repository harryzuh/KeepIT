import type { HTMLAttributes } from 'react';

/** Cartão branco com borda, usado em listas e blocos do protótipo. */
export function Cartao({ className = '', ...resto }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-cartao border border-borda bg-superficie p-4 ${className}`}
      {...resto}
    />
  );
}
