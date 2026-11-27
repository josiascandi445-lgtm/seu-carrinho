// Pilha de "manipuladores de voltar". O último registado (ex.: um modal aberto) tem prioridade.
// Cada manipulador devolve true se tratou o evento.
const handlers = [];

export function registerBackHandler(fn) {
  handlers.push(fn);
  return () => {
    const index = handlers.lastIndexOf(fn);
    if (index >= 0) handlers.splice(index, 1);
  };
}

export function runBackHandlers() {
  for (let i = handlers.length - 1; i >= 0; i -= 1) {
    if (handlers[i]() === true) return true;
  }
  return false;
}
