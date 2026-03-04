// src/services/tokenManager.js

const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000; // Refresh 5 minutes before expiry

let cachedToken = null;
let tokenExpirationTime = null;
let refreshTimer = null;
let _getAuth = null;

/**
 * Initialize token manager with auth reference (breaks circular dependency)
 */
export const initTokenManager = (getAuth) => {
  _getAuth = getAuth;
};

/**
 * Get a valid ID token, refreshing if necessary
 */
export const getValidToken = async () => {
  const auth = _getAuth?.();
  const user = auth?.currentUser;
  if (!user) {
    cachedToken = null;
    tokenExpirationTime = null;
    return null;
  }

  // Return cached token if still valid
  if (cachedToken && tokenExpirationTime && Date.now() < tokenExpirationTime - TOKEN_REFRESH_BUFFER_MS) {
    return cachedToken;
  }

  // Force refresh and cache new token
  try {
    const tokenResult = await user.getIdTokenResult(true);
    cachedToken = tokenResult.token;
    tokenExpirationTime = new Date(tokenResult.expirationTime).getTime();

    scheduleTokenRefresh();

    console.log('🔑 Token refreshed, expires:', new Date(tokenExpirationTime).toLocaleTimeString());
    return cachedToken;
  } catch (error) {
    console.error('❌ Token refresh failed:', error);
    cachedToken = null;
    tokenExpirationTime = null;
    throw error;
  }
};

/**
 * Schedule automatic token refresh before expiry
 */
const scheduleTokenRefresh = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }

  if (!tokenExpirationTime) return;

  const refreshIn = tokenExpirationTime - Date.now() - TOKEN_REFRESH_BUFFER_MS;

  if (refreshIn > 0) {
    refreshTimer = setTimeout(async () => {
      try {
        await getValidToken();
        console.log('🔄 Token proactively refreshed');
      } catch (error) {
        console.error('❌ Scheduled token refresh failed:', error);
      }
    }, refreshIn);
  }
};

/**
 * Clear cached token (call on logout)
 */
export const clearTokenCache = () => {
  cachedToken = null;
  tokenExpirationTime = null;
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

/**
 * Check if user has a valid token
 */
export const hasValidToken = () => {
  return !!(cachedToken && tokenExpirationTime && Date.now() < tokenExpirationTime);
};
