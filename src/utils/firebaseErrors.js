// src/utils/firebaseErrors.js

const ERROR_MESSAGES = {
  // Auth errors
  'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled. Contact support.',
  'auth/user-not-found': 'No account found with this email. Please sign up.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Invalid email or password. Please try again.',
  'auth/too-many-requests': 'Too many failed attempts. Please wait a moment and try again.',
  'auth/weak-password': 'Password must be at least 6 characters long.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled.',
  'auth/requires-recent-login': 'Please sign in again to complete this action.',
};

/**
 * Get a user-friendly error message from a Firebase error
 */
export const getFirebaseErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred.';

  const code = error.code || error.message;
  return ERROR_MESSAGES[code] || error.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Check if an error is a network-related error
 */
export const isNetworkError = (error) => {
  return !!(error?.code === 'auth/network-request-failed' ||
         error?.message?.includes('network') ||
         error?.message?.includes('Network'));
};

/**
 * Check if the error requires re-authentication
 */
export const requiresReauth = (error) => {
  return error?.code === 'auth/requires-recent-login';
};
