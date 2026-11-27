import { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cx } from '../../utils/cx';
import styles from './ProductImage.module.css';

// Imagem de produto com carregamento progressivo e fallback (nunca mostra uma imagem "quebrada").
export function ProductImage({ src, alt = '', ratio = '1 / 1', eager = false, fit = 'cover', className }) {
  const [status, setStatus] = useState(src ? 'loading' : 'error');

  useEffect(() => {
    setStatus(src ? 'loading' : 'error');
  }, [src]);

  return (
    <div className={cx(styles.box, className)} style={{ aspectRatio: ratio }}>
      {status !== 'loaded' && (
        <div className={cx(styles.placeholder, status === 'loading' && styles.pulse)} aria-hidden="true">
          {status === 'error' && <ImageOff size={26} strokeWidth={1.6} />}
        </div>
      )}
      {src && status !== 'error' && (
        <img
          className={styles.img}
          src={src}
          alt={alt}
          draggable={false}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={{ objectFit: fit, opacity: status === 'loaded' ? 1 : 0 }}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}
    </div>
  );
}
