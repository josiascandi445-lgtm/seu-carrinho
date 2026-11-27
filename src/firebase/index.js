import { getApp, getApps, initializeApp } from 'firebase/app';
import { browserLocalPersistence, getAuth, indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigured } from './config';

// Plano Spark: usamos apenas Authentication e Firestore. Storage e Functions ficam atrás de flags (config/features.js).
let instance = null;

// Devolve { app, auth, db } ou null quando o Firebase não está configurado (variáveis VITE_FIREBASE_* em falta).
export function initFirebase() {
  if (!isFirebaseConfigured) return null;
  if (instance) return instance;

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  let auth;
  try {
    // A sessão fica guardada no dispositivo (IndexedDB) e sobrevive ao fecho da app.
    auth = initializeAuth(app, { persistence: [indexedDBLocalPersistence, browserLocalPersistence] });
  } catch {
    auth = getAuth(app); // já inicializado (ex.: recarregamento a quente em desenvolvimento)
  }

  let db;
  try {
    // Cache local: lê e mostra dados mesmo sem rede, reduzindo leituras ao Firestore.
    db = initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) });
  } catch {
    db = getFirestore(app);
  }

  instance = { app, auth, db };
  return instance;
}

export function requireFirebase() {
  const firebase = initFirebase();
  if (!firebase) {
    const error = new Error('Firebase não configurado');
    error.code = 'app/not-configured';
    throw error;
  }
  return firebase;
}

export { isFirebaseConfigured };
