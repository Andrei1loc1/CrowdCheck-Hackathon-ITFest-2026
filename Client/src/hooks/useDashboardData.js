/**
 * useDashboardData - Custom hook for fetching dashboard data from server
 * Handles loading states, errors, and falls back to default values
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  getInstitutionDetails, 
  getWaitTime, 
  getHourlyAnalytics, 
  getDailyAnalytics,
  getStoredKey
} from '@/serverActions';

// Default fallback values
const DEFAULT_INSTITUTION = {
  name: "Evidența Populației",
  desk: "Ghișeul 1",
  waitTime: 12,
  status: "liber"
};

const DEFAULT_HOURLY_DATA = [
  { hour: "08", status: "liber" },
  { hour: "09", status: "mediu" },
  { hour: "10", status: "plin" },
  { hour: "11", status: "plin" },
  { hour: "12", status: "mediu" },
  { hour: "13", status: "liber" },
  { hour: "14", status: "mediu" },
  { hour: "15", status: "plin" },
  { hour: "16", status: "mediu" },
  { hour: "17", status: "liber" },
];

const DEFAULT_WEEKLY_DATA = [
  { day: "LUNI", status: "liber" },
  { day: "MARȚI", status: "mediu" },
  { day: "MIERCURI", status: "plin" },
  { day: "JOI", status: "mediu" },
  { day: "VINERI", status: "liber" },
  { day: "SAMBATA", status: "liber" },
  { day: "DUMINICA", status: "liber" },
];

/**
 * Convert wait time minutes to status
 */
function getStatusFromWaitTime(waitTime) {
  if (waitTime <= 10) return 'liber';
  if (waitTime <= 25) return 'mediu';
  return 'plin';
}

/**
 * Convert numeric status to display text
 */
function getStatusDisplayText(status) {
  switch(status) {
    case 'liber': return 'LIBER';
    case 'mediu': return 'MEDIU';
    case 'plin': return 'PLIN';
    default: return 'NECUNOSCUT';
  }
}

/**
 * Transform hourly analytics to client format
 */
function transformHourlyData(analytics) {
  if (!analytics || !Array.isArray(analytics) || analytics.length === 0) {
    return DEFAULT_HOURLY_DATA;
  }

  return analytics.slice(0, 10).map(item => {
    const hour = new Date(item.time).getHours();
    return {
      hour: hour.toString().padStart(2, '0'),
      count: item.count,
      status: item.count <= 5 ? 'liber' : item.count <= 15 ? 'mediu' : 'plin'
    };
  });
}

/**
 * Transform daily analytics to client format
 */
function transformDailyData(analytics) {
  if (!analytics || !Array.isArray(analytics) || analytics.length === 0) {
    return DEFAULT_WEEKLY_DATA;
  }

  const dayNames = ['DUMINICA', 'LUNI', 'MARȚI', 'MIERCURI', 'JOI', 'VINERI', 'SAMBATA'];

  return analytics.slice(-7).map(item => {
    const dayIndex = new Date(item.day).getDay();
    return {
      day: dayNames[dayIndex],
      count: item.count,
      status: item.count <= 10 ? 'liber' : item.count <= 25 ? 'mediu' : 'plin'
    };
  });
}

/**
 * Main hook for dashboard data
 * @param {string} institutionKey - Optional institution key to fetch data for
 */
export function useDashboardData(institutionKey = null) {
  const [institutionData, setInstitutionData] = useState(DEFAULT_INSTITUTION);
  const [hourlyData, setHourlyData] = useState(DEFAULT_HOURLY_DATA);
  const [weeklyData, setWeeklyData] = useState(DEFAULT_WEEKLY_DATA);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Get key from localStorage if not provided
  const key = institutionKey || getStoredKey();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // If no key is available, use defaults
      if (!key) {
        console.log('No institution key available, using default data');
        setLoading(false);
        return;
      }

      // Fetch institution details and wait time in parallel
      const [institution, waitTimeData] = await Promise.all([
        getInstitutionDetails(key).catch(err => {
          console.warn('Failed to fetch institution details:', err.message);
          return null;
        }),
        getWaitTime(key, 0).catch(err => {
          console.warn('Failed to fetch wait time:', err.message);
          return { avg_wait_time: 0 };
        })
      ]);

      // Update institution data
      if (institution) {
        const waitTime = waitTimeData?.avg_wait_time || 0;
        const status = getStatusFromWaitTime(waitTime);
        
        setInstitutionData({
          name: institution.name || DEFAULT_INSTITUTION.name,
          desk: institution.desk || DEFAULT_INSTITUTION.desk,
          waitTime: waitTime,
          status: getStatusDisplayText(status),
          rawStatus: status
        });
      }

      // Fetch analytics in parallel
      const [hourlyAnalytics, dailyAnalytics] = await Promise.all([
        getHourlyAnalytics(key).catch(err => {
          console.warn('Failed to fetch hourly analytics:', err.message);
          return [];
        }),
        getDailyAnalytics(key).catch(err => {
          console.warn('Failed to fetch daily analytics:', err.message);
          return [];
        })
      ]);

      setHourlyData(transformHourlyData(hourlyAnalytics));
      setWeeklyData(transformDailyData(dailyAnalytics));
      setLastUpdated(new Date().toISOString());

    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [key]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh function
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    institutionData,
    hourlyData,
    weeklyData,
    loading,
    error,
    lastUpdated,
    refresh
  };
}

/**
 * Hook for fetching only institution data
 */
export function useInstitutionData(key) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!key) {
      setLoading(false);
      return;
    }

    async function fetchInstitution() {
      setLoading(true);
      setError(null);
      
      try {
        const result = await getInstitutionDetails(key);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInstitution();
  }, [key]);

  return { data, loading, error };
}

export default useDashboardData;
