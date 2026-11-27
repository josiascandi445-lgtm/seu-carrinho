import { useNavigation } from '../../navigation/NavigationContext';
import { Onboarding } from './Onboarding';

// Introdução aberta a partir do Perfil (pode ser revista quando quiseres)
export default function OnboardingRoute() {
  const navigation = useNavigation();
  return <Onboarding onDone={navigation.pop} />;
}
