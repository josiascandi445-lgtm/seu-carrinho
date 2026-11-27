import { AppHeader } from '../components';
import { Screen } from '../navigation/Screen';
import { useNavigation } from '../navigation/NavigationContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { friendlyError } from '../services/authService';
import { ProfileForm } from './auth/ProfileForm';

export default function EditProfilePage() {
  const auth = useAuth();
  const navigation = useNavigation();
  const toast = useToast();

  const submit = async (data) => {
    try {
      await auth.saveProfile(data);
    } catch (error) {
      const wrapped = new Error(friendlyError(error));
      wrapped.friendly = wrapped.message;
      throw wrapped;
    }
    toast.success('Perfil atualizado');
    navigation.pop();
  };

  return (
    <Screen header={<AppHeader back title="Gerir perfil" />}>
      <div style={{ paddingTop: 12 }}>
        <ProfileForm initial={auth.profile} submitLabel="Guardar alterações" onSubmit={submit} />
      </div>
    </Screen>
  );
}
