import { useState } from 'react';
import { Bell, Check, CircleHelp, CircleUserRound, Info, Languages, LayoutGrid, Lock, LogOut, CirclePlay, SunMoon } from 'lucide-react';
import { AppHeader, Avatar, Button, ListGroup, ListRow, Modal } from '../components';
import { Screen } from '../navigation/Screen';
import { useNavigation } from '../navigation/NavigationContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { features } from '../config/features';
import { friendlyError } from '../services/authService';
import styles from './ProfilePage.module.css';

const THEME_OPTIONS = [
  { id: 'system', label: 'Automático (segue o telemóvel)' },
  { id: 'light', label: 'Claro' },
  { id: 'dark', label: 'Escuro' },
];
const THEME_LABEL = { system: 'Automático', light: 'Claro', dark: 'Escuro' };

export default function ProfilePage() {
  const navigation = useNavigation();
  const auth = useAuth();
  const toast = useToast();
  const { mode, setMode } = useTheme();
  const [themeOpen, setThemeOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const signedIn = auth.status === 'signedIn';
  const name = auth.profile?.displayName || auth.user?.displayName || '';

  const confirmLogout = async () => {
    setLoggingOut(true);
    try {
      await auth.logout();
    } catch (error) {
      setLoggingOut(false);
      setLogoutOpen(false);
      toast.error(friendlyError(error));
    }
  };

  return (
    <Screen header={<AppHeader title="Perfil" />}>
      <div className={styles.card}>
        <Avatar src={signedIn ? auth.profile?.photoDataUrl : ''} name={signedIn ? name : ''} size={64} />
        <div className={styles.who}>
          <p className={styles.name}>{signedIn ? name || 'A tua conta' : 'Visitante'}</p>
          <p className={styles.hint}>{signedIn ? auth.user?.email : 'Entra para guardares compras e favoritos'}</p>
        </div>
      </div>
      {!signedIn && (
        <Button className={styles.cta} fullWidth onClick={auth.leaveGuest}>
          Entrar ou criar conta
        </Button>
      )}

      <ListGroup title="Conta">
        <ListRow icon={CircleUserRound} label="Gerir perfil" onPress={signedIn ? () => navigation.push('editProfile') : undefined} unavailable={!signedIn} />
        <ListRow icon={Lock} label="Segurança" unavailable />
        <ListRow icon={Bell} label="Notificações" unavailable />
        <ListRow icon={Languages} label="Idioma" unavailable />
      </ListGroup>

      <ListGroup title="Preferências">
        <ListRow icon={SunMoon} label="Tema" value={THEME_LABEL[mode]} onPress={() => setThemeOpen(true)} />
        <ListRow icon={CirclePlay} label="Ver introdução" onPress={() => navigation.push('onboarding')} />
        <ListRow icon={Info} label="Sobre o aplicativo" unavailable />
        {features.designSystem && (
          <ListRow icon={LayoutGrid} label="Biblioteca de componentes" onPress={() => navigation.push('designSystem')} />
        )}
      </ListGroup>

      <ListGroup title="Suporte">
        <ListRow icon={CircleHelp} label="Centro de ajuda" unavailable />
      </ListGroup>

      {signedIn && (
        <ListGroup>
          <ListRow icon={LogOut} label="Terminar sessão" danger onPress={() => setLogoutOpen(true)} trailing={<span />} />
        </ListGroup>
      )}

      <Modal open={themeOpen} onClose={() => setThemeOpen(false)} title="Tema">
        <div className={styles.options}>
          <ListGroup>
            {THEME_OPTIONS.map((option) => (
              <ListRow
                key={option.id}
                label={option.label}
                selected={mode === option.id}
                trailing={mode === option.id ? <Check size={18} strokeWidth={2.2} /> : <span />}
                onPress={() => {
                  setMode(option.id);
                  setThemeOpen(false);
                }}
              />
            ))}
          </ListGroup>
        </div>
      </Modal>

      <Modal open={logoutOpen} onClose={() => !loggingOut && setLogoutOpen(false)} title="Terminar sessão?" variant="dialog" dismissible={!loggingOut}>
        <p className={styles.dialogText}>Vais precisar de iniciar sessão outra vez para aceder à tua conta.</p>
        <div className={styles.dialogActions}>
          <Button size="sm" variant="soft" onClick={() => setLogoutOpen(false)} disabled={loggingOut}>
            Cancelar
          </Button>
          <Button size="sm" variant="danger" onClick={confirmLogout} loading={loggingOut}>
            Terminar sessão
          </Button>
        </div>
      </Modal>
    </Screen>
  );
}
