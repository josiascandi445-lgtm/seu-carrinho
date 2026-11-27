import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core';
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform(); // 'android' | 'ios' | 'web'

// Cor dos ícones da barra de estado/navegação conforme o tema.
// SystemBarsStyle.Dark = ícones claros (para fundos escuros).
export async function setSystemBarsStyle(isDark) {
  if (!isNative) return;
  try {
    await SystemBars.setStyle({ style: isDark ? SystemBarsStyle.Dark : SystemBarsStyle.Light });
  } catch {
    /* plugin indisponível: ignora */
  }
}

export async function hideNativeSplash() {
  if (!isNative) return;
  try {
    await SplashScreen.hide({ fadeOutDuration: 200 });
  } catch {
    /* já escondido */
  }
}

// Botão "voltar" do Android. Devolve uma função para remover o listener.
export function listenHardwareBack(handler) {
  if (!isNative) return () => {};
  const pending = App.addListener('backButton', handler);
  return () => {
    pending.then((listener) => listener.remove());
  };
}

export function exitApp() {
  if (isNative) App.exitApp();
}
