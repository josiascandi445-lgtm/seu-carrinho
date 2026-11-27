import { CircleAlert, CircleCheck, Info } from 'lucide-react';
import { cx } from '../../utils/cx';
import styles from './Toast.module.css';

const ICONS = { success: CircleCheck, error: CircleAlert, info: Info };

export function ToastHost({ toast, onDismiss }) {
  const Icon = toast ? ICONS[toast.type] ?? Info : null;
  return (
    <div className={styles.wrap} aria-live="polite">
      {toast && (
        <button
          key={toast.id}
          type="button"
          role="status"
          className={cx(styles.toast, styles[toast.type], toast.closing && styles.closing)}
          onClick={onDismiss}
        >
          <Icon size={20} strokeWidth={2} className={styles.icon} aria-hidden="true" />
          <span>{toast.message}</span>
        </button>
      )}
    </div>
  );
}
