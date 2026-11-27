import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { NavigationProvider } from './navigation/NavigationContext';
import { Navigator } from './navigation/Navigator';
import { LoadingScreen, SplashScreen } from './components';
import { AuthFlow } from './pages/auth/AuthFlow';
import { CompleteProfilePage } from './pages/auth/CompleteProfilePage';
import { ProfileLoadError } from './pages/auth/ProfileLoadError';
import { Onboarding } from './pages/onboarding/Onboarding';
import { useKeyboardWatcher } from './hooks/useKeyboardWatcher';
import { exitApp, hideNativeSplash, listenHardwareBack } from './services/native';
import { runBackHandlers } from './services/backButton';
import { KEYS, getItem, setItem } from './services/storage';

const MIN_SPLASH_MS = 1600;

// Decide o que mostrar: splash → introdução (1.ª vez) → autenticação → conclusão de perfil → aplicação.
function Root() {
  const auth = useAuth();
  const [onboardingSeen, setOnboardingSeen] = useState(null); // null = ainda a ler
  const [minElapsed, setMinElapsed] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    getItem(KEYS.onboardingSeen).then((value) => setOnboardingSeen(value === 'true'));
    const timer = window.setTimeout(() => setMinElapsed(true), MIN_SPLASH_MS);
    Promise.race([document.fonts?.ready, new Promise((resolve) => window.setTimeout(resolve, 1200))]).then(() => setFontsReady(true));
    // O splash nativo sai quando o splash animado já está pintado
    requestAnimationFrame(() => requestAnimationFrame(hideNativeSplash));
    return () => window.clearTimeout(timer);
  }, []);

  const finishOnboarding = () => {
    setItem(KEYS.onboardingSeen, 'true');
    setOnboardingSeen(true);
  };

  if (!minElapsed || !fontsReady || onboardingSeen === null || !auth.ready) return <SplashScreen />;
  if (!onboardingSeen) return <Onboarding onDone={finishOnboarding} />;

  if (auth.status === 'signedIn') {
    if (auth.profileStatus === 'loading' || auth.profileStatus === 'idle') return <LoadingScreen />;
    if (auth.profileStatus === 'error') return <ProfileLoadError />;
    if (!auth.profile) return <CompleteProfilePage />;
    return (
      <NavigationProvider>
        <Navigator badges={{ cart: 0 }} />
      </NavigationProvider>
    );
  }

  if (auth.guest) {
    return (
      <NavigationProvider>
        <Navigator badges={{ cart: 0 }} />
      </NavigationProvider>
    );
  }

  return <AuthFlow />;
}

export default function App() {
  useKeyboardWatcher();

  // Botão voltar do Android: o último manipulador registado decide; se ninguém tratar, sai da app
  useEffect(() => listenHardwareBack(() => { if (!runBackHandlers()) exitApp(); }), []);

  return (
    <ThemeProvider>
      <div className="app">
        <ToastProvider>
          <AuthProvider>
            <Root />
          </AuthProvider>
          <div id="overlay-root" />
        </ToastProvider>
      </div>
    </ThemeProvider>
  );
}
