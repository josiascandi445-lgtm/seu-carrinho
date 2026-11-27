import { firebaseConfig, isFirebaseConfigured } from './config';

// Inicialização preguiçosa: o SDK do Firebase só entra na execução quando é realmente usado.
// No plano Spark usamos apenas Authentication e Firestore. Storage e Functions ficam atrás de flags (config/features.js).
let instance = null;

export async function getFirebase() {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase não configurado. Copia .env.example para .env.local e preenche as variáveis VITE_FIREBASE_*.',
    );
  }
  if (instance) return instance;

  const [{ initializeApp }, authMod, fsMod] = await Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/firestore'),
  ]);

  const app = initializeApp(firebaseConfig);
  const auth = authMod.initializeAuth(app, {
    persistence: [authMod.indexedDBLocalPersistence, authMod.browserLocalPersistence],
  });
  const db = fsMod.initializeFirestore(app, {
    localCache: fsMod.persistentLocalCache({ tabManager: fsMod.persistentMultipleTabManager() }),
  });

  instance = { app, auth, db };
  return instance;
}

export { isFirebaseConfigured };
