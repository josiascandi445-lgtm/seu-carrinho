import { cx } from '../../utils/cx';
import styles from './Badge.module.css';

export function Badge({ tone = 'lime', children, className }) {
  return <span className={cx(styles.badge, styles[tone], className)}>{children}</span>;
}
