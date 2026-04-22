# 🧪 GVPLACEMENT ERP - Demo Mode Testing Guide

## ✅ Servers Status

**Both servers are running successfully!**

- 🟢 **Backend**: http://localhost:5000 (PostgreSQL connected)
- 🟢 **Frontend**: http://localhost:3000 (React compiled)

---

## 🎯 How to Test Demo Mode

### Step 1: Open the Application
1. Open your browser (Chrome, Edge, or Firefox)
2. Go to: **http://localhost:3000**
3. You should see the landing page

### Step 2: Demo Mode Auto-Activates
- Demo mode automatically activates on localhost
- Look for the **demo toggle button** in the bottom-right corner
- It should show "Demo Mode Active" with current role

### Step 3: Test Admin Dashboard
1. Click on **"Admin"** button in the demo toggle
2. You should be redirected to `/admin/dashboard`
3. **Check these elements**:
   - ✅ Dashboard shows statistics (students, teachers, classes, revenue)
   - ✅ Revenue chart shows 6 months of data
   - ✅ Recent payments list is visible
   - ✅ Subject performance chart shows data
   - ✅ Fee management section shows data
   - ✅ No empty tables or "No data" messages

4. **Navigate to other admin pages**:
   - Click **"Students"** in sidebar → Should show 5+ students
   - Click **"Teachers"** in sidebar → Should show 5+ teachers
   - Click **"Classes"** in sidebar → Should show 8+ classes
   - Click **"Subjects"** in sidebar → Should show 8+ subjects
   - Click **"Fees"** in sidebar → Should show fee records
   - Click **"Notices"** in sidebar → Should show 5+ notices

### Step 4: Test Teacher Dashboard
1. Click on **"Teacher"** button in the demo toggle
2. You should be redirected to `/teacher/dashboard`
3. **Check these elements**:
   - ✅ Dashboard shows teacher stats (classes, subjects, students)
   - ✅ Recent homework list is visible
   - ✅ Classes count shows 2
   - ✅ Subjects count shows 3
   - ✅ Total students shows 58

4. **Navigate to teacher pages**:
   - Click **"My Classes"** → Should show 2 classes with student counts
   - Click **"Students"** → Should show students list
   - Click **"Attendance"** → Should show attendance interface
   - Click **"Assignments"** → Should show homework list

### Step 5: Test Student Dashboard
1. Click on **"Student"** button in the demo toggle
2. You should be redirected to `/student/dashboard`
3. **Check these elements**:
   - ✅ Dashboard shows student stats
   - ✅ Attendance percentage shows 90%
   - ✅ Recent marks are visible
   - ✅ Upcoming homework list shows 3+ items
   - ✅ Fee status is displayed

4. **Navigate to student pages**:
   - Click **"Attendance"** → Should show attendance records
   - Click **"Marks"** → Should show exam results
   - Click **"Homework"** → Should show assignments
   - Click **"Fees"** → Should show fee details

### Step 6: Test Transport Pages
1. Click on **"Transport"** button in the demo toggle
2. You should be redirected to `/transport/dashboard`
3. **Navigate to transport pages**:
   - Click **"Routes"** → Should show 5 bus routes
   - Click **"Buses"** → Should show 7 buses with driver info
   - Click **"Fees"** → Should show transport fees
   - Each route should show: route name, start/end points, distance, time, fee

### Step 7: Test Other Roles
1. **Parent Role**:
   - Click **"Parent"** button
   - Should show child's attendance, marks, fees

2. **Accounts Role**:
   - Click **"Accounts"** button
   - Should show payments, transactions, reports

3. **HR Role**:
   - Click **"HR"** button (if available)
   - Should show employee data

---

## 🔍 What to Check on Each Page

### ✅ General Checks (All Pages)
- [ ] No "401 Unauthorized" errors in browser console
- [ ] No "403 Forbidden" errors in browser console
- [ ] No "Network Error" messages
- [ ] No empty tables with "No data available"
- [ ] All navigation links work
- [ ] Page loads within 2-3 seconds
- [ ] Demo toggle is visible in bottom-right corner
- [ ] Current role is displayed correctly

### ✅ Data Checks
- [ ] Student names appear (Priya Sharma, Rahul Verma, etc.)
- [ ] Teacher names appear (Mr. Rajesh Kumar, Dr. Ravi Mehta, etc.)
- [ ] Class names appear (11th Science, 12th Commerce, etc.)
- [ ] Subject names appear (Mathematics, Physics, Chemistry, etc.)
- [ ] Dates are realistic (2026 dates)
- [ ] Numbers make sense (attendance %, marks, fees)

### ✅ UI Checks
- [ ] Charts render properly (revenue chart, subject performance)
- [ ] Tables display data correctly
- [ ] Cards show statistics
- [ ] Icons and images load
- [ ] Colors and styling look good
- [ ] Responsive design works (try resizing browser)

---

## 🐛 Common Issues & Solutions

### Issue 1: "401 Unauthorized" Errors
**Solution**: 
- Check browser console for errors
- Verify demo mode is enabled (check demo toggle)
- Refresh the page (Ctrl+R or Cmd+R)

### Issue 2: Empty Pages / No Data
**Solution**:
- Check backend server logs (look for "🎯 Demo mode:" messages)
- Verify you're on the correct role
- Try switching roles using demo toggle

### Issue 3: "403 Forbidden" Errors
**Solution**:
- This means role mismatch
- Switch to the correct role using demo toggle
- Backend should auto-detect role from URL

### Issue 4: Page Not Loading
**Solution**:
- Check if both servers are running
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- Restart servers if needed

---

## 📊 Expected Demo Data

### Students (5+)
- Priya Sharma (STU002)
- Rahul Verma (STU011)
- Isha Reddy (STU008)
- Sakshi Nair (STU012)
- Neha Gupta (STU004)

### Teachers (5+)
- Mr. Rajesh Kumar (Mathematics)
- Dr. Ravi Mehta (Economics)
- Mr. Amit Verma (Geography)
- Mr. Vikram Singh (Mathematics)
- Ms. Neha Agarwal (Computer Science)

### Classes (8+)
- 11th Science (32 students)
- 11th Commerce (28 students)
- 11th Arts (24 students)
- 12th Science (30 students)
- 12th Commerce (26 students)
- 12th Arts (22 students)
- 10th Grade (35 students)
- 9th Grade (33 students)

### Transport Routes (5)
- City Center Route (RT001)
- Residential Route (RT002)
- Tech Park Route (RT003)
- Airport Express (RT004)
- Mall Circuit (RT005)

### Buses (7)
- BUS001 to BUS007
- Each with driver name and phone

---

## ✅ Testing Checklist

### Admin Pages
- [ ] Dashboard loads with all stats
- [ ] Students page shows list
- [ ] Teachers page shows list
- [ ] Classes page shows list
- [ ] Subjects page shows list
- [ ] Fees page shows records
- [ ] Notices page shows announcements
- [ ] Reports page works
- [ ] Settings page loads

### Teacher Pages
- [ ] Dashboard shows stats
- [ ] My Classes shows 2 classes
- [ ] Students page shows list
- [ ] Attendance page works
- [ ] Assignments page shows homework
- [ ] Marks page works

### Student Pages
- [ ] Dashboard shows stats
- [ ] Attendance shows 90% (18/20)
- [ ] Marks shows exam results
- [ ] Homework shows 3+ assignments
- [ ] Fees shows pending amount
- [ ] Profile page loads

### Transport Pages
- [ ] Dashboard shows stats
- [ ] Routes page shows 5 routes
- [ ] Buses page shows 7 buses
- [ ] Each route has complete details
- [ ] Driver information is visible

---

## 🎉 Success Criteria

**Demo mode is working correctly if:**

1. ✅ All pages load without errors
2. ✅ Every page shows demo data (no empty pages)
3. ✅ Role switching works smoothly
4. ✅ Navigation between pages works
5. ✅ No 401/403 errors in console
6. ✅ Charts and tables display data
7. ✅ Demo toggle shows current role
8. ✅ Backend logs show "🎯 Demo mode:" messages

---

## 📝 After Testing

Once you've verified everything works:

1. **Note any issues** you find
2. **Take screenshots** of working pages
3. **Test all major workflows**
4. **Verify data consistency**
5. **Check mobile responsiveness** (optional)

Then we can push the code to GitHub! 🚀

---

**Current Status**: 
- ✅ Backend Running (Port 5000)
- ✅ Frontend Running (Port 3000)
- ✅ Demo Mode Implemented
- ⏳ Waiting for your testing confirmation

**Ready to test at**: http://localhost:3000
