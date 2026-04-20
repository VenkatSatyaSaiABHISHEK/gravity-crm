import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Grid,
  MenuItem,
  Alert,
  InputAdornment,
  Snackbar,
  SnackbarContent,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Upload as UploadIcon,
  CloudUpload as CloudUploadIcon,
  Calculate as CalculateIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { departments, designations } from '../../../data/hr-data/employees';
import { SalaryCalculationService } from '../../../services/salaryCalculation';
import SalarySummaryDialog from '../../../components/SalarySummaryDialog';
import {
  fetchEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  importEmployeesFromCSV,
  selectEmployees,
  selectAttendance,
  selectHRLoading,
  selectHRError,
  selectImportStatus,
  clearError,
  resetImportStatus,
} from '../../../redux/slices/hrSlice';

const EmployeeManagement = ({ isHRRole = false }) => {
  const dispatch = useDispatch();
  
  // Redux state
  const employees = useSelector(selectEmployees);
  const attendance = useSelector(selectAttendance);
  const loading = useSelector(selectHRLoading);
  const error = useSelector(selectHRError);
  const importStatus = useSelector(selectImportStatus);

  // Local state
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [salaryDialogOpen, setSalaryDialogOpen] = useState(false);
  const [selectedEmployeeForSalary, setSelectedEmployeeForSalary] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'success', // 'success' or 'error'
  });
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    designation: '',
    email: '',
    phone: '',
    salary: '',
    joinDate: '',
    status: 'Active',
    bankAccount: '',
    bankName: '',
    qualification: '',
    address: '',
  });

  // Fetch employees on component mount
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Handle Redux errors
  useEffect(() => {
    if (error) {
      setNotification({
        open: true,
        message: `❌ Error: ${error}`,
        type: 'error',
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Handle import status
  useEffect(() => {
    if (importStatus.success) {
      setNotification({
        open: true,
        message: `✅ Successfully imported ${importStatus.imported} employees! ${importStatus.skipped > 0 ? `(${importStatus.skipped} skipped)` : ''}`,
        type: 'success',
      });
      dispatch(resetImportStatus());
      dispatch(fetchEmployees()); // Refresh employee list
    }
    if (importStatus.error) {
      setNotification({
        open: true,
        message: `❌ Import failed: ${importStatus.error}`,
        type: 'error',
      });
      dispatch(resetImportStatus());
    }
  }, [importStatus, dispatch]);

  // Fetch real teacher data on mount
  const fetchTeachersData = async () => {
    try {
      console.log('🔄 EmployeeManagement: Fetching teachers from API...');
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      console.log('🔑 Token exists:', !!token);
      
      const apiUrl = 'http://localhost:5000/api/hr/teachers';
      console.log('📍 API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      console.log('📡 API Response Status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ API Result:', result);
        
        if (result.success && result.data) {
          console.log('✅ Loaded', result.data.length, 'real teachers');
          setLocalEmployees(result.data);
          setEmployees(result.data);  // Update parent component too
        } else {
          console.warn('⚠️ API no data, using initial employees');
          setLocalEmployees(initialEmployees);
        }
      } else {
        const errorText = await response.text();
        console.warn('❌ API Error (Status:', response.status, '):', errorText);
        setLocalEmployees(initialEmployees);
      }
    } catch (error) {
      console.error('❌ Error fetching teachers:', error);
      setLocalEmployees(initialEmployees);
    }
  };

  useEffect(() => {
    fetchTeachersData();
    // Only run once on mount, not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpen = (employee = null) => {
    if (employee) {
      setFormData(employee);
      setEditingId(employee.id);
    } else {
      setFormData({
        name: '',
        department: '',
        designation: '',
        email: '',
        phone: '',
        salary: '',
        joinDate: '',
        status: 'Active',
        bankAccount: '',
        bankName: '',
        qualification: '',
        address: '',
      });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      if (editingId) {
        // Update existing employee
        if (isHRRole) {
          // HR role is updating salary - call backend API
          console.log('💾 Saving salary for teacher:', editingId);
          console.log('📊 New salary:', formData.salary);
          
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No authentication token found');
          }
          
          const apiUrl = `http://localhost:5000/api/hr/teachers/${editingId}/salary`;
          console.log('📍 API URL:', apiUrl);
          
          const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ salary: parseFloat(formData.salary) || 0 }),
            credentials: 'include',
          });
          
          console.log('📡 Response Status:', response.status);
          
          if (response.ok) {
            const result = await response.json();
            console.log('✅ API Response:', result);
            
            if (result.success && result.data) {
              // Refresh employees to get updated data
              dispatch(fetchEmployees());
              
              setNotification({
                open: true,
                message: `✅ Salary updated successfully for ${result.data.name}!`,
                type: 'success',
              });
              console.log('✅ Salary updated successfully');
              console.log('💰 Updated salary:', result.data.salary);
              handleClose();
            } else {
              throw new Error(result.message || 'Failed to update salary');
            }
          } else {
            const errorText = await response.text();
            console.error('❌ API Error (Status:', response.status, '):', errorText);
            throw new Error(`Error: ${response.status} - ${errorText}`);
          }
        } else {
          // Admin role - update employee via Redux
          await dispatch(updateEmployee({ 
            employeeId: editingId, 
            employeeData: formData 
          })).unwrap();
          
          setNotification({
            open: true,
            message: `✅ Employee ${formData.name} updated successfully!`,
            type: 'success',
          });
          handleClose();
        }
      } else {
        // Add new employee via Redux
        await dispatch(addEmployee(formData)).unwrap();
        
        setNotification({
          open: true,
          message: `✅ Employee ${formData.name} added successfully!`,
          type: 'success',
        });
        handleClose();
      }
    } catch (error) {
      console.error('❌ Error saving employee:', error);
      setNotification({
        open: true,
        message: `❌ Error: ${error.message || error}`,
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await dispatch(deleteEmployee(id)).unwrap();
        setNotification({
          open: true,
          message: '✅ Employee deleted successfully!',
          type: 'success',
        });
      } catch (error) {
        setNotification({
          open: true,
          message: `❌ Error deleting employee: ${error}`,
          type: 'error',
        });
      }
    }
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleImportClick = () => {
    setImportDialogOpen(true);
  };

  const handleImportClose = () => {
    setImportDialogOpen(false);
    setCsvFile(null);
  };

  const handleViewSalaryDetails = (employee) => {
    setSelectedEmployeeForSalary(employee);
    setSalaryDialogOpen(true);
  };

  const handleSalaryDialogClose = () => {
    setSalaryDialogOpen(false);
    setSelectedEmployeeForSalary(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    } else {
      setNotification({
        open: true,
        message: '❌ Please select a valid CSV file',
        type: 'error',
      });
    }
  };

  const handleImportCSV = async () => {
    if (!csvFile) {
      setNotification({
        open: true,
        message: '❌ Please select a CSV file first',
        type: 'error',
      });
      return;
    }

    try {
      await dispatch(importEmployeesFromCSV(csvFile)).unwrap();
      handleImportClose();
    } catch (error) {
      console.error('❌ Error importing CSV:', error);
      // Error handling is done in useEffect for importStatus
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = `name,email,phone,department,designation,salary,joinDate,bankAccount,bankName,qualification,address,status
John Doe,john.doe@example.com,9876543210,Computer Science,Professor,75000,2024-01-15,1234567890,State Bank,PhD Computer Science,123 Main St,Active
Jane Smith,jane.smith@example.com,9876543211,Mathematics,Associate Professor,65000,2024-02-01,0987654321,HDFC Bank,MSc Mathematics,456 Park Ave,Active`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_import_sample.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'success' : 'error';
  };

  const getSalaryInfo = (employee) => {
    try {
      const salaryCalc = SalaryCalculationService.getCurrentMonthSalary(employee, attendance);
      return {
        baseSalary: salaryCalc.baseSalary,
        calculatedSalary: salaryCalc.finalSalary,
        deductions: salaryCalc.deductions.totalDeductions,
        attendancePercentage: salaryCalc.attendancePercentage,
        effectiveDays: salaryCalc.attendanceSummary.effectiveDays,
        workingDays: salaryCalc.workingDaysInMonth,
        hasDeductions: salaryCalc.deductions.totalDeductions > 0
      };
    } catch (error) {
      console.error('Error calculating salary for employee:', employee.id, error);
      return {
        baseSalary: parseFloat(employee.salary) || 0,
        calculatedSalary: parseFloat(employee.salary) || 0,
        deductions: 0,
        attendancePercentage: 100,
        effectiveDays: 30,
        workingDays: 30,
        hasDeductions: false
      };
    }
  };

  return (
    <Box>
      {isHRRole && (
        <Alert severity="info" sx={{ mb: 2 }}>
          📌 HR Mode: You can add, edit, and manage all employee data including salaries and attendance.
        </Alert>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2 }}>
        <TextField
          placeholder="Search by name, email, or designation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={handleImportClick}
            color="primary"
          >
            Import CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Employee
          </Button>
        </Box>
      </Box>

      {filteredEmployees.length === 0 && (
        <Alert severity="info">No employees found</Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Designation</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                Base Salary
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                Current Month
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Attendance
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee) => {
              const salaryInfo = getSalaryInfo(employee);
              return (
                <TableRow key={employee.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell sx={{ fontSize: '0.9rem' }}>{employee.email}</TableCell>
                  <TableCell align="right">
                    ₹{salaryInfo.baseSalary.toLocaleString('en-IN', { 
                      maximumFractionDigits: 0 
                    })}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600,
                            color: salaryInfo.hasDeductions ? '#f57c00' : '#2e7d32'
                          }}
                        >
                          ₹{salaryInfo.calculatedSalary.toLocaleString('en-IN', { 
                            maximumFractionDigits: 0 
                          })}
                        </Typography>
                        <Tooltip title="View detailed salary calculation">
                          <IconButton 
                            size="small" 
                            onClick={() => handleViewSalaryDetails(employee)}
                            sx={{ p: 0.5 }}
                          >
                            <CalculateIcon fontSize="small" color="primary" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      {salaryInfo.hasDeductions && (
                        <Tooltip title={`Deductions: ₹${salaryInfo.deductions.toLocaleString('en-IN')}`}>
                          <Typography 
                            variant="caption" 
                            sx={{ color: '#d32f2f', fontSize: '0.7rem' }}
                          >
                            -₹{salaryInfo.deductions.toLocaleString('en-IN')}
                          </Typography>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={`${salaryInfo.effectiveDays}/${salaryInfo.workingDays} days`}>
                      <Chip
                        label={`${salaryInfo.attendancePercentage}%`}
                        size="small"
                        color={
                          salaryInfo.attendancePercentage >= 90 ? 'success' :
                          salaryInfo.attendancePercentage >= 75 ? 'warning' : 'error'
                        }
                        sx={{ minWidth: 60 }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={employee.status}
                      color={getStatusColor(employee.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleOpen(employee)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(employee.id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Employee Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingId ? `Edit Employee${isHRRole ? ' - Update Salary' : ''}` : 'Add New Employee'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isHRRole && editingId} // Only disable for HR when editing
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                select
                disabled={isHRRole && editingId} // Only disable for HR when editing
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                select
                disabled={isHRRole && editingId} // Only disable for HR when editing
              >
                {designations.map((des) => (
                  <MenuItem key={des} value={des}>
                    {des}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isHRRole && editingId} // Only disable for HR when editing
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={isHRRole && editingId} // Only disable for HR when editing
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                select
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Join Date"
                name="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                disabled={isHRRole && editingId} // Only disable for HR when editing
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bank Account"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bank Name"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                disabled={isHRRole && editingId} // Only disable for HR when editing
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={2}
                disabled={isHRRole && editingId} // Only disable for HR when editing
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={saving}>Cancel</Button>
          {editingId && (
            <Button onClick={handleSave} variant="contained" color="success" disabled={saving}>
              {saving ? '💾 Saving...' : isHRRole ? 'Update Salary' : 'Update Employee'}
            </Button>
          )}
          {!editingId && (
            <Button onClick={handleSave} variant="contained" disabled={saving}>
              {saving ? '💾 Adding...' : 'Add Employee'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Success/Error Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <SnackbarContent
          message={notification.message}
          sx={{
            backgroundColor: notification.type === 'success' ? '#4caf50' : '#f44336',
            color: '#fff',
            fontWeight: 600,
            borderRadius: '4px',
          }}
        />
      </Snackbar>

      {/* Import CSV Dialog */}
      <Dialog open={importDialogOpen} onClose={handleImportClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Import Employees from CSV
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              📋 Upload a CSV file with employee data. Make sure it includes columns: name, email, phone, department, designation, salary, etc.
            </Alert>
            <Button
              variant="outlined"
              size="small"
              onClick={downloadSampleCSV}
              sx={{ mb: 2 }}
            >
              📥 Download Sample CSV
            </Button>
          </Box>
          
          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              bgcolor: '#f9f9f9',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: '#f0f0f0',
                borderColor: '#999',
              },
            }}
            onClick={() => document.getElementById('csv-file-input').click()}
          >
            <input
              id="csv-file-input"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <UploadIcon sx={{ fontSize: 48, color: '#666', mb: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              {csvFile ? csvFile.name : 'Click to select CSV file'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Supported format: .csv
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImportClose} disabled={importStatus.loading}>
            Cancel
          </Button>
          <Button
            onClick={handleImportCSV}
            variant="contained"
            disabled={!csvFile || importStatus.loading}
            startIcon={importStatus.loading ? null : <CloudUploadIcon />}
          >
            {importStatus.loading ? '⏳ Importing...' : 'Import'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Salary Summary Dialog */}
      <SalarySummaryDialog
        open={salaryDialogOpen}
        onClose={handleSalaryDialogClose}
        employee={selectedEmployeeForSalary}
        attendance={attendance}
      />
    </Box>
  );
};

export default EmployeeManagement;
