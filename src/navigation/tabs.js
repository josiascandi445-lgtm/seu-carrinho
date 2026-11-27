import { Compass, Heart, House, ShoppingBag, User } from 'lucide-react';

// As cinco áreas da navegação inferior. O id coincide com o nome da rota raiz de cada separador.
export const TABS = [
  { id: 'home', label: 'Início', icon: House },
  { id: 'explore', label: 'Explorar', icon: Compass },
  { id: 'favorites', label: 'Favoritos', icon: Heart },
  { id: 'cart', label: 'Carrinho', icon: ShoppingBag },
  { id: 'profile', label: 'Perfil', icon: User },
];

export const TAB_IDS = TABS.map((tab) => tab.id);
export const ROOT_ROUTE_BY_TAB = Object.fromEntries(TAB_IDS.map((id) => [id, id]));
