// src/utils/__tests__/retry.test.js
import { withRetry } from '../retry';

describe('withRetry', () => {
  test('returns result on first success', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    const result = await withRetry(fn);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('retries on failure and eventually succeeds', async () => {
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success');

    const result = await withRetry(fn, { maxRetries: 2, baseDelay: 1, maxDelay: 10 });
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  }, 10000);

  test('throws after max retries exceeded', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('always fails'));

    await expect(withRetry(fn, { maxRetries: 2, baseDelay: 1, maxDelay: 10 }))
      .rejects.toThrow('always fails');
    expect(fn).toHaveBeenCalledTimes(3);
  }, 10000);

  test('does not retry on non-retryable status', async () => {
    const error = new Error('bad request');
    error.status = 400;
    const fn = jest.fn().mockRejectedValue(error);

    await expect(withRetry(fn, { maxRetries: 3 }))
      .rejects.toThrow('bad request');
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
