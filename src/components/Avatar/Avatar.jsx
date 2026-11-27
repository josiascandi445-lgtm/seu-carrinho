import { User } from 'lucide-react';
import { cx } from '../../utils/cx';
import styles from './Avatar.module.css';

const initialsOf = (name) =>
  (name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

// Fotografia do utilizador; sem foto mostra as iniciais (ou um ícone, se não houver nome).
export function Avatar({ src, name, size = 64, className }) {
  const initials = initialsOf(name);
  return (
    <span className={cx(styles.avatar, className)} style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}>
      {src ? (
        <img src={src} alt="" draggable={false} />
      ) : initials ? (
        <span aria-hidden="true">{initials}</span>
      ) : (
        <User size={Math.round(size * 0.46)} strokeWidth={1.7} aria-hidden="true" />
      )}
    </span>
  );
}
