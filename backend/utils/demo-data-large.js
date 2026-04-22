// EXPANDED Demo Data with MANY MORE records for realistic demo
// This provides a large dataset for impressive demonstrations

// Helper function to generate student data
const generateStudents = () => {
    const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Arnav', 'Ayaan', 'Krishna', 'Ishaan',
                        'Ananya', 'Diya', 'Aadhya', 'Saanvi', 'Kiara', 'Anika', 'Navya', 'Angel', 'Pari', 'Myra',
                        'Priya', 'Rahul', 'Isha', 'Sakshi', 'Neha', 'Rohan', 'Amit', 'Pooja', 'Riya', 'Karan',
                        'Sneha', 'Vikram', 'Anjali', 'Rajesh', 'Kavya', 'Aryan', 'Divya', 'Harsh', 'Nisha', 'Varun'];
    
    const lastNames = ['Sharma', 'Verma', 'Reddy', 'Nair', 'Gupta', 'Kumar', 'Singh', 'Patel', 'Mehta', 'Shah',
                       'Agarwal', 'Jain', 'Rao', 'Iyer', 'Desai', 'Malhotra', 'Kapoor', 'Chopra', 'Bhatia', 'Khanna'];
    
    const students = [];
    const classes = ['1', '2', '3', '4', '5', '6', '7', '8'];
    
    for (let i = 1; i <= 50; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = `${firstName} ${lastName}`;
        const studentId = `STU${String(i).padStart(3, '0')}`;
        const classId = classes[Math.floor(Math.random() * classes.length)];
        
        students.push({
            id: String(i),
            userId: `demo-student-${String(i).padStart(3, '0')}`,
            name: name,
            studentId: studentId,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.edu`,
            rollNum: i,
            sclassId: classId,
            sectionId: classId,
            phone: `+91 ${9800000000 + i}`,
            gender: i % 2 === 0 ? 'Male' : 'Female',
            dateOfBirth: `200${8 + Math.floor(i / 10)}-${String((i % 12) + 1).padStart(2, '0')}-15`,
            profileImage: 'https://via.placeholder.com/100',
            isActive: true,
            isDeleted: false
        });
    }
    
    return students;
};

// Helper function to generate teacher data
const generateTeachers = () => {
    const teachers = [
        { name: 'Mr. Rajesh Kumar', specialization: 'Mathematics', experience: 15, gender: 'Male' },
        { name: 'Dr. Priya Sharma', specialization: 'Physics', experience: 12, gender: 'Female' },
        { name: 'Ms. Anjali Verma', specialization: 'Chemistry', experience: 10, gender: 'Female' },
        { name: 'Mr. Vikram Singh', specialization: 'Biology', experience: 8, gender: 'Male' },
        { name: 'Dr. Ravi Mehta', specialization: 'English', experience: 18, gender: 'Male' },
        { name: 'Ms. Neha Agarwal', specialization: 'Computer Science', experience: 6, gender: 'Female' },
        { name: 'Mr. Amit Patel', specialization: 'Economics', experience: 14, gender: 'Male' },
        { name: 'Dr. Kavya Reddy', specialization: 'History', experience: 11, gender: 'Female' },
        { name: 'Mr. Arjun Nair', specialization: 'Geography', experience: 9, gender: 'Male' },
        { name: 'Ms. Divya Gupta', specialization: 'Political Science', experience: 7, gender: 'Female' },
        { name: 'Dr. Suresh Iyer', specialization: 'Accountancy', experience: 16, gender: 'Male' },
        { name: 'Ms. Pooja Desai', specialization: 'Business Studies', experience: 8, gender: 'Female' },
        { name: 'Mr. Karan Malhotra', specialization: 'Physical Education', experience: 10, gender: 'Male' },
        { name: 'Dr. Sneha Kapoor', specialization: 'Psychology', experience: 13, gender: 'Female' },
        { name: 'Mr. Rohan Chopra', specialization: 'Sociology', experience: 9, gender: 'Male' },
        { name: 'Ms. Riya Bhatia', specialization: 'Hindi', experience: 11, gender: 'Female' },
        { name: 'Dr. Varun Khanna', specialization: 'Sanskrit', experience: 15, gender: 'Male' },
        { name: 'Ms. Nisha Shah', specialization: 'Art & Craft', experience: 7, gender: 'Female' },
        { name: 'Mr. Harsh Jain', specialization: 'Music', experience: 12, gender: 'Male' },
        { name: 'Dr. Isha Rao', specialization: 'Environmental Science', experience: 10, gender: 'Female' }
    ];
    
    return teachers.map((t, i) => ({
        id: String(i + 1),
        userId: `demo-teacher-${String(i + 1).padStart(3, '0')}`,
        name: t.name,
        email: `${t.name.toLowerCase().replace(/[^a-z]/g, '')}@teacher.edu`,
        specialization: t.specialization,
        experience: t.experience,
        phone: `+91 ${9900000000 + i}`,
        gender: t.gender,
        qualification: 'M.Sc., B.Ed',
        profileImage: 'https://via.placeholder.com/100',
        isActive: true,
        createdAt: new Date('2026-01-01')
    }));
};

// Helper function to generate HR employees
const generateHREmployees = () => {
    const employees = [
        { name: 'Mr. Anil Kumar', designation: 'Principal', department: 'Administration', salary: 150000 },
        { name: 'Ms. Sunita Sharma', designation: 'Vice Principal', department: 'Administration', salary: 120000 },
        { name: 'Mr. Ramesh Gupta', designation: 'Admin Officer', department: 'Administration', salary: 80000 },
        { name: 'Ms. Lakshmi Iyer', designation: 'Accountant', department: 'Accounts', salary: 60000 },
        { name: 'Mr. Prakash Reddy', designation: 'Librarian', department: 'Library', salary: 50000 },
        { name: 'Ms. Meena Patel', designation: 'Lab Assistant', department: 'Science Lab', salary: 35000 },
        { name: 'Mr. Sunil Verma', designation: 'Sports Coach', department: 'Sports', salary: 45000 },
        { name: 'Ms. Radha Nair', designation: 'Counselor', department: 'Student Welfare', salary: 55000 },
        { name: 'Mr. Vijay Singh', designation: 'IT Administrator', department: 'IT', salary: 70000 },
        { name: 'Ms. Geeta Desai', designation: 'Receptionist', department: 'Front Office', salary: 30000 },
        { name: 'Mr. Mohan Jain', designation: 'Security Supervisor', department: 'Security', salary: 40000 },
        { name: 'Ms. Kavita Mehta', designation: 'Nurse', department: 'Medical', salary: 45000 },
        { name: 'Mr. Deepak Shah', designation: 'Maintenance Head', department: 'Maintenance', salary: 50000 },
        { name: 'Ms. Priyanka Kapoor', designation: 'HR Manager', department: 'HR', salary: 90000 },
        { name: 'Mr. Sanjay Chopra', designation: 'Transport Manager', department: 'Transport', salary: 65000 }
    ];
    
    return employees.map((e, i) => ({
        id: String(i + 1),
        userId: `demo-hr-${String(i + 1).padStart(3, '0')}`,
        name: e.name,
        email: `${e.name.toLowerCase().replace(/[^a-z]/g, '')}@staff.edu`,
        designation: e.designation,
        department: e.department,
        salary: e.salary,
        phone: `+91 ${9700000000 + i}`,
        joiningDate: new Date('2024-01-01'),
        isActive: true,
        createdAt: new Date('2024-01-01')
    }));
};

// Helper function to generate payment transactions
const generatePayments = () => {
    const payments = [];
    const paymentMethods = ['Online', 'Cash', 'Cheque', 'UPI', 'Card'];
    const feeTypes = ['Tuition Fee', 'Lab Fee', 'Library Fee', 'Sports Fee', 'Transport Fee', 'Exam Fee', 'Annual Fee'];
    
    for (let i = 1; i <= 100; i++) {
        const studentId = String(Math.floor(Math.random() * 50) + 1);
        const amount = [5000, 10000, 15000, 20000, 25000, 30000, 50000][Math.floor(Math.random() * 7)];
        const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        const feeType = feeTypes[Math.floor(Math.random() * feeTypes.length)];
        const daysAgo = Math.floor(Math.random() * 90);
        const paymentDate = new Date();
        paymentDate.setDate(paymentDate.getDate() - daysAgo);
        
        payments.push({
            id: String(i),
            transactionId: `TXN2026${String(i).padStart(5, '0')}`,
            razorpayOrderId: `order_${Math.random().toString(36).substring(7)}`,
            razorpayPaymentId: `pay_${Math.random().toString(36).substring(7)}`,
            studentId: studentId,
            amount: amount,
            feeType: feeType,
            paymentMethod: method,
            status: 'completed',
            paymentDate: paymentDate,
            receiptNumber: `RCP${String(i).padStart(4, '0')}`,
            createdAt: paymentDate
        });
    }
    
    return payments;
};

// Main demo data object
const demoDataLarge = {
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
    
    students: generateStudents(),
    teachers: generateTeachers(),
    hrEmployees: generateHREmployees(),
    payments: generatePayments(),
    
    classes: [
        { id: '1', sclassName: '11th Science', collegeId: 'demo-college-001', classTeacherId: '1', studentCount: 32 },
        { id: '2', sclassName: '11th Commerce', collegeId: 'demo-college-001', classTeacherId: '2', studentCount: 28 },
        { id: '3', sclassName: '11th Arts', collegeId: 'demo-college-001', classTeacherId: '3', studentCount: 24 },
        { id: '4', sclassName: '12th Science', collegeId: 'demo-college-001', classTeacherId: '4', studentCount: 30 },
        { id: '5', sclassName: '12th Commerce', collegeId: 'demo-college-001', classTeacherId: '5', studentCount: 26 },
        { id: '6', sclassName: '12th Arts', collegeId: 'demo-college-001', classTeacherId: '6', studentCount: 22 },
        { id: '7', sclassName: '10th Grade', collegeId: 'demo-college-001', classTeacherId: '7', studentCount: 35 },
        { id: '8', sclassName: '9th Grade', collegeId: 'demo-college-001', classTeacherId: '8', studentCount: 33 }
    ],
    
    subjects: [
        { id: '1', subName: 'Mathematics', subCode: 'MATH101', maxMarks: 100, sclassId: '1', teacherId: '1' },
        { id: '2', subName: 'Physics', subCode: 'PHY101', maxMarks: 100, sclassId: '1', teacherId: '2' },
        { id: '3', subName: 'Chemistry', subCode: 'CHEM101', maxMarks: 100, sclassId: '1', teacherId: '3' },
        { id: '4', subName: 'Biology', subCode: 'BIO101', maxMarks: 100, sclassId: '1', teacherId: '4' },
        { id: '5', subName: 'English', subCode: 'ENG101', maxMarks: 100, sclassId: '1', teacherId: '5' },
        { id: '6', subName: 'Computer Science', subCode: 'CS101', maxMarks: 100, sclassId: '1', teacherId: '6' },
        { id: '7', subName: 'Economics', subCode: 'ECO101', maxMarks: 100, sclassId: '2', teacherId: '7' },
        { id: '8', subName: 'Accountancy', subCode: 'ACC101', maxMarks: 100, sclassId: '2', teacherId: '11' },
        { id: '9', subName: 'Business Studies', subCode: 'BUS101', maxMarks: 100, sclassId: '2', teacherId: '12' },
        { id: '10', subName: 'History', subCode: 'HIS101', maxMarks: 100, sclassId: '3', teacherId: '8' },
        { id: '11', subName: 'Geography', subCode: 'GEO101', maxMarks: 100, sclassId: '3', teacherId: '9' },
        { id: '12', subName: 'Political Science', subCode: 'POL101', maxMarks: 100, sclassId: '3', teacherId: '10' }
    ],
    
    routes: [
        { id: '1', routeName: 'City Center Route', routeNumber: 'RT001', startPoint: 'College Gate', endPoint: 'City Center', distance: '15 km', estimatedTime: '45 minutes', fee: 2500, isActive: true, stopsCount: 8, createdAt: new Date('2026-01-15') },
        { id: '2', routeName: 'Residential Route', routeNumber: 'RT002', startPoint: 'College Gate', endPoint: 'Green Valley', distance: '12 km', estimatedTime: '35 minutes', fee: 2200, isActive: true, stopsCount: 6, createdAt: new Date('2026-01-20') },
        { id: '3', routeName: 'Tech Park Route', routeNumber: 'RT003', startPoint: 'College Gate', endPoint: 'Tech Park', distance: '18 km', estimatedTime: '55 minutes', fee: 2800, isActive: true, stopsCount: 10, createdAt: new Date('2026-02-01') },
        { id: '4', routeName: 'Airport Express', routeNumber: 'RT004', startPoint: 'College Gate', endPoint: 'Airport Terminal', distance: '25 km', estimatedTime: '70 minutes', fee: 3500, isActive: true, stopsCount: 12, createdAt: new Date('2026-02-10') },
        { id: '5', routeName: 'Mall Circuit', routeNumber: 'RT005', startPoint: 'College Gate', endPoint: 'Shopping Mall', distance: '8 km', estimatedTime: '25 minutes', fee: 2000, isActive: true, stopsCount: 5, createdAt: new Date('2026-02-15') }
    ],
    
    buses: [
        { id: '1', busNumber: 'BUS001', registrationNo: 'KA01AB1234', capacity: 45, routeId: '1', driverName: 'Rajesh Kumar', driverPhone: '9876543210', status: 'active', createdAt: new Date('2026-01-15') },
        { id: '2', busNumber: 'BUS002', registrationNo: 'KA01AB1235', capacity: 45, routeId: '1', driverName: 'Suresh Patel', driverPhone: '9876543211', status: 'active', createdAt: new Date('2026-01-20') },
        { id: '3', busNumber: 'BUS003', registrationNo: 'KA01AB1236', capacity: 45, routeId: '2', driverName: 'Mahesh Singh', driverPhone: '9876543212', status: 'active', createdAt: new Date('2026-01-25') },
        { id: '4', busNumber: 'BUS004', registrationNo: 'KA01AB1237', capacity: 50, routeId: '3', driverName: 'Vikram Rao', driverPhone: '9876543213', status: 'active', createdAt: new Date('2026-02-01') },
        { id: '5', busNumber: 'BUS005', registrationNo: 'KA01AB1238', capacity: 50, routeId: '3', driverName: 'Anil Kumar', driverPhone: '9876543214', status: 'maintenance', createdAt: new Date('2026-02-05') },
        { id: '6', busNumber: 'BUS006', registrationNo: 'KA01AB1239', capacity: 55, routeId: '4', driverName: 'Ravi Sharma', driverPhone: '9876543215', status: 'active', createdAt: new Date('2026-02-10') },
        { id: '7', busNumber: 'BUS007', registrationNo: 'KA01AB1240', capacity: 40, routeId: '5', driverName: 'Deepak Gupta', driverPhone: '9876543216', status: 'active', createdAt: new Date('2026-02-15') }
    ],
    
    notices: [
        { id: '1', title: 'Annual Sports Day - May 15th', description: 'Sports day celebration for all students. Participation is mandatory.', category: 'Events', priority: 'high', publishedDate: new Date('2026-04-20'), isActive: true, createdAt: new Date('2026-04-20') },
        { id: '2', title: 'Mid-term Exams Schedule', description: 'Exam schedule has been released. Check your dashboard for details.', category: 'Academic', priority: 'high', publishedDate: new Date('2026-04-18'), isActive: true, createdAt: new Date('2026-04-18') },
        { id: '3', title: 'Parent-Teacher Meeting', description: 'PTM scheduled for April 25th at 10:00 AM', category: 'Meeting', priority: 'normal', publishedDate: new Date('2026-04-15'), isActive: true, createdAt: new Date('2026-04-15') },
        { id: '4', title: 'Library New Books', description: 'New collection of science and literature books available', category: 'Library', priority: 'normal', publishedDate: new Date('2026-04-12'), isActive: true, createdAt: new Date('2026-04-12') },
        { id: '5', title: 'Fee Payment Reminder', description: 'Please pay pending fees by April 30th to avoid late charges', category: 'Finance', priority: 'high', publishedDate: new Date('2026-04-10'), isActive: true, createdAt: new Date('2026-04-10') }
    ]
};

module.exports = {
    demoDataLarge,
    generateStudents,
    generateTeachers,
    generateHREmployees,
    generatePayments
};


// Helper function to generate admission data
const generateAdmissions = () => {
    const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Arnav', 'Ayaan', 'Krishna', 'Ishaan',
                        'Ananya', 'Diya', 'Aadhya', 'Saanvi', 'Kiara', 'Anika', 'Navya', 'Angel', 'Pari', 'Myra'];
    const lastNames = ['Sharma', 'Verma', 'Reddy', 'Nair', 'Gupta', 'Kumar', 'Singh', 'Patel', 'Mehta', 'Shah'];
    
    const admissions = [];
    const statuses = ['Pending', 'Approved', 'Rejected'];
    
    for (let i = 1; i <= 15; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        admissions.push({
            id: String(i),
            admissionNumber: `ADM2026${String(i).padStart(4, '0')}`,
            studentName: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@admission.edu`,
            phone: `+91 ${9800000000 + i}`,
            parentName: `Mr./Ms. ${lastName}`,
            parentPhone: `+91 ${9700000000 + i}`,
            appliedClass: ['9th', '10th', '11th', '12th'][Math.floor(Math.random() * 4)],
            appliedStream: ['Science', 'Commerce', 'Arts'][Math.floor(Math.random() * 3)],
            status: status,
            applicationDate: new Date(2026, 3, Math.floor(Math.random() * 20) + 1),
            approvalDate: status !== 'Pending' ? new Date(2026, 3, Math.floor(Math.random() * 20) + 10) : null,
            documents: ['Birth Certificate', 'Previous School Certificate', 'Transfer Certificate'],
            remarks: status === 'Rejected' ? 'Incomplete documents' : 'Application under review',
            createdAt: new Date(2026, 3, Math.floor(Math.random() * 20) + 1)
        });
    }
    
    return admissions;
};

