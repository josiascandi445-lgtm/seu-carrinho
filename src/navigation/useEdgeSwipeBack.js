import { useEffect } from 'react';

// Gesto de voltar: deslizar a partir da margem esquerda (como no iOS).
export function useEdgeSwipeBack(ref, onBack, enabled) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return undefined;
    let start = null;

    const onStart = (event) => {
      const touch = event.touches[0];
      const left = el.getBoundingClientRect().left;
      start = touch.clientX - left <= 24 ? { x: touch.clientX, y: touch.clientY, time: Date.now() } : null;
    };
    const onEnd = (event) => {
      if (!start) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - start.x;
      const dy = Math.abs(touch.clientY - start.y);
      const elapsed = Date.now() - start.time;
      start = null;
      if (dx > 70 && dy < 60 && elapsed < 700) onBack();
    };
    const onCancel = () => {
      start = null;
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    el.addEventListener('touchcancel', onCancel, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('touchcancel', onCancel);
    };
  }, [ref, onBack, enabled]);
}
