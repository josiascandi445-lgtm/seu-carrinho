import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { isNative } from './native';

// Feedback tátil "quando suportado": nativo via Capacitor, web via Vibration API (onde existir).
function run(nativeCall, webPattern) {
  try {
    if (isNative) {
      nativeCall();
    } else if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(webPattern);
    }
  } catch {
    /* sem suporte: ignora */
  }
}

export const haptics = {
  tap: () => run(() => Haptics.impact({ style: ImpactStyle.Light }), 8),
  medium: () => run(() => Haptics.impact({ style: ImpactStyle.Medium }), 14),
  success: () => run(() => Haptics.notification({ type: NotificationType.Success }), [10, 40, 12]),
  error: () => run(() => Haptics.notification({ type: NotificationType.Error }), [20, 40, 20]),
};
