import { ArrowRight } from 'lucide-react';
import { cx } from '../../utils/cx';
import { haptics } from '../../services/haptics';
import styles from './ListRow.module.css';

// Grupo de linhas de definições (estilo da referência de perfil).
export function ListGroup({ title, children }) {
  return (
    <section className={styles.section}>
      {title && <h3 className={styles.heading}>{title}</h3>}
      <ul className={styles.group}>{children}</ul>
    </section>
  );
}

// Linha de definição. Sem onPress ou com unavailable=true fica claramente identificada como indisponível.
export function ListRow({ icon: Icon, label, value, onPress, unavailable = false, trailing, selected = false }) {
  const disabled = unavailable || !onPress;
  return (
    <li className={styles.item}>
      <button
        type="button"
        className={cx(styles.row, disabled && styles.disabled)}
        disabled={disabled}
        aria-current={selected || undefined}
        onClick={() => {
          haptics.tap();
          onPress?.();
        }}
      >
        {Icon && <Icon size={22} strokeWidth={1.7} className={styles.icon} aria-hidden="true" />}
        <span className={styles.label}>{label}</span>
        {unavailable && <span className={styles.soon}>Em breve</span>}
        {value && !unavailable && <span className={styles.value}>{value}</span>}
        {trailing ?? (!disabled && <ArrowRight size={16} strokeWidth={1.9} className={styles.arrow} aria-hidden="true" />)}
      </button>
    </li>
  );
}
