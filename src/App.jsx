import { useEffect, useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { NavigationProvider } from './navigation/NavigationContext';
import { Navigator } from './navigation/Navigator';
import { LoadingScreen } from './components';
import { useKeyboardWatcher } from './hooks/useKeyboardWatcher';
import { exitApp, hideNativeSplash, listenHardwareBack } from './services/native';
import { runBackHandlers } from './services/backButton';

const MIN_SPLASH_MS = 700;

export default function App() {
  const [ready, setReady] = useState(false);
  useKeyboardWatcher();

  // Arranque: esconde o splash nativo quando o ecrã de carregamento de marca já está pintado
  useEffect(() => {
    let alive = true;
    requestAnimationFrame(() => requestAnimationFrame(hideNativeSplash));
    const fonts = Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 1200))]);
    const minimum = new Promise((r) => setTimeout(r, MIN_SPLASH_MS));
    Promise.all([fonts, minimum]).then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);

  // Botão voltar do Android: o último manipulador registado decide; se ninguém tratar, sai da app
  useEffect(() => listenHardwareBack(() => { if (!runBackHandlers()) exitApp(); }), []);

  return (
    <ThemeProvider>
      <div className="app">
        <ToastProvider>
          {ready ? (
            <NavigationProvider>
              <Navigator badges={{ cart: 0 }} />
            </NavigationProvider>
          ) : (
            <LoadingScreen />
          )}
          <div id="overlay-root" />
        </ToastProvider>
      </div>
    </ThemeProvider>
  );
}
