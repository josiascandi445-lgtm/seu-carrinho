// Dados FICTÍCIOS usados apenas na biblioteca de componentes (não são produtos reais).
const svgImage = (bg, fg, shape) => {
  const shapes = {
    box: `<rect x='120' y='140' width='160' height='130' rx='22' fill='${fg}'/><rect x='150' y='110' width='100' height='46' rx='16' fill='none' stroke='${fg}' stroke-width='14'/>`,
    round: `<circle cx='200' cy='200' r='92' fill='${fg}'/><circle cx='168' cy='168' r='22' fill='${bg}' opacity='.55'/>`,
    wide: `<rect x='72' y='160' width='256' height='92' rx='40' fill='${fg}'/><rect x='110' y='134' width='120' height='40' rx='20' fill='${fg}'/>`,
    tall: `<rect x='128' y='84' width='144' height='236' rx='30' fill='${fg}'/><circle cx='200' cy='116' r='9' fill='${bg}' opacity='.6'/>`,
  };
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><rect width='400' height='400' fill='${bg}'/>${shapes[shape]}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Variante sem fundo (recorte), como seriam imagens de produto em PNG transparente
const cutout = (fg, shape) => svgImage('none', fg, shape);

export const demoImages = {
  sand: svgImage('#ece7dc', '#c9b896', 'wide'),
  sky: svgImage('#dfe8f5', '#7a9cd6', 'tall'),
  mint: svgImage('#dcefe5', '#5fae8a', 'round'),
  rose: svgImage('#f4e1e3', '#d98c95', 'box'),
  stone: svgImage('#e4e5e2', '#8a8f87', 'wide'),
  amber: svgImage('#f6ebd0', '#e0a93a', 'round'),
};

const cut = { shirt: cutout('#4f6fb5', 'tall'), dress: cutout('#c4606d', 'box'), shoe: cutout('#2f7d5c', 'wide'), phone: cutout('#b97a12', 'round') };

export const demoProducts = [
  { id: 'p1', name: 'Sapatilha casual cinzenta', price: 18500, salePrice: 14800, image: demoImages.stone, rating: 4.6, reviewCount: 128, categoryName: 'Calçados' },
  { id: 'p2', name: 'Casaco de ganga clássico', price: 32000, image: demoImages.sky, rating: 4.2, reviewCount: 64, categoryName: 'Moda masculina' },
  { id: 'p3', name: 'Auscultadores sem fios', price: 45000, salePrice: 38250, image: demoImages.amber, rating: 4.8, reviewCount: 311, categoryName: 'Eletrónicos' },
  { id: 'p4', name: 'Mala de ombro em pele sintética com fecho duplo', price: 27500, image: demoImages.rose, rating: 3.9, reviewCount: 22, categoryName: 'Acessórios' },
  { id: 'p5', name: 'Candeeiro de mesa', price: 12900, image: null, categoryName: 'Casa e decoração' },
  { id: 'p6', name: 'Relógio minimalista', price: 21000, image: demoImages.mint, rating: 4.4, reviewCount: 97, categoryName: 'Acessórios' },
];

export const demoCategories = [
  { id: 'c1', name: 'Moda masculina', image: cut.shirt, color: '#f2c14e' },
  { id: 'c2', name: 'Moda feminina', image: cut.dress, color: '#7b97f2' },
  { id: 'c3', name: 'Calçados', image: cut.shoe, color: '#8fd3b6' },
  { id: 'c4', name: 'Eletrónicos', image: cut.phone, color: '#e9a07a' },
];

export const demoGallery = [demoImages.stone, demoImages.sand, demoImages.sky];

export const demoCartItems = [
  { id: 'i1', name: 'Sapatilha casual cinzenta', image: demoImages.stone, variantLabel: 'Tamanho 42 · Cinzento', price: 18500, salePrice: 14800, quantity: 1, maxQuantity: 5 },
  { id: 'i2', name: 'Casaco de ganga clássico', image: demoImages.sky, variantLabel: 'Tamanho M', price: 32000, quantity: 2, maxQuantity: 8 },
];
