const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function quickFillEmptyPages() {
  try {
    console.log('⚡ Quick filling empty pages with demo data...\n');

    const college = await prisma.college.findFirst();
    if (!college) {
      console.log('❌ No college found');
      return;
    }

    const hashedPassword = await bcrypt.hash('Demo@123', 10);

    // 1. NOTICES (for notice board pages)
    console.log('📢 Adding Notices...');
    const notices = [
      'Annual Sports Day - May 15th, 2026',
      'Mid-term Exam Schedule Released',
      'Parent-Teacher Meeting - April 25th',
      'Library New Books Available',
      'Fee Payment Last Date - April 30th',
      'Science Exhibition - May 5th',
      'Holiday Notice - May 1st'
    ];

    for (let i = 0; i < notices.length; i++) {
      const existing = await prisma.notice.findFirst({
        where: { title: notices[i], collegeId: college.id }
      });
      
      if (!existing) {
        await prisma.notice.create({
          data: {
            title: notices[i],
            description: `Important notice about ${notices[i].toLowerCase()}`,
            category: ['Academic', 'Events', 'Finance', 'General'][i % 4],
            priority: i < 2 ? 'high' : 'normal',
            collegeId: college.id,
          },
        });
      }
    }

    // 2. TRANSPORT ROUTES (for transport pages)
    console.log('🚌 Adding Transport Routes...');
    const routes = [
      { name: 'City Center Route', number: 'RT001', fee: 2500 },
      { name: 'Residential Area Route', number: 'RT002', fee: 2200 },
      { name: 'Tech Park Route', number: 'RT003', fee: 2800 }
    ];

    for (const route of routes) {
      const existing = await prisma.busRoute.findFirst({ where: { routeNumber: route.number } });
      if (!existing) {
        await prisma.busRoute.create({
          data: {
            routeName: route.name,
            routeNumber: route.number,
            startPoint: 'College Main Gate',
            endPoint: route.name.split(' ')[0],
            distance: 15.5,
            estimatedTime: '45 mins',
            stopsCount: 8,
            fee: route.fee,
            collegeId: college.id,
          },
        });
      }
    }

    // 3. COMPLAINTS (for complaint pages)
    console.log('📋 Adding Complaints...');
    const students = await prisma.student.findMany({ where: { collegeId: college.id }, take: 5 });
    const complaints = [
      'Classroom AC not working',
      'Library book missing',
      'Canteen food quality issue',
      'Transport delay problem',
      'Homework overload concern'
    ];

    for (let i = 0; i < complaints.length && i < students.length; i++) {
      const existing = await prisma.complain.findFirst({
        where: { title: complaints[i], collegeId: college.id }
      });
      
      if (!existing) {
        await prisma.complain.create({
          data: {
            title: complaints[i],
            description: `Student complaint about ${complaints[i].toLowerCase()}`,
            category: ['Infrastructure', 'Library', 'Canteen', 'Transport', 'Academic'][i],
            status: ['pending', 'resolved'][i % 2],
            studentId: students[i].id,
            collegeId: college.id,
          },
        });
      }
    }

    // 4. ADMISSIONS (for admission pages)
    console.log('📝 Adding Admission Applications...');
    const admissions = [
      { name: 'Aarav Mehta', phone: '9888888801', course: '11th Science', status: 'pending' },
      { name: 'Diya Sharma', phone: '9888888802', course: '11th Commerce', status: 'approved' },
      { name: 'Vihaan Gupta', phone: '9888888803', course: '12th Science', status: 'rejected' }
    ];

    for (let i = 0; i < admissions.length; i++) {
      const admission = admissions[i];
      const admissionNumber = `ADM2026${(i + 1).toString().padStart(3, '0')}`;
      
      const existing = await prisma.admission.findFirst({ where: { admissionNumber } });
      if (!existing) {
        await prisma.admission.create({
          data: {
            admissionNumber,
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
    }

    // 5. MORE PAYMENT RECORDS (for payment history pages)
    console.log('💳 Adding More Payment Records...');
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
            paymentDate: new Date(2026, Math.floor(Math.random() * 4), Math.floor(Math.random() * 28) + 1),
            receiptNumber: `RCP${Math.floor(Math.random() * 10000)}`,
            studentId: fee.studentId,
            feeId: fee.id,
            collegeId: college.id,
          },
        });
      }
    }

    // 6. TEACHER ATTENDANCE (for teacher attendance pages)
    console.log('👩‍🏫 Adding Teacher Attendance...');
    const teachers = await prisma.teacher.findMany({ where: { collegeId: college.id }, take: 5 });
    const today = new Date();
    
    for (let day = 0; day < 10; day++) { // Last 10 days
      const date = new Date(today);
      date.setDate(date.getDate() - day);
      
      for (const teacher of teachers) {
        const existing = await prisma.teacherAttendance.findFirst({
          where: { teacherId: teacher.id, date }
        });
        
        if (!existing) {
          await prisma.teacherAttendance.create({
            data: {
              date,
              status: Math.random() > 0.1 ? 'Present' : 'Absent',
              teacherId: teacher.id,
              collegeId: college.id,
            },
          });
        }
      }
    }

    console.log('\n✅ Quick demo data filling completed!\n');
    console.log('🎯 Pages now filled with data:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📢 Notice Board - 7 notices');
    console.log('🚌 Transport Routes - 3 routes');
    console.log('📋 Complaints - 5 complaints');
    console.log('📝 Admissions - 3 applications');
    console.log('💳 Payment History - 10+ payments');
    console.log('👩‍🏫 Teacher Attendance - 10 days records');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🚀 All empty pages now have visible demo data!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

quickFillEmptyPages();