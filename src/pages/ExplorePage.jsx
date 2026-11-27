import { useState } from 'react';
import { AppHeader, EmptyState, SearchBar } from '../components';
import { Screen } from '../navigation/Screen';

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  return (
    <Screen header={<AppHeader title="Explorar" />}>
      <SearchBar value={query} onChange={setQuery} placeholder="Pesquisar produtos" />
      <EmptyState
        kind="search"
        title={query ? 'Sem resultados' : 'O catálogo ainda está vazio'}
        description={
          query
            ? `Não encontrámos nada para "${query}".`
            : 'Quando os produtos estiverem ligados ao Firebase, poderás pesquisar, filtrar e ordenar aqui.'
        }
      />
    </Screen>
  );
}
