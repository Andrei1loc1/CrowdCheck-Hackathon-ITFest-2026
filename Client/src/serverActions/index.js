/**
 * Server Actions - Main export file
 * Contains all server communication functions
 * 
 * Usage:
 * import { getInstitutionDetails, getHourlyAnalytics } from '@/serverActions';
 */

// API Client
export { postRequest, getRequest, default as apiClient } from './apiClient';

// Institution Actions
export {
  getInstitutionDetails,
  savePersonCount,
  getWaitTime,
  getInstitutionStatus,
  getStatusFromWaitTime,
  getAllInstitutions
} from './institutiiActions';

// Analytics Actions
export {
  getHourlyAnalytics,
  getDailyAnalytics,
  triggerHourlyAnalytics,
  triggerDailyAnalytics,
  getAllAnalytics,
  transformHourlyData,
  transformDailyData,
  calculateAverage
} from './analyticsActions';

// Key Actions
export {
  validateKey,
  createKey,
  isKeyValid,
  getStoredKey,
  saveKey,
  removeKey
} from './keyActions';
