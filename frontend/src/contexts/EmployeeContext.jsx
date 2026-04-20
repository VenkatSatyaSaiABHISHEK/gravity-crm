import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEmployees,
  selectEmployees,
  selectAttendance,
  selectHRLoading,
  selectHRError,
  selectLastUpdated,
} from '../redux/slices/hrSlice';

const EmployeeContext = createContext();

export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployeeContext must be used within an EmployeeProvider');
  }
  return context;
};

export const EmployeeProvider = ({ children }) => {
  const dispatch = useDispatch();
  
  const employees = useSelector(selectEmployees);
  const attendance = useSelector(selectAttendance);
  const loading = useSelector(selectHRLoading);
  const error = useSelector(selectHRError);
  const lastUpdated = useSelector(selectLastUpdated);

  // Auto-refresh employees when the component mounts or when needed
  useEffect(() => {
    if (employees.length === 0) {
      dispatch(fetchEmployees());
    }
  }, [dispatch, employees.length]);

  // Auto-refresh every 5 minutes to keep data fresh
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchEmployees());
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [dispatch]);

  const refreshEmployees = () => {
    dispatch(fetchEmployees());
  };

  const contextValue = {
    employees,
    attendance,
    loading,
    error,
    lastUpdated,
    refreshEmployees,
    // Helper functions
    getEmployeeById: (id) => employees.find(emp => emp.id === id),
    getEmployeesByDepartment: (department) => 
      employees.filter(emp => emp.department === department),
    getActiveEmployees: () => employees.filter(emp => emp.status === 'Active'),
    getTotalEmployees: () => employees.length,
  };

  return (
    <EmployeeContext.Provider value={contextValue}>
      {children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeContext;