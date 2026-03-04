// src/utils/retry.js

const DEFAULT_OPTIONS = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  retryOn: [408, 429, 500, 502, 503, 504],
};

/**
 * Retry a function with exponential backoff
 */
export const withRetry = async (fn, options = {}) => {
  const { maxRetries, baseDelay, maxDelay, retryOn } = { ...DEFAULT_OPTIONS, ...options };

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on non-retryable status codes
      if (error.status && !retryOn.includes(error.status)) {
        throw error;
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        throw error;
      }

      // Calculate delay with exponential backoff + jitter
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelay
      );

      console.log(`🔄 Retry attempt ${attempt + 1}/${maxRetries} after ${Math.round(delay)}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};
