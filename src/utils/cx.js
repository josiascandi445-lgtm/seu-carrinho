// Junta nomes de classes ignorando valores vazios
export function cx(...parts) {
  return parts.flat().filter(Boolean).join(' ');
}
