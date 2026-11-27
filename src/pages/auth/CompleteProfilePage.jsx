import { useAuth } from '../../contexts/AuthContext';
import { friendlyError } from '../../services/authService';
import { AuthLayout } from './AuthLayout';
import { ProfileForm } from './ProfileForm';
import form from './authForm.module.css';

// Etapa obrigatória depois do registo: só pedimos o essencial (nome); foto e telefone são opcionais.
export function CompleteProfilePage() {
  const auth = useAuth();

  const submit = async (data) => {
    try {
      await auth.completeProfile(data);
    } catch (error) {
      const wrapped = new Error(friendlyError(error));
      wrapped.friendly = wrapped.message;
      throw wrapped;
    }
  };

  return (
    <AuthLayout title="Quase lá!" subtitle="Conta-nos como te chamas.">
      <ProfileForm submitLabel="Concluir" onSubmit={submit} />
      <p className={form.switch} style={{ marginTop: 20 }}>
        <button type="button" onClick={auth.logout}>
          Terminar sessão
        </button>
      </p>
    </AuthLayout>
  );
}
