import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  TrendingDown as DeductionIcon,
  TrendingUp as EarningIcon,
} from '@mui/icons-material';
import { SalaryCalculationService } from '../services/salaryCalculation';

const SalarySummaryDialog = ({ open, onClose, employee, attendance }) => {
  if (!employee) return null;

  const salaryCalc = SalaryCalculationService.getCurrentMonthSalary(employee, attendance);
  const formatted = SalaryCalculationService.formatSalaryDisplay(salaryCalc);

  const currentMonth = new Date().toLocaleDateString('en-IN', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        bgcolor: '#f5f5f5',
        fontWeight: 700 
      }}>
        <CalculateIcon color="primary" />
        Salary Calculation - {employee.name}
        <Chip 
          label={currentMonth} 
          size="small" 
          color="primary" 
          sx={{ ml: 'auto' }}
        />
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#e3f2fd', border: '1px solid #2196f3' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <EarningIcon sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                <Typography variant="h6" color="primary" fontWeight={700}>
                  Base Salary
                </Typography>
                <Typography variant="h4" fontWeight={800}>
                  {formatted.baseSalary}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#fff3e0', border: '1px solid #ff9800' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <DeductionIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                <Typography variant="h6" color="#ff9800" fontWeight={700}>
                  Total Deductions
                </Typography>
                <Typography variant="h4" fontWeight={800} color="#ff9800">
                  {formatted.totalDeductions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              bgcolor: salaryCalc.deductions.totalDeductions > 0 ? '#fff3e0' : '#e8f5e9',
              border: `1px solid ${salaryCalc.deductions.totalDeductions > 0 ? '#ff9800' : '#4caf50'}`
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <CalculateIcon sx={{ 
                  fontSize: 40, 
                  color: salaryCalc.deductions.totalDeductions > 0 ? '#ff9800' : '#4caf50',
                  mb: 1 
                }} />
                <Typography variant="h6" fontWeight={700} sx={{
                  color: salaryCalc.deductions.totalDeductions > 0 ? '#ff9800' : '#4caf50'
                }}>
                  Final Salary
                </Typography>
                <Typography variant="h4" fontWeight={800} sx={{
                  color: salaryCalc.deductions.totalDeductions > 0 ? '#ff9800' : '#4caf50'
                }}>
                  {formatted.finalSalary}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Attendance Summary */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  📅 Attendance Summary
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Working Days:</Typography>
                    <Typography fontWeight={600}>{salaryCalc.workingDaysInMonth} days</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Present Days:</Typography>
                    <Typography fontWeight={600} color="success.main">
                      {salaryCalc.attendanceSummary.presentDays} days
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Half Days:</Typography>
                    <Typography fontWeight={600} color="warning.main">
                      {salaryCalc.attendanceSummary.halfDays} days
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Paid Leave:</Typography>
                    <Typography fontWeight={600} color="info.main">
                      {salaryCalc.attendanceSummary.paidLeaveDays} days
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Unpaid Leave:</Typography>
                    <Typography fontWeight={600} color="error.main">
                      {salaryCalc.attendanceSummary.unpaidLeaveDays} days
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Absent Days:</Typography>
                    <Typography fontWeight={600} color="error.main">
                      {salaryCalc.attendanceSummary.absentDays} days
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography fontWeight={700}>Effective Days:</Typography>
                    <Typography fontWeight={700} color="primary.main">
                      {formatted.effectiveDays}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography fontWeight={700}>Attendance %:</Typography>
                    <Chip 
                      label={formatted.attendancePercentage}
                      size="small"
                      color={
                        salaryCalc.attendancePercentage >= 90 ? 'success' :
                        salaryCalc.attendancePercentage >= 75 ? 'warning' : 'error'
                      }
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Salary Breakdown */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  💰 Salary Breakdown
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Daily Salary:</Typography>
                    <Typography fontWeight={600}>{formatted.dailySalary}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" fontWeight={700} color="error.main">
                    Deductions:
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 2 }}>
                    <Typography variant="body2">Unpaid Leave:</Typography>
                    <Typography variant="body2" color="error.main">
                      {formatted.deductionBreakdown.unpaidLeave}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 2 }}>
                    <Typography variant="body2">Absent Days:</Typography>
                    <Typography variant="body2" color="error.main">
                      {formatted.deductionBreakdown.absent}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 2 }}>
                    <Typography variant="body2">Half Days:</Typography>
                    <Typography variant="body2" color="error.main">
                      {formatted.deductionBreakdown.halfDay}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography fontWeight={700}>Total Deductions:</Typography>
                    <Typography fontWeight={700} color="error.main">
                      {formatted.totalDeductions}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="h6" fontWeight={800}>Final Salary:</Typography>
                    <Typography variant="h6" fontWeight={800} color="success.main">
                      {formatted.finalSalary}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5' }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SalarySummaryDialog;