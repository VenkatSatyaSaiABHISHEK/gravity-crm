// Salary Calculation Service
export class SalaryCalculationService {
  
  /**
   * Calculate monthly salary based on attendance
   * @param {number} baseSalary - Employee's base monthly salary
   * @param {Array} attendanceRecords - Array of attendance records for the month
   * @param {number} workingDaysInMonth - Total working days in the month (default: 30)
   * @returns {Object} Salary calculation details
   */
  static calculateMonthlySalary(baseSalary, attendanceRecords, workingDaysInMonth = 30) {
    const dailySalary = baseSalary / workingDaysInMonth;
    
    let presentDays = 0;
    let halfDays = 0;
    let paidLeaveDays = 0;
    let unpaidLeaveDays = 0;
    let absentDays = 0;
    
    // Count different types of attendance
    attendanceRecords.forEach(record => {
      switch (record.status) {
        case 'Present':
          presentDays++;
          break;
        case 'Half-Day':
          halfDays++;
          break;
        case 'Paid-Leave':
          paidLeaveDays++;
          break;
        case 'Unpaid-Leave':
          unpaidLeaveDays++;
          break;
        case 'Absent':
          absentDays++;
          break;
        default:
          break;
      }
    });
    
    // Calculate effective working days
    const effectiveDays = presentDays + (halfDays * 0.5) + paidLeaveDays;
    
    // Calculate deductions
    const unpaidLeaveDeduction = unpaidLeaveDays * dailySalary;
    const absentDeduction = absentDays * dailySalary;
    const halfDayDeduction = halfDays * (dailySalary * 0.5);
    
    const totalDeductions = unpaidLeaveDeduction + absentDeduction + halfDayDeduction;
    const finalSalary = baseSalary - totalDeductions;
    
    return {
      baseSalary,
      dailySalary: Math.round(dailySalary),
      workingDaysInMonth,
      attendanceSummary: {
        presentDays,
        halfDays,
        paidLeaveDays,
        unpaidLeaveDays,
        absentDays,
        effectiveDays: Math.round(effectiveDays * 10) / 10
      },
      deductions: {
        unpaidLeaveDeduction: Math.round(unpaidLeaveDeduction),
        absentDeduction: Math.round(absentDeduction),
        halfDayDeduction: Math.round(halfDayDeduction),
        totalDeductions: Math.round(totalDeductions)
      },
      finalSalary: Math.round(finalSalary),
      attendancePercentage: Math.round((effectiveDays / workingDaysInMonth) * 100)
    };
  }
  
  /**
   * Get salary calculation for current month
   * @param {Object} employee - Employee object with salary
   * @param {Array} allAttendanceRecords - All attendance records
   * @returns {Object} Current month salary calculation
   */
  static getCurrentMonthSalary(employee, allAttendanceRecords) {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const currentYear = new Date().getFullYear();
    const currentMonthNumber = new Date().getMonth() + 1;
    
    // Get working days in current month (excluding weekends)
    const workingDays = this.getWorkingDaysInMonth(currentYear, currentMonthNumber);
    
    // Filter attendance records for current month and employee
    const monthlyAttendance = allAttendanceRecords.filter(record => 
      record.empId === employee.id && 
      record.date.startsWith(currentMonth)
    );
    
    return this.calculateMonthlySalary(
      parseFloat(employee.salary) || 0,
      monthlyAttendance,
      workingDays
    );
  }
  
  /**
   * Calculate working days in a month (excluding weekends)
   * @param {number} year 
   * @param {number} month 
   * @returns {number} Number of working days
   */
  static getWorkingDaysInMonth(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    let workingDays = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      // Exclude Sundays (0) and Saturdays (6) - adjust based on your working days
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++;
      }
    }
    
    return workingDays;
  }
  
  /**
   * Format salary calculation for display
   * @param {Object} calculation - Salary calculation object
   * @returns {Object} Formatted display data
   */
  static formatSalaryDisplay(calculation) {
    return {
      baseSalary: `₹${calculation.baseSalary.toLocaleString('en-IN')}`,
      dailySalary: `₹${calculation.dailySalary.toLocaleString('en-IN')}`,
      finalSalary: `₹${calculation.finalSalary.toLocaleString('en-IN')}`,
      totalDeductions: `₹${calculation.deductions.totalDeductions.toLocaleString('en-IN')}`,
      attendancePercentage: `${calculation.attendancePercentage}%`,
      effectiveDays: `${calculation.attendanceSummary.effectiveDays}/${calculation.workingDaysInMonth}`,
      deductionBreakdown: {
        unpaidLeave: `₹${calculation.deductions.unpaidLeaveDeduction.toLocaleString('en-IN')} (${calculation.attendanceSummary.unpaidLeaveDays} days)`,
        absent: `₹${calculation.deductions.absentDeduction.toLocaleString('en-IN')} (${calculation.attendanceSummary.absentDays} days)`,
        halfDay: `₹${calculation.deductions.halfDayDeduction.toLocaleString('en-IN')} (${calculation.attendanceSummary.halfDays} half days)`
      }
    };
  }
}

export default SalaryCalculationService;