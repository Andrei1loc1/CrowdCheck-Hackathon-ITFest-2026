/**
 * Analytics Actions - Functions for fetching analytics data from server
 * Endpoints: /trigger-analytics, /get-hourly-analytics, /get-daily-analytics
 */

import { postRequest } from './apiClient';

/**
 * Get hourly analytics for an institution
 * Endpoint: POST /get-hourly-analytics
 * @param {string} key - Institution unique key
 * @returns {Promise<object>} Hourly analytics data with queue counts by hour
 * @throws {Error} If key is missing or request fails
 */
export async function getHourlyAnalytics(key) {
  if (!key) {
    throw new Error('Institution key is required');
  }

  const response = await postRequest('/get-hourly-analytics', { key });

  if (response.error) {
    throw new Error(response.error);
  }

  return response.analytics || [];
}

/**
 * Get daily analytics for an institution
 * Endpoint: POST /get-daily-analytics
 * @param {string} key - Institution unique key
 * @returns {Promise<object>} Daily analytics data with queue counts by day
 * @throws {Error} If key is missing or request fails
 */
export async function getDailyAnalytics(key) {
  if (!key) {
    throw new Error('Institution key is required');
  }

  const response = await postRequest('/get-daily-analytics', { key });

  if (response.error) {
    throw new Error(response.error);
  }

  return response.analytics || [];
}

/**
 * Trigger hourly analytics processing for an institution
 * Endpoint: POST /trigger-analytics (type: hourly)
 * @param {string} key - Institution unique key
 * @returns {Promise<object>} Processing result with average
 * @throws {Error} If key is missing
 */
export async function triggerHourlyAnalytics(key) {
  if (!key) {
    throw new Error('Institution key is required');
  }

  const response = await postRequest('/trigger-analytics', { key, type: 'hourly' });

  if (response.error) {
    throw new Error(response.error);
  }

  return response;
}

/**
 * Trigger daily analytics processing for an institution
 * Endpoint: POST /trigger-analytics (type: daily)
 * @param {string} key - Institution unique key
 * @returns {Promise<object>} Processing result with average
 * @throws {Error} If key is missing
 */
export async function triggerDailyAnalytics(key) {
  if (!key) {
    throw new Error('Institution key is required');
  }

  const response = await postRequest('/trigger-analytics', { key, type: 'daily' });

  if (response.error) {
    throw new Error(response.error);
  }

  return response;
}

/**
 * Get all analytics for an institution (hourly and daily)
 * @param {string} key - Institution unique key
 * @returns {Promise<object>} Combined hourly and daily analytics
 */
export async function getAllAnalytics(key) {
  const [hourly, daily] = await Promise.all([
    getHourlyAnalytics(key).catch(() => []),
    getDailyAnalytics(key).catch(() => [])
  ]);

  return {
    hourly,
    daily,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Transform hourly analytics to client-compatible format
 * @param {object[]} analytics - Raw hourly analytics from server
 * @returns {object[]} Formatted hourly data for HourlyStatus component
 */
export function transformHourlyData(analytics) {
  if (!analytics || !Array.isArray(analytics)) {
    return [];
  }

  return analytics.map(item => ({
    hour: new Date(item.time).getHours().toString().padStart(2, '0'),
    count: item.count,
    status: getStatusFromCount(item.count)
  }));
}

/**
 * Transform daily analytics to client-compatible format
 * @param {object[]} analytics - Raw daily analytics from server
 * @returns {object[]} Formatted daily data for WeeklyStatus component
 */
export function transformDailyData(analytics) {
  if (!analytics || !Array.isArray(analytics)) {
    return [];
  }

  const dayNames = ['DUMINICA', 'LUNI', 'MARȚI', 'MIERCURI', 'JOI', 'VINERI', 'SAMBATA'];

  return analytics.map(item => ({
    day: dayNames[new Date(item.day).getDay()],
    count: item.count,
    status: getStatusFromCount(item.count)
  }));
}

/**
 * Determine status based on queue count
 * @param {number} count - Number of people in queue
 * @returns {string} Status: 'liber', 'mediu', or 'plin'
 */
function getStatusFromCount(count) {
  // Thresholds can be adjusted based on institution type
  if (count <= 5) return 'liber';
  if (count <= 15) return 'mediu';
  return 'plin';
}

/**
 * Calculate average from analytics data
 * @param {object[]} analytics - Array of analytics entries with count
 * @returns {number} Average count
 */
export function calculateAverage(analytics) {
  if (!analytics || analytics.length === 0) return 0;
  
  const total = analytics.reduce((sum, item) => sum + (item.count || 0), 0);
  return Math.round(total / analytics.length);
}

// Default export
export default {
  getHourlyAnalytics,
  getDailyAnalytics,
  triggerHourlyAnalytics,
  triggerDailyAnalytics,
  getAllAnalytics,
  transformHourlyData,
  transformDailyData,
  calculateAverage,
};
