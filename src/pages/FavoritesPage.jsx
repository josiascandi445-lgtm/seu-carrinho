import { AppHeader, EmptyState } from '../components';
import { Screen } from '../navigation/Screen';
import { useNavigation } from '../navigation/NavigationContext';

export default function FavoritesPage() {
  const navigation = useNavigation();
  return (
    <Screen header={<AppHeader title="Favoritos" />}>
      <EmptyState
        kind="favorites"
        title="Ainda não tens favoritos"
        description="Toca no coração de um produto para o guardares aqui."
        actionLabel="Explorar produtos"
        onAction={() => navigation.setTab('explore')}
      />
    </Screen>
  );
}
