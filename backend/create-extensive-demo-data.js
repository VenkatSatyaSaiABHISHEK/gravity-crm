const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createExtensiveDemoData() {
  try {
    console.log('🚀 Creating extensive demo data for all pages...\n');

    // Get existing college
    const college = await prisma.college.findFirst();
    if (!college) {
      console.log('❌ No college found. Please run create-demo-data.js first');
      return;
    }

    console.log('✅ Using college:', college.name);

    // Get existing classes and create more if needed
    let classes = await prisma.sclass.findMany({ where: { collegeId: college.id } });
    
    // Add more classes for comprehensive demo
    const additionalClasses = [
      '9th Grade', '11th Science', '11th Commerce', '12th Science', '12th Commerce'
    ];

    for (const className of additionalClasses) {
      const existing = classes.find(c => c.sclassName === className);
      if (!existing) {
        const newClass = await prisma.sclass.create({
          data: { sclassName: className, collegeId: college.id }
        });
        classes.push(newClass);
      }
    }

    // Create more sections
    const sectionNames = ['A', 'B', 'C', 'D'];
    for (const cls of classes) {
      for (const sectionName of sectionNames) {
        const existing = await prisma.section.findFirst({
          where: { sectionName, sclassId: cls.id, collegeId: college.id }
        });
        if (!existing) {
          await prisma.section.create({
            data: { sectionName, sclassId: cls.id, collegeId: college.id }
          });
        }
      }
    }

    // Create comprehensive subjects
    const subjectData = [
      { code: 'ENG101', name: 'English Literature', maxMarks: 100 },
      { code: 'MATH101', name: 'Advanced Mathematics', maxMarks: 100 },
      { code: 'PHY101', name: 'Physics', maxMarks: 100 },
      { code: 'CHEM101', name: 'Chemistry', maxMarks: 100 },
      { code: 'BIO101', name: 'Biology', maxMarks: 100 },
      { code: 'HIST101', name: 'History', maxMarks: 100 },
      { code: 'GEO101', name: 'Geography', maxMarks: 100 },
      { code: 'CS101', name: 'Computer Science', maxMarks: 100 },
      { code: 'ECO101', name: 'Economics', maxMarks: 100 },
      { code: 'ACC101', name: 'Accountancy', maxMarks: 100 },
      { code: 'PE101', name: 'Physical Education', maxMarks: 50 },
      { code: 'ART101', name: 'Fine Arts', maxMarks: 50 }
    ];

    for (const cls of classes) {
      for (const subject of subjectData) {
        const existing = await prisma.subject.findFirst({
          where: { subCode: subject.code, sclassId: cls.id, collegeId: college.id }
        });
        if (!existing) {
          await prisma.subject.create({
            data: {
              subCode: subject.code,
              subName: subject.name,
              sclassId: cls.id,
              collegeId: college.id,
              maxMarks: subject.maxMarks
            }
          });
        }
      }
    }

    // Create many more teachers
    const hashedPassword = await bcrypt.hash('Demo@123', 10);
    const teacherData = [
      { name: 'Dr. Rajesh Sharma', email: 'rajesh@demo.com', specialization: 'Physics', experience: 15 },
      { name: 'Prof. Anita Gupta', email: 'anita@demo.com', specialization: 'Chemistry', experience: 12 },
      { name: 'Mr. Vikram Singh', email: 'vikram@demo.com', specialization: 'Mathematics', experience: 10 },
      { name: 'Ms. Priya Patel', email: 'priya@demo.com', specialization: 'Biology', experience: 8 },
      { name: 'Dr. Suresh Kumar', email: 'suresh@demo.com', specialization: 'English', experience: 20 },
      { name: 'Mrs. Kavita Joshi', email: 'kavita@demo.com', specialization: 'History', experience: 14 },
      { name: 'Mr. Amit Verma', email: 'amit@demo.com', specialization: 'Geography', experience: 9 },
      { name: 'Ms. Neha Agarwal', email: 'neha@demo.com', specialization: 'Computer Science', experience: 6 },
      { name: 'Dr. Ravi Mehta', email: 'ravi@demo.com', specialization: 'Economics', experience: 18 },
      { name: 'Mrs. Sunita Rao', email: 'sunita@demo.com', specialization: 'Accountancy', experience: 11 }
    ];

    for (const teacher of teacherData) {
      const existingUser = await prisma.user.findFirst({ where: { email: teacher.email } });
      if (!existingUser) {
        const teacherUser = await prisma.user.create({
          data: {
            email: teacher.email,
            password: hashedPassword,
            name: teacher.name,
            phone: `987654${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            role: 'Teacher',
            collegeId: college.id,
          },
        });

        await prisma.teacher.create({
          data: {
            name: teacher.name,
            email: teacher.email,
            password: hashedPassword,
            collegeId: college.id,
            userId: teacherUser.id,
            experience: teacher.experience,
            specialization: teacher.specialization,
          },
        });
      }
    }

    // Create many more students (50+ students)
    const studentNames = [
      'Aarav Sharma', 'Vivaan Gupta', 'Aditya Singh', 'Vihaan Patel', 'Arjun Kumar',
      'Sai Reddy', 'Reyansh Joshi', 'Ayaan Khan', 'Krishna Yadav', 'Ishaan Verma',
      'Shaurya Agarwal', 'Atharv Mehta', 'Advik Rao', 'Pranav Nair', 'Arnav Mishra',
      'Aadhya Sharma', 'Diya Gupta', 'Kavya Singh', 'Ananya Patel', 'Ira Kumar',
      'Myra Reddy', 'Larisa Joshi', 'Anika Khan', 'Navya Yadav', 'Kiara Verma',
      'Saanvi Agarwal', 'Avni Mehta', 'Dhriti Rao', 'Anvi Nair', 'Arya Mishra',
      'Kabir Malhotra', 'Shivansh Kapoor', 'Rudra Saxena', 'Kian Bhatt', 'Yug Pandey',
      'Advait Tiwari', 'Veer Chandra', 'Aayansh Dubey', 'Darsh Srivastava', 'Viaan Tripathi',
      'Samaira Malhotra', 'Riya Kapoor', 'Aarohi Saxena', 'Tara Bhatt', 'Zara Pandey',
      'Shanaya Tiwari', 'Myra Chandra', 'Pihu Dubey', 'Avika Srivastava', 'Niyati Tripathi'
    ];

    const sections = await prisma.section.findMany({ where: { collegeId: college.id } });
    
    for (let i = 0; i < studentNames.length; i++) {
      const name = studentNames[i];
      const email = `${name.toLowerCase().replace(' ', '.')}@demo.com`;
      const rollNum = i + 1;
      const section = sections[i % sections.length];
      
      const existingStudent = await prisma.student.findFirst({ 
        where: { email, collegeId: college.id } 
      });
      
      if (!existingStudent) {
        const studentUser = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            phone: `911111${rollNum.toString().padStart(4, '0')}`,
            role: 'Student',
            collegeId: college.id,
          },
        });

        await prisma.student.create({
          data: {
            name,
            studentId: `STU${rollNum.toString().padStart(3, '0')}`,
            email,
            rollNum,
            password: hashedPassword,
            collegeId: college.id,
            userId: studentUser.id,
            sclassId: section.sclassId,
            sectionId: section.id,
            dateOfBirth: new Date(2006 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            gender: i % 2 === 0 ? 'Male' : 'Female',
            board: 'CBSE',
          },
        });
      }
    }

    // Create many more parents
    const parentNames = [
      'Mr. Rajesh Sharma', 'Mrs. Sunita Sharma', 'Mr. Vikash Gupta', 'Mrs. Priya Gupta',
      'Mr. Sunil Singh', 'Mrs. Kavita Singh', 'Mr. Ramesh Patel', 'Mrs. Neeta Patel',
      'Mr. Anil Kumar', 'Mrs. Geeta Kumar', 'Mr. Mahesh Reddy', 'Mrs. Lakshmi Reddy',
      'Mr. Deepak Joshi', 'Mrs. Meera Joshi', 'Mr. Ashok Khan', 'Mrs. Fatima Khan',
      'Mr. Ravi Yadav', 'Mrs. Sita Yadav', 'Mr. Mohan Verma', 'Mrs. Radha Verma'
    ];

    for (let i = 0; i < parentNames.length; i++) {
      const name = parentNames[i];
      const email = `${name.toLowerCase().replace(/[^a-z]/g, '')}@demo.com`;
      
      const existingParent = await prisma.parent.findFirst({ 
        where: { email, collegeId: college.id } 
      });
      
      if (!existingParent) {
        const parentUser = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            phone: `922222${(i + 1).toString().padStart(4, '0')}`,
            role: 'Parent',
            collegeId: college.id,
          },
        });

        await prisma.parent.create({
          data: {
            name,
            email,
            phone: `922222${(i + 1).toString().padStart(4, '0')}`,
            password: hashedPassword,
            collegeId: college.id,
            userId: parentUser.id,
            relation: name.includes('Mr.') ? 'Father' : 'Mother',
            occupation: ['Engineer', 'Doctor', 'Teacher', 'Businessman', 'Lawyer'][i % 5],
          },
        });
      }
    }

    // Create multiple exams
    const examData = [
      { name: 'Unit Test 1', date: new Date('2026-03-15') },
      { name: 'Unit Test 2', date: new Date('2026-04-15') },
      { name: 'Mid Term Exam', date: new Date('2026-05-15') },
      { name: 'Unit Test 3', date: new Date('2026-06-15') },
      { name: 'Pre-Final Exam', date: new Date('2026-07-15') },
      { name: 'Final Exam', date: new Date('2026-08-15') },
      { name: 'Supplementary Exam', date: new Date('2026-09-15') }
    ];

    for (const cls of classes) {
      for (const exam of examData) {
        const existing = await prisma.exam.findFirst({
          where: { examName: exam.name, sclassId: cls.id, collegeId: college.id }
        });
        if (!existing) {
          await prisma.exam.create({
            data: {
              examName: exam.name,
              examDate: exam.date,
              sclassId: cls.id,
              collegeId: college.id,
            },
          });
        }
      }
    }

    // Create extensive fee records
    const students = await prisma.student.findMany({ where: { collegeId: college.id } });
    const feeTypes = ['Tuition', 'Lab Fee', 'Library Fee', 'Sports Fee', 'Transport Fee', 'Exam Fee'];
    
    for (const student of students) {
      for (const feeType of feeTypes) {
        const existing = await prisma.fee.findFirst({
          where: { studentId: student.id, feeType, collegeId: college.id }
        });
        if (!existing) {
          const amount = feeType === 'Tuition' ? 50000 : Math.floor(Math.random() * 5000) + 1000;
          await prisma.fee.create({
            data: {
              studentId: student.id,
              collegeId: college.id,
              feeType,
              amount,
              dueDate: new Date(2026, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
              frequency: 'yearly',
              isActive: true,
            },
          });
        }
      }
    }

    // Create payment records
    for (const student of students.slice(0, 30)) { // Create payments for first 30 students
      const fees = await prisma.fee.findMany({ where: { studentId: student.id } });
      for (const fee of fees.slice(0, 3)) { // Pay first 3 fees for each student
        const existing = await prisma.payment.findFirst({
          where: { studentId: student.id, feeId: fee.id }
        });
        if (!existing) {
          await prisma.payment.create({
            data: {
              studentId: student.id,
              feeId: fee.id,
              collegeId: college.id,
              amount: fee.amount,
              paymentDate: new Date(2026, Math.floor(Math.random() * 4), Math.floor(Math.random() * 28) + 1),
              paymentMethod: ['Cash', 'Online', 'Cheque', 'Card'][Math.floor(Math.random() * 4)],
              transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
              status: 'Completed',
            },
          });
        }
      }
    }

    // Create extensive attendance records for last 30 days
    const subjects = await prisma.subject.findMany({ where: { collegeId: college.id } });
    const today = new Date();
    
    for (let day = 0; day < 30; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - day);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      for (const student of students) {
        for (const subject of subjects.slice(0, 5)) { // 5 subjects per day
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
                status: Math.random() > 0.15 ? 'Present' : 'Absent', // 85% attendance rate
              },
            });
          }
        }
      }
    }

    // Create homework assignments
    const homeworkTopics = [
      'Chapter 1 Exercises', 'Lab Report Submission', 'Essay Writing', 'Mathematical Problems',
      'Science Project', 'History Assignment', 'Geography Map Work', 'Computer Programming',
      'Economics Case Study', 'Accounting Practice', 'Physics Numericals', 'Chemistry Equations',
      'Biology Diagrams', 'English Literature Review', 'Art Portfolio', 'PE Fitness Report'
    ];

    for (const subject of subjects) {
      for (let i = 0; i < 5; i++) { // 5 homework per subject
        const topic = homeworkTopics[Math.floor(Math.random() * homeworkTopics.length)];
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) + 1);
        
        const existing = await prisma.homework.findFirst({
          where: { subjectId: subject.id, title: `${topic} - ${i + 1}` }
        });
        
        if (!existing) {
          await prisma.homework.create({
            data: {
              title: `${topic} - ${i + 1}`,
              description: `Complete the ${topic.toLowerCase()} as discussed in class. Submit before due date.`,
              subjectId: subject.id,
              collegeId: college.id,
              dueDate,
              assignedDate: new Date(),
            },
          });
        }
      }
    }

    // Create HR employees
    const hrEmployees = [
      { name: 'Ms. Rekha Sharma', email: 'rekha.hr@demo.com', department: 'Human Resources', designation: 'HR Manager' },
      { name: 'Mr. Sunil Kumar', email: 'sunil.hr@demo.com', department: 'Administration', designation: 'Admin Officer' },
      { name: 'Mrs. Pooja Gupta', email: 'pooja.hr@demo.com', department: 'Accounts', designation: 'Accountant' },
      { name: 'Mr. Rahul Verma', email: 'rahul.hr@demo.com', department: 'IT Support', designation: 'IT Executive' },
      { name: 'Ms. Anjali Patel', email: 'anjali.hr@demo.com', department: 'Library', designation: 'Librarian' }
    ];

    for (const emp of hrEmployees) {
      const existingUser = await prisma.user.findFirst({ where: { email: emp.email } });
      if (!existingUser) {
        const empUser = await prisma.user.create({
          data: {
            email: emp.email,
            password: hashedPassword,
            name: emp.name,
            phone: `933333${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            role: 'HR',
            collegeId: college.id,
          },
        });

        // Create employee record (assuming you have an Employee model)
        // If not, you can create HR manager records or similar
      }
    }

    // Create admissions data
    const admissionData = [
      { name: 'Rohan Gupta', phone: '9888888801', course: '11th Science', status: 'Pending' },
      { name: 'Simran Kaur', phone: '9888888802', course: '11th Commerce', status: 'Approved' },
      { name: 'Aryan Joshi', phone: '9888888803', course: '12th Science', status: 'Rejected' },
      { name: 'Priya Nair', phone: '9888888804', course: '10th Grade', status: 'Pending' },
      { name: 'Karan Singh', phone: '9888888805', course: '11th Science', status: 'Approved' }
    ];

    for (let i = 0; i < admissionData.length; i++) {
      const admission = admissionData[i];
      const admissionNumber = `ADM2026${(i + 1).toString().padStart(3, '0')}`;
      
      const existing = await prisma.admission.findFirst({
        where: { admissionNumber, collegeId: college.id }
      });
      
      if (!existing) {
        await prisma.admission.create({
          data: {
            admissionNumber,
            studentName: admission.name,
            fatherName: `Mr. ${admission.name.split(' ')[1]}`,
            motherName: `Mrs. ${admission.name.split(' ')[1]}`,
            dateOfBirth: new Date(2008, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            gender: i % 2 === 0 ? 'Male' : 'Female',
            phone: admission.phone,
            email: `${admission.name.toLowerCase().replace(' ', '.')}@admission.com`,
            address: `${i + 1}, Demo Street, City`,
            course: admission.course,
            status: admission.status,
            applicationDate: new Date(),
            collegeId: college.id,
          },
        });
      }
    }

    console.log('\n🎉 Extensive demo data creation completed!\n');
    console.log('📊 Summary of created data:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Classes: ${classes.length}`);
    console.log(`✅ Sections: Multiple per class`);
    console.log(`✅ Subjects: ${subjects.length}`);
    console.log(`✅ Teachers: ${teacherData.length}+`);
    console.log(`✅ Students: ${studentNames.length}+`);
    console.log(`✅ Parents: ${parentNames.length}+`);
    console.log(`✅ Exams: ${examData.length} per class`);
    console.log(`✅ Fee Records: ${feeTypes.length} types per student`);
    console.log(`✅ Attendance: 30 days of records`);
    console.log(`✅ Homework: 5+ per subject`);
    console.log(`✅ Admissions: ${admissionData.length} applications`);
    console.log(`✅ HR Employees: ${hrEmployees.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error creating extensive demo data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createExtensiveDemoData();