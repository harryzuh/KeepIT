import { FormTag } from '../features/exemplo/FormTag';
import { ListaTags } from '../features/exemplo/ListaTags';

/**
 * MÓDULO DE EXEMPLO — página.
 * Página só monta o layout e junta componentes da feature; dados e regras ficam na feature.
 * Precisa de login: sem token, a lista mostra "Faça login para continuar".
 */
export function ExemploPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-5 py-8">
      <header>
        <p className="text-[15px] text-texto-suave">Módulo de exemplo</p>
        <h1 className="text-[22px] font-bold tracking-tight">Tags da Casa</h1>
      </header>
      <FormTag />
      <ListaTags />
    </main>
  );
}
