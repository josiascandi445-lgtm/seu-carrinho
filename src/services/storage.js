import { Preferences } from '@capacitor/preferences';

// Armazenamento simples chave/valor. No telemóvel usa o armazenamento nativo (mais durável que o localStorage
// do WebView); na web usa o localStorage.
export async function getItem(key) {
  try {
    const { value } = await Preferences.get({ key });
    return value;
  } catch {
    return null;
  }
}

export async function setItem(key, value) {
  try {
    await Preferences.set({ key, value: String(value) });
  } catch {
    /* armazenamento indisponível */
  }
}

export async function removeItem(key) {
  try {
    await Preferences.remove({ key });
  } catch {
    /* ignora */
  }
}

export const KEYS = {
  onboardingSeen: 'sc:onboarding-seen',
  guest: 'sc:guest',
};
