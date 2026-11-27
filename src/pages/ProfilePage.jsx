import { useState } from 'react';
import { Bell, Check, CircleHelp, CircleUserRound, Info, Languages, LayoutGrid, Lock, SunMoon, User } from 'lucide-react';
import { AppHeader, ListGroup, ListRow, Modal } from '../components';
import { Screen } from '../navigation/Screen';
import { useNavigation } from '../navigation/NavigationContext';
import { useTheme } from '../contexts/ThemeContext';
import { features } from '../config/features';
import styles from './ProfilePage.module.css';

const THEME_OPTIONS = [
  { id: 'system', label: 'Automático (segue o telemóvel)' },
  { id: 'light', label: 'Claro' },
  { id: 'dark', label: 'Escuro' },
];
const THEME_LABEL = { system: 'Automático', light: 'Claro', dark: 'Escuro' };

export default function ProfilePage() {
  const navigation = useNavigation();
  const { mode, setMode } = useTheme();
  const [themeOpen, setThemeOpen] = useState(false);

  return (
    <Screen header={<AppHeader title="Perfil" />}>
      <div className={styles.card}>
        <span className={styles.avatar} aria-hidden="true">
          <User size={26} strokeWidth={1.7} />
        </span>
        <div className={styles.who}>
          <p className={styles.name}>Visitante</p>
          <p className={styles.hint}>O início de sessão chega em breve</p>
        </div>
      </div>

      <ListGroup title="Conta">
        <ListRow icon={CircleUserRound} label="Gerir perfil" unavailable />
        <ListRow icon={Lock} label="Segurança" unavailable />
        <ListRow icon={Bell} label="Notificações" unavailable />
        <ListRow icon={Languages} label="Idioma" unavailable />
      </ListGroup>

      <ListGroup title="Preferências">
        <ListRow icon={SunMoon} label="Tema" value={THEME_LABEL[mode]} onPress={() => setThemeOpen(true)} />
        <ListRow icon={Info} label="Sobre o aplicativo" unavailable />
        {features.designSystem && (
          <ListRow icon={LayoutGrid} label="Biblioteca de componentes" onPress={() => navigation.push('designSystem')} />
        )}
      </ListGroup>

      <ListGroup title="Suporte">
        <ListRow icon={CircleHelp} label="Centro de ajuda" unavailable />
      </ListGroup>

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
    </Screen>
  );
}
