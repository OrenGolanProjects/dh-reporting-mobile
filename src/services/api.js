// src/services/api.js
import { getIdToken } from './firebase';
import { getValidToken } from './tokenManager';
import { API_BASE_URL } from '../config/firebase.config';
import { withRetry } from '../utils/retry';

/**
 * Make an authenticated API request with retry and token refresh
 */
const authenticatedFetch = async (endpoint, options = {}) => {
  return withRetry(async () => {
    const token = await getValidToken();

    if (!token) {
      const fallbackToken = await getIdToken();
      if (!fallbackToken) {
        throw new Error('Not authenticated - no token available');
      }
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getValidToken() || await getIdToken()}`,
      ...options.headers,
    };

    console.log(`📡 API Request: ${options.method || 'GET'} ${endpoint}`);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // On 401, force token refresh and let retry handle it
    if (response.status === 401) {
      const error = new Error('Unauthorized');
      error.status = 401;
      throw error;
    }

    return response;
  }, { maxRetries: 2, retryOn: [401, 408, 429, 500, 502, 503, 504] });
};

/**
 * Save user's ERP credentials to the backend
 */
export const saveUserCredentials = async (employeeCode, employeePass) => {
  try {
    const response = await authenticatedFetch('/saveUserCredentials', {
      method: 'POST',
      body: JSON.stringify({
        employeeCode,
        employeePass,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Save credentials failed:', data);
      return {
        success: false,
        message: data.error || data.message || 'Failed to save credentials',
      };
    }

    console.log('✅ Credentials saved successfully');
    return {
      success: true,
      message: data.message || 'Credentials saved successfully',
    };
  } catch (error) {
    console.error('❌ Save credentials error:', error);
    return {
      success: false,
      message: error.message || 'Network error - please try again',
    };
  }
};

/**
 * Check if user has saved ERP credentials
 */
export const checkUserCredentials = async () => {
  try {
    const response = await authenticatedFetch('/checkCredentials', {
      method: 'GET',
    });

    if (!response.ok) {
      return { hasCredentials: false };
    }

    const data = await response.json();
    return { hasCredentials: data.hasCredentials || false };
  } catch (error) {
    console.error('❌ Check credentials error:', error);
    return { hasCredentials: false };
  }
};

