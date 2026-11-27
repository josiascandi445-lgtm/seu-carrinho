import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cx } from '../../utils/cx';
import { haptics } from '../../services/haptics';
import styles from './SearchBar.module.css';

// Barra de pesquisa. Com asButton=true funciona como atalho (ex.: na Home abre o Explorar).
export function SearchBar({
  value = '',
  onChange,
  onSubmit,
  onFilterPress,
  filterActive = false,
  placeholder = 'O que procuras?',
  asButton = false,
  onPress,
  autoFocus = false,
  className,
}) {
  return (
    <div className={cx(styles.bar, className)} role="search">
      {asButton ? (
        <button type="button" className={cx(styles.field, styles.asButton)} onClick={onPress}>
          <Search size={20} strokeWidth={1.8} aria-hidden="true" />
          <span className={styles.placeholder}>{placeholder}</span>
        </button>
      ) : (
        <form
          className={styles.field}
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit?.(value);
            event.currentTarget.querySelector('input')?.blur();
          }}
        >
          <Search size={20} strokeWidth={1.8} aria-hidden="true" />
          <input
            type="search"
            className={styles.input}
            value={value}
            placeholder={placeholder}
            aria-label={placeholder}
            enterKeyHint="search"
            autoFocus={autoFocus}
            autoComplete="off"
            onChange={(event) => onChange?.(event.target.value)}
          />
          {value && (
            <button type="button" className={styles.clear} aria-label="Limpar pesquisa" onClick={() => onChange?.('')}>
              <X size={16} strokeWidth={2.2} />
            </button>
          )}
        </form>
      )}
      {onFilterPress && (
        <button
          type="button"
          className={cx(styles.filter, filterActive && styles.filterActive)}
          aria-label="Filtros"
          onClick={() => {
            haptics.tap();
            onFilterPress();
          }}
        >
          <SlidersHorizontal size={20} strokeWidth={1.8} />
        </button>
      )}
    </div>
  );
}
