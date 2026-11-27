import { cx } from '../../utils/cx';
import { haptics } from '../../services/haptics';
import styles from './Button.module.css';

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon: Icon,
  children,
  onClick,
  type = 'button',
  haptic = true,
  className,
  ...rest
}) {
  const handleClick = (event) => {
    if (loading || disabled) return;
    if (haptic) haptics.tap();
    onClick?.(event);
  };

  return (
    <button
      type={type}
      className={cx(styles.btn, styles[variant], styles[size], fullWidth && styles.full, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={handleClick}
      {...rest}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        Icon && <Icon size={size === 'sm' ? 16 : 20} strokeWidth={2} aria-hidden="true" />
      )}
      <span>{children}</span>
    </button>
  );
}
