import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { requireFirebase } from '../firebase';

const MESSAGES = {
  'app/not-configured': 'O Firebase ainda não está configurado nesta versão da app.',
  'auth/invalid-email': 'O email não é válido.',
  'auth/invalid-credential': 'Email ou palavra-passe incorretos.',
  'auth/wrong-password': 'Email ou palavra-passe incorretos.',
  'auth/user-not-found': 'Email ou palavra-passe incorretos.',
  'auth/user-disabled': 'Esta conta foi desativada.',
  'auth/email-already-in-use': 'Já existe uma conta com este email. Tenta iniciar sessão.',
  'auth/weak-password': 'A palavra-passe é demasiado fraca. Usa pelo menos 8 caracteres, com letras e números.',
  'auth/too-many-requests': 'Demasiadas tentativas. Espera um pouco e tenta de novo.',
  'auth/network-request-failed': 'Sem ligação à internet. Verifica a rede e tenta de novo.',
  'auth/operation-not-allowed': 'O início de sessão por email ainda não foi ativado no Firebase.',
  'permission-denied': 'Sem permissão. As regras do Firestore podem ainda não estar publicadas.',
  unavailable: 'Serviço indisponível. Verifica a ligação e tenta de novo.',
};

export function friendlyError(error) {
  return MESSAGES[error?.code] ?? 'Algo correu mal. Tenta novamente.';
}

export async function registerWithEmail(email, password) {
  const { auth } = requireFirebase();
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

export async function loginWithEmail(email, password) {
  const { auth } = requireFirebase();
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

export async function logout() {
  const { auth } = requireFirebase();
  await signOut(auth);
}

export async function sendResetEmail(email) {
  const { auth } = requireFirebase();
  await sendPasswordResetEmail(auth, email.trim());
}

// Melhor esforço: mantém o nome também no Firebase Authentication
export async function syncAuthDisplayName(displayName) {
  try {
    const { auth } = requireFirebase();
    if (auth.currentUser) await updateProfile(auth.currentUser, { displayName });
  } catch {
    /* não é crítico */
  }
}
