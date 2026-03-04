// src/utils/logger.js
// Environment-aware logger that only logs in development mode.
// In production, only errors are logged (without sensitive data).

const noop = () => {};
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : true;

const logger = {
  log: isDev ? (...args) => console.log(...args) : noop,
  info: isDev ? (...args) => console.log(...args) : noop,
  warn: isDev ? (...args) => console.warn(...args) : noop,
  debug: isDev ? (...args) => console.log(...args) : noop,
  error: (...args) => console.error(...args),
};

export default logger;
