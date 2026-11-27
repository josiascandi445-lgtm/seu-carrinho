import { cx } from '../../utils/cx';
import styles from './Skeleton.module.css';

export function Skeleton({ width = '100%', height = 16, radius = 8, className, style }) {
  return (
    <span
      className={cx(styles.sk, className)}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}
