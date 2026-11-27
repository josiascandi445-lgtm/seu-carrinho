import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { requireFirebase } from '../firebase';

// Documento: users/{uid}
// { uid, email, displayName, phone, photoDataUrl, role, profileCompleted, createdAt, updatedAt }
// "role" só pode ser definido como "customer" pelo cliente; perfis de administrador são geridos fora da app (etapa 5).
const userRef = (db, uid) => doc(db, 'users', uid);

export async function fetchProfile(uid) {
  const { db } = requireFirebase();
  const snapshot = await getDoc(userRef(db, uid));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function createProfile(user, { displayName, phone, photoDataUrl }) {
  const { db } = requireFirebase();
  await setDoc(userRef(db, user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: displayName.trim().replace(/\s+/g, ' '),
    phone: phone.trim(),
    photoDataUrl: photoDataUrl ?? '',
    role: 'customer',
    profileCompleted: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return fetchProfile(user.uid);
}

export async function updateProfileData(uid, { displayName, phone, photoDataUrl }) {
  const { db } = requireFirebase();
  await updateDoc(userRef(db, uid), {
    displayName: displayName.trim().replace(/\s+/g, ' '),
    phone: phone.trim(),
    photoDataUrl: photoDataUrl ?? '',
    updatedAt: serverTimestamp(),
  });
  return fetchProfile(uid);
}
