import { forwardRef, useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cx } from '../../utils/cx';
import styles from './FormField.module.css';

// Campo de formulário com rótulo, erro, dica e (para palavra-passe) botão mostrar/ocultar.
export const FormField = forwardRef(function FormField(
  { label, error, hint, icon: Icon, type = 'text', id, className, onFocus, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const messageId = `${fieldId}-msg`;
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';

  // Em ecrãs com teclado, traz o campo para o centro da área visível
  const handleFocus = (event) => {
    const el = event.currentTarget;
    window.setTimeout(() => el.scrollIntoView({ block: 'center', behavior: 'smooth' }), 320);
    onFocus?.(event);
  };

  return (
    <div className={cx(styles.field, className)}>
      {label && (
        <label className={styles.label} htmlFor={fieldId}>
          {label}
        </label>
      )}
      <div className={cx(styles.control, error && styles.invalid)}>
        {Icon && <Icon size={20} strokeWidth={1.8} className={styles.icon} aria-hidden="true" />}
        <input
          ref={ref}
          id={fieldId}
          className={styles.input}
          type={isPassword && visible ? 'text' : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          onFocus={handleFocus}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            aria-label={visible ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOff size={20} strokeWidth={1.8} /> : <Eye size={20} strokeWidth={1.8} />}
          </button>
        )}
      </div>
      {error ? (
        <p id={messageId} role="alert" className={styles.error}>
          {error}
        </p>
      ) : (
        hint && (
          <p id={messageId} className={styles.hint}>
            {hint}
          </p>
        )
      )}
    </div>
  );
});
