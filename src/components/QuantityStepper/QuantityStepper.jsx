import { Minus, Plus } from 'lucide-react';
import { cx } from '../../utils/cx';
import { haptics } from '../../services/haptics';
import styles from './QuantityStepper.module.css';

export function QuantityStepper({ value, onChange, min = 1, max = 99, size = 'md', className }) {
  const change = (next) => {
    haptics.tap();
    onChange(next);
  };

  return (
    <div className={cx(styles.stepper, styles[size], className)} role="group" aria-label="Quantidade">
      <button type="button" aria-label="Diminuir quantidade" disabled={value <= min} onClick={() => change(value - 1)}>
        <Minus size={16} strokeWidth={2.2} aria-hidden="true" />
      </button>
      <span className={styles.value} aria-live="polite">
        {value}
      </span>
      <button type="button" aria-label="Aumentar quantidade" disabled={value >= max} onClick={() => change(value + 1)}>
        <Plus size={16} strokeWidth={2.2} aria-hidden="true" />
      </button>
    </div>
  );
}
