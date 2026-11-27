import { Button, EmptyState } from '../../components';
import { useAuth } from '../../contexts/AuthContext';

// Mostrado quando não foi possível ler o perfil do Firestore (sem rede, regras por publicar, etc.)
export function ProfileLoadError() {
  const auth = useAuth();
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--bg)' }}>
      <EmptyState
        kind="error"
        title="Não foi possível carregar o teu perfil"
        description={auth.profileError || 'Verifica a ligação e tenta novamente.'}
        actionLabel="Tentar novamente"
        onAction={auth.retryProfile}
      />
      <Button variant="soft" size="sm" onClick={auth.logout}>
        Terminar sessão
      </Button>
    </div>
  );
}
