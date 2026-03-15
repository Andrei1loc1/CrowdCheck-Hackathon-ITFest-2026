/**
 * Institution Actions - Functions for fetching institution data from server
 * Endpoints: /get-details, /save-person-count, /get-wait-time
 */

import { postRequest } from './apiClient';

/**
 * Get institution details by key
 * Endpoint: POST /get-details
 * @param {string} key - Institution unique key
 * @returns {Promise<object>} Institution details including name, address, type, counters, etc.
 * @throws {Error} If key is missing or request fails
 */
export async function getInstitutionDetails(key) {
  if (!key) {
    throw new Error('Institution key is required');
  }

  const response = await postRequest('/get-details', { key });
  
  if (response.error) {
    throw new Error(response.error);
  }

  return response;
}

/**
 * Save person count for an institution
 * Endpoint: POST /save-person-count
 * @param {string} key - Institution unique key
 * @param {number} count - Number of people in queue
 * @returns {Promise<object>} Status response
 * @throws {Error} If key or count is missing
 */
export async function savePersonCount(key, count) {
  if (!key) {
    throw new Error('Institution key is required');
  }

  if (count === undefined || count === null) {
    throw new Error('Person count is required');
  }

  const response = await postRequest('/save-person-count', { key, count });

  if (response.error) {
    throw new Error(response.error);
  }

  return response;
}

/**
 * Get estimated wait time for an institution
 * Endpoint: POST /get-wait-time
 * @param {string} key - Institution unique key
 * @param {number} count - Current number of people in queue
 * @returns {Promise<object>} Object containing avg_wait_time
 * @throws {Error} If key or count is missing
 */
export async function getWaitTime(key, count) {
  if (!key) {
    throw new Error('Institution key is required');
  }

  if (count === undefined || count === null) {
    throw new Error('Person count is required');
  }

  const response = await postRequest('/get-wait-time', { key, count });

  if (response.error) {
    throw new Error(response.error);
  }

  return response;
}

/**
 * Get current queue status for an institution
 * Combines getInstitutionDetails and getWaitTime
 * @param {string} key - Institution unique key
 * @param {number} count - Current number of people (optional, will use saved count if not provided)
 * @returns {Promise<object>} Combined institution data with wait time
 */
export async function getInstitutionStatus(key, count = null) {
  const [institution, waitTimeData] = await Promise.all([
    getInstitutionDetails(key),
    count !== null ? getWaitTime(key, count).catch(() => ({ avg_wait_time: 0 })) : Promise.resolve({ avg_wait_time: 0 })
  ]);

  return {
    ...institution,
    waitTime: waitTimeData.avg_wait_time || 0,
    currentCount: count,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Get status text based on wait time
 * @param {number} waitTimeMinutes - Wait time in minutes
 * @returns {string} Status: 'liber', 'mediu', or 'plin'
 */
export function getStatusFromWaitTime(waitTimeMinutes) {
  if (waitTimeMinutes <= 10) return 'liber';
  if (waitTimeMinutes <= 25) return 'mediu';
  return 'plin';
}

/**
 * Get all available institutions
 * This requires a list of keys - typically stored in the app or fetched from a separate endpoint
 * @param {string[]} keys - Array of institution keys
 * @returns {Promise<object[]>} Array of institution details
 */
export async function getAllInstitutions(keys = []) {
  const institutions = await Promise.all(
    keys.map(key => getInstitutionDetails(key).catch(() => null))
  );
  
  return institutions.filter(Boolean);
}

// Default export
export default {
  getInstitutionDetails,
  savePersonCount,
  getWaitTime,
  getInstitutionStatus,
  getStatusFromWaitTime,
  getAllInstitutions,
};
