import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components';
import { registerBackHandler } from '../../services/backButton';
import { cx } from '../../utils/cx';
import { DiscoverArt, FavoritesArt, OrganizeArt } from './OnboardingArt';
import styles from './Onboarding.module.css';

const SLIDES = [
  {
    Art: DiscoverArt,
    title: 'Descobre produtos incríveis',
    text: 'Explora categorias, novidades e promoções, tudo num só lugar.',
  },
  {
    Art: FavoritesArt,
    title: 'Encontra os teus favoritos',
    text: 'Guarda o que gostas com um toque e volta a isso quando quiseres.',
  },
  {
    Art: OrganizeArt,
    title: 'Organiza as tuas compras num só lugar',
    text: 'Carrinho, pedidos e novidades sempre à mão, em qualquer momento.',
  },
];

// Três ecrãs com deslize, indicadores, Continuar / Saltar / Começar. onDone é chamado ao terminar ou saltar.
export function Onboarding({ onDone }) {
  const trackRef = useRef(null);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const last = index === SLIDES.length - 1;

  const goTo = (i) => {
    const el = trackRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el || !el.clientWidth) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next !== indexRef.current) {
      indexRef.current = next;
      setIndex(next);
    }
  };

  // Botão voltar do Android recua um ecrã do onboarding antes de sair
  useEffect(
    () =>
      registerBackHandler(() => {
        if (indexRef.current > 0) {
          goTo(indexRef.current - 1);
          return true;
        }
        return false;
      }),
    [],
  );

  return (
    <div className={styles.root}>
      <header className={styles.top}>
        {!last ? (
          <button type="button" className={styles.skip} onClick={onDone}>
            Saltar
          </button>
        ) : (
          <span className={styles.skip} aria-hidden="true" />
        )}
      </header>

      <div ref={trackRef} className={styles.track} onScroll={handleScroll}>
        {SLIDES.map(({ Art, title, text }, i) => (
          <section key={title} className={styles.slide} aria-label={`${i + 1} de ${SLIDES.length}`}>
            <div className={styles.art}>
              <Art />
            </div>
            <div className={styles.copy}>
              <h1 className={styles.title}>{title}</h1>
              <p className={styles.text}>{text}</p>
            </div>
          </section>
        ))}
      </div>

      <footer className={styles.footer}>
        <div className={styles.dots} aria-hidden="true">
          {SLIDES.map((_, i) => (
            <span key={i} className={cx(styles.dot, i === index && styles.dotActive)} />
          ))}
        </div>
        <Button fullWidth size="lg" variant="dark" onClick={last ? onDone : () => goTo(index + 1)}>
          {last ? 'Começar' : 'Continuar'}
        </Button>
      </footer>
    </div>
  );
}
