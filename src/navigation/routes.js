import { lazy } from 'react';
import HomePage from '../pages/HomePage';
import ExplorePage from '../pages/ExplorePage';
import FavoritesPage from '../pages/FavoritesPage';
import CartPage from '../pages/CartPage';
import ProfilePage from '../pages/ProfilePage';

// Registo de ecrãs. tabBar:false esconde a navegação inferior (ex.: detalhes do produto).
// Ecrãs secundários são carregados sob demanda (lazy) para manter o arranque leve.
export const routes = {
  home: { component: HomePage, tabBar: true },
  explore: { component: ExplorePage, tabBar: true },
  favorites: { component: FavoritesPage, tabBar: true },
  cart: { component: CartPage, tabBar: true },
  profile: { component: ProfilePage, tabBar: true },

  editProfile: { component: lazy(() => import('../pages/EditProfilePage')), tabBar: false },
  onboarding: { component: lazy(() => import('../pages/onboarding/OnboardingRoute')), tabBar: false },
  designSystem: { component: lazy(() => import('../pages/dev/DesignSystemPage')), tabBar: false },
};
