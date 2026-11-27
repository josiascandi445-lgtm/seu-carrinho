import { AppHeader, EmptyState } from '../components';
import { Screen } from '../navigation/Screen';
import { useNavigation } from '../navigation/NavigationContext';

export default function CartPage() {
  const navigation = useNavigation();
  return (
    <Screen header={<AppHeader title="Carrinho" />}>
      <EmptyState
        kind="cart"
        title="O teu carrinho está vazio"
        description="Adiciona produtos para os veres aqui."
        actionLabel="Explorar produtos"
        onAction={() => navigation.setTab('explore')}
      />
    </Screen>
  );
}
