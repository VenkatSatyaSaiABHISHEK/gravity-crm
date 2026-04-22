// Demo Data for Frontend Pages
export const demoRoutes = [
  {
    id: 'route-001',
    routeName: 'City Center Route',
    routeNumber: 'RT001',
    startPoint: 'College Main Gate',
    endPoint: 'City Center',
    distance: 15.5,
    estimatedTime: '45 mins',
    stopsCount: 8,
    fee: 2500,
    isActive: true,
    Buses: [{ busNumber: 'BUS001', driverName: 'Rajesh Kumar' }]
  },
  {
    id: 'route-002',
    routeName: 'Residential Area Route',
    routeNumber: 'RT002',
    startPoint: 'College Main Gate',
    endPoint: 'Green Valley',
    distance: 12.3,
    estimatedTime: '35 mins',
    stopsCount: 6,
    fee: 2200,
    isActive: true,
    Buses: [{ busNumber: 'BUS002', driverName: 'Suresh Patel' }]
  },
  {
    id: 'route-003',
    routeName: 'Tech Park Route',
    routeNumber: 'RT003',
    startPoint: 'College Main Gate',
    endPoint: 'Tech Park',
    distance: 18.7,
    estimatedTime: '50 mins',
    stopsCount: 10,
    fee: 2800,
    isActive: true,
    Buses: [{ busNumber: 'BUS003', driverName: 'Mahesh Singh' }]
  }
];

export const demoBuses = [
  {
    id: 'bus-001',
    busNumber: 'BUS001',
    regNumber: 'KA01AB1234',
    capacity: 45,
    driverName: 'Rajesh Kumar',
    driverPhone: '9876543210',
    conductorName: 'Conductor 1',
    status: 'active',
    routeId: 'route-001'
  },
  {
    id: 'bus-002',
    busNumber: 'BUS002',
    regNumber: 'KA01AB1235',
    capacity: 45,
    driverName: 'Suresh Patel',
    driverPhone: '9876543211',
    conductorName: 'Conductor 2',
    status: 'active',
    routeId: 'route-002'
  },
  {
    id: 'bus-003',
    busNumber: 'BUS003',
    regNumber: 'KA01AB1236',
    capacity: 45,
    driverName: 'Mahesh Singh',
    driverPhone: '9876543212',
    conductorName: 'Conductor 3',
    status: 'active',
    routeId: 'route-003'
  }
];

export const demoNotices = [
  {
    id: 'notice-001',
    title: 'Annual Sports Day - May 15th, 2026',
    description: 'Annual sports day will be held on May 15th, 2026. All students are requested to participate.',
    category: 'Events',
    priority: 'high',
    publishedDate: '2026-04-20',
    isActive: true
  },
  {
    id: 'notice-002',
    title: 'Mid-term Exam Schedule Released',
    description: 'Mid-term examinations will commence from April 20th. Check your class schedule.',
    category: 'Academic',
    priority: 'high',
    publishedDate: '2026-04-18',
    isActive: true
  },
  {
    id: 'notice-003',
    title: 'Parent-Teacher Meeting - April 25th',
    description: 'PTM scheduled for all classes on April 25th from 10 AM to 4 PM.',
    category: 'Meeting',
    priority: 'normal',
    publishedDate: '2026-04-15',
    isActive: true
  },
  {
    id: 'notice-004',
    title: 'Library New Books Available',
    description: 'New collection of books added to the library. Students can issue from Monday.',
    category: 'Library',
    priority: 'normal',
    publishedDate: '2026-04-12',
    isActive: true
  },
  {
    id: 'notice-005',
    title: 'Fee Payment Last Date - April 30th',
    description: 'Last date for fee payment is April 30th. Late fee will be charged after this date.',
    category: 'Finance',
    priority: 'high',
    publishedDate: '2026-04-10',
    isActive: true
  }
];

export const demoComplaints = [
  {
    id: 'complaint-001',
    title: 'Classroom AC not working',
    description: 'The air conditioning in classroom 101 is not functioning properly since last week.',
    category: 'Infrastructure',
    status: 'pending',
    priority: 'high',
    studentName: 'Priya Sharma',
    createdAt: '2026-04-20',
    adminResponse: null
  },
  {
    id: 'complaint-002',
    title: 'Library book missing',
    description: 'Unable to find the requested mathematics reference book in the library.',
    category: 'Library',
    status: 'resolved',
    priority: 'normal',
    studentName: 'Rahul Verma',
    createdAt: '2026-04-18',
    adminResponse: 'Book has been reordered and will be available soon.'
  },
  {
    id: 'complaint-003',
    title: 'Canteen food quality issue',
    description: 'Food quality in canteen needs improvement. Many students are facing stomach issues.',
    category: 'Canteen',
    status: 'in-progress',
    priority: 'high',
    studentName: 'Isha Reddy',
    createdAt: '2026-04-15',
    adminResponse: 'Investigation in progress. New vendor being evaluated.'
  },
  {
    id: 'complaint-004',
    title: 'Transport delay problem',
    description: 'Bus is frequently late on Route A causing students to miss first period.',
    category: 'Transport',
    status: 'pending',
    priority: 'normal',
    studentName: 'Sakshi Nair',
    createdAt: '2026-04-12',
    adminResponse: null
  }
];

