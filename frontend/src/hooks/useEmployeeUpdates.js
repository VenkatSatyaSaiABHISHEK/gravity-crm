import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEmployees,
  selectEmployees,
  selectLastUpdated,
} from '../redux/slices/hrSlice';

/**
 * Custom hook for managing employee updates across components
 * Ensures all components stay in sync when employee data changes
 */
export const useEmployeeUpdates = () => {
  const dispatch = useDispatch();
  const employees = useSelector(selectEmployees);
  const lastUpdated = useSelector(selectLastUpdated);

  // Force refresh employees from server
  const refreshEmployees = useCallback(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Auto-refresh when component mounts if data is stale
  useEffect(() => {
    const now = new Date();
    const lastUpdateTime = lastUpdated ? new Date(lastUpdated) : null;
    const isStale = !lastUpdateTime || (now - lastUpdateTime) > 2 * 60 * 1000; // 2 minutes

    if (employees.length === 0 || isStale) {
      refreshEmployees();
    }
  }, [employees.length, lastUpdated, refreshEmployees]);

  // Listen for storage events to sync across tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'hr_employee_update') {
        console.log('🔄 Employee update detected from another tab, refreshing...');
        refreshEmployees();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshEmployees]);

  // Broadcast employee updates to other tabs
  const broadcastUpdate = useCallback(() => {
    localStorage.setItem('hr_employee_update', Date.now().toString());
    localStorage.removeItem('hr_employee_update');
  }, []);

  return {
    employees,
    lastUpdated,
    refreshEmployees,
    broadcastUpdate,
    isStale: () => {
      const now = new Date();
      const lastUpdateTime = lastUpdated ? new Date(lastUpdated) : null;
      return !lastUpdateTime || (now - lastUpdateTime) > 2 * 60 * 1000;
    },
  };
};

export default useEmployeeUpdates;