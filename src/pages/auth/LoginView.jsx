import { useState } from 'react';
import { CircleAlert, Info, Lock, Mail } from 'lucide-react';
import { Button, FormField } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { friendlyError } from '../../services/authService';
import { haptics } from '../../services/haptics';
import { validateEmail, validateRequiredPassword } from '../../utils/validators';
import form from './authForm.module.css';

export function LoginView({ email, setEmail, goRegister, goForgot }) {
  const auth = useAuth();
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');

  const errors = { email: validateEmail(email), password: validateRequiredPassword(password) };
  const visible = (field) => (touched[field] || submitted ? errors[field] : '');
  const unconfigured = auth.status === 'unconfigured';

  const submit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setFormError('');
    if (errors.email || errors.password) {
      haptics.error();
      return;
    }
    setBusy(true);
    try {
      await auth.login(email, password);
    } catch (error) {
      setFormError(friendlyError(error));
      haptics.error();
      setBusy(false);
    }
  };

  return (
    <form className={form.form} onSubmit={submit} noValidate>
      {unconfigured && (
        <p className={`${form.banner} ${form.info}`} role="status">
          <Info size={18} strokeWidth={1.9} aria-hidden="true" />
          <span>O Firebase ainda não está configurado nesta versão, por isso o início de sessão está indisponível. Podes explorar a app sem conta.</span>
        </p>
      )}
      <FormField
        label="Email"
        type="email"
        icon={Mail}
        placeholder="nome@exemplo.com"
        value={email}
        error={visible('email')}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        autoComplete="email"
        inputMode="email"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        disabled={busy}
      />
      <FormField
        label="Palavra-passe"
        type="password"
        icon={Lock}
        placeholder="A tua palavra-passe"
        value={password}
        error={visible('password')}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
        autoComplete="current-password"
        disabled={busy}
      />
      <button type="button" className={form.link} onClick={goForgot}>
        Esqueceste a palavra-passe?
      </button>

      {formError && (
        <p className={`${form.banner} ${form.error}`} role="alert">
          <CircleAlert size={18} strokeWidth={1.9} aria-hidden="true" />
          <span>{formError}</span>
        </p>
      )}

      <Button type="submit" size="lg" fullWidth loading={busy} disabled={unconfigured}>
        Entrar
      </Button>
      <p className={form.switch}>
        Ainda não tens conta?{' '}
        <button type="button" onClick={goRegister}>
          Criar conta
        </button>
      </p>

      <div className={form.divider}>ou</div>
      <Button variant="soft" size="lg" fullWidth onClick={auth.enterGuest}>
        Explorar sem conta
      </Button>
    </form>
  );
}
