import { useRef, useState } from 'react';
import { Camera, CircleAlert, Phone, User } from 'lucide-react';
import { Avatar, Button, FormField } from '../../components';
import { haptics } from '../../services/haptics';
import { fileToAvatarDataUrl } from '../../utils/image';
import { validateFullName, validatePhone } from '../../utils/validators';
import form from './authForm.module.css';
import styles from './ProfileForm.module.css';

// Formulário partilhado: concluir perfil (após registo) e gerir perfil. Só o nome é obrigatório.
export function ProfileForm({ initial, submitLabel, onSubmit }) {
  const fileRef = useRef(null);
  const [name, setName] = useState(initial?.displayName ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [photo, setPhoto] = useState(initial?.photoDataUrl ?? '');
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');

  const errors = { name: validateFullName(name), phone: validatePhone(phone) };
  const visible = (field) => (touched[field] || submitted ? errors[field] : '');

  const pickPhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setFormError('');
    try {
      setPhoto(await fileToAvatarDataUrl(file));
      haptics.tap();
    } catch (error) {
      setFormError(error.message || 'Não foi possível usar essa imagem.');
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setFormError('');
    if (errors.name || errors.phone) {
      haptics.error();
      return;
    }
    setBusy(true);
    try {
      await onSubmit({ displayName: name, phone, photoDataUrl: photo });
    } catch (error) {
      setFormError(error?.friendly || 'Não foi possível guardar. Tenta novamente.');
      haptics.error();
      setBusy(false);
    }
  };

  return (
    <form className={form.form} onSubmit={submit} noValidate>
      <div className={styles.photo}>
        <Avatar src={photo} name={name} size={104} />
        <div className={styles.photoActions}>
          <Button variant="soft" size="sm" icon={Camera} onClick={() => fileRef.current?.click()} disabled={busy}>
            {photo ? 'Alterar foto' : 'Adicionar foto'}
          </Button>
          {photo && (
            <button type="button" className={styles.remove} onClick={() => setPhoto('')} disabled={busy}>
              Remover
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} onChange={pickPhoto} aria-label="Escolher fotografia" />
      </div>

      <FormField
        label="Nome completo"
        icon={User}
        placeholder="Ex.: Maria da Silva"
        value={name}
        error={visible('name')}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
        autoComplete="name"
        autoCapitalize="words"
        disabled={busy}
      />
      <FormField
        label="Telefone (opcional)"
        type="tel"
        icon={Phone}
        placeholder="+244 900 000 000"
        value={phone}
        error={visible('phone')}
        onChange={(e) => setPhone(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
        autoComplete="tel"
        inputMode="tel"
        disabled={busy}
      />

      {formError && (
        <p className={`${form.banner} ${form.error}`} role="alert">
          <CircleAlert size={18} strokeWidth={1.9} aria-hidden="true" />
          <span>{formError}</span>
        </p>
      )}

      <Button type="submit" size="lg" fullWidth loading={busy}>
        {submitLabel}
      </Button>
    </form>
  );
}
