import { Star } from 'lucide-react';
import { cx } from '../../utils/cx';
import { haptics } from '../../services/haptics';
import styles from './RatingStars.module.css';

function Row({ size, filled }) {
  return (
    <span className={styles.row}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={size} strokeWidth={1.6} fill="currentColor" aria-hidden="true" data-filled={filled} />
      ))}
    </span>
  );
}

// Mostra a classificação (0–5, aceita meias estrelas). Com interactive=true permite escolher de 1 a 5.
export function RatingStars({ value = 0, count, size = 14, showValue = false, interactive = false, onChange, className }) {
  if (interactive) {
    return (
      <div className={cx(styles.wrap, className)} role="radiogroup" aria-label="Classificação">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} ${n === 1 ? 'estrela' : 'estrelas'}`}
            className={cx(styles.pick, n <= value && styles.picked)}
            onClick={() => {
              haptics.tap();
              onChange?.(n);
            }}
          >
            <Star size={size} strokeWidth={1.6} fill={n <= value ? 'currentColor' : 'none'} aria-hidden="true" />
          </button>
        ))}
      </div>
    );
  }

  const percent = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className={cx(styles.wrap, className)}>
      <span
        className={styles.stars}
        role="img"
        aria-label={`${value.toFixed(1).replace('.', ',')} de 5 estrelas`}
        style={{ height: size }}
      >
        <span className={styles.track}>
          <Row size={size} />
        </span>
        <span className={styles.fill} style={{ width: `${percent}%` }}>
          <Row size={size} filled />
        </span>
      </span>
      {showValue && <span className={styles.value}>{value.toFixed(1).replace('.', ',')}</span>}
      {count != null && <span className={styles.count}>({count})</span>}
    </span>
  );
}
