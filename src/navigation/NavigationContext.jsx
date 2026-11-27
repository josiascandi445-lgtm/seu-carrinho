import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { ROOT_ROUTE_BY_TAB, TAB_IDS } from './tabs';
import { registerBackHandler } from '../services/backButton';

// Navegação própria, sem histórico do navegador: um separador ativo e uma pilha de ecrãs por separador.
export const TRANSITION_MS = 300;

let keySequence = 0;
const nextKey = () => `s${(keySequence += 1)}`;

const makeRoot = (tab) => ({ key: nextKey(), name: ROOT_ROUTE_BY_TAB[tab], params: {}, anim: null, leaving: false });
const isBusy = (stack) => stack.some((entry) => entry.anim || entry.leaving);

function createInitialState() {
  const stacks = {};
  TAB_IDS.forEach((tab) => {
    stacks[tab] = [makeRoot(tab)];
  });
  return { activeTab: TAB_IDS[0], stacks };
}

function withStack(state, tab, stack) {
  return { ...state, stacks: { ...state.stacks, [tab]: stack } };
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TAB':
      return action.tab === state.activeTab ? state : { ...state, activeTab: action.tab };

    case 'PUSH': {
      const stack = state.stacks[state.activeTab];
      if (isBusy(stack)) return state; // ignora toques repetidos durante a transição
      const previous = stack[stack.length - 1];
      return withStack(state, state.activeTab, [
        ...stack.slice(0, -1),
        { ...previous, anim: 'push-under' },
        { key: action.key, name: action.name, params: action.params ?? {}, anim: 'push-in', leaving: false },
      ]);
    }

    case 'POP': {
      const stack = state.stacks[state.activeTab];
      if (stack.length <= 1 || isBusy(stack)) return state;
      const top = stack[stack.length - 1];
      const under = stack[stack.length - 2];
      return withStack(state, state.activeTab, [
        ...stack.slice(0, -2),
        { ...under, anim: 'pop-reveal' },
        { ...top, anim: 'pop-out', leaving: true },
      ]);
    }

    case 'POP_TO_ROOT': {
      const stack = state.stacks[state.activeTab];
      if (stack.length <= 1 || isBusy(stack)) return state;
      const top = stack[stack.length - 1];
      return withStack(state, state.activeTab, [
        { ...stack[0], anim: 'pop-reveal' },
        { ...top, anim: 'pop-out', leaving: true },
      ]);
    }

    case 'SETTLE': {
      const stacks = {};
      TAB_IDS.forEach((tab) => {
        stacks[tab] = state.stacks[tab]
          .filter((entry) => !entry.leaving)
          .map((entry) => (entry.anim ? { ...entry, anim: null } : entry));
      });
      return { ...state, stacks };
    }

    default:
      return state;
  }
}

const NavigationContext = createContext(null);
const NavigationStateContext = createContext(null);

export function NavigationProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Depois de uma transição, limpa as animações e remove ecrãs que saíram
  useEffect(() => {
    const busy = TAB_IDS.some((tab) => isBusy(state.stacks[tab]));
    if (!busy) return undefined;
    const timer = window.setTimeout(() => dispatch({ type: 'SETTLE' }), TRANSITION_MS + 30);
    return () => window.clearTimeout(timer);
  }, [state.stacks]);

  const push = useCallback((name, params) => dispatch({ type: 'PUSH', name, params, key: nextKey() }), []);
  const pop = useCallback(() => dispatch({ type: 'POP' }), []);
  const popToRoot = useCallback(() => dispatch({ type: 'POP_TO_ROOT' }), []);

  // Tocar no separador já ativo: volta à raiz; se já está na raiz, sobe ao topo
  const setTab = useCallback((tab) => {
    const current = stateRef.current;
    if (tab !== current.activeTab) {
      dispatch({ type: 'SET_TAB', tab });
    } else if (current.stacks[tab].length > 1) {
      dispatch({ type: 'POP_TO_ROOT' });
    } else {
      window.dispatchEvent(new CustomEvent('sc:scroll-top'));
    }
  }, []);

  // Botão voltar do Android: recua no ecrã; fora do Início, volta ao Início; no Início, sai (devolve false)
  useEffect(
    () =>
      registerBackHandler(() => {
        const current = stateRef.current;
        const stack = current.stacks[current.activeTab];
        if (stack.length > 1) {
          dispatch({ type: 'POP' });
          return true;
        }
        if (current.activeTab !== TAB_IDS[0]) {
          dispatch({ type: 'SET_TAB', tab: TAB_IDS[0] });
          return true;
        }
        return false;
      }),
    [],
  );

  const activeStack = state.stacks[state.activeTab];
  const api = useMemo(
    () => ({
      activeTab: state.activeTab,
      canGoBack: activeStack.length > 1,
      push,
      pop,
      popToRoot,
      setTab,
    }),
    [state.activeTab, activeStack.length, push, pop, popToRoot, setTab],
  );

  const stateValue = useMemo(() => ({ state }), [state]);

  return (
    <NavigationContext.Provider value={api}>
      <NavigationStateContext.Provider value={stateValue}>{children}</NavigationStateContext.Provider>
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation deve ser usado dentro de <NavigationProvider>');
  return context;
}

export const useOptionalNavigation = () => useContext(NavigationContext);
export const useNavigationState = () => useContext(NavigationStateContext);
