import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching employees
export const fetchEmployees = createAsyncThunk(
  'hr/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/hr/teachers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          return result.data;
        } else {
          throw new Error(result.message || 'Failed to fetch employees');
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for adding employee
export const addEmployee = createAsyncThunk(
  'hr/addEmployee',
  async (employeeData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/hr/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(employeeData),
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          return result.data;
        } else {
          throw new Error(result.message || 'Failed to add employee');
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating employee
export const updateEmployee = createAsyncThunk(
  'hr/updateEmployee',
  async ({ employeeId, employeeData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/hr/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(employeeData),
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          return result.data;
        } else {
          throw new Error(result.message || 'Failed to update employee');
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting employee
export const deleteEmployee = createAsyncThunk(
  'hr/deleteEmployee',
  async (employeeId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/hr/employees/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          return employeeId;
        } else {
          throw new Error(result.message || 'Failed to delete employee');
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for importing employees from CSV
export const importEmployeesFromCSV = createAsyncThunk(
  'hr/importEmployeesFromCSV',
  async (csvFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', csvFile);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/hr/employees/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || 'Import failed');
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  employees: [],
  attendance: [],
  loading: false,
  error: null,
  lastUpdated: null,
  importStatus: {
    loading: false,
    success: false,
    error: null,
    imported: 0,
    skipped: 0,
  },
};

const hrSlice = createSlice({
  name: 'hr',
  initialState,
  reducers: {
    // Synchronous actions for local state updates
    setEmployees: (state, action) => {
      state.employees = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    addEmployeeLocal: (state, action) => {
      state.employees.push(action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    updateEmployeeLocal: (state, action) => {
      const index = state.employees.findIndex(emp => emp.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
        state.lastUpdated = new Date().toISOString();
      }
    },
    deleteEmployeeLocal: (state, action) => {
      state.employees = state.employees.filter(emp => emp.id !== action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    setAttendance: (state, action) => {
      state.attendance = action.payload;
    },
    addAttendanceRecord: (state, action) => {
      const existingIndex = state.attendance.findIndex(
        record => record.empId === action.payload.empId && record.date === action.payload.date
      );
      if (existingIndex !== -1) {
        state.attendance[existingIndex] = action.payload;
      } else {
        state.attendance.push(action.payload);
      }
    },
    clearError: (state) => {
      state.error = null;
      state.importStatus.error = null;
    },
    resetImportStatus: (state) => {
      state.importStatus = {
        loading: false,
        success: false,
        error: null,
        imported: 0,
        skipped: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add employee
      .addCase(addEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update employee
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
          state.lastUpdated = new Date().toISOString();
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete employee
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter(emp => emp.id !== action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Import employees
      .addCase(importEmployeesFromCSV.pending, (state) => {
        state.importStatus.loading = true;
        state.importStatus.error = null;
        state.importStatus.success = false;
      })
      .addCase(importEmployeesFromCSV.fulfilled, (state, action) => {
        state.importStatus.loading = false;
        state.importStatus.success = true;
        state.importStatus.imported = action.payload.imported || 0;
        state.importStatus.skipped = action.payload.skipped || 0;
        // Refresh employees after import
        // Note: This will be handled by dispatching fetchEmployees after import
      })
      .addCase(importEmployeesFromCSV.rejected, (state, action) => {
        state.importStatus.loading = false;
        state.importStatus.error = action.payload;
        state.importStatus.success = false;
      });
  },
});

export const {
  setEmployees,
  addEmployeeLocal,
  updateEmployeeLocal,
  deleteEmployeeLocal,
  setAttendance,
  addAttendanceRecord,
  clearError,
  resetImportStatus,
} = hrSlice.actions;

export default hrSlice.reducer;

// Selectors
export const selectEmployees = (state) => state.hr.employees;
export const selectAttendance = (state) => state.hr.attendance;
export const selectHRLoading = (state) => state.hr.loading;
export const selectHRError = (state) => state.hr.error;
export const selectLastUpdated = (state) => state.hr.lastUpdated;
export const selectImportStatus = (state) => state.hr.importStatus;