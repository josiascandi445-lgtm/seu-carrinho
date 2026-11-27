import { cx } from '../../utils/cx';
import { haptics } from '../../services/haptics';
import styles from './CategoryCard.module.css';

// category: { id, name, image?, color? }
// variant "chip": rótulo + miniatura (Home). variant "tile": cartão colorido com a imagem a sobrepor (Explorar).
export function CategoryCard({ category, variant = 'chip', active = false, onPress, className }) {
  const { name, image, color } = category;
  const press = () => {
    haptics.tap();
    onPress?.(category);
  };

  if (variant === 'tile') {
    return (
      <button
        type="button"
        className={cx(styles.tile, className)}
        style={{ background: color ?? 'var(--accent)' }}
        onClick={press}
      >
        <span className={styles.tileName}>{name}</span>
        {image && <img className={styles.tileImg} src={image} alt="" draggable={false} loading="lazy" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cx(styles.chip, active && styles.active, className)}
      aria-pressed={active}
      onClick={press}
    >
      <span className={styles.chipName}>{name}</span>
      {image && <img className={styles.chipImg} src={image} alt="" draggable={false} loading="lazy" />}
    </button>
  );
}
