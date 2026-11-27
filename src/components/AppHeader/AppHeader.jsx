import { ChevronLeft } from 'lucide-react';
import { IconButton } from '../IconButton/IconButton';
import { useOptionalNavigation } from '../../navigation/NavigationContext';
import { cx } from '../../utils/cx';
import styles from './AppHeader.module.css';

// Cabeçalho de ecrã: botão voltar (ou elemento à esquerda), título centrado e ações à direita.
export function AppHeader({ title, subtitle, back = false, onBack, leading, trailing, className }) {
  const navigation = useOptionalNavigation();
  const handleBack = onBack ?? navigation?.pop;

  return (
    <header className={cx(styles.header, className)}>
      <div className={styles.side}>
        {back ? <IconButton icon={ChevronLeft} label="Voltar" onClick={handleBack} /> : leading}
      </div>
      <div className={styles.center}>
        {title && <h1 className={styles.title}>{title}</h1>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={cx(styles.side, styles.end)}>{trailing}</div>
    </header>
  );
}
