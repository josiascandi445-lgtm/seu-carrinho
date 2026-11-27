import { Bell, Heart, Package, Search, ShoppingBag, Store, WifiOff } from 'lucide-react';
import { Button } from '../Button/Button';
import { cx } from '../../utils/cx';
import styles from './EmptyState.module.css';

const ICONS = {
  cart: ShoppingBag,
  favorites: Heart,
  search: Search,
  orders: Package,
  notifications: Bell,
  error: WifiOff,
  generic: Store,
};

// Estado vazio ilustrado: cartão inclinado com o ícone do contexto + formas de apoio.
export function EmptyState({ kind = 'generic', title, description, actionLabel, onAction, className }) {
  const Icon = ICONS[kind] ?? ICONS.generic;
  return (
    <div className={cx(styles.empty, className)}>
      <div className={styles.art} aria-hidden="true">
        <span className={styles.blob} />
        <span className={styles.ring} />
        <span className={styles.dot} />
        <span className={styles.chip} />
        <div className={styles.card}>
          <Icon size={38} strokeWidth={1.6} />
        </div>
      </div>
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.text}>{description}</p>}
      {actionLabel && onAction && (
        <Button className={styles.action} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
