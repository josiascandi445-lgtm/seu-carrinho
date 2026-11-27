const NBSP = '\u00A0';

// 12500 -> "12.500 Kz"
export function formatKz(value) {
  const n = Math.round(Number(value) || 0);
  const digits = Math.abs(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${n < 0 ? '-' : ''}${digits}${NBSP}Kz`;
}

// Percentagem de desconto entre preço normal e promocional (0 se não houver desconto)
export function discountPercent(price, salePrice) {
  if (!salePrice || !price || salePrice >= price) return 0;
  return Math.round((1 - salePrice / price) * 100);
}
