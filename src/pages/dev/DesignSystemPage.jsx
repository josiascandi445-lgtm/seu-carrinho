import { useState } from 'react';
import { Mail, Plus, ShoppingBag, Vibrate } from 'lucide-react';
import {
  AppHeader, BottomNavigation, Button, CartItem, CategoryCard, EmptyState, FormField, IconButton,
  Modal, ProductCard, ProductCardSkeleton, ProductGallery, QuantityStepper, RatingStars, SearchBar,
} from '../../components';
import { Screen } from '../../navigation/Screen';
import { TABS } from '../../navigation/tabs';
import { useToast } from '../../contexts/ToastContext';
import { haptics } from '../../services/haptics';
import { demoCartItems, demoCategories, demoGallery, demoProducts } from './demoData';
import styles from './DesignSystemPage.module.css';

function Section({ title, note, children }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{title}</h2>
      {note && <p className={styles.note}>{note}</p>}
      {children}
    </section>
  );
}

const SWATCHES = [
  ['Lima', 'var(--accent)'], ['Lima suave', 'var(--accent-soft)'], ['Carvão', 'var(--ink)'],
  ['Fundo', 'var(--bg)'], ['Superfície', 'var(--surface)'], ['Linha', 'var(--line)'],
];

export default function DesignSystemPage() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [query, setQuery] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [favorites, setFavorites] = useState(() => new Set(['p1']));
  const [cartItems, setCartItems] = useState(demoCartItems);
  const [rating, setRating] = useState(4);
  const [qty, setQty] = useState(1);
  const [chip, setChip] = useState('c1');
  const [sheet, setSheet] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('home');

  const emailError = emailTouched && !/^\S+@\S+\.\S+$/.test(email) ? 'Escreve um email válido, como nome@exemplo.com.' : '';

  const toggleFavorite = (product) =>
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(product.id) ? next.delete(product.id) : next.add(product.id);
      return next;
    });

  const fakeSave = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      toast.success('Alterações guardadas');
    }, 1200);
  };

  return (
    <Screen header={<AppHeader back title="Biblioteca de componentes" />}>
      <p className={styles.note}>Todos os dados desta página são fictícios e servem apenas para demonstração visual.</p>

      <Section title="Cores">
        <div className={styles.swatches}>
          {SWATCHES.map(([name, value]) => (
            <div key={name} className={styles.swatch}>
              <span style={{ background: value }} />
              <small>{name}</small>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Botões">
        <div className={styles.stack}>
          <Button fullWidth icon={ShoppingBag}>Adicionar ao carrinho</Button>
          <Button fullWidth variant="dark">Continuar</Button>
          <div className={styles.row}>
            <Button variant="soft" size="sm">Secundário</Button>
            <Button variant="outline" size="sm">Contorno</Button>
            <Button variant="danger" size="sm">Remover</Button>
          </div>
          <Button fullWidth loading={saving} onClick={fakeSave}>Guardar alterações</Button>
          <Button fullWidth disabled>Indisponível</Button>
          <div className={styles.row}>
            <IconButton icon={Plus} label="Adicionar" />
            <IconButton icon={ShoppingBag} label="Carrinho" badge={3} />
            <IconButton icon={Mail} label="Mensagens" variant="dark" />
          </div>
        </div>
      </Section>

      <Section title="Campos">
        <div className={styles.stack}>
          <SearchBar value={query} onChange={setQuery} onFilterPress={() => toast.info('Os filtros chegam com o catálogo')} />
          <FormField
            label="Email" type="email" icon={Mail} placeholder="nome@exemplo.com" value={email}
            error={emailError} onChange={(e) => setEmail(e.target.value)} onBlur={() => setEmailTouched(true)}
            autoComplete="email" inputMode="email"
          />
          <FormField label="Palavra-passe" type="password" placeholder="Mínimo 8 caracteres" hint="Usa letras e números." autoComplete="new-password" />
        </div>
      </Section>

      <Section title="Categorias">
        <div className={styles.scroller}>
          {demoCategories.map((c) => (
            <CategoryCard key={c.id} category={c} active={chip === c.id} onPress={() => setChip(c.id)} />
          ))}
        </div>
        <div className={styles.scroller}>
          {demoCategories.map((c) => (
            <CategoryCard key={c.id} category={c} variant="tile" onPress={() => toast.info(c.name)} />
          ))}
        </div>
      </Section>

      <Section title="Produtos">
        <div className={styles.row}>
          <Button size="sm" variant="soft" onClick={() => setLoadingProducts((v) => !v)}>
            {loadingProducts ? 'Mostrar produtos' : 'Mostrar carregamento'}
          </Button>
        </div>
        <div className={styles.grid}>
          {loadingProducts
            ? [0, 1, 2, 3].map((i) => <ProductCardSkeleton key={i} />)
            : demoProducts.map((p) => (
                <ProductCard
                  key={p.id} product={p} isFavorite={favorites.has(p.id)}
                  onPress={() => toast.info(p.name)} onToggleFavorite={toggleFavorite}
                />
              ))}
        </div>
      </Section>

      <Section title="Galeria e quantidade">
        <ProductGallery images={demoGallery} alt="Sapatilha" />
        <div className={styles.rowBetween}>
          <RatingStars value={4.6} count={128} showValue />
          <QuantityStepper value={qty} onChange={setQty} max={5} />
        </div>
        <div className={styles.rowBetween}>
          <span>A tua classificação</span>
          <RatingStars interactive value={rating} onChange={setRating} size={22} />
        </div>
      </Section>

      <Section title="Carrinho">
        <div className={styles.stack}>
          {cartItems.map((item) => (
            <CartItem
              key={item.id} item={item}
              onQuantityChange={(it, quantity) => setCartItems((l) => l.map((x) => (x.id === it.id ? { ...x, quantity } : x)))}
              onRemove={(it) => setCartItems((l) => l.filter((x) => x.id !== it.id))}
            />
          ))}
          {cartItems.length === 0 && (
            <>
              <EmptyState kind="cart" title="O teu carrinho está vazio" description="Adiciona produtos para os veres aqui." />
              <Button variant="soft" onClick={() => setCartItems(demoCartItems)}>Repor itens de exemplo</Button>
            </>
          )}
        </div>
      </Section>

      <Section title="Estados vazios">
        <EmptyState kind="favorites" title="Ainda não tens favoritos" description="Toca no coração de um produto para o guardares aqui." />
        <EmptyState kind="error" title="Sem ligação" description="Verifica a tua internet e tenta novamente." actionLabel="Tentar novamente" onAction={() => toast.error('Continua sem ligação')} />
      </Section>

      <Section title="Feedback">
        <div className={styles.row}>
          <Button size="sm" variant="soft" onClick={() => toast.success('Adicionado ao carrinho')}>Sucesso</Button>
          <Button size="sm" variant="soft" onClick={() => toast.error('Não foi possível guardar')}>Erro</Button>
          <Button size="sm" variant="soft" icon={Vibrate} onClick={haptics.medium}>Tátil</Button>
        </div>
        <div className={styles.row}>
          <Button size="sm" variant="outline" onClick={() => setSheet(true)}>Folha inferior</Button>
          <Button size="sm" variant="outline" onClick={() => setDialog(true)}>Caixa de diálogo</Button>
        </div>
      </Section>

      <Section title="Navegação inferior">
        <BottomNavigation inline items={TABS} activeId={tab} onChange={setTab} badges={{ cart: 3 }} />
      </Section>

      <Modal open={sheet} onClose={() => setSheet(false)} title="Ordenar por">
        <div className={styles.stack}>
          <Button variant="soft" fullWidth onClick={() => setSheet(false)}>Mais recentes</Button>
          <Button variant="soft" fullWidth onClick={() => setSheet(false)}>Preço: do mais baixo</Button>
          <Button variant="soft" fullWidth onClick={() => setSheet(false)}>Preço: do mais alto</Button>
        </div>
      </Modal>
      <Modal open={dialog} onClose={() => setDialog(false)} title="Remover do carrinho?" variant="dialog">
        <p className={styles.note}>O produto deixa de aparecer no teu carrinho.</p>
        <div className={styles.rowEnd}>
          <Button size="sm" variant="soft" onClick={() => setDialog(false)}>Cancelar</Button>
          <Button size="sm" variant="danger" onClick={() => { setDialog(false); toast.success('Produto removido'); }}>Remover</Button>
        </div>
      </Modal>
    </Screen>
  );
}
