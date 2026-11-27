import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cx } from '../../utils/cx';
import { registerBackHandler } from '../../services/backButton';
import styles from './Modal.module.css';

const EXIT_MS = 220;

// Modal com duas variantes: "sheet" (folha inferior, estilo mobile) e "dialog" (caixa centrada).
// Fecha com o botão voltar do Android, com Escape e ao tocar no fundo.
export function Modal({ open, onClose, title, children, variant = 'sheet', dismissible = true }) {
  const [mounted, setMounted] = useState(open);
  const panelRef = useRef(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return undefined;
    }
    const timer = window.setTimeout(() => setMounted(false), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const close = () => {
      if (dismissible) onClose?.();
      return true; // consome o evento: o ecrã por baixo não deve recuar
    };
    const onKey = (event) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    const unregister = registerBackHandler(close);
    panelRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      unregister();
    };
  }, [open, dismissible, onClose]);

  if (!mounted) return null;

  const state = open ? 'open' : 'closing';
  const target = document.getElementById('overlay-root') ?? document.body;

  return createPortal(
    <div className={cx(styles.root, styles[variant])} data-state={state}>
      <div className={styles.backdrop} onClick={dismissible ? onClose : undefined} />
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        {variant === 'sheet' && <span className={styles.grabber} aria-hidden="true" />}
        {(title || dismissible) && (
          <div className={styles.head}>
            <h2 className={styles.title}>{title}</h2>
            {dismissible && (
              <button type="button" className={styles.close} aria-label="Fechar" onClick={onClose}>
                <X size={18} strokeWidth={2} />
              </button>
            )}
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    target,
  );
}
