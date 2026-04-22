const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function addPageSpecificData() {
  try {
    console.log('🎯 Adding page-specific demo data...\n');

    const college = await prisma.college.findFirst();
    if (!college) {
      console.log('❌ No college found');
      return;
    }

    const hashedPassword = await bcrypt.hash('Demo@123', 10);

    // 1. Add more students for student list page
    console.log('📚 Adding more students...');
    const moreStudents = [
      'Aarav Sharma', 'Vivaan Gupta', 'Aditya Singh', 'Vihaan Patel', 'Arjun Kumar',
      'Sai Reddy', 'Reyansh Joshi', 'Ayaan Khan', 'Krishna Yadav', 'Ishaan Verma',
      'Aadhya Sharma', 'Diya Gupta', 'Kavya Singh', 'Ananya Patel', 'Ira Kumar',
      'Myra Reddy', 'Larisa Joshi', 'Anika Khan', 'Navya Yadav', 'Kiara Verma'
    ];

    const classes = await prisma.sclass.findMany({ where: { collegeId: college.id } });
    const sections = await prisma.section.findMany({ where: { collegeId: college.id } });

    for (let i = 0; i < moreStudents.length; i++) {
      const name = moreStudents[i];
      const email = `${name.toLowerCase().replace(' ', '.')}@demo.com`;
      
      const existing = await prisma.student.findFirst({ where: { email } });
      if (!existing && classes.length > 0 && sections.length > 0) {
        const studentUser = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            phone: `911${(1000 + i).toString()}`,
            role: 'Student',
            collegeId: college.id,
          },
        });

        await prisma.student.create({
          data: {
            name,
            studentId: `STU${(100 + i).toString()}`,
            email,
            rollNum: 100 + i,
            password: hashedPassword,
            collegeId: college.id,
            userId: studentUser.id,
            sclassId: classes[i % classes.length].id,
            sectionId: sections[i % sections.length].id,
            dateOfBirth: new Date(2008, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            gender: i % 2 === 0 ? 'Male' : 'Female',
            board: 'CBSE',
          },
        });
      }
    }

    // 2. Add fee records for fee management page
    console.log('💰 Adding fee records...');
    const students = await prisma.student.findMany({ where: { collegeId: college.id } });
    const feeTypes = ['Tuition Fee', 'Lab Fee', 'Library Fee', 'Sports Fee', 'Transport Fee'];
    
    for (const student of students.slice(0, 20)) { // First 20 students
      for (const feeType of feeTypes) {
        const existing = await prisma.fee.findFirst({
          where: { studentId: student.id, feeType }
        });
        if (!existing) {
          await prisma.fee.create({
            data: {
              studentId: student.id,
              collegeId: college.id,
              feeType,
              amount: feeType === 'Tuition Fee' ? 50000 : Math.floor(Math.random() * 5000) + 1000,
              dueDate: new Date(2026, Math.floor(Math.random() * 12), 15),
              frequency: 'yearly',
              isActive: true,
            },
          });
        }
      }
    }

    // 3. Add attendance records for attendance page
    console.log('📅 Adding attendance records...');
    const subjects = await prisma.subject.findMany({ where: { collegeId: college.id } });
    const today = new Date();
    
    for (let day = 0; day < 15; day++) { // Last 15 days
      const date = new Date(today);
      date.setDate(date.getDate() - day);
      
      for (const student of students.slice(0, 15)) { // First 15 students
        for (const subject of subjects.slice(0, 3)) { // First 3 subjects
          const existing = await prisma.attendance.findFirst({
            where: { 
              studentId: student.id, 
              subjectId: subject.id,
              date: {
                gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
              }
            }
          });
          
          if (!existing) {
            await prisma.attendance.create({
              data: {
                studentId: student.id,
                subjectId: subject.id,
                collegeId: college.id,
                date,
                status: Math.random() > 0.2 ? 'Present' : 'Absent',
              },
            });
          }
        }
      }
    }

    // 4. Add exam results for results page
    console.log('📊 Adding exam results...');
    const exams = await prisma.exam.findMany({ where: { collegeId: college.id } });
    
    for (const exam of exams) {
      for (const student of students.slice(0, 10)) { // First 10 students
        for (const subject of subjects.slice(0, 5)) { // First 5 subjects
          const existing = await prisma.examResult.findFirst({
            where: { studentId: student.id, subjectId: subject.id, examId: exam.id }
          });
          
          if (!existing) {
            const marksObtained = Math.floor(Math.random() * 40) + 60; // 60-100 marks
            await prisma.examResult.create({
              data: {
                studentId: student.id,
                subjectId: subject.id,
                examId: exam.id,
                collegeId: college.id,
                marksObtained,
                percentage: marksObtained,
                grade: marksObtained >= 90 ? 'A+' : marksObtained >= 80 ? 'A' : marksObtained >= 70 ? 'B' : 'C',
              },
            });
          }
        }
      }
    }

    // 5. Add payment records for payment page
    console.log('💳 Adding payment records...');
    const fees = await prisma.fee.findMany({ where: { collegeId: college.id } });
    
    for (const fee of fees.slice(0, 30)) { // First 30 fees
      const existing = await prisma.payment.findFirst({ where: { feeId: fee.id } });
      if (!existing) {
        await prisma.payment.create({
          data: {
            studentId: fee.studentId,
            feeId: fee.id,
            collegeId: college.id,
            amount: fee.amount,
            paymentDate: new Date(2026, Math.floor(Math.random() * 4), Math.floor(Math.random() * 28) + 1),
            paymentMethod: ['Online', 'Cash', 'Cheque', 'Card'][Math.floor(Math.random() * 4)],
            transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
            status: 'Completed',
          },
        });
      }
    }

    // 6. Add homework for homework page
    console.log('📝 Adding homework assignments...');
    const homeworkTopics = [
      'Mathematics Chapter 5 Problems', 'English Essay Writing', 'Physics Lab Report',
      'Chemistry Equations Practice', 'Biology Diagram Drawing', 'History Timeline Project',
      'Geography Map Work', 'Computer Programming Assignment', 'Economics Case Study',
      'Art Portfolio Submission', 'Physical Education Report', 'Science Project Work'
    ];

    for (const subject of subjects) {
      for (let i = 0; i < 3; i++) { // 3 homework per subject
        const topic = homeworkTopics[Math.floor(Math.random() * homeworkTopics.length)];
        const existing = await prisma.homework.findFirst({
          where: { subjectId: subject.id, title: `${topic} ${i + 1}` }
        });
        
        if (!existing) {
          await prisma.homework.create({
            data: {
              title: `${topic} ${i + 1}`,
              description: `Complete the assigned ${topic.toLowerCase()} and submit before the due date.`,
              subjectId: subject.id,
              collegeId: college.id,
              dueDate: new Date(2026, Math.floor(Math.random() * 6) + 4, Math.floor(Math.random() * 28) + 1),
              assignedDate: new Date(),
            },
          });
        }
      }
    }

    console.log('\n✅ Page-specific demo data added successfully!\n');
    console.log('🎯 Now your frontend pages will have plenty of visible data for demo:\n');
    console.log('📚 Student Management - 20+ students with complete profiles');
    console.log('💰 Fee Management - Multiple fee types for each student');
    console.log('📅 Attendance - 15 days of attendance records');
    console.log('📊 Exam Results - Results for multiple exams and subjects');
    console.log('💳 Payment Records - Transaction history');
    console.log('📝 Homework - Assignments across all subjects');
    console.log('\n🎉 Ready for comprehensive demo presentation!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addPageSpecificData();