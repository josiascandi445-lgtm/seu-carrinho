import { Check, Footprints, Headphones, Heart, Package, Search, ShoppingBag, Shirt, Watch } from 'lucide-react';
import styles from './OnboardingArt.module.css';

// Ilustrações compostas com formas e ícones (sem imagens externas): leves e iguais em qualquer dispositivo.

export function DiscoverArt() {
  return (
    <div className={styles.art} aria-hidden="true">
      <div className={styles.searchPill}>
        <Search size={18} strokeWidth={2} />
        <span className={styles.line} />
        <span className={styles.caret} />
      </div>
      <div className={styles.grid}>
        <div className={`${styles.tile} ${styles.lime}`}><Shirt size={40} strokeWidth={1.5} /></div>
        <div className={`${styles.tile} ${styles.surface} ${styles.drop}`}><Headphones size={40} strokeWidth={1.5} /></div>
        <div className={`${styles.tile} ${styles.ink}`}><Footprints size={40} strokeWidth={1.5} /></div>
        <div className={`${styles.tile} ${styles.soft} ${styles.drop}`}><Watch size={40} strokeWidth={1.5} /></div>
      </div>
    </div>
  );
}

export function FavoritesArt() {
  return (
    <div className={styles.art} aria-hidden="true">
      <div className={`${styles.back} ${styles.backLeft}`}><Shirt size={34} strokeWidth={1.5} /></div>
      <div className={`${styles.back} ${styles.backRight}`}><Footprints size={34} strokeWidth={1.5} /></div>
      <div className={styles.hero}>
        <Heart size={84} strokeWidth={1.4} fill="currentColor" />
      </div>
      <span className={`${styles.bubble} ${styles.bubbleA}`}><Heart size={16} fill="currentColor" strokeWidth={0} /></span>
      <span className={`${styles.bubble} ${styles.bubbleB}`}><Heart size={12} fill="currentColor" strokeWidth={0} /></span>
    </div>
  );
}

export function OrganizeArt() {
  return (
    <div className={styles.art} aria-hidden="true">
      <div className={styles.list}>
        <div className={styles.listHead}>
          <span className={styles.listIcon}><Package size={20} strokeWidth={1.8} /></span>
          <span className={`${styles.bar} ${styles.barLong}`} />
        </div>
        {[0, 1, 2].map((i) => (
          <div className={styles.row} key={i}>
            <span className={styles.check}><Check size={14} strokeWidth={3} /></span>
            <span className={`${styles.bar} ${i === 1 ? styles.barMid : styles.barLong}`} />
          </div>
        ))}
      </div>
      <span className={styles.bag}><ShoppingBag size={34} strokeWidth={1.8} /></span>
    </div>
  );
}
