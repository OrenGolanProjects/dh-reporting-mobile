// src/utils/__tests__/validation.test.js
import { validateEmail, validatePhone, validateRequired, validateLength } from '../validation';

describe('validateEmail', () => {
  test('returns true for valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  test('returns true for email with subdomain', () => {
    expect(validateEmail('user@mail.example.com')).toBe(true);
  });

  test('returns false for empty string', () => {
    expect(validateEmail('')).toBe(false);
  });

  test('returns false for null', () => {
    expect(validateEmail(null)).toBe(false);
  });

  test('returns false for undefined', () => {
    expect(validateEmail(undefined)).toBe(false);
  });

  test('returns false for email without @', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  test('returns false for email without domain', () => {
    expect(validateEmail('user@')).toBe(false);
  });

  test('returns false for email with spaces', () => {
    expect(validateEmail('user @example.com')).toBe(false);
  });

  test('handles uppercase emails by lowercasing', () => {
    expect(validateEmail('USER@EXAMPLE.COM')).toBe(true);
  });
});

describe('validatePhone', () => {
  test('returns true for 10-digit phone number', () => {
    expect(validatePhone('0501234567')).toBe(true);
  });

  test('returns true for phone with dashes (stripped)', () => {
    expect(validatePhone('050-123-4567')).toBe(true);
  });

  test('returns true for phone with spaces (stripped)', () => {
    expect(validatePhone('050 123 4567')).toBe(true);
  });

  test('returns false for short phone number', () => {
    expect(validatePhone('12345')).toBe(false);
  });

  test('returns false for empty string', () => {
    expect(validatePhone('')).toBe(false);
  });

  test('returns false for null', () => {
    expect(validatePhone(null)).toBe(false);
  });

  test('returns false for undefined', () => {
    expect(validatePhone(undefined)).toBe(false);
  });
});

describe('validateRequired', () => {
  test('returns true for non-empty string', () => {
    expect(validateRequired('hello')).toBe(true);
  });

  test('returns true for number zero', () => {
    expect(validateRequired(0)).toBe(true);
  });

  test('returns true for boolean false', () => {
    expect(validateRequired(false)).toBe(true);
  });

  test('returns false for empty string', () => {
    expect(validateRequired('')).toBe(false);
  });

  test('returns false for null', () => {
    expect(validateRequired(null)).toBe(false);
  });

  test('returns false for undefined', () => {
    expect(validateRequired(undefined)).toBe(false);
  });
});

describe('validateLength', () => {
  test('returns true when length is within range', () => {
    expect(validateLength('hello', 1, 10)).toBe(true);
  });

  test('returns true when length equals min', () => {
    expect(validateLength('ab', 2, 5)).toBe(true);
  });

  test('returns true when length equals max', () => {
    expect(validateLength('abcde', 2, 5)).toBe(true);
  });

  test('returns false when length is below min', () => {
    expect(validateLength('a', 2, 5)).toBe(false);
  });

  test('returns false when length exceeds max', () => {
    expect(validateLength('abcdef', 2, 5)).toBe(false);
  });

  test('returns false for null value', () => {
    expect(validateLength(null, 1, 10)).toBe(false);
  });

  test('returns false for undefined value', () => {
    expect(validateLength(undefined, 1, 10)).toBe(false);
  });

  test('returns false for empty string when min is 1', () => {
    expect(validateLength('', 1, 10)).toBe(false);
  });
});
