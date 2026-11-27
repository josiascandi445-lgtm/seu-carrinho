import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { initFirebase, isFirebaseConfigured } from '../firebase';
import * as authService from '../services/authService';
import * as profileService from '../services/profileService';
import { KEYS, getItem, removeItem, setItem } from '../services/storage';

// status: 'loading' | 'unconfigured' | 'signedOut' | 'signedIn'
// profileStatus: 'idle' | 'loading' | 'ready' | 'error'
const AuthContext = createContext(null);

const initialState = {
  status: isFirebaseConfigured ? 'loading' : 'unconfigured',
  user: null,
  profile: null,
  profileStatus: 'idle',
  profileError: '',
};

export function AuthProvider({ children }) {
  const [state, setState] = useState(initialState);
  const [guest, setGuest] = useState(false);
  const [guestLoaded, setGuestLoaded] = useState(false);

  useEffect(() => {
    getItem(KEYS.guest).then((value) => {
      setGuest(value === 'true');
      setGuestLoaded(true);
    });
  }, []);

  const loadProfile = useCallback(async (uid) => {
    setState((s) => (s.user?.uid === uid ? { ...s, profileStatus: 'loading', profileError: '' } : s));
    try {
      const profile = await profileService.fetchProfile(uid);
      setState((s) => (s.user?.uid === uid ? { ...s, profile, profileStatus: 'ready' } : s));
    } catch (error) {
      setState((s) => (s.user?.uid === uid ? { ...s, profileStatus: 'error', profileError: authService.friendlyError(error) } : s));
    }
  }, []);

  // Sessão: o Firebase restaura o utilizador guardado no dispositivo e avisa aqui
  useEffect(() => {
    const firebase = initFirebase();
    if (!firebase) return undefined;
    return onAuthStateChanged(firebase.auth, (user) => {
      if (!user) {
        setState({ status: 'signedOut', user: null, profile: null, profileStatus: 'idle', profileError: '' });
        return;
      }
      setState({
        status: 'signedIn',
        user: { uid: user.uid, email: user.email, displayName: user.displayName },
        profile: null,
        profileStatus: 'loading',
        profileError: '',
      });
      loadProfile(user.uid);
    });
  }, [loadProfile]);

  const enterGuest = useCallback(() => {
    setGuest(true);
    setItem(KEYS.guest, 'true');
  }, []);

  const leaveGuest = useCallback(() => {
    setGuest(false);
    removeItem(KEYS.guest);
  }, []);

  const login = useCallback(
    async (email, password) => {
      await authService.loginWithEmail(email, password);
      leaveGuest();
    },
    [leaveGuest],
  );

  const register = useCallback(
    async (email, password) => {
      await authService.registerWithEmail(email, password);
      leaveGuest();
    },
    [leaveGuest],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    leaveGuest();
  }, [leaveGuest]);

  const completeProfile = useCallback(
    async (data) => {
      if (!state.user) return;
      const profile = await profileService.createProfile(state.user, data);
      authService.syncAuthDisplayName(profile.displayName);
      setState((s) => ({ ...s, profile, profileStatus: 'ready' }));
    },
    [state.user],
  );

  const saveProfile = useCallback(
    async (data) => {
      if (!state.user) return;
      const profile = await profileService.updateProfileData(state.user.uid, data);
      authService.syncAuthDisplayName(profile.displayName);
      setState((s) => ({ ...s, profile }));
    },
    [state.user],
  );

  const retryProfile = useCallback(() => {
    if (state.user) loadProfile(state.user.uid);
  }, [state.user, loadProfile]);

  const value = useMemo(
    () => ({
      ...state,
      guest,
      ready: state.status !== 'loading' && guestLoaded,
      enterGuest,
      leaveGuest,
      login,
      register,
      logout,
      resetPassword: authService.sendResetEmail,
      completeProfile,
      saveProfile,
      retryProfile,
    }),
    [state, guest, guestLoaded, enterGuest, leaveGuest, login, register, logout, completeProfile, saveProfile, retryProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return context;
}
