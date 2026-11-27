import { useState } from 'react';
import { CircleAlert, MailCheck, Mail } from 'lucide-react';
import { Button, FormField } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { friendlyError } from '../../services/authService';
import { haptics } from '../../services/haptics';
import { validateEmail } from '../../utils/validators';
import form from './authForm.module.css';

export function ForgotView({ email, setEmail, goLogin }) {
  const auth = useAuth();
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [sentTo, setSentTo] = useState('');

  const error = validateEmail(email);
  const unconfigured = auth.status === 'unconfigured';

  const submit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setFormError('');
    if (error) {
      haptics.error();
      return;
    }
    setBusy(true);
    try {
      await auth.resetPassword(email);
      setSentTo(email.trim());
      haptics.success();
    } catch (err) {
      // Não revelamos se o email tem conta: "utilizador não encontrado" conta como sucesso
      if (err?.code === 'auth/user-not-found') {
        setSentTo(email.trim());
      } else {
        setFormError(friendlyError(err));
        haptics.error();
      }
    } finally {
      setBusy(false);
    }
  };

  if (sentTo) {
    return (
      <div className={form.done}>
        <span className={form.doneIcon}>
          <MailCheck size={34} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <h2>Verifica o teu email</h2>
        <p>
          Se existir uma conta com <strong>{sentTo}</strong>, enviámos instruções para definires uma nova palavra-passe.
          Confirma também a pasta de spam.
        </p>
        <Button fullWidth size="lg" onClick={goLogin}>
          Voltar ao início de sessão
        </Button>
      </div>
    );
  }

  return (
    <form className={form.form} onSubmit={submit} noValidate>
      <FormField
        label="Email da tua conta"
        type="email"
        icon={Mail}
        placeholder="nome@exemplo.com"
        value={email}
        error={touched || submitted ? error : ''}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched(true)}
        autoComplete="email"
        inputMode="email"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        disabled={busy}
      />
      {formError && (
        <p className={`${form.banner} ${form.error}`} role="alert">
          <CircleAlert size={18} strokeWidth={1.9} aria-hidden="true" />
          <span>{formError}</span>
        </p>
      )}
      <Button type="submit" size="lg" fullWidth loading={busy} disabled={unconfigured}>
        Enviar instruções
      </Button>
      <p className={form.switch}>
        <button type="button" onClick={goLogin}>
          Voltar ao início de sessão
        </button>
      </p>
    </form>
  );
}
