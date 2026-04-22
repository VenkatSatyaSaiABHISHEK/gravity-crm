const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createMissingModuleData() {
  try {
    console.log('🚀 Creating data for empty/missing modules...\n');

    const college = await prisma.college.findFirst();
    if (!college) {
      console.log('❌ No college found');
      return;
    }

    const hashedPassword = await bcrypt.hash('Demo@123', 10);

    // 1. CREATE TRANSPORT MODULE DATA
    console.log('🚌 Creating Transport Module Data...');
    
    // Create Bus Routes
    const routeData = [
      { name: 'Route A - City Center', number: 'RT001', start: 'Main Gate', end: 'City Center', distance: 15.5, fee: 2500 },
      { name: 'Route B - Residential Area', number: 'RT002', start: 'Main Gate', end: 'Green Valley', distance: 12.3, fee: 2200 },
      { name: 'Route C - Industrial Zone', number: 'RT003', start: 'Main Gate', end: 'Tech Park', distance: 18.7, fee: 2800 },
      { name: 'Route D - Suburbs', number: 'RT004', start: 'Main Gate', end: 'Hillside', distance: 22.1, fee: 3200 },
      { name: 'Route E - Downtown', number: 'RT005', start: 'Main Gate', end: 'Downtown Plaza', distance: 8.9, fee: 1800 }
    ];

    const routes = [];
    for (const route of routeData) {
      const existing = await prisma.busRoute.findFirst({ where: { routeNumber: route.number } });
      if (!existing) {
        const newRoute = await prisma.busRoute.create({
          data: {
            routeName: route.name,
            routeNumber: route.number,
            startPoint: route.start,
            endPoint: route.end,
            distance: route.distance,
            estimatedTime: '45 mins',
            stopsCount: Math.floor(Math.random() * 8) + 5,
            fee: route.fee,
            description: `Regular bus service from ${route.start} to ${route.end}`,
            collegeId: college.id,
          },
        });
        routes.push(newRoute);
      }
    }

    // Create Buses
    const busData = [
      { number: 'BUS001', reg: 'KA01AB1234', driver: 'Rajesh Kumar', phone: '9876543210' },
      { number: 'BUS002', reg: 'KA01AB1235', driver: 'Suresh Patel', phone: '9876543211' },
      { number: 'BUS003', reg: 'KA01AB1236', driver: 'Mahesh Singh', phone: '9876543212' },
      { number: 'BUS004', reg: 'KA01AB1237', driver: 'Ramesh Gupta', phone: '9876543213' },
      { number: 'BUS005', reg: 'KA01AB1238', driver: 'Dinesh Sharma', phone: '9876543214' }
    ];

    for (let i = 0; i < busData.length && i < routes.length; i++) {
      const bus = busData[i];
      const existing = await prisma.bus.findFirst({ where: { busNumber: bus.number } });
      if (!existing) {
        await prisma.bus.create({
          data: {
            busNumber: bus.number,
            regNumber: bus.reg,
            capacity: 45,
            driverName: bus.driver,
            driverPhone: bus.phone,
            driverLicense: `DL${Math.floor(Math.random() * 100000)}`,
            conductorName: `Conductor ${i + 1}`,
            conductorPhone: `987654321${i}`,
            gpsDeviceId: `GPS${bus.number}`,
            status: 'active',
            lastServiceDate: new Date(2026, 2, Math.floor(Math.random() * 28) + 1),
            nextServiceDate: new Date(2026, 5, Math.floor(Math.random() * 28) + 1),
            collegeId: college.id,
            routeId: routes[i].id,
          },
        });
      }
    }

    // Create Transport Fees
    for (const route of routes) {
      const existing = await prisma.transportFee.findFirst({ where: { routeId: route.id } });
      if (!existing) {
        await prisma.transportFee.create({
          data: {
            amount: route.fee,
            frequency: 'monthly',
            dueDate: new Date(2026, 4, 15),
            discountPercent: 10,
            description: `Monthly transport fee for ${route.routeName}`,
            routeId: route.id,
            collegeId: college.id,
          },
        });
      }
    }

    // Create Transport Team
    const transportTeamData = [
      { name: 'Mr. Anil Transport Manager', email: 'anil.transport@demo.com', designation: 'Transport Manager' },
      { name: 'Ms. Sunita Route Coordinator', email: 'sunita.transport@demo.com', designation: 'Route Coordinator' }
    ];

    for (const member of transportTeamData) {
      const existingUser = await prisma.user.findFirst({ where: { email: member.email } });
      if (!existingUser) {
        const transportUser = await prisma.user.create({
          data: {
            email: member.email,
            password: hashedPassword,
            name: member.name,
            phone: `944444${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            role: 'Transport',
            collegeId: college.id,
          },
        });

        await prisma.transportTeam.create({
          data: {
            name: member.name,
            email: member.email,
            designation: member.designation,
            collegeId: college.id,
            userId: transportUser.id,
          },
        });
      }
    }

    // 2. CREATE HR MODULE DATA
    console.log('👥 Creating HR Module Data...');

    // Create HR Managers
    const hrManagerData = [
      { name: 'Ms. Priya HR Manager', email: 'priya.hr@demo.com', department: 'Human Resources' },
      { name: 'Mr. Rohit HR Executive', email: 'rohit.hr@demo.com', department: 'Human Resources' }
    ];

    const hrManagers = [];
    for (const hr of hrManagerData) {
      const existingUser = await prisma.user.findFirst({ where: { email: hr.email } });
      if (!existingUser) {
        const hrUser = await prisma.user.create({
          data: {
            email: hr.email,
            password: hashedPassword,
            name: hr.name,
            phone: `955555${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            role: 'HR',
            collegeId: college.id,
          },
        });

        const hrManager = await prisma.hRManager.create({
          data: {
            name: hr.name,
            email: hr.email,
            department: hr.department,
            designation: 'HR Manager',
            collegeId: college.id,
            userId: hrUser.id,
          },
        });
        hrManagers.push(hrManager);
      }
    }

    // Create Employees
    const employeeData = [
      { name: 'Mr. Kiran Accountant', email: 'kiran.accounts@demo.com', dept: 'Accounts', designation: 'Senior Accountant', salary: 45000 },
      { name: 'Ms. Meera Librarian', email: 'meera.library@demo.com', dept: 'Library', designation: 'Head Librarian', salary: 35000 },
      { name: 'Mr. Sunil IT Support', email: 'sunil.it@demo.com', dept: 'IT', designation: 'IT Executive', salary: 40000 },
      { name: 'Ms. Kavya Admin', email: 'kavya.admin@demo.com', dept: 'Administration', designation: 'Admin Officer', salary: 38000 },
      { name: 'Mr. Deepak Security', email: 'deepak.security@demo.com', dept: 'Security', designation: 'Security Head', salary: 32000 },
      { name: 'Ms. Anjali Receptionist', email: 'anjali.reception@demo.com', dept: 'Administration', designation: 'Receptionist', salary: 25000 },
      { name: 'Mr. Ravi Maintenance', email: 'ravi.maintenance@demo.com', dept: 'Maintenance', designation: 'Maintenance Head', salary: 30000 },
      { name: 'Ms. Pooja Nurse', email: 'pooja.medical@demo.com', dept: 'Medical', designation: 'School Nurse', salary: 35000 }
    ];

    if (hrManagers.length > 0) {
      for (let i = 0; i < employeeData.length; i++) {
        const emp = employeeData[i];
        const existing = await prisma.employee.findFirst({ 
          where: { email: emp.email, collegeId: college.id } 
        });
        
        if (!existing) {
          await prisma.employee.create({
            data: {
              name: emp.name,
              email: emp.email,
              phone: `966666${(i + 1).toString().padStart(4, '0')}`,
              employeeId: `EMP${(i + 1).toString().padStart(3, '0')}`,
              department: emp.dept,
              designation: emp.designation,
              dateOfJoining: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
              dateOfBirth: new Date(1985 + Math.floor(Math.random() * 15), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
              gender: i % 2 === 0 ? 'Male' : 'Female',
              qualification: ['B.Com', 'M.Com', 'BCA', 'MCA', 'B.A', 'M.A'][Math.floor(Math.random() * 6)],
              experience: Math.floor(Math.random() * 10) + 2,
              salary: emp.salary,
              bankAccount: `123456789${i}`,
              bankName: 'Demo Bank',
              ifscCode: 'DEMO0001234',
              address: `${i + 1}, Employee Colony, City`,
              status: 'Active',
              collegeId: college.id,
              hrManagerId: hrManagers[0].id,
            },
          });
        }
      }
    }

    // Create Employee Attendance (last 30 days)
    const employees = await prisma.employee.findMany({ where: { collegeId: college.id } });
    const today = new Date();
    
    for (let day = 0; day < 30; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - day);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      for (const employee of employees) {
        const existing = await prisma.employeeAttendance.findFirst({
          where: { 
            employeeId: employee.id, 
            date: {
              gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
              lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
            }
          }
        });
        
        if (!existing) {
          await prisma.employeeAttendance.create({
            data: {
              date,
              status: Math.random() > 0.1 ? 'Present' : 'Absent',
              leaveType: Math.random() > 0.9 ? 'Sick Leave' : null,
              remarks: Math.random() > 0.8 ? 'Late arrival' : null,
              employeeId: employee.id,
              collegeId: college.id,
            },
          });
        }
      }
    }

    // Create Employee Salaries
    const months = ['January', 'February', 'March', 'April'];
    for (const employee of employees) {
      for (const month of months) {
        const existing = await prisma.employeeSalary.findFirst({
          where: { employeeId: employee.id, month, year: 2026 }
        });
        
        if (!existing) {
          const baseSalary = employee.salary;
          const allowances = baseSalary * 0.2;
          const deductions = baseSalary * 0.1;
          
          await prisma.employeeSalary.create({
            data: {
              month,
              year: 2026,
              baseSalary,
              allowances,
              deductions,
              netSalary: baseSalary + allowances - deductions,
              workingDays: 30,
              attendedDays: Math.floor(Math.random() * 5) + 25,
              status: Math.random() > 0.3 ? 'Paid' : 'Pending',
              employeeId: employee.id,
              collegeId: college.id,
            },
          });
        }
      }
    }

    // 3. CREATE ADMISSION MODULE DATA
    console.log('📝 Creating Admission Module Data...');

    // Create Admission Team
    const admissionTeamData = [
      { name: 'Ms. Rekha Admission Officer', email: 'rekha.admission@demo.com', designation: 'Admission Officer' },
      { name: 'Mr. Vinod Admission Coordinator', email: 'vinod.admission@demo.com', designation: 'Admission Coordinator' }
    ];

    const admissionTeam = [];
    for (const member of admissionTeamData) {
      const existingUser = await prisma.user.findFirst({ where: { email: member.email } });
      if (!existingUser) {
        const admissionUser = await prisma.user.create({
          data: {
            email: member.email,
            password: hashedPassword,
            name: member.name,
            phone: `977777${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            role: 'Admission',
            collegeId: college.id,
          },
        });

        const admissionMember = await prisma.admissionTeam.create({
          data: {
            name: member.name,
            email: member.email,
            designation: member.designation,
            collegeId: college.id,
            userId: admissionUser.id,
          },
        });
        admissionTeam.push(admissionMember);
      }
    }

    // Create Admission Applications
    const admissionData = [
      { name: 'Aarav Mehta', email: 'aarav.mehta@admission.com', phone: '9888888801', course: '11th Science', status: 'pending' },
      { name: 'Diya Sharma', email: 'diya.sharma@admission.com', phone: '9888888802', course: '11th Commerce', status: 'approved' },
      { name: 'Vihaan Gupta', email: 'vihaan.gupta@admission.com', phone: '9888888803', course: '12th Science', status: 'rejected' },
      { name: 'Ananya Singh', email: 'ananya.singh@admission.com', phone: '9888888804', course: '10th Grade', status: 'pending' },
      { name: 'Arjun Patel', email: 'arjun.patel@admission.com', phone: '9888888805', course: '11th Science', status: 'approved' },
      { name: 'Kavya Reddy', email: 'kavya.reddy@admission.com', phone: '9888888806', course: '12th Commerce', status: 'pending' },
      { name: 'Ishaan Kumar', email: 'ishaan.kumar@admission.com', phone: '9888888807', course: '11th Science', status: 'approved' },
      { name: 'Myra Joshi', email: 'myra.joshi@admission.com', phone: '9888888808', course: '10th Grade', status: 'pending' }
    ];

    for (let i = 0; i < admissionData.length; i++) {
      const admission = admissionData[i];
      const admissionNumber = `ADM2026${(i + 1).toString().padStart(3, '0')}`;
      
      const existing = await prisma.admission.findFirst({
        where: { admissionNumber }
      });
      
      if (!existing) {
        await prisma.admission.create({
          data: {
            admissionNumber,
            applicantName: admission.name,
            applicantEmail: admission.email,
            applicantPhone: admission.phone,
            dateOfBirth: new Date(2008, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            gender: i % 2 === 0 ? 'Male' : 'Female',
            fatherName: `Mr. ${admission.name.split(' ')[1]}`,
            motherName: `Mrs. ${admission.name.split(' ')[1]}`,
            address: `${i + 1}, Admission Street, City`,
            previousSchool: `Previous School ${i + 1}`,
            previousGrade: '9th Grade',
            status: admission.status,
            appliedFor: admission.course,
            appliedDate: new Date(2026, Math.floor(Math.random() * 4), Math.floor(Math.random() * 28) + 1),
            approvedDate: admission.status === 'approved' ? new Date() : null,
            rejectionReason: admission.status === 'rejected' ? 'Insufficient marks' : null,
            comments: `Application for ${admission.course}`,
            collegeId: college.id,
            admissionTeamId: admissionTeam.length > 0 ? admissionTeam[0].id : null,
          },
        });
      }
    }

    // 4. CREATE ACCOUNTS MODULE DATA
    console.log('💰 Creating Accounts Module Data...');

    // Create Accounts Team
    const accountsTeamData = [
      { name: 'Mr. Suresh Accounts Manager', email: 'suresh.accounts@demo.com', designation: 'Accounts Manager' },
      { name: 'Ms. Priya Accounts Executive', email: 'priya.accounts@demo.com', designation: 'Accounts Executive' }
    ];

    for (const member of accountsTeamData) {
      const existingUser = await prisma.user.findFirst({ where: { email: member.email } });
      if (!existingUser) {
        const accountsUser = await prisma.user.create({
          data: {
            email: member.email,
            password: hashedPassword,
            name: member.name,
            phone: `988888${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            role: 'Accounts',
            collegeId: college.id,
          },
        });

        await prisma.accountsTeam.create({
          data: {
            name: member.name,
            email: member.email,
            designation: member.designation,
            collegeId: college.id,
            userId: accountsUser.id,
          },
        });
      }
    }

    // 5. CREATE NOTICES
    console.log('📢 Creating Notices...');
    const noticeData = [
      { title: 'Annual Sports Day', description: 'Annual sports day will be held on May 15th, 2026', category: 'Events' },
      { title: 'Mid-term Exam Schedule', description: 'Mid-term examinations will commence from April 20th', category: 'Academic' },
      { title: 'Parent-Teacher Meeting', description: 'PTM scheduled for all classes on April 25th', category: 'Meeting' },
      { title: 'Library New Books', description: 'New collection of books added to the library', category: 'Library' },
      { title: 'Fee Payment Reminder', description: 'Last date for fee payment is April 30th', category: 'Finance' },
      { title: 'Science Exhibition', description: 'Inter-school science exhibition on May 5th', category: 'Events' },
      { title: 'Holiday Notice', description: 'School will remain closed on May 1st for Labor Day', category: 'Holiday' }
    ];

    for (const notice of noticeData) {
      const existing = await prisma.notice.findFirst({
        where: { title: notice.title, collegeId: college.id }
      });
      
      if (!existing) {
        await prisma.notice.create({
          data: {
            title: notice.title,
            description: notice.description,
            details: `Detailed information about ${notice.title.toLowerCase()}. Please check with the administration for more details.`,
            category: notice.category,
            priority: Math.random() > 0.7 ? 'high' : 'normal',
            publishedDate: new Date(2026, Math.floor(Math.random() * 4), Math.floor(Math.random() * 28) + 1),
            collegeId: college.id,
            createdBy: 'Admin',
          },
        });
      }
    }

    // 6. CREATE COMPLAINTS
    console.log('📋 Creating Complaints...');
    const students = await prisma.student.findMany({ where: { collegeId: college.id } });
    const teachers = await prisma.teacher.findMany({ where: { collegeId: college.id } });
    const parents = await prisma.parent.findMany({ where: { collegeId: college.id } });

    const complaintData = [
      { title: 'Classroom AC not working', description: 'The air conditioning in classroom 101 is not functioning properly', category: 'Infrastructure' },
      { title: 'Library book missing', description: 'Unable to find the requested book in the library', category: 'Library' },
      { title: 'Canteen food quality', description: 'Food quality in canteen needs improvement', category: 'Canteen' },
      { title: 'Transport delay', description: 'Bus is frequently late on Route A', category: 'Transport' },
      { title: 'Homework overload', description: 'Too much homework assigned in mathematics', category: 'Academic' }
    ];

    for (let i = 0; i < complaintData.length; i++) {
      const complaint = complaintData[i];
      const existing = await prisma.complain.findFirst({
        where: { title: complaint.title, collegeId: college.id }
      });
      
      if (!existing && students.length > 0) {
        await prisma.complain.create({
          data: {
            title: complaint.title,
            description: complaint.description,
            category: complaint.category,
            status: ['pending', 'in-progress', 'resolved'][Math.floor(Math.random() * 3)],
            priority: Math.random() > 0.6 ? 'high' : 'normal',
            studentId: students[i % students.length].id,
            collegeId: college.id,
          },
        });
      }
    }

    console.log('\n✅ Missing module data creation completed!\n');
    console.log('📊 New modules now have demo data:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚌 Transport: Routes, Buses, Fees, Team');
    console.log('👥 HR: Managers, Employees, Attendance, Salaries');
    console.log('📝 Admissions: Team, Applications, Status tracking');
    console.log('💰 Accounts: Team members and financial management');
    console.log('📢 Notices: Important announcements and updates');
    console.log('📋 Complaints: Student/parent feedback system');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎯 All pages now have comprehensive demo data!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createMissingModuleData();