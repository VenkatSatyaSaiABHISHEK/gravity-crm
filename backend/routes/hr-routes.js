const express = require('express');
const router = express.Router();
const {
    addHRManager,
    getHRManagers,
    deleteHRManager,
    addEmployee,
    getEmployees,
    getEmployee,
    updateEmployee,
    deleteEmployee,
    importEmployeesFromCSV,
    upload,
    markAttendance,
    getEmployeeAttendance,
    createSalaryRecord,
    getSalaryRecords,
    updateSalaryStatus,
    getHRDashboard,
    getAdminHRDashboard,
    getAvailableTeachers,
    getTeachersForHR,
    updateTeacherSalary,
    regenerateHRManagerPasswords,
} = require('../controllers/hr-controller');

// Note: authMiddleware is already applied in index.js

// ==================== HR MANAGER ROUTES (Admin only) ====================
router.post('/hr-managers', addHRManager);
router.get('/hr-managers', getHRManagers);
router.delete('/hr-managers/:hrManagerId', deleteHRManager);

// ==================== EMPLOYEE ROUTES ====================
router.post('/employees', addEmployee);
router.get('/employees', getEmployees);
router.get('/employees/:employeeId', getEmployee);
router.put('/employees/:employeeId', updateEmployee);
router.delete('/employees/:employeeId', deleteEmployee);
router.post('/employees/import', upload.single('file'), importEmployeesFromCSV);

// ==================== ATTENDANCE ROUTES ====================
router.post('/attendance', markAttendance);
router.get('/attendance/:employeeId', getEmployeeAttendance);

// ==================== SALARY ROUTES ====================
router.post('/salaries', createSalaryRecord);
router.get('/salaries', getSalaryRecords);
router.put('/salaries/:salaryId/status', updateSalaryStatus);

// ==================== DASHBOARD ROUTES ====================
router.get('/dashboard/hr', getHRDashboard);
router.get('/dashboard/admin-hr', getAdminHRDashboard);

// ==================== AVAILABLE TEACHERS ROUTES ====================
router.get('/teachers/available', getAvailableTeachers);
router.get('/teachers', getTeachersForHR);
router.put('/teachers/:teacherId/salary', updateTeacherSalary);

// ==================== PASSWORD MANAGEMENT ROUTES ====================
router.post('/hr-managers/regenerate-passwords', regenerateHRManagerPasswords);

// ==================== PROFILE ROUTES ====================
router.get('/profile', async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await require('../lib/prisma').user.findUnique({
            where: { id: userId },
            include: {
                HRManagerProfile: true,
            },
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            data: {
                name: user.name,
                email: user.email,
                phone: user.HRManagerProfile?.phone || '',
                designation: user.HRManagerProfile?.designation || 'HR Manager',
                department: user.HRManagerProfile?.department || 'Human Resources',
                employeeId: user.HRManagerProfile?.employeeId || 'N/A',
            },
        });
    } catch (error) {
        console.error('Error fetching HR profile:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }
});

router.put('/profile', async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, designation, department } = req.body;

        // Update user name
        await require('../lib/prisma').user.update({
            where: { id: userId },
            data: { name },
        });

        // Update HR Manager profile
        const hrProfile = await require('../lib/prisma').hRManagerProfile.findFirst({
            where: { userId },
        });

        if (hrProfile) {
            await require('../lib/prisma').hRManagerProfile.update({
                where: { id: hrProfile.id },
                data: {
                    phone,
                    designation,
                    department,
                },
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
        });
    } catch (error) {
        console.error('Error updating HR profile:', error);
        res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
});

module.exports = router;
