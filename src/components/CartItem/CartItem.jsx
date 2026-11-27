import { memo } from 'react';
import { Trash2 } from 'lucide-react';
import { ProductImage } from '../ProductImage/ProductImage';
import { QuantityStepper } from '../QuantityStepper/QuantityStepper';
import { formatKz } from '../../utils/format';
import { haptics } from '../../services/haptics';
import styles from './CartItem.module.css';

// item: { id, name, image?, variantLabel?, price, salePrice?, quantity, maxQuantity? }
export const CartItem = memo(function CartItem({ item, onQuantityChange, onRemove, onPress }) {
  const unit = item.salePrice && item.salePrice < item.price ? item.salePrice : item.price;

  return (
    <article className={styles.item}>
      <button type="button" className={styles.thumb} onClick={() => onPress?.(item)} aria-label={`Abrir ${item.name}`}>
        <ProductImage src={item.image} alt="" />
      </button>
      <div className={styles.body}>
        <div className={styles.top}>
          <div className={styles.text}>
            <h3 className={styles.name}>{item.name}</h3>
            {item.variantLabel && <p className={styles.variant}>{item.variantLabel}</p>}
          </div>
          <button
            type="button"
            className={styles.remove}
            aria-label={`Remover ${item.name} do carrinho`}
            onClick={() => {
              haptics.medium();
              onRemove?.(item);
            }}
          >
            <Trash2 size={18} strokeWidth={1.8} />
          </button>
        </div>
        <div className={styles.bottom}>
          <span className={styles.price}>{formatKz(unit * item.quantity)}</span>
          <QuantityStepper
            size="sm"
            value={item.quantity}
            max={item.maxQuantity ?? 99}
            onChange={(quantity) => onQuantityChange?.(item, quantity)}
          />
        </div>
      </div>
    </article>
  );
});
