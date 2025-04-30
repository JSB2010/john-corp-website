import { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  googleProvider,
  signInWithPopup
} from '../firebase';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'johnCorpAuthUser';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check for stored user on initial load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Login function
  const login = async (email, password) => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Google sign-in function
  const signInWithGoogle = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Register function
  const register = async (email, password) => {
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    setError('');
    try {
      await signOut(auth);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const value = {
    currentUser,
    login,
    signInWithGoogle,
    register,
    logout,
    error,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
