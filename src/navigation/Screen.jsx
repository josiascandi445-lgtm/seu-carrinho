import { useCallback, useEffect, useRef, useState } from 'react';
import { useScreen } from './ScreenContext';
import { cx } from '../utils/cx';
import styles from './Screen.module.css';

// Estrutura de um ecrã: cabeçalho fixo, conteúdo com scroll controlado e rodapé fixo opcional.
// Reserva espaço para a navegação inferior quando a rota a mostra.
export function Screen({ header, footer, children, scroll = true, className, contentClassName }) {
  const { focused, tabBar } = useScreen();
  const scrollRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const next = (scrollRef.current?.scrollTop ?? 0) > 4;
    setScrolled((prev) => (prev === next ? prev : next));
  }, []);

  // Tocar no separador ativo, já na raiz, volta ao topo
  useEffect(() => {
    if (!focused) return undefined;
    const toTop = () => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    window.addEventListener('sc:scroll-top', toTop);
    return () => window.removeEventListener('sc:scroll-top', toTop);
  }, [focused]);

  return (
    <div className={cx(styles.screen, className)} data-scrolled={scrolled} data-tabbar={tabBar}>
      {header}
      {scroll ? (
        <div ref={scrollRef} className={cx(styles.scroll, !header && styles.noHeader)} onScroll={handleScroll}>
          <div className={cx(styles.content, contentClassName)}>{children}</div>
        </div>
      ) : (
        <div className={cx(styles.fixed, contentClassName)}>{children}</div>
      )}
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
