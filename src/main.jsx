import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import './styles/tokens.css';
import './styles/base.css';
import './styles/animations.css';
import App from './App';
import { installMobileGuards } from './services/mobileGuards';
import { hideNativeSplash, platform } from './services/native';

document.documentElement.classList.add(`plt-${platform}`);
installMobileGuards();

// Rede de segurança: se algo falhar no arranque, o splash nativo não fica preso
window.setTimeout(hideNativeSplash, 4000);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
