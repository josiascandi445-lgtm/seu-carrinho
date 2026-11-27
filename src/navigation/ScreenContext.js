import { createContext, useContext } from 'react';

// Informação sobre o ecrã onde um componente está a ser desenhado
export const ScreenContext = createContext({ focused: true, tabBar: false, name: '', params: {} });

export const useScreen = () => useContext(ScreenContext);

// true quando este ecrã é o que o utilizador está a ver
export const useIsFocused = () => useContext(ScreenContext).focused;
