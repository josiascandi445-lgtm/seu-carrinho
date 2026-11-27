// Interruptores de funcionalidades. Os que dependem do plano Blaze do Firebase ficam desligados por defeito.
const on = (value, fallback = false) =>
  value === undefined || value === '' ? fallback : String(value).toLowerCase() === 'true';

export const features = {
  // Firebase Storage (upload de imagens) exige o plano Blaze nos projetos novos.
  storage: on(import.meta.env.VITE_ENABLE_STORAGE, false),
  // Cloud Functions (ações administrativas com privilégios) exigem o plano Blaze.
  functions: on(import.meta.env.VITE_ENABLE_FUNCTIONS, false),
  // Biblioteca de componentes visível no Perfil.
  designSystem: on(import.meta.env.VITE_SHOW_DESIGN_SYSTEM, true),
};