// Helper function to generate complaints data
const generateComplaints = () => {
    const complaints = [];
    const categories = ['Academic', 'Discipline', 'Facilities', 'Bullying', 'Other'];
    const statuses = ['Open', 'In Progress', 'Resolved'];
    
    for (let i = 1; i <= 20; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        complaints.push({
            id: String(i),
            complaintNumber: `CMP2026${String(i).padStart(4, '0')}`,
            studentId: String(Math.floor(Math.random() * 50) + 1),
            studentName: `Student ${i}`,
            category: category,
            title: `${category} Complaint - Issue ${i}`,
            description: `This is a detailed complaint about ${category.toLowerCase()} matter. The student has raised this concern on ${new Date(2026, 3, Math.floor(Math.random() * 20) + 1).toDateString()}.`,
            status: status,
            priority: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
            filedDate: new Date(2026, 3, Math.floor(Math.random() * 20) + 1),
            resolvedDate: status === 'Resolved' ? new Date(2026, 3, Math.floor(Math.random() * 20) + 15) : null,
            assignedTo: `Staff Member ${Math.floor(Math.random() * 10) + 1}`,
            resolution: status === 'Resolved' ? 'Issue has been resolved satisfactorily.' : 'Pending resolution',
            createdAt: new Date(2026, 3, Math.floor(Math.random() * 20) + 1)
        });
    }
    
    return complaints;
};

