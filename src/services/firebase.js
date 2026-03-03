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

const firebaseConfig = {
  apiKey: "AIzaSyDEQyfhh1tXTnx_KNy7GC6QtflZPteFbjY",
  authDomain: "dh-reporting-487418.firebaseapp.com",
  projectId: "dh-reporting-487418",
  appId: "1:372197521648:web:60f9df28a431de8a35aa35",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

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
