// src/services/api.js
import { getIdToken } from './firebase';

const API_BASE_URL = 'https://api-gateway-dwabxa66vq-uc.a.run.app';

/**
 * Make an authenticated API request
 */
const authenticatedFetch = async (endpoint, options = {}) => {
  const token = await getIdToken();

  if (!token) {
    throw new Error('Not authenticated - no token available');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  console.log(`📡 API Request: ${options.method || 'GET'} ${endpoint}`);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
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

export { API_BASE_URL };