// Helper function to generate homework/assignments data
const generateHomework = () => {
    const homework = [];
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'Economics', 'History'];
    
    for (let i = 1; i <= 25; i++) {
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const dueDate = new Date(2026, 4, Math.floor(Math.random() * 20) + 1);
        
        homework.push({
            id: String(i),
            title: `${subject} Assignment ${i}`,
            description: `Complete the ${subject} assignment covering chapters 1-3. Submit in PDF format.`,
            subject: subject,
            subjectId: String(Math.floor(Math.random() * 12) + 1),
            teacherId: String(Math.floor(Math.random() * 20) + 1),
            teacherName: `Teacher ${Math.floor(Math.random() * 20) + 1}`,
            classId: String(Math.floor(Math.random() * 8) + 1),
            dueDate: dueDate,
            totalMarks: [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)],
            instructions: 'Submit before 5 PM on the due date. Late submissions will not be accepted.',
            attachments: ['assignment.pdf', 'reference_material.docx'],
            createdDate: new Date(2026, 3, Math.floor(Math.random() * 20) + 1),
            createdAt: new Date(2026, 3, Math.floor(Math.random() * 20) + 1)
        });
    }
    
    return homework;
};

// Helper function to generate exam results data
const generateExamResults = () => {
    const results = [];
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'];
    
    for (let i = 1; i <= 40; i++) {
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const marksObtained = Math.floor(Math.random() * 100);
        const percentage = (marksObtained / 100) * 100;
        
        let grade = 'F';
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B';
        else if (percentage >= 60) grade = 'C';
        else if (percentage >= 50) grade = 'D';
        
        results.push({
            id: String(i),
            studentId: String(Math.floor(Math.random() * 50) + 1),
            studentName: `Student ${Math.floor(Math.random() * 50) + 1}`,
            examId: String(Math.floor(Math.random() * 5) + 1),
            examName: `Mid-term Exam ${Math.floor(Math.random() * 2) + 1}`,
            subject: subject,
            subjectId: String(Math.floor(Math.random() * 12) + 1),
            marksObtained: marksObtained,
            maxMarks: 100,
            percentage: percentage.toFixed(2),
            grade: grade,
            remarks: grade === 'F' ? 'Need improvement' : 'Good performance',
            examDate: new Date(2026, 3, Math.floor(Math.random() * 20) + 1),
            createdAt: new Date(2026, 3, Math.floor(Math.random() * 20) + 1)
        });
    }
    
    return results;
};

