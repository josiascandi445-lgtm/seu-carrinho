import { AppHeader, EmptyState, Logo, SearchBar } from '../components';
import { Screen } from '../navigation/Screen';
import { useNavigation } from '../navigation/NavigationContext';

export default function HomePage() {
  const navigation = useNavigation();
  return (
    <Screen header={<AppHeader leading={<Logo size={34} />} />}>
      <SearchBar asButton placeholder="O que estás à procura?" onPress={() => navigation.setTab('explore')} />
      <EmptyState
        kind="generic"
        title="A vitrine está a ser preparada"
        description="Produtos, categorias e promoções aparecem aqui assim que a loja estiver ligada ao Firebase."
      />
    </Screen>
  );
}
