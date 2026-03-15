/**
 * API Client - Basic configuration for server communication
 * Handles all HTTP requests to the backend server
 */

// Server URL from environment variable or default to localhost
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 10000;

/**
 * Get nested property safely (lodash alternative)
 */
function get(obj, path, defaultValue = undefined) {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    if (result === null || result === undefined) return defaultValue;
    result = result[key];
  }
  return result ?? defaultValue;
}

/**
 * Make a POST request to the server
 * @param {string} endpoint - Server endpoint (e.g., '/get-details')
 * @param {object} data - Request body data
 * @returns {Promise<object>} Response data
 * @throws {Error} If request fails
 */
export async function postRequest(endpoint, data = {}) {
  const url = `${SERVER_URL}${endpoint}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(get(errorData, 'error', `HTTP error! status: ${response.status}`));
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server took too long to respond');
    }
    
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

/**
 * Make a GET request to the server
 * @param {string} endpoint - Server endpoint
 * @param {object} params - Query parameters
 * @returns {Promise<object>} Response data
 */
export async function getRequest(endpoint, params = {}) {
  const url = new URL(`${SERVER_URL}${endpoint}`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

// Default export with common configuration
export default {
  SERVER_URL,
  REQUEST_TIMEOUT,
  post: postRequest,
  get: getRequest,
};
