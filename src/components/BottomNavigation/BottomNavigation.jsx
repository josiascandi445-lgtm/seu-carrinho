import { cx } from '../../utils/cx';
import styles from './BottomNavigation.module.css';

// items: [{ id, label, icon }]  badges: { [id]: número }
// inline=true desativa o posicionamento fixo (usado na biblioteca de componentes).
export function BottomNavigation({ items, activeId, onChange, badges = {}, hidden = false, inline = false }) {
  return (
    <nav
      className={cx(styles.nav, inline && styles.inline)}
      data-hidden={hidden || undefined}
      aria-label="Navegação principal"
    >
      <ul className={styles.list}>
        {items.map(({ id, label, icon: Icon }) => {
          const active = id === activeId;
          const badge = badges[id] ?? 0;
          return (
            <li key={id} className={styles.item} data-active={active}>
              <button
                type="button"
                className={styles.btn}
                aria-current={active ? 'page' : undefined}
                aria-label={badge > 0 ? `${label}, ${badge} ${badge === 1 ? 'produto' : 'produtos'}` : label}
                onClick={() => onChange(id)}
              >
                <span className={styles.icon}>
                  <Icon size={21} strokeWidth={active ? 2.1 : 1.8} aria-hidden="true" />
                  {badge > 0 && (
                    <span className={styles.badge} key={badge}>
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                </span>
                <span className={styles.label}>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
