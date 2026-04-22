// Comprehensive Demo Data for All Modules
// This file provides demo data for all controllers when in demo mode

const demoData = {
    // College Info
    college: {
        id: 'demo-college-001',
        name: 'GVPLACEMENT Demo College',
        description: 'Premier Educational Institution - Demo Version',
        email: 'admin@gvplacement.demo',
        phone: '+91 9876543210',
        address: '123 Education Street, Knowledge Park',
        city: 'Demo City',
        state: 'Demo State',
        country: 'India',
        pincode: '123456',
        logo: 'https://via.placeholder.com/150',
        theme: 'green'
    },

    // Students
    students: [
        { id: '1', userId: 'demo-student-001', name: 'Priya Sharma', studentId: 'STU002', email: 'student2@demo.com', rollNum: 2, sclassId: '1', sectionId: '1', phone: '+91 9876543201', gender: 'Female', dateOfBirth: '2008-05-15', profileImage: 'https://via.placeholder.com/100' },
        { id: '2', userId: 'demo-student-002', name: 'Rahul Verma', studentId: 'STU011', email: 'rahul.verma@student.edu', rollNum: 11, sclassId: '1', sectionId: '1', phone: '+91 9876543202', gender: 'Male', dateOfBirth: '2008-03-22', profileImage: 'https://via.placeholder.com/100' },
        { id: '3', userId: 'demo-student-003', name: 'Isha Reddy', studentId: 'STU008', email: 'isha.reddy@student.edu', rollNum: 8, sclassId: '2', sectionId: '2', phone: '+91 9876543203', gender: 'Female', dateOfBirth: '2008-07-10', profileImage: 'https://via.placeholder.com/100' },
        { id: '4', userId: 'demo-student-004', name: 'Sakshi Nair', studentId: 'STU012', email: 'sakshi.nair@student.edu', rollNum: 12, sclassId: '3', sectionId: '3', phone: '+91 9876543204', gender: 'Female', dateOfBirth: '2008-11-30', profileImage: 'https://via.placeholder.com/100' },
        { id: '5', userId: 'demo-student-005', name: 'Neha Gupta', studentId: 'STU004', email: 'student4@demo.com', rollNum: 4, sclassId: '1', sectionId: '1', phone: '+91 9876543205', gender: 'Female', dateOfBirth: '2008-09-18', profileImage: 'https://via.placeholder.com/100' }
    ],

    // Teachers
    teachers: [
        { id: '1', userId: 'demo-teacher-001', name: 'Mr. Rajesh Kumar', email: 'teacher1@demo.com', specialization: 'Mathematics', experience: 5, phone: '+91 9876543210', profileImage: 'https://via.placeholder.com/100' },
        { id: '2', userId: 'demo-teacher-002', name: 'Dr. Ravi Mehta', email: 'ravi@demo.com', specialization: 'Economics', experience: 18, phone: '+91 9876543211', profileImage: 'https://via.placeholder.com/100' },
        { id: '3', userId: 'demo-teacher-003', name: 'Mr. Amit Verma', email: 'amit@demo.com', specialization: 'Geography', experience: 9, phone: '+91 9876543212', profileImage: 'https://via.placeholder.com/100' },
        { id: '4', userId: 'demo-teacher-004', name: 'Mr. Vikram Singh', email: 'vikram@demo.com', specialization: 'Mathematics', experience: 10, phone: '+91 9876543213', profileImage: 'https://via.placeholder.com/100' },
        { id: '5', userId: 'demo-teacher-005', name: 'Ms. Neha Agarwal', email: 'neha@demo.com', specialization: 'Computer Science', experience: 6, phone: '+91 9876543214', profileImage: 'https://via.placeholder.com/100' }
    ],

    // Classes
    classes: [
        { id: '1', sclassName: '11th Science', collegeId: 'demo-college-001', classTeacherId: '1', studentCount: 32 },
        { id: '2', sclassName: '11th Commerce', collegeId: 'demo-college-001', classTeacherId: '2', studentCount: 28 },
        { id: '3', sclassName: '11th Arts', collegeId: 'demo-college-001', classTeacherId: '3', studentCount: 24 },
        { id: '4', sclassName: '12th Science', collegeId: 'demo-college-001', classTeacherId: '4', studentCount: 30 },
        { id: '5', sclassName: '12th Commerce', collegeId: 'demo-college-001', classTeacherId: '5', studentCount: 26 },
        { id: '6', sclassName: '12th Arts', collegeId: 'demo-college-001', classTeacherId: '1', studentCount: 22 },
        { id: '7', sclassName: '10th Grade', collegeId: 'demo-college-001', classTeacherId: '2', studentCount: 35 },
        { id: '8', sclassName: '9th Grade', collegeId: 'demo-college-001', classTeacherId: '3', studentCount: 33 }
    ],

    // Subjects
    subjects: [
        { id: '1', subName: 'Mathematics', subCode: 'MATH101', maxMarks: 100, sclassId: '1', teacherId: '1' },
        { id: '2', subName: 'Physics', subCode: 'PHY101', maxMarks: 100, sclassId: '1', teacherId: '4' },
        { id: '3', subName: 'Chemistry', subCode: 'CHEM101', maxMarks: 100, sclassId: '1', teacherId: '5' },
        { id: '4', subName: 'Biology', subCode: 'BIO101', maxMarks: 100, sclassId: '1', teacherId: '3' },
        { id: '5', subName: 'English', subCode: 'ENG101', maxMarks: 100, sclassId: '1', teacherId: '2' },
        { id: '6', subName: 'Computer Science', subCode: 'CS101', maxMarks: 100, sclassId: '1', teacherId: '5' },
        { id: '7', subName: 'Economics', subCode: 'ECO101', maxMarks: 100, sclassId: '2', teacherId: '2' },
        { id: '8', subName: 'Accountancy', subCode: 'ACC101', maxMarks: 100, sclassId: '2', teacherId: '1' }
    ],

    // Attendance
    attendance: [
        { id: '1', studentId: '1', date: new Date('2026-04-20'), status: 'present', subjectId: '1' },
        { id: '2', studentId: '1', date: new Date('2026-04-19'), status: 'present', subjectId: '1' },
        { id: '3', studentId: '1', date: new Date('2026-04-18'), status: 'present', subjectId: '2' },
        { id: '4', studentId: '1', date: new Date('2026-04-17'), status: 'absent', subjectId: '1' },
        { id: '5', studentId: '1', date: new Date('2026-04-16'), status: 'present', subjectId: '3' },
        { id: '6', studentId: '2', date: new Date('2026-04-20'), status: 'present', subjectId: '1' },
        { id: '7', studentId: '3', date: new Date('2026-04-20'), status: 'absent', subjectId: '1' }
    ],

    // Homework
    homework: [
        { id: '1', title: 'Mathematics Chapter 5', description: 'Complete exercises 1-10', dueDate: new Date('2026-04-25'), subjectId: '1', teacherId: '1', createdAt: new Date('2026-04-20') },
        { id: '2', title: 'English Essay', description: 'Write essay on environmental protection', dueDate: new Date('2026-04-26'), subjectId: '5', teacherId: '2', createdAt: new Date('2026-04-19') },
        { id: '3', title: 'Science Project', description: 'Prepare model on solar system', dueDate: new Date('2026-04-28'), subjectId: '2', teacherId: '4', createdAt: new Date('2026-04-18') },
        { id: '4', title: 'Physics Lab Report', description: 'Submit pendulum experiment report', dueDate: new Date('2026-04-27'), subjectId: '2', teacherId: '4', createdAt: new Date('2026-04-17') },
        { id: '5', title: 'Chemistry Assignment', description: 'Solve problems from Chapter 3', dueDate: new Date('2026-04-29'), subjectId: '3', teacherId: '5', createdAt: new Date('2026-04-16') }
    ],

    // Exam Results
    examResults: [
        { id: '1', studentId: '1', subjectId: '1', examId: '1', marksObtained: 85, percentage: 85, grade: 'A', createdAt: new Date('2026-04-15') },
        { id: '2', studentId: '1', subjectId: '2', examId: '1', marksObtained: 78, percentage: 78, grade: 'B', createdAt: new Date('2026-04-15') },
        { id: '3', studentId: '1', subjectId: '3', examId: '1', marksObtained: 92, percentage: 92, grade: 'A+', createdAt: new Date('2026-04-15') },
        { id: '4', studentId: '2', subjectId: '1', examId: '1', marksObtained: 92, percentage: 92, grade: 'A+', createdAt: new Date('2026-04-15') },
        { id: '5', studentId: '3', subjectId: '1', examId: '1', marksObtained: 78, percentage: 78, grade: 'B', createdAt: new Date('2026-04-15') }
    ],

    // Fees
    fees: [
        { id: '1', studentId: '1', feeType: 'Tuition Fee', amount: 50000, dueDate: new Date('2026-05-15'), status: 'Pending', isActive: true },
        { id: '2', studentId: '2', feeType: 'Lab Fee', amount: 2500, dueDate: new Date('2026-05-15'), status: 'Paid', isActive: true },
        { id: '3', studentId: '3', feeType: 'Library Fee', amount: 1500, dueDate: new Date('2026-05-15'), status: 'Pending', isActive: true },
        { id: '4', studentId: '4', feeType: 'Sports Fee', amount: 1000, dueDate: new Date('2026-05-15'), status: 'Paid', isActive: true },
        { id: '5', studentId: '5', feeType: 'Transport Fee', amount: 2200, dueDate: new Date('2026-05-15'), status: 'Pending', isActive: true }
    ],

    // Payments
    payments: [
        { id: '1', transactionId: 'TXN202600001', studentId: '1', amount: 50000, feeType: 'Tuition Fee', paymentMethod: 'Online', status: 'completed', paymentDate: new Date('2026-04-15'), receiptNumber: 'RCP001', createdAt: new Date('2026-04-15') },
        { id: '2', transactionId: 'TXN202600002', studentId: '2', amount: 25000, feeType: 'Lab Fee', paymentMethod: 'Cash', status: 'completed', paymentDate: new Date('2026-04-12'), receiptNumber: 'RCP002', createdAt: new Date('2026-04-12') },
        { id: '3', transactionId: 'TXN202600003', studentId: '3', amount: 30000, feeType: 'Tuition Fee', paymentMethod: 'Online', status: 'completed', paymentDate: new Date('2026-04-10'), receiptNumber: 'RCP003', createdAt: new Date('2026-04-10') },
        { id: '4', transactionId: 'TXN202600004', studentId: '4', amount: 22000, feeType: 'Sports Fee', paymentMethod: 'Cheque', status: 'completed', paymentDate: new Date('2026-04-08'), receiptNumber: 'RCP004', createdAt: new Date('2026-04-08') },
        { id: '5', transactionId: 'TXN202600005', studentId: '5', amount: 28000, feeType: 'Transport Fee', paymentMethod: 'Online', status: 'completed', paymentDate: new Date('2026-04-05'), receiptNumber: 'RCP005', createdAt: new Date('2026-04-05') }
    ],

    // Transport Routes
    routes: [
        { id: '1', routeName: 'City Center Route', routeNumber: 'RT001', startPoint: 'College Gate', endPoint: 'City Center', distance: '15 km', estimatedTime: '45 minutes', fee: 2500, isActive: true, stopsCount: 8, createdAt: new Date('2026-01-15') },
        { id: '2', routeName: 'Residential Route', routeNumber: 'RT002', startPoint: 'College Gate', endPoint: 'Green Valley', distance: '12 km', estimatedTime: '35 minutes', fee: 2200, isActive: true, stopsCount: 6, createdAt: new Date('2026-01-20') },
        { id: '3', routeName: 'Tech Park Route', routeNumber: 'RT003', startPoint: 'College Gate', endPoint: 'Tech Park', distance: '18 km', estimatedTime: '55 minutes', fee: 2800, isActive: true, stopsCount: 10, createdAt: new Date('2026-02-01') },
        { id: '4', routeName: 'Airport Express', routeNumber: 'RT004', startPoint: 'College Gate', endPoint: 'Airport Terminal', distance: '25 km', estimatedTime: '70 minutes', fee: 3500, isActive: true, stopsCount: 12, createdAt: new Date('2026-02-10') },
        { id: '5', routeName: 'Mall Circuit', routeNumber: 'RT005', startPoint: 'College Gate', endPoint: 'Shopping Mall', distance: '8 km', estimatedTime: '25 minutes', fee: 2000, isActive: true, stopsCount: 5, createdAt: new Date('2026-02-15') }
    ],

    // Buses
    buses: [
        { id: '1', busNumber: 'BUS001', registrationNo: 'KA01AB1234', capacity: 45, routeId: '1', driverName: 'Rajesh Kumar', driverPhone: '9876543210', status: 'active', createdAt: new Date('2026-01-15') },
        { id: '2', busNumber: 'BUS002', registrationNo: 'KA01AB1235', capacity: 45, routeId: '1', driverName: 'Suresh Patel', driverPhone: '9876543211', status: 'active', createdAt: new Date('2026-01-20') },
        { id: '3', busNumber: 'BUS003', registrationNo: 'KA01AB1236', capacity: 45, routeId: '2', driverName: 'Mahesh Singh', driverPhone: '9876543212', status: 'active', createdAt: new Date('2026-01-25') },
        { id: '4', busNumber: 'BUS004', registrationNo: 'KA01AB1237', capacity: 50, routeId: '3', driverName: 'Vikram Rao', driverPhone: '9876543213', status: 'active', createdAt: new Date('2026-02-01') },
        { id: '5', busNumber: 'BUS005', registrationNo: 'KA01AB1238', capacity: 50, routeId: '3', driverName: 'Anil Kumar', driverPhone: '9876543214', status: 'maintenance', createdAt: new Date('2026-02-05') }
    ],

    // Notices
    notices: [
        { id: '1', title: 'Annual Sports Day - May 15th', description: 'Sports day celebration for all students. Participation is mandatory.', category: 'Events', priority: 'high', publishedDate: new Date('2026-04-20'), isActive: true, createdAt: new Date('2026-04-20') },
        { id: '2', title: 'Mid-term Exams Schedule', description: 'Exam schedule has been released. Check your dashboard for details.', category: 'Academic', priority: 'high', publishedDate: new Date('2026-04-18'), isActive: true, createdAt: new Date('2026-04-18') },
        { id: '3', title: 'Parent-Teacher Meeting', description: 'PTM scheduled for April 25th at 10:00 AM', category: 'Meeting', priority: 'normal', publishedDate: new Date('2026-04-15'), isActive: true, createdAt: new Date('2026-04-15') },
        { id: '4', title: 'Library New Books', description: 'New collection of science and literature books available', category: 'Library', priority: 'normal', publishedDate: new Date('2026-04-12'), isActive: true, createdAt: new Date('2026-04-12') },
        { id: '5', title: 'Fee Payment Reminder', description: 'Please pay pending fees by April 30th to avoid late charges', category: 'Finance', priority: 'high', publishedDate: new Date('2026-04-10'), isActive: true, createdAt: new Date('2026-04-10') }
    ],

    // Complaints
    complaints: [
        { id: '1', title: 'AC not working in classroom', description: 'The air conditioning in Room 301 has not been working for 3 days', category: 'Infrastructure', status: 'pending', priority: 'high', studentId: '1', studentName: 'Priya Sharma', createdAt: new Date('2026-04-20') },
        { id: '2', title: 'Library book missing', description: 'Cannot find the required reference book for Physics', category: 'Library', status: 'resolved', priority: 'normal', studentId: '2', studentName: 'Rahul Verma', createdAt: new Date('2026-04-18') },
        { id: '3', title: 'Canteen food quality', description: 'Food quality has deteriorated in the past week', category: 'Canteen', status: 'in-progress', priority: 'high', studentId: '3', studentName: 'Isha Reddy', createdAt: new Date('2026-04-15') },
        { id: '4', title: 'Transport delay', description: 'Bus RT001 is frequently arriving 15-20 minutes late', category: 'Transport', status: 'pending', priority: 'normal', studentId: '4', studentName: 'Sakshi Nair', createdAt: new Date('2026-04-12') }
    ],

    // Admissions
    admissions: [
        { id: '1', admissionNumber: 'ADM2026001', applicantName: 'Aarav Mehta', applicantEmail: 'aarav.mehta@admission.com', applicantPhone: '9888888801', appliedFor: '11th Science', status: 'pending', appliedDate: new Date('2026-04-15'), createdAt: new Date('2026-04-15') },
        { id: '2', admissionNumber: 'ADM2026002', applicantName: 'Diya Sharma', applicantEmail: 'diya.sharma@admission.com', applicantPhone: '9888888802', appliedFor: '11th Commerce', status: 'approved', appliedDate: new Date('2026-04-10'), createdAt: new Date('2026-04-10') },
        { id: '3', admissionNumber: 'ADM2026003', applicantName: 'Vihaan Gupta', applicantEmail: 'vihaan.gupta@admission.com', applicantPhone: '9888888803', appliedFor: '12th Science', status: 'rejected', appliedDate: new Date('2026-04-08'), createdAt: new Date('2026-04-08') },
        { id: '4', admissionNumber: 'ADM2026004', applicantName: 'Ananya Patel', applicantEmail: 'ananya.patel@admission.com', applicantPhone: '9888888804', appliedFor: '11th Arts', status: 'pending', appliedDate: new Date('2026-04-12'), createdAt: new Date('2026-04-12') }
    ]
};

// Helper function to get demo response
const getDemoResponse = (data, message = 'Demo data') => {
    return {
        success: true,
        demo: true,
        data: data,
        message: message
    };
};

module.exports = {
    demoData,
    getDemoResponse
};
