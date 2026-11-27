import { ChevronLeft } from 'lucide-react';
import { IconButton } from '../../components';
import { cx } from '../../utils/cx';
import styles from './AuthLayout.module.css';

// Estrutura dos ecrãs de autenticação: cabeçalho em verde-lima com o título e painel claro com o formulário.
export function AuthLayout({ title, subtitle, onBack, children }) {
  return (
    <div className={styles.layout}>
      <header className={cx(styles.hero, onBack && styles.hasBack)}>
        <span className={styles.ring} aria-hidden="true" />
        <span className={styles.dot} aria-hidden="true" />
        {onBack && <IconButton icon={ChevronLeft} label="Voltar" onClick={onBack} className={styles.back} />}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </header>
      <main className={styles.panel}>
        <div className={styles.scroll}>{children}</div>
      </main>
    </div>
  );
}
