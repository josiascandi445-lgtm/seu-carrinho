import { memo } from 'react';
import { Heart } from 'lucide-react';
import { ProductImage } from '../ProductImage/ProductImage';
import { RatingStars } from '../RatingStars/RatingStars';
import { Badge } from '../Badge/Badge';
import { Skeleton } from '../Skeleton/Skeleton';
import { cx } from '../../utils/cx';
import { discountPercent, formatKz } from '../../utils/format';
import { haptics } from '../../services/haptics';
import styles from './ProductCard.module.css';

// product: { id, name, price, salePrice?, image?, rating?, reviewCount?, categoryName? }
export const ProductCard = memo(function ProductCard({ product, isFavorite = false, onPress, onToggleFavorite, className }) {
  const { name, price, salePrice, image, rating, reviewCount, categoryName } = product;
  const percent = discountPercent(price, salePrice);
  const finalPrice = percent > 0 ? salePrice : price;

  return (
    <article className={cx(styles.card, className)}>
      <button
        type="button"
        className={styles.main}
        onClick={() => onPress?.(product)}
        aria-label={`${name}, ${formatKz(finalPrice)}`}
      >
        <div className={styles.media}>
          <ProductImage src={image} alt="" ratio="1 / 1.08" />
          {percent > 0 && <Badge className={styles.discount}>-{percent}%</Badge>}
        </div>
        <div className={styles.info}>
          {categoryName && <span className={styles.category}>{categoryName}</span>}
          <h3 className={styles.name}>{name}</h3>
          <div className={styles.prices}>
            <span className={styles.price}>{formatKz(finalPrice)}</span>
            {percent > 0 && <span className={styles.old}>{formatKz(price)}</span>}
          </div>
          {rating != null && <RatingStars value={rating} count={reviewCount} size={12} />}
        </div>
      </button>
      <button
        type="button"
        className={styles.fav}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        onClick={() => {
          isFavorite ? haptics.tap() : haptics.medium();
          onToggleFavorite?.(product);
        }}
      >
        <Heart
          key={isFavorite ? 'on' : 'off'}
          size={18}
          strokeWidth={1.9}
          fill={isFavorite ? 'currentColor' : 'none'}
          className={isFavorite ? styles.pop : undefined}
        />
      </button>
    </article>
  );
});

export function ProductCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <Skeleton height={0} radius={16} style={{ paddingBottom: '108%', height: 0 }} />
      <div className={styles.info}>
        <Skeleton width="40%" height={11} />
        <Skeleton width="85%" height={15} />
        <Skeleton width="55%" height={16} />
      </div>
    </div>
  );
}