export const demoAdmissions = [
  {
    id: 'admission-001',
    admissionNumber: 'ADM2026001',
    applicantName: 'Aarav Mehta',
    applicantEmail: 'aarav.mehta@admission.com',
    applicantPhone: '9888888801',
    dateOfBirth: '2008-05-15',
    gender: 'Male',
    fatherName: 'Mr. Vikash Mehta',
    motherName: 'Mrs. Priya Mehta',
    address: '123, Demo Street, City',
    appliedFor: '11th Science',
    status: 'pending',
    appliedDate: '2026-04-15'
  },
  {
    id: 'admission-002',
    admissionNumber: 'ADM2026002',
    applicantName: 'Diya Sharma',
    applicantEmail: 'diya.sharma@admission.com',
    applicantPhone: '9888888802',
    dateOfBirth: '2008-07-22',
    gender: 'Female',
    fatherName: 'Mr. Rajesh Sharma',
    motherName: 'Mrs. Sunita Sharma',
    address: '456, Demo Avenue, City',
    appliedFor: '11th Commerce',
    status: 'approved',
    appliedDate: '2026-04-10'
  },
  {
    id: 'admission-003',
    admissionNumber: 'ADM2026003',
    applicantName: 'Vihaan Gupta',
    applicantEmail: 'vihaan.gupta@admission.com',
    applicantPhone: '9888888803',
    dateOfBirth: '2006-12-08',
    gender: 'Male',
    fatherName: 'Mr. Sunil Gupta',
    motherName: 'Mrs. Kavita Gupta',
    address: '789, Demo Road, City',
    appliedFor: '12th Science',
    status: 'rejected',
    appliedDate: '2026-04-08',
    rejectionReason: 'Insufficient marks in entrance test'
  }
];

export const demoPayments = [
  {
    id: 'payment-001',
    transactionId: 'TXN202600001',
    studentName: 'Priya Sharma',
    studentId: 'STU002',
    amount: 50000,
    feeType: 'Tuition Fee',
    paymentMethod: 'Online',
    status: 'Completed',
    paymentDate: '2026-04-15',
    receiptNumber: 'RCP001'
  },
  {
    id: 'payment-002',
    transactionId: 'TXN202600002',
    studentName: 'Rahul Verma',
    studentId: 'STU011',
    amount: 2500,
    feeType: 'Lab Fee',
    paymentMethod: 'Cash',
    status: 'Completed',
    paymentDate: '2026-04-12',
    receiptNumber: 'RCP002'
  },
  {
    id: 'payment-003',
    transactionId: 'TXN202600003',
    studentName: 'Isha Reddy',
    studentId: 'STU008',
    amount: 1500,
    feeType: 'Library Fee',
    paymentMethod: 'Cheque',
    status: 'Pending',
    paymentDate: '2026-04-10',
    receiptNumber: 'RCP003'
  }
];

export const demoEmployees = [
  {
    id: 'emp-001',
    employeeId: 'EMP001',
    name: 'Mr. Kiran Accountant',
    email: 'kiran.accounts@demo.com',
    department: 'Accounts',
    designation: 'Senior Accountant',
    phone: '9666661001',
    salary: 45000,
    status: 'Active',
    dateOfJoining: '2024-01-15'
  },
  {
    id: 'emp-002',
    employeeId: 'EMP002',
    name: 'Ms. Meera Librarian',
    email: 'meera.library@demo.com',
    department: 'Library',
    designation: 'Head Librarian',
    phone: '9666661002',
    salary: 35000,
    status: 'Active',
    dateOfJoining: '2024-02-01'
  },
  {
    id: 'emp-003',
    employeeId: 'EMP003',
    name: 'Mr. Sunil IT Support',
    email: 'sunil.it@demo.com',
    department: 'IT',
    designation: 'IT Executive',
    phone: '9666661003',
    salary: 40000,
    status: 'Active',
    dateOfJoining: '2024-03-10'
  }
];

// Helper function to get demo data based on API endpoint
export const getDemoData = (endpoint) => {
  const demoDataMap = {
    '/api/transport/routes': { success: true, data: demoRoutes },
    '/api/transport/buses': { success: true, data: demoBuses },
    '/api/notices': { success: true, data: demoNotices },
    '/api/complaints': { success: true, data: demoComplaints },
    '/api/admissions': { success: true, data: demoAdmissions },
    '/api/payments': { success: true, data: demoPayments },
    '/api/hr/employees': { success: true, data: demoEmployees }
  };
  
  return demoDataMap[endpoint] || { success: false, data: [] };
};