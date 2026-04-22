// Demo Mode Middleware - Provides fake data when database is unavailable

const demoData = {
  // Students
  students: [
    { id: '1', name: 'Priya Sharma', studentId: 'STU002', email: 'student2@demo.com', rollNum: 2, sclassId: '1', sectionId: '1' },
    { id: '2', name: 'Rahul Verma', studentId: 'STU011', email: 'rahul.verma@student.edu', rollNum: 11, sclassId: '1', sectionId: '1' },
    { id: '3', name: 'Isha Reddy', studentId: 'STU008', email: 'isha.reddy@student.edu', rollNum: 8, sclassId: '1', sectionId: '1' },
    { id: '4', name: 'Sakshi Nair', studentId: 'STU012', email: 'sakshi.nair@student.edu', rollNum: 12, sclassId: '1', sectionId: '1' },
    { id: '5', name: 'Neha Gupta', studentId: 'STU004', email: 'student4@demo.com', rollNum: 4, sclassId: '1', sectionId: '1' }
  ],

  // Teachers
  teachers: [
    { id: '1', name: 'Mr. Rajesh Kumar', email: 'teacher1@demo.com', specialization: 'Mathematics', experience: 5 },
    { id: '2', name: 'Dr. Ravi Mehta', email: 'ravi@demo.com', specialization: 'Economics', experience: 18 },
    { id: '3', name: 'Mr. Amit Verma', email: 'amit@demo.com', specialization: 'Geography', experience: 9 },
    { id: '4', name: 'Mr. Vikram Singh', email: 'vikram@demo.com', specialization: 'Mathematics', experience: 10 },
    { id: '5', name: 'Ms. Neha Agarwal', email: 'neha@demo.com', specialization: 'Computer Science', experience: 6 }
  ],

  // Transport Routes
  routes: [
    { id: '1', routeName: 'City Center Route', routeNumber: 'RT001', startPoint: 'College Gate', endPoint: 'City Center', fee: 2500, isActive: true, stopsCount: 8 },
    { id: '2', routeName: 'Residential Route', routeNumber: 'RT002', startPoint: 'College Gate', endPoint: 'Green Valley', fee: 2200, isActive: true, stopsCount: 6 },
    { id: '3', routeName: 'Tech Park Route', routeNumber: 'RT003', startPoint: 'College Gate', endPoint: 'Tech Park', fee: 2800, isActive: true, stopsCount: 10 }
  ],

  // Buses
  buses: [
    { id: '1', busNumber: 'BUS001', regNumber: 'KA01AB1234', capacity: 45, driverName: 'Rajesh Kumar', driverPhone: '9876543210', status: 'active', routeId: '1' },
    { id: '2', busNumber: 'BUS002', regNumber: 'KA01AB1235', capacity: 45, driverName: 'Suresh Patel', driverPhone: '9876543211', status: 'active', routeId: '2' },
    { id: '3', busNumber: 'BUS003', regNumber: 'KA01AB1236', capacity: 45, driverName: 'Mahesh Singh', driverPhone: '9876543212', status: 'active', routeId: '3' }
  ],

  // Notices
  notices: [
    { id: '1', title: 'Annual Sports Day - May 15th', description: 'Sports day celebration for all students', category: 'Events', priority: 'high', publishedDate: '2026-04-20', isActive: true },
    { id: '2', title: 'Mid-term Exams Schedule', description: 'Exam schedule has been released', category: 'Academic', priority: 'high', publishedDate: '2026-04-18', isActive: true },
    { id: '3', title: 'Parent-Teacher Meeting', description: 'PTM scheduled for April 25th', category: 'Meeting', priority: 'normal', publishedDate: '2026-04-15', isActive: true },
    { id: '4', title: 'Library New Books', description: 'New collection available', category: 'Library', priority: 'normal', publishedDate: '2026-04-12', isActive: true },
    { id: '5', title: 'Fee Payment Reminder', description: 'Pay fees by April 30th', category: 'Finance', priority: 'high', publishedDate: '2026-04-10', isActive: true }
  ],

  // Complaints
  complaints: [
    { id: '1', title: 'AC not working', description: 'Classroom AC issue', category: 'Infrastructure', status: 'pending', priority: 'high', studentName: 'Priya Sharma', createdAt: '2026-04-20' },
    { id: '2', title: 'Library book missing', description: 'Cannot find required book', category: 'Library', status: 'resolved', priority: 'normal', studentName: 'Rahul Verma', createdAt: '2026-04-18' },
    { id: '3', title: 'Canteen food quality', description: 'Food quality concern', category: 'Canteen', status: 'in-progress', priority: 'high', studentName: 'Isha Reddy', createdAt: '2026-04-15' },
    { id: '4', title: 'Transport delay', description: 'Bus frequently late', category: 'Transport', status: 'pending', priority: 'normal', studentName: 'Sakshi Nair', createdAt: '2026-04-12' }
  ],

  // Admissions
  admissions: [
    { id: '1', admissionNumber: 'ADM2026001', applicantName: 'Aarav Mehta', applicantEmail: 'aarav.mehta@admission.com', applicantPhone: '9888888801', appliedFor: '11th Science', status: 'pending', appliedDate: '2026-04-15' },
    { id: '2', admissionNumber: 'ADM2026002', applicantName: 'Diya Sharma', applicantEmail: 'diya.sharma@admission.com', applicantPhone: '9888888802', appliedFor: '11th Commerce', status: 'approved', appliedDate: '2026-04-10' },
    { id: '3', admissionNumber: 'ADM2026003', applicantName: 'Vihaan Gupta', applicantEmail: 'vihaan.gupta@admission.com', applicantPhone: '9888888803', appliedFor: '12th Science', status: 'rejected', appliedDate: '2026-04-08' }
  ],

  // Payments
  payments: [
    { id: '1', transactionId: 'TXN202600001', studentName: 'Priya Sharma', amount: 50000, feeType: 'Tuition Fee', paymentMethod: 'Online', status: 'Completed', paymentDate: '2026-04-15', receiptNumber: 'RCP001' },
    { id: '2', transactionId: 'TXN202600002', studentName: 'Rahul Verma', amount: 2500, feeType: 'Lab Fee', paymentMethod: 'Cash', status: 'Completed', paymentDate: '2026-04-12', receiptNumber: 'RCP002' },
    { id: '3', transactionId: 'TXN202600003', studentName: 'Isha Reddy', amount: 1500, feeType: 'Library Fee', paymentMethod: 'Cheque', status: 'Pending', paymentDate: '2026-04-10', receiptNumber: 'RCP003' }
  ],

  // Fees
  fees: [
    { id: '1', studentId: '1', feeType: 'Tuition Fee', amount: 50000, dueDate: '2026-05-15', status: 'Pending' },
    { id: '2', studentId: '2', feeType: 'Lab Fee', amount: 2500, dueDate: '2026-05-15', status: 'Paid' },
    { id: '3', studentId: '3', feeType: 'Library Fee', amount: 1500, dueDate: '2026-05-15', status: 'Pending' },
    { id: '4', studentId: '4', feeType: 'Sports Fee', amount: 1000, dueDate: '2026-05-15', status: 'Paid' },
    { id: '5', studentId: '5', feeType: 'Transport Fee', amount: 2200, dueDate: '2026-05-15', status: 'Pending' }
  ],

  // Attendance
  attendance: [
    { id: '1', studentId: '1', date: '2026-04-20', status: 'Present', subjectId: '1' },
    { id: '2', studentId: '2', date: '2026-04-20', status: 'Present', subjectId: '1' },
    { id: '3', studentId: '3', date: '2026-04-20', status: 'Absent', subjectId: '1' },
    { id: '4', studentId: '4', date: '2026-04-20', status: 'Present', subjectId: '1' },
    { id: '5', studentId: '5', date: '2026-04-20', status: 'Present', subjectId: '1' }
  ],

  // Homework
  homework: [
    { id: '1', title: 'Mathematics Chapter 5', description: 'Complete exercises 1-10', dueDate: '2026-04-25', subjectId: '1', teacherId: '1' },
    { id: '2', title: 'English Essay', description: 'Write essay on environmental protection', dueDate: '2026-04-26', subjectId: '2', teacherId: '2' },
    { id: '3', title: 'Science Project', description: 'Prepare model on solar system', dueDate: '2026-04-28', subjectId: '3', teacherId: '3' }
  ],

  // Exam Results
  examResults: [
    { id: '1', studentId: '1', subjectId: '1', examId: '1', marksObtained: 85, percentage: 85, grade: 'A' },
    { id: '2', studentId: '2', subjectId: '1', examId: '1', marksObtained: 92, percentage: 92, grade: 'A+' },
    { id: '3', studentId: '3', subjectId: '1', examId: '1', marksObtained: 78, percentage: 78, grade: 'B' },
    { id: '4', studentId: '4', subjectId: '1', examId: '1', marksObtained: 88, percentage: 88, grade: 'A' },
    { id: '5', studentId: '5', subjectId: '1', examId: '1', marksObtained: 76, percentage: 76, grade: 'B' }
  ]
};

// Demo mode middleware
const demoModeMiddleware = (req, res, next) => {
  // Check if we're in demo mode (database unavailable)
  if (global.DEMO_MODE || process.env.DEMO_MODE === 'true') {
    req.demoMode = true;
    req.demoData = demoData;
  }
  next();
};

// Helper function to send demo response
const sendDemoResponse = (res, data, message = 'Demo data') => {
  res.json({
    success: true,
    data: data,
    message: message,
    demo: true
  });
};

module.exports = {
  demoModeMiddleware,
  sendDemoResponse,
  demoData
};