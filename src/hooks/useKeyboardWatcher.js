import { useEffect } from 'react';
import { Keyboard } from '@capacitor/keyboard';
import { isNative } from '../services/native';

// Mantém <html data-keyboard="open|closed"> e --keyboard-height atualizados.
// Usado para esconder a navegação inferior quando o teclado está aberto.
export function useKeyboardWatcher() {
  useEffect(() => {
    const root = document.documentElement;
    const apply = (height) => {
      root.style.setProperty('--keyboard-height', `${height}px`);
      root.dataset.keyboard = height > 80 ? 'open' : 'closed';
    };
    apply(0);

    if (isNative) {
      const show = Keyboard.addListener('keyboardWillShow', (info) => apply(info.keyboardHeight));
      const hide = Keyboard.addListener('keyboardWillHide', () => apply(0));
      return () => {
        show.then((l) => l.remove());
        hide.then((l) => l.remove());
      };
    }

    const viewport = window.visualViewport;
    if (!viewport) return undefined;
    const onResize = () => {
      const covered = window.innerHeight - viewport.height - viewport.offsetTop;
      apply(Math.max(0, Math.round(covered)));
    };
    viewport.addEventListener('resize', onResize);
    viewport.addEventListener('scroll', onResize);
    return () => {
      viewport.removeEventListener('resize', onResize);
      viewport.removeEventListener('scroll', onResize);
    };
  }, []);
}
