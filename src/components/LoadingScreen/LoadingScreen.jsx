import { LogoMark } from '../Logo/Logo';
import { cx } from '../../utils/cx';
import styles from './LoadingScreen.module.css';

// Ecrã de carregamento de marca (arranque). Com inline=true mostra só o indicador (dentro de um ecrã).
export function LoadingScreen({ inline = false, className }) {
  if (inline) {
    return (
      <div className={cx(styles.inline, className)} role="status" aria-label="A carregar">
        <span className={styles.ring} />
      </div>
    );
  }
  return (
    <div className={cx(styles.screen, className)} role="status" aria-label="A carregar">
      <LogoMark size={84} className={styles.mark} />
      <span className={styles.ring} />
    </div>
  );
}