// Helper function to generate attendance data
const generateAttendance = () => {
    const attendance = [];
    const statuses = ['present', 'absent', 'leave'];
    
    for (let i = 1; i <= 100; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        attendance.push({
            id: String(i),
            studentId: String(Math.floor(Math.random() * 50) + 1),
            studentName: `Student ${Math.floor(Math.random() * 50) + 1}`,
            classId: String(Math.floor(Math.random() * 8) + 1),
            date: new Date(2026, 3, Math.floor(Math.random() * 20) + 1),
            status: status,
            remarks: status === 'leave' ? 'Medical leave' : '',
            markedBy: `Teacher ${Math.floor(Math.random() * 20) + 1}`,
            createdAt: new Date(2026, 3, Math.floor(Math.random() * 20) + 1)
        });
    }
    
    return attendance;
};

// Helper function to generate fee records
const generateFeeRecords = () => {
    const fees = [];
    const feeTypes = ['Tuition Fee', 'Lab Fee', 'Library Fee', 'Sports Fee', 'Transport Fee', 'Exam Fee', 'Annual Fee'];
    
    for (let i = 1; i <= 50; i++) {
        const feeType = feeTypes[Math.floor(Math.random() * feeTypes.length)];
        const amount = [5000, 10000, 15000, 20000, 25000, 30000, 50000][Math.floor(Math.random() * 7)];
        const paid = Math.random() > 0.3 ? amount : Math.floor(amount * 0.5);
        
        fees.push({
            id: String(i),
            studentId: String(Math.floor(Math.random() * 50) + 1),
            studentName: `Student ${Math.floor(Math.random() * 50) + 1}`,
            feeType: feeType,
            amount: amount,
            paidAmount: paid,
            dueAmount: amount - paid,
            dueDate: new Date(2026, 4, 30),
            status: paid >= amount ? 'Paid' : 'Pending',
            paymentMethod: paid > 0 ? ['Online', 'Cash', 'Cheque', 'UPI'][Math.floor(Math.random() * 4)] : 'Not Paid',
            lastPaymentDate: paid > 0 ? new Date(2026, 3, Math.floor(Math.random() * 20) + 1) : null,
            createdAt: new Date(2026, 3, Math.floor(Math.random() * 20) + 1)
        });
    }
    
    return fees;
};

