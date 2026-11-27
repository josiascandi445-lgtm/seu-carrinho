import { LogoMark } from '../Logo/Logo';
import styles from './SplashScreen.module.css';

// Splash animada de arranque: o logótipo entra com um halo de luz e o nome sobe suavemente.
export function SplashScreen() {
  return (
    <div className={styles.splash} role="status" aria-label="A iniciar Seu Carrinho">
      <div className={styles.center}>
        <span className={styles.halo} aria-hidden="true" />
        <LogoMark size={96} className={styles.mark} />
        <p className={styles.name}>Seu Carrinho</p>
      </div>
      <p className={styles.by}>Uma demonstração Bug Shop</p>
    </div>
  );
}
