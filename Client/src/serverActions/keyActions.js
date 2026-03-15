/**
 * Key Actions - Functions for key validation and management
 * Endpoints: /check-key, /create-key
 */

import { postRequest } from './apiClient';

/**
 * Validate a user key
 * Endpoint: POST /check-key
 * @param {string} key - User key to validate
 * @returns {Promise<object>} Validation result with status
 * @throws {Error} If key is missing or request fails
 */
export async function validateKey(key) {
  if (!key) {
    throw new Error('Key is required for validation');
  }

  const response = await postRequest('/check-key', { key });

  if (response.error) {
    throw new Error(response.error);
  }

  return {
    isValid: response.status === 'ok',
    status: response.status,
    message: response.message
  };
}

/**
 * Create a new user key
 * Endpoint: POST /create-key
 * @param {object} data - Additional data to store with the key
 * @returns {Promise<object>} Created key information
 * @throws {Error} If request fails
 */
export async function createKey(data = {}) {
  const response = await postRequest('/create-key', data);

  if (response.error) {
    throw new Error(response.error);
  }

  return {
    key: response.key,
    status: response.status
  };
}

/**
 * Check if key exists and is valid
 * Wrapper around validateKey for convenience
 * @param {string} key - Key to check
 * @returns {Promise<boolean>} True if key is valid
 */
export async function isKeyValid(key) {
  try {
    const result = await validateKey(key);
    return result.isValid;
  } catch (error) {
    console.error('Key validation error:', error);
    return false;
  }
}

/**
 * Get stored key from localStorage
 * @returns {string|null} Stored key or null
 */
export function getStoredKey() {
  return localStorage.getItem('user_key');
}

/**
 * Save key to localStorage
 * @param {string} key - Key to save
 */
export function saveKey(key) {
  localStorage.setItem('user_key', key);
}

/**
 * Remove key from localStorage
 */
export function removeKey() {
  localStorage.removeItem('user_key');
}

// Default export
export default {
  validateKey,
  createKey,
  isKeyValid,
  getStoredKey,
  saveKey,
  removeKey,
};
