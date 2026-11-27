import { cx } from '../../utils/cx';
import { haptics } from '../../services/haptics';
import styles from './IconButton.module.css';

export function IconButton({
  icon: Icon,
  label,
  onClick,
  badge = 0,
  variant = 'surface',
  size = 44,
  iconSize = 20,
  className,
  haptic = true,
  ...rest
}) {
  const handleClick = (event) => {
    if (haptic) haptics.tap();
    onClick?.(event);
  };

  return (
    <button
      type="button"
      aria-label={label}
      className={cx(styles.btn, styles[variant], className)}
      style={{ width: size, height: size }}
      onClick={handleClick}
      {...rest}
    >
      <Icon size={iconSize} strokeWidth={1.9} aria-hidden="true" />
      {badge > 0 && (
        <span className={styles.badge} key={badge}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}
