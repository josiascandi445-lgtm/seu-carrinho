import { useRef, useState } from 'react';
import { ProductImage } from '../ProductImage/ProductImage';
import { cx } from '../../utils/cx';
import styles from './ProductGallery.module.css';

// Galeria com deslize horizontal (scroll-snap) e indicadores. Sem ampliação nem arrastar imagem.
export function ProductGallery({ images = [], alt = '', className }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const slides = images.length ? images : [null];

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el || !el.clientWidth) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    setIndex((prev) => (prev === next ? prev : next));
  };

  const goTo = (i) => {
    const el = trackRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className={cx(styles.gallery, className)}>
      <div ref={trackRef} className={styles.track} onScroll={handleScroll}>
        {slides.map((src, i) => (
          <div className={styles.slide} key={src ?? `empty-${i}`}>
            <ProductImage src={src} alt={alt ? `${alt} (${i + 1} de ${slides.length})` : ''} eager={i === 0} />
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className={styles.dots}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={styles.hit}
              aria-label={`Ver imagem ${i + 1}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
            >
              <span className={cx(styles.dot, i === index && styles.dotActive)} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
