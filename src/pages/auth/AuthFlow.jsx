import { useEffect, useRef, useState } from 'react';
import { registerBackHandler } from '../../services/backButton';
import { AuthLayout } from './AuthLayout';
import { ForgotView } from './ForgotView';
import { LoginView } from './LoginView';
import { RegisterView } from './RegisterView';

const COPY = {
  login: { title: 'Bem-vindo de volta', subtitle: 'Entra para continuar as tuas compras.' },
  register: { title: 'Cria a tua conta', subtitle: 'Leva menos de um minuto.' },
  forgot: { title: 'Recuperar acesso', subtitle: 'Enviamos-te um email com instruções.' },
};

// Login, registo e recuperação de palavra-passe. O email escrito passa de um ecrã para o outro.
export function AuthFlow() {
  const [view, setView] = useState('login');
  const [email, setEmail] = useState('');
  const viewRef = useRef(view);
  viewRef.current = view;

  // Botão voltar do Android: de registo/recuperação volta ao login; no login sai da app
  useEffect(
    () =>
      registerBackHandler(() => {
        if (viewRef.current !== 'login') {
          setView('login');
          return true;
        }
        return false;
      }),
    [],
  );

  const { title, subtitle } = COPY[view];
  return (
    <AuthLayout title={title} subtitle={subtitle} onBack={view === 'login' ? undefined : () => setView('login')}>
      {view === 'login' && (
        <LoginView key="login" email={email} setEmail={setEmail} goRegister={() => setView('register')} goForgot={() => setView('forgot')} />
      )}
      {view === 'register' && <RegisterView key="register" email={email} setEmail={setEmail} goLogin={() => setView('login')} />}
      {view === 'forgot' && <ForgotView key="forgot" email={email} setEmail={setEmail} goLogin={() => setView('login')} />}
    </AuthLayout>
  );
}
