const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function finalDemoDataFix() {
  try {
    console.log('🔧 Final demo data fix for empty pages...\n');

    const college = await prisma.college.findFirst();
    if (!college) {
      console.log('❌ No college found');
      return;
    }

    const hashedPassword = await bcrypt.hash('Demo@123', 10);

    // 1. ENSURE TRANSPORT DATA EXISTS
    console.log('🚌 Ensuring Transport Data...');
    
    // Check and create routes
    const routeCount = await prisma.busRoute.count({ where: { collegeId: college.id } });
    if (routeCount === 0) {
      const routes = [
        { name: 'City Center Route', number: 'RT001', start: 'College Gate', end: 'City Center', fee: 2500 },
        { name: 'Residential Route', number: 'RT002', start: 'College Gate', end: 'Green Valley', fee: 2200 },
        { name: 'Tech Park Route', number: 'RT003', start: 'College Gate', end: 'Tech Park', fee: 2800 }
      ];

      for (const route of routes) {
        await prisma.busRoute.create({
          data: {
            routeName: route.name,
            routeNumber: route.number,
            startPoint: route.start,
            endPoint: route.end,
            distance: 15.5,
            estimatedTime: '45 mins',
            stopsCount: 8,
            fee: route.fee,
            collegeId: college.id,
          },
        });
      }
      console.log('✅ Transport routes created');
    }

    // 2. ENSURE NOTICES EXIST
    console.log('📢 Ensuring Notices...');
    const noticeCount = await prisma.notice.count({ where: { collegeId: college.id } });
    if (noticeCount === 0) {
      const notices = [
        { title: 'Annual Sports Day - May 15th', description: 'Sports day celebration', category: 'Events' },
        { title: 'Mid-term Exams Schedule', description: 'Exam schedule released', category: 'Academic' },
        { title: 'Parent-Teacher Meeting', description: 'PTM on April 25th', category: 'Meeting' },
        { title: 'Library New Books', description: 'New books available', category: 'Library' },
        { title: 'Fee Payment Reminder', description: 'Pay fees by April 30th', category: 'Finance' }
      ];

      for (const notice of notices) {
        await prisma.notice.create({
          data: {
            title: notice.title,
            description: notice.description,
            category: notice.category,
            priority: 'normal',
            collegeId: college.id,
          },
        });
      }
      console.log('✅ Notices created');
    }

    // 3. ENSURE COMPLAINTS EXIST
    console.log('📋 Ensuring Complaints...');
    const complaintCount = await prisma.complain.count({ where: { collegeId: college.id } });
    if (complaintCount === 0) {
      const students = await prisma.student.findMany({ where: { collegeId: college.id }, take: 3 });
      if (students.length > 0) {
        const complaints = [
          { title: 'AC not working', description: 'Classroom AC issue', category: 'Infrastructure' },
          { title: 'Library book missing', description: 'Cannot find book', category: 'Library' },
          { title: 'Canteen food quality', description: 'Food quality concern', category: 'Canteen' }
        ];

        for (let i = 0; i < complaints.length && i < students.length; i++) {
          await prisma.complain.create({
            data: {
              title: complaints[i].title,
              description: complaints[i].description,
              category: complaints[i].category,
              status: 'pending',
              studentId: students[i].id,
              collegeId: college.id,
            },
          });
        }
        console.log('✅ Complaints created');
      }
    }

    // 4. ENSURE ADMISSIONS EXIST
    console.log('📝 Ensuring Admissions...');
    const admissionCount = await prisma.admission.count({ where: { collegeId: college.id } });
    if (admissionCount === 0) {
      const admissions = [
        { name: 'Aarav Mehta', phone: '9888888801', course: '11th Science', status: 'pending' },
        { name: 'Diya Sharma', phone: '9888888802', course: '11th Commerce', status: 'approved' },
        { name: 'Vihaan Gupta', phone: '9888888803', course: '12th Science', status: 'rejected' }
      ];

      for (let i = 0; i < admissions.length; i++) {
        const admission = admissions[i];
        await prisma.admission.create({
          data: {
            admissionNumber: `ADM2026${(i + 1).toString().padStart(3, '0')}`,
            applicantName: admission.name,
            applicantEmail: `${admission.name.toLowerCase().replace(' ', '.')}@admission.com`,
            applicantPhone: admission.phone,
            dateOfBirth: new Date(2008, 5, 15),
            gender: i % 2 === 0 ? 'Male' : 'Female',
            fatherName: `Mr. ${admission.name.split(' ')[1]}`,
            motherName: `Mrs. ${admission.name.split(' ')[1]}`,
            address: `${i + 1}, Demo Street, City`,
            status: admission.status,
            appliedFor: admission.course,
            collegeId: college.id,
          },
        });
      }
      console.log('✅ Admissions created');
    }

    // 5. ENSURE MORE PAYMENT RECORDS
    console.log('💳 Ensuring Payment Records...');
    const paymentCount = await prisma.payment.count({ where: { collegeId: college.id } });
    if (paymentCount < 10) {
      const fees = await prisma.fee.findMany({ where: { collegeId: college.id }, take: 10 });
      
      for (const fee of fees) {
        const existing = await prisma.payment.findFirst({ where: { feeId: fee.id } });
        if (!existing) {
          await prisma.payment.create({
            data: {
              transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
              paymentMethod: ['Online', 'Cash', 'Cheque'][Math.floor(Math.random() * 3)],
              amount: fee.amount,
              status: 'Completed',
              paymentDate: new Date(),
              receiptNumber: `RCP${Math.floor(Math.random() * 10000)}`,
              studentId: fee.studentId,
              feeId: fee.id,
              collegeId: college.id,
            },
          });
        }
      }
      console.log('✅ Payment records ensured');
    }

    // 6. CREATE TEAM MEMBERS FOR DIFFERENT MODULES
    console.log('👥 Ensuring Team Members...');
    
    // Transport Team
    const transportTeamCount = await prisma.transportTeam.count({ where: { collegeId: college.id } });
    if (transportTeamCount === 0) {
      const transportUser = await prisma.user.create({
        data: {
          email: 'transport@demo.com',
          password: hashedPassword,
          name: 'Transport Manager',
          phone: '9444444444',
          role: 'TransportTeam',
          collegeId: college.id,
        },
      });

      await prisma.transportTeam.create({
        data: {
          name: 'Transport Manager',
          email: 'transport@demo.com',
          designation: 'Transport Manager',
          collegeId: college.id,
          userId: transportUser.id,
        },
      });
      console.log('✅ Transport team created');
    }

    // Accounts Team
    const accountsTeamCount = await prisma.accountsTeam.count({ where: { collegeId: college.id } });
    if (accountsTeamCount === 0) {
      const accountsUser = await prisma.user.create({
        data: {
          email: 'accounts@demo.com',
          password: hashedPassword,
          name: 'Accounts Manager',
          phone: '9555555555',
          role: 'AccountsTeam',
          collegeId: college.id,
        },
      });

      await prisma.accountsTeam.create({
        data: {
          name: 'Accounts Manager',
          email: 'accounts@demo.com',
          designation: 'Accounts Manager',
          collegeId: college.id,
          userId: accountsUser.id,
        },
      });
      console.log('✅ Accounts team created');
    }

    // HR Team
    const hrTeamCount = await prisma.hRManager.count({ where: { collegeId: college.id } });
    if (hrTeamCount === 0) {
      const hrUser = await prisma.user.create({
        data: {
          email: 'hr@demo.com',
          password: hashedPassword,
          name: 'HR Manager',
          phone: '9666666666',
          role: 'HRTeam',
          collegeId: college.id,
        },
      });

      await prisma.hRManager.create({
        data: {
          name: 'HR Manager',
          email: 'hr@demo.com',
          department: 'Human Resources',
          designation: 'HR Manager',
          collegeId: college.id,
          userId: hrUser.id,
        },
      });
      console.log('✅ HR team created');
    }

    console.log('\n✅ Final demo data fix completed!\n');
    console.log('🎯 All pages now have data:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚌 Transport: Routes and team members');
    console.log('📢 Notices: Important announcements');
    console.log('📋 Complaints: Student feedback system');
    console.log('📝 Admissions: Application management');
    console.log('💳 Payments: Transaction records');
    console.log('👥 Teams: All module team members');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🚀 Demo is ready with login credentials:');
    console.log('Admin: admin@demo.com');
    console.log('Transport: transport@demo.com');
    console.log('Accounts: accounts@demo.com');
    console.log('HR: hr@demo.com');
    console.log('Password for all: Demo@123');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

finalDemoDataFix();