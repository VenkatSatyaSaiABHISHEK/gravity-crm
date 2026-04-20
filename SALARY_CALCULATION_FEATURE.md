# Automatic Salary Calculation Based on Attendance ✅

## 🎯 **Feature Overview**

I've implemented an automatic salary calculation system that adjusts employee salaries based on their attendance records. The system calculates deductions for leaves, absences, and half-days in real-time.

## 💰 **Salary Calculation Logic**

### **Base Calculation:**
- **Daily Salary** = Base Monthly Salary ÷ Working Days (30 days default)
- **Example**: ₹30,000 ÷ 30 = ₹1,000 per day

### **Attendance Types & Impact:**
| Attendance Status | Salary Impact | Calculation |
|------------------|---------------|-------------|
| **Present** | ✅ Full Pay | No deduction |
| **Paid Leave** | ✅ Full Pay | No deduction |
| **Half Day** | ⚠️ 50% Pay | -₹500 (50% of daily salary) |
| **Absent** | ❌ No Pay | -₹1,000 (full daily salary) |
| **Unpaid Leave** | ❌ No Pay | -₹1,000 (full daily salary) |

### **Example Calculation:**
**Employee:** John Doe  
**Base Salary:** ₹30,000  
**Daily Salary:** ₹1,000  

**Monthly Attendance:**
- Present: 25 days
- Half Days: 2 days  
- Absent: 2 days
- Unpaid Leave: 1 day

**Deductions:**
- Half Days: 2 × ₹500 = ₹1,000
- Absent: 2 × ₹1,000 = ₹2,000  
- Unpaid Leave: 1 × ₹1,000 = ₹1,000
- **Total Deductions:** ₹4,000

**Final Salary:** ₹30,000 - ₹4,000 = **₹26,000**

## 🔧 **Files Created/Modified**

### **New Files:**
1. **`frontend/src/services/salaryCalculation.js`**
   - Core salary calculation logic
   - Working days calculation (excludes weekends)
   - Attendance percentage calculation
   - Deduction breakdown

2. **`frontend/src/components/SalarySummaryDialog.jsx`**
   - Detailed salary breakdown dialog
   - Visual attendance summary
   - Deduction details with color coding

### **Modified Files:**
1. **`frontend/src/pages/hr/sections/EmployeeManagement.jsx`**
   - Added salary calculation display
   - Shows both base salary and calculated salary
   - Added attendance percentage column
   - Added salary details button

2. **`frontend/src/pages/hr/HRDashboard.jsx`**
   - Pass attendance data to EmployeeManagement

3. **`frontend/src/pages/hr/sections/AttendanceManagement.jsx`**
   - Added salary impact calculation
   - Shows immediate salary impact when marking attendance

## 📊 **Enhanced Employee Table**

### **New Columns:**
| Column | Description |
|--------|-------------|
| **Base Salary** | Original monthly salary |
| **Current Month** | Calculated salary with deductions |
| **Attendance** | Attendance percentage with tooltip |

### **Visual Indicators:**
- 🟢 **Green**: No deductions (100% salary)
- 🟠 **Orange**: Has deductions (reduced salary)
- 🔴 **Red**: Low attendance (<75%)

## 🎨 **User Interface Features**

### **1. Employee Table Enhancements:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Name    │ Base Salary │ Current Month │ Attendance │ Actions     │
│ John    │ ₹30,000     │ ₹26,000 💰   │ 87% 🟠     │ Edit Delete │
│         │             │ -₹4,000       │ 26/30 days │             │
└─────────────────────────────────────────────────────────────────┘
```

### **2. Salary Details Dialog:**
- 📊 **Summary Cards**: Base, Deductions, Final Salary
- 📅 **Attendance Breakdown**: Present, Half-days, Leaves, Absent
- 💰 **Deduction Details**: Per category with amounts
- 📈 **Attendance Percentage**: Color-coded performance

### **3. Real-time Updates:**
- Salary recalculates automatically when attendance is marked
- Immediate feedback on salary impact
- Live attendance percentage updates

## 🔄 **Automatic Calculations**

### **When Salary Updates:**
1. **Adding/Editing Employee** → Recalculates based on current attendance
2. **Marking Attendance** → Shows immediate salary impact
3. **Viewing Employee List** → Real-time salary display
4. **Opening Salary Details** → Complete breakdown

### **Working Days Logic:**
- Excludes weekends (Saturday & Sunday)
- Calculates actual working days per month
- Adjusts daily salary rate accordingly

## 🎯 **How to Use**

### **1. View Calculated Salaries:**
1. Go to **HR Dashboard** → **Employee Management**
2. See **Current Month** column with calculated salaries
3. 🟠 Orange amounts indicate deductions
4. Hover over attendance % to see days breakdown

### **2. View Detailed Breakdown:**
1. Click the **💰 Calculator icon** next to salary
2. View complete salary calculation dialog
3. See attendance summary and deduction details

### **3. Mark Attendance with Salary Impact:**
1. Go to **Attendance Management**
2. Mark employee attendance
3. System shows immediate salary impact message

## 📈 **Benefits**

### **For HR Teams:**
- ✅ Automatic salary calculations
- ✅ Real-time deduction tracking  
- ✅ Attendance-based payroll
- ✅ Transparent salary breakdown

### **For Management:**
- 📊 Clear attendance impact visibility
- 💰 Accurate payroll calculations
- 📈 Employee performance tracking
- 🎯 Cost management insights

## 🔮 **Future Enhancements**

- **Overtime Calculations** - Extra pay for overtime hours
- **Bonus Integration** - Performance-based bonuses
- **Tax Calculations** - Automatic tax deductions
- **Payslip Generation** - PDF payslip with breakdown
- **Attendance Policies** - Configurable leave policies

## 🎉 **Result**

The system now automatically calculates employee salaries based on their attendance, providing real-time salary adjustments and detailed breakdowns for complete transparency! 

**Example Impact:**
- Employee takes 1 day leave from ₹30,000 salary
- System automatically deducts ₹1,000  
- Final salary: ₹29,000
- All calculations visible in real-time! 💰