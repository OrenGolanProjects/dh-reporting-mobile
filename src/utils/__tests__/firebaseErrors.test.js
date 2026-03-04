// src/utils/__tests__/firebaseErrors.test.js
import { getFirebaseErrorMessage, isNetworkError, requiresReauth } from '../firebaseErrors';

describe('getFirebaseErrorMessage', () => {
  test('returns friendly message for known error code', () => {
    const error = { code: 'auth/wrong-password' };
    expect(getFirebaseErrorMessage(error)).toBe('Incorrect password. Please try again.');
  });

  test('returns friendly message for email already in use', () => {
    const error = { code: 'auth/email-already-in-use' };
    expect(getFirebaseErrorMessage(error)).toBe('This email is already registered. Please sign in instead.');
  });

  test('returns error message for unknown code', () => {
    const error = { code: 'auth/unknown', message: 'Some error' };
    expect(getFirebaseErrorMessage(error)).toBe('Some error');
  });

  test('returns default message for null error', () => {
    expect(getFirebaseErrorMessage(null)).toBe('An unknown error occurred.');
  });
});

describe('isNetworkError', () => {
  test('returns true for network error code', () => {
    expect(isNetworkError({ code: 'auth/network-request-failed' })).toBe(true);
  });

  test('returns false for non-network error', () => {
    expect(isNetworkError({ code: 'auth/wrong-password' })).toBe(false);
  });
});

describe('requiresReauth', () => {
  test('returns true for requires-recent-login error', () => {
    expect(requiresReauth({ code: 'auth/requires-recent-login' })).toBe(true);
  });

  test('returns false for other errors', () => {
    expect(requiresReauth({ code: 'auth/wrong-password' })).toBe(false);
  });
});
