import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { ToastHost } from '../components/Toast/ToastHost';
import { haptics } from '../services/haptics';

const ToastContext = createContext(null);
const EXIT_MS = 220;

// Mostra uma mensagem curta no topo. Uma de cada vez; a nova substitui a anterior.
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(0);
  const sequence = useRef(0);

  const dismiss = useCallback(() => {
    window.clearTimeout(timer.current);
    setToast((current) => (current ? { ...current, closing: true } : current));
    timer.current = window.setTimeout(() => setToast(null), EXIT_MS);
  }, []);

  const show = useCallback(
    (message, { type = 'info', duration = 2600 } = {}) => {
      window.clearTimeout(timer.current);
      sequence.current += 1;
      setToast({ id: sequence.current, message, type, closing: false });
      if (type === 'success') haptics.success();
      if (type === 'error') haptics.error();
      timer.current = window.setTimeout(dismiss, duration);
    },
    [dismiss],
  );

  const api = useMemo(
    () => ({
      show,
      info: (message, options) => show(message, { ...options, type: 'info' }),
      success: (message, options) => show(message, { ...options, type: 'success' }),
      error: (message, options) => show(message, { ...options, type: 'error' }),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastHost toast={toast} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast deve ser usado dentro de <ToastProvider>');
  return context;
}
