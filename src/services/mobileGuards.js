// Proteções para o aplicativo não se comportar como um site aberto no navegador.
// Os campos de texto continuam a funcionar normalmente.
const EDITABLE = 'input, textarea, [contenteditable="true"], [data-selectable]';

export function installMobileGuards() {
  const prevent = (event) => event.preventDefault();

  // Pinch-zoom no Safari/iOS
  document.addEventListener('gesturestart', prevent);
  document.addEventListener('gesturechange', prevent);
  document.addEventListener('gestureend', prevent);

  // Pinch-zoom com dois dedos (Android/WebViews que ignoram user-scalable=no)
  const onTouchMove = (event) => {
    if (event.touches && event.touches.length > 1) event.preventDefault();
  };
  document.addEventListener('touchmove', onTouchMove, { passive: false });

  // Sem menu de contexto (toque longo / botão direito), exceto em campos editáveis
  const onContextMenu = (event) => {
    if (!event.target.closest?.(EDITABLE)) event.preventDefault();
  };
  document.addEventListener('contextmenu', onContextMenu);

  // Sem arrastar imagens ou ligações
  const onDragStart = (event) => {
    if (event.target.closest?.('img, a')) event.preventDefault();
  };
  document.addEventListener('dragstart', onDragStart);

  return () => {
    document.removeEventListener('gesturestart', prevent);
    document.removeEventListener('gesturechange', prevent);
    document.removeEventListener('gestureend', prevent);
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('contextmenu', onContextMenu);
    document.removeEventListener('dragstart', onDragStart);
  };
}