// Update the main demoDataLarge object to include new data
const demoDataLarge_Updated = {
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
    
    students: generateStudents(),
    teachers: generateTeachers(),
    hrEmployees: generateHREmployees(),
    payments: generatePayments(),
    admissions: generateAdmissions(),
    complaints: generateComplaints(),
    homework: generateHomework(),
    examResults: generateExamResults(),
    attendance: generateAttendance(),
    fees: generateFeeRecords(),
    
    classes: [
        { id: '1', sclassName: '11th Science', collegeId: 'demo-college-001', classTeacherId: '1', studentCount: 32 },
        { id: '2', sclassName: '11th Commerce', collegeId: 'demo-college-001', classTeacherId: '2', studentCount: 28 },
        { id: '3', sclassName: '11th Arts', collegeId: 'demo-college-001', classTeacherId: '3', studentCount: 24 },
        { id: '4', sclassName: '12th Science', collegeId: 'demo-college-001', classTeacherId: '4', studentCount: 30 },
        { id: '5', sclassName: '12th Commerce', collegeId: 'demo-college-001', classTeacherId: '5', studentCount: 26 },
        { id: '6', sclassName: '12th Arts', collegeId: 'demo-college-001', classTeacherId: '6', studentCount: 22 },
        { id: '7', sclassName: '10th Grade', collegeId: 'demo-college-001', classTeacherId: '7', studentCount: 35 },
        { id: '8', sclassName: '9th Grade', collegeId: 'demo-college-001', classTeacherId: '8', studentCount: 33 }
    ],
    
    subjects: [
        { id: '1', subName: 'Mathematics', subCode: 'MATH101', maxMarks: 100, sclassId: '1', teacherId: '1' },
        { id: '2', subName: 'Physics', subCode: 'PHY101', maxMarks: 100, sclassId: '1', teacherId: '2' },
        { id: '3', subName: 'Chemistry', subCode: 'CHEM101', maxMarks: 100, sclassId: '1', teacherId: '3' },
        { id: '4', subName: 'Biology', subCode: 'BIO101', maxMarks: 100, sclassId: '1', teacherId: '4' },
        { id: '5', subName: 'English', subCode: 'ENG101', maxMarks: 100, sclassId: '1', teacherId: '5' },
        { id: '6', subName: 'Computer Science', subCode: 'CS101', maxMarks: 100, sclassId: '1', teacherId: '6' },
        { id: '7', subName: 'Economics', subCode: 'ECO101', maxMarks: 100, sclassId: '2', teacherId: '7' },
        { id: '8', subName: 'Accountancy', subCode: 'ACC101', maxMarks: 100, sclassId: '2', teacherId: '11' },
        { id: '9', subName: 'Business Studies', subCode: 'BUS101', maxMarks: 100, sclassId: '2', teacherId: '12' },
        { id: '10', subName: 'History', subCode: 'HIS101', maxMarks: 100, sclassId: '3', teacherId: '8' },
        { id: '11', subName: 'Geography', subCode: 'GEO101', maxMarks: 100, sclassId: '3', teacherId: '9' },
        { id: '12', subName: 'Political Science', subCode: 'POL101', maxMarks: 100, sclassId: '3', teacherId: '10' }
    ],
    
    routes: [
        { id: '1', routeName: 'City Center Route', routeNumber: 'RT001', startPoint: 'College Gate', endPoint: 'City Center', distance: '15 km', estimatedTime: '45 minutes', fee: 2500, isActive: true, stopsCount: 8, createdAt: new Date('2026-01-15') },
        { id: '2', routeName: 'Residential Route', routeNumber: 'RT002', startPoint: 'College Gate', endPoint: 'Green Valley', distance: '12 km', estimatedTime: '35 minutes', fee: 2200, isActive: true, stopsCount: 6, createdAt: new Date('2026-01-20') },
        { id: '3', routeName: 'Tech Park Route', routeNumber: 'RT003', startPoint: 'College Gate', endPoint: 'Tech Park', distance: '18 km', estimatedTime: '55 minutes', fee: 2800, isActive: true, stopsCount: 10, createdAt: new Date('2026-02-01') },
        { id: '4', routeName: 'Airport Express', routeNumber: 'RT004', startPoint: 'College Gate', endPoint: 'Airport Terminal', distance: '25 km', estimatedTime: '70 minutes', fee: 3500, isActive: true, stopsCount: 12, createdAt: new Date('2026-02-10') },
        { id: '5', routeName: 'Mall Circuit', routeNumber: 'RT005', startPoint: 'College Gate', endPoint: 'Shopping Mall', distance: '8 km', estimatedTime: '25 minutes', fee: 2000, isActive: true, stopsCount: 5, createdAt: new Date('2026-02-15') }
    ],
    
    buses: [
        { id: '1', busNumber: 'BUS001', registrationNo: 'KA01AB1234', capacity: 45, routeId: '1', driverName: 'Rajesh Kumar', driverPhone: '9876543210', status: 'active', createdAt: new Date('2026-01-15') },
        { id: '2', busNumber: 'BUS002', registrationNo: 'KA01AB1235', capacity: 45, routeId: '1', driverName: 'Suresh Patel', driverPhone: '9876543211', status: 'active', createdAt: new Date('2026-01-20') },
        { id: '3', busNumber: 'BUS003', registrationNo: 'KA01AB1236', capacity: 45, routeId: '2', driverName: 'Mahesh Singh', driverPhone: '9876543212', status: 'active', createdAt: new Date('2026-01-25') },
        { id: '4', busNumber: 'BUS004', registrationNo: 'KA01AB1237', capacity: 50, routeId: '3', driverName: 'Vikram Rao', driverPhone: '9876543213', status: 'active', createdAt: new Date('2026-02-01') },
        { id: '5', busNumber: 'BUS005', registrationNo: 'KA01AB1238', capacity: 50, routeId: '3', driverName: 'Anil Kumar', driverPhone: '9876543214', status: 'maintenance', createdAt: new Date('2026-02-05') },
        { id: '6', busNumber: 'BUS006', registrationNo: 'KA01AB1239', capacity: 55, routeId: '4', driverName: 'Ravi Sharma', driverPhone: '9876543215', status: 'active', createdAt: new Date('2026-02-10') },
        { id: '7', busNumber: 'BUS007', registrationNo: 'KA01AB1240', capacity: 40, routeId: '5', driverName: 'Deepak Gupta', driverPhone: '9876543216', status: 'active', createdAt: new Date('2026-02-15') }
    ],
    
    notices: [
        { id: '1', title: 'Annual Sports Day - May 15th', description: 'Sports day celebration for all students. Participation is mandatory.', category: 'Events', priority: 'high', publishedDate: new Date('2026-04-20'), isActive: true, createdAt: new Date('2026-04-20') },
        { id: '2', title: 'Mid-term Exams Schedule', description: 'Exam schedule has been released. Check your dashboard for details.', category: 'Academic', priority: 'high', publishedDate: new Date('2026-04-18'), isActive: true, createdAt: new Date('2026-04-18') },
        { id: '3', title: 'Parent-Teacher Meeting', description: 'PTM scheduled for April 25th at 10:00 AM', category: 'Meeting', priority: 'normal', publishedDate: new Date('2026-04-15'), isActive: true, createdAt: new Date('2026-04-15') },
        { id: '4', title: 'Library New Books', description: 'New collection of science and literature books available', category: 'Library', priority: 'normal', publishedDate: new Date('2026-04-12'), isActive: true, createdAt: new Date('2026-04-12') },
        { id: '5', title: 'Fee Payment Reminder', description: 'Please pay pending fees by April 30th to avoid late charges', category: 'Finance', priority: 'high', publishedDate: new Date('2026-04-10'), isActive: true, createdAt: new Date('2026-04-10') }
    ]
};

module.exports = {
    demoDataLarge: demoDataLarge_Updated,
    generateStudents,
    generateTeachers,
    generateHREmployees,
    generatePayments,
    generateAdmissions,
    generateComplaints,
    generateHomework,
    generateExamResults,
    generateAttendance,
    generateFeeRecords
};
