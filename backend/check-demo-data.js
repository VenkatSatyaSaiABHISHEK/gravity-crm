const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDemoData() {
  try {
    console.log('🔍 Checking current demo data...\n');

    const college = await prisma.college.findFirst();
    if (!college) {
      console.log('❌ No college found');
      return;
    }

    console.log(`🏫 College: ${college.name}`);
    console.log(`📧 Email: ${college.email}\n`);

    // Count all data
    const counts = {
      students: await prisma.student.count({ where: { collegeId: college.id } }),
      teachers: await prisma.teacher.count({ where: { collegeId: college.id } }),
      parents: await prisma.parent.count({ where: { collegeId: college.id } }),
      classes: await prisma.sclass.count({ where: { collegeId: college.id } }),
      sections: await prisma.section.count({ where: { collegeId: college.id } }),
      subjects: await prisma.subject.count({ where: { collegeId: college.id } }),
      exams: await prisma.exam.count({ where: { collegeId: college.id } }),
      fees: await prisma.fee.count({ where: { collegeId: college.id } }),
      payments: await prisma.payment.count({ where: { collegeId: college.id } }),
      attendance: await prisma.attendance.count({ where: { collegeId: college.id } }),
      homework: await prisma.homework.count({ where: { collegeId: college.id } }),
      examResults: await prisma.examResult.count({ where: { collegeId: college.id } }),
    };

    console.log('📊 Current Data Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    Object.entries(counts).forEach(([key, count]) => {
      console.log(`✅ ${key.charAt(0).toUpperCase() + key.slice(1)}: ${count}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Show sample login credentials
    console.log('🔑 Available Login Credentials (Password: Demo@123):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Get sample users
    const admins = await prisma.admin.findMany({ where: { collegeId: college.id }, take: 3 });
    const teachers = await prisma.teacher.findMany({ where: { collegeId: college.id }, take: 5 });
    const students = await prisma.student.findMany({ where: { collegeId: college.id }, take: 10 });
    const parents = await prisma.parent.findMany({ where: { collegeId: college.id }, take: 5 });

    console.log('\n👨‍💼 Admins:');
    admins.forEach(admin => console.log(`   📧 ${admin.email} - ${admin.name}`));

    console.log('\n👩‍🏫 Teachers:');
    teachers.forEach(teacher => console.log(`   📧 ${teacher.email} - ${teacher.name}`));

    console.log('\n👨‍🎓 Students:');
    students.forEach(student => console.log(`   📧 ${student.email} - ${student.name} (${student.studentId})`));

    console.log('\n👨‍👩‍👧‍👦 Parents:');
    parents.forEach(parent => console.log(`   📧 ${parent.email} - ${parent.name}`));

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 Your demo is ready! Access at: http://localhost:3000');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDemoData();