import { Cartao } from '../../components/Cartao';
import { useTags } from './exemplo.hooks';

/** MÓDULO DE EXEMPLO — lista com os estados de carregando, erro e vazio. */
export function ListaTags() {
  const { data: tags, isPending, error } = useTags();

  if (isPending) return <p className="text-texto-suave">Carregando…</p>;
  if (error)
    return (
      <p role="alert" className="text-perigo">
        {error.message}
      </p>
    );
  if (tags.length === 0) return <p className="text-texto-suave">Nenhuma tag ainda.</p>;

  return (
    <Cartao className="p-0">
      <ul className="divide-y divide-borda">
        {tags.map((tag) => (
          <li key={tag.id} className="px-4 py-3 font-medium">
            {tag.nome}
          </li>
        ))}
      </ul>
    </Cartao>
  );
}
