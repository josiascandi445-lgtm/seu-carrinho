// Validações de formulário. Devolvem uma mensagem de erro, ou '' se o valor for válido.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value) {
  const email = value.trim();
  if (!email) return 'Escreve o teu email.';
  if (!EMAIL_RE.test(email)) return 'Escreve um email válido, como nome@exemplo.com.';
  return '';
}

// Regras para criar uma palavra-passe nova
export function validateNewPassword(value) {
  if (!value) return 'Escolhe uma palavra-passe.';
  if (value.length < 8) return 'Usa pelo menos 8 caracteres.';
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return 'Usa letras e números.';
  return '';
}

// No login só exigimos que não esteja vazia (não revelamos as regras de quem já tem conta)
export function validateRequiredPassword(value) {
  return value ? '' : 'Escreve a tua palavra-passe.';
}

export function validateFullName(value) {
  const name = value.trim().replace(/\s+/g, ' ');
  if (!name) return 'Escreve o teu nome completo.';
  if (name.length < 3) return 'O nome é demasiado curto.';
  if (!name.includes(' ')) return 'Escreve o nome e o apelido.';
  if (name.length > 80) return 'O nome é demasiado longo.';
  return '';
}

// Telefone é opcional: vazio é válido
export function validatePhone(value) {
  const phone = value.trim();
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (!/^[+\d\s()-]+$/.test(phone) || digits.length < 7 || digits.length > 15) {
    return 'Escreve um número de telefone válido.';
  }
  return '';
}
