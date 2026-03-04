import {
  initTokenManager,
  getValidToken,
  clearTokenCache,
  hasValidToken,
} from '../tokenManager';

jest.mock('../../utils/logger', () => ({
  __esModule: true,
  default: {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('tokenManager', () => {
  let mockGetAuth;
  let mockUser;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Clear token state between tests
    clearTokenCache();

    mockUser = {
      getIdTokenResult: jest.fn().mockResolvedValue({
        token: 'test-token-123',
        expirationTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
      }),
    };

    mockGetAuth = jest.fn().mockReturnValue({
      currentUser: mockUser,
    });

    initTokenManager(mockGetAuth);
  });

  afterEach(() => {
    jest.useRealTimers();
    clearTokenCache();
  });

  // --- Returns null when no auth/user ---

  describe('getValidToken() when no auth or user', () => {
    it('returns null when getAuth is not initialized', async () => {
      initTokenManager(null);

      const token = await getValidToken();

      expect(token).toBeNull();
    });

    it('returns null when auth has no currentUser', async () => {
      mockGetAuth.mockReturnValue({ currentUser: null });

      const token = await getValidToken();

      expect(token).toBeNull();
    });

    it('returns null when getAuth returns undefined', async () => {
      initTokenManager(() => undefined);

      const token = await getValidToken();

      expect(token).toBeNull();
    });
  });

  // --- Returns cached token ---

  describe('getValidToken() with cached token', () => {
    it('returns cached token when still valid', async () => {
      // First call - fetches token
      const token1 = await getValidToken();
      expect(token1).toBe('test-token-123');
      expect(mockUser.getIdTokenResult).toHaveBeenCalledTimes(1);

      // Second call - should return cached token
      const token2 = await getValidToken();
      expect(token2).toBe('test-token-123');
      expect(mockUser.getIdTokenResult).toHaveBeenCalledTimes(1); // Not called again
    });
  });

  // --- Forces refresh when expired ---

  describe('getValidToken() with expired/near-expiry token', () => {
    it('forces refresh when token is near expiry (within 5 min buffer)', async () => {
      // First call with a token that expires in 3 minutes (within 5 min buffer)
      mockUser.getIdTokenResult.mockResolvedValueOnce({
        token: 'short-lived-token',
        expirationTime: new Date(Date.now() + 3 * 60 * 1000).toISOString(), // 3 min
      });

      const token1 = await getValidToken();
      expect(token1).toBe('short-lived-token');

      // Second call should force refresh because token is within buffer
      mockUser.getIdTokenResult.mockResolvedValueOnce({
        token: 'refreshed-token',
        expirationTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      });

      const token2 = await getValidToken();
      expect(token2).toBe('refreshed-token');
      expect(mockUser.getIdTokenResult).toHaveBeenCalledTimes(2);
    });

    it('forces refresh when token has expired', async () => {
      // First call with a token that is already past expiry
      mockUser.getIdTokenResult.mockResolvedValueOnce({
        token: 'expired-token',
        expirationTime: new Date(Date.now() - 1000).toISOString(), // Already expired
      });

      await getValidToken();

      // Second call should force refresh
      mockUser.getIdTokenResult.mockResolvedValueOnce({
        token: 'new-token',
        expirationTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      });

      const token2 = await getValidToken();
      expect(token2).toBe('new-token');
      expect(mockUser.getIdTokenResult).toHaveBeenCalledTimes(2);
    });
  });

  // --- clearTokenCache() ---

  describe('clearTokenCache()', () => {
    it('clears all cached state', async () => {
      // Get a token first
      await getValidToken();
      expect(hasValidToken()).toBe(true);

      // Clear cache
      clearTokenCache();

      // Token should no longer be valid
      expect(hasValidToken()).toBe(false);
    });

    it('causes next getValidToken to fetch fresh token', async () => {
      await getValidToken();
      expect(mockUser.getIdTokenResult).toHaveBeenCalledTimes(1);

      clearTokenCache();

      mockUser.getIdTokenResult.mockResolvedValueOnce({
        token: 'fresh-token',
        expirationTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      });

      const token = await getValidToken();
      expect(token).toBe('fresh-token');
      expect(mockUser.getIdTokenResult).toHaveBeenCalledTimes(2);
    });
  });

  // --- hasValidToken() ---

  describe('hasValidToken()', () => {
    it('returns false when no token is cached', () => {
      expect(hasValidToken()).toBe(false);
    });

    it('returns true when token is cached and valid', async () => {
      await getValidToken();

      expect(hasValidToken()).toBe(true);
    });

    it('returns false after cache is cleared', async () => {
      await getValidToken();
      expect(hasValidToken()).toBe(true);

      clearTokenCache();
      expect(hasValidToken()).toBe(false);
    });
  });

  // --- Error handling ---

  describe('getValidToken() error handling', () => {
    it('throws and clears state when token refresh fails', async () => {
      const refreshError = new Error('Token refresh failed');
      mockUser.getIdTokenResult.mockRejectedValueOnce(refreshError);

      await expect(getValidToken()).rejects.toThrow('Token refresh failed');
      expect(hasValidToken()).toBe(false);
    });

    it('clears cached token on refresh error', async () => {
      // First, get a valid token
      await getValidToken();
      expect(hasValidToken()).toBe(true);

      // Clear cache so next call forces refresh
      clearTokenCache();

      // Now simulate a refresh error
      mockUser.getIdTokenResult.mockRejectedValueOnce(new Error('Network error'));

      await expect(getValidToken()).rejects.toThrow('Network error');
      expect(hasValidToken()).toBe(false);
    });
  });
});
