import { cx } from '../../utils/cx';
import styles from './Logo.module.css';

export function LogoMark({ size = 40, className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="#a3cf3b" />
      <g
        transform="translate(9 9) scale(1.25)"
        fill="none"
        stroke="#14181a"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2.5 3.5h2.4l2.2 10.6a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.46-1.15L19.8 7.5H6" />
        <circle cx="9.5" cy="19.5" r="1.4" />
        <circle cx="17" cy="19.5" r="1.4" />
      </g>
    </svg>
  );
}

export function Logo({ size = 32, showName = true, className }) {
  return (
    <span className={cx(styles.logo, className)}>
      <LogoMark size={size} />
      {showName && (
        <span className={styles.name} style={{ fontSize: Math.round(size * 0.56) }}>
          Seu Carrinho
        </span>
      )}
    </span>
  );
}
