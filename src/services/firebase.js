// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebaseConfig from '../config/firebase.config';
import { getFirebaseErrorMessage } from '../utils/firebaseErrors';
import { clearTokenCache, initTokenManager } from './tokenManager';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize token manager with auth reference (avoids circular dependency)
initTokenManager(() => auth);

/**
 * Create a new user account with email and password
 */
export const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('✅ Firebase signup successful:', userCredential.user.email);
    return userCredential;
  } catch (error) {
    console.error('❌ Firebase signup error:', error.code, error.message);
    error.userMessage = getFirebaseErrorMessage(error);
    throw error;
  }
};

/**
 * Sign in an existing user with email and password
 */
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Firebase signin successful:', userCredential.user.email);
    return userCredential;
  } catch (error) {
    console.error('❌ Firebase signin error:', error.code, error.message);
    error.userMessage = getFirebaseErrorMessage(error);
    throw error;
  }
};

/**
 * Get the current user's ID token for API authentication
 */
export const getIdToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.warn('⚠️ No authenticated user for getIdToken');
    return null;
  }
  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('❌ Error getting ID token:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    clearTokenCache();
    await firebaseSignOut(auth);
    console.log('✅ Firebase signout successful');
  } catch (error) {
    console.error('❌ Firebase signout error:', error);
    throw error;
  }
};

/**
 * Get the current Firebase user
 */
export const getCurrentFirebaseUser = () => {
  return auth.currentUser;
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChange = (callback) => {
  return auth.onAuthStateChanged(callback);
};

export { auth };
