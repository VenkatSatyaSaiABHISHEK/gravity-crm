const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createDemoData() {
  try {
    console.log('🚀 Creating demo data...\n');

    // Check if college already exists
    let college = await prisma.college.findFirst();
    
    if (!college) {
      // Create college
      college = await prisma.college.create({
        data: {
          name: 'Demo College of Excellence',
          email: 'admin@democollege.edu',
          phone: '9999999999',
          address: '123 Education Street, Knowledge City, State 12345',
        },
      });
      console.log('✅ College created:', college.name);
    } else {
      console.log('✅ Using existing college:', college.name);
    }

    // Create classes if they don't exist
    const existingClasses = await prisma.sclass.findMany({ where: { collegeId: college.id } });
    let classes = existingClasses;
    
    if (classes.length === 0) {
      classes = await Promise.all([
        prisma.sclass.create({
          data: { sclassName: '10th Grade', collegeId: college.id },
        }),
        prisma.sclass.create({
          data: { sclassName: '11th Grade', collegeId: college.id },
        }),
        prisma.sclass.create({
          data: { sclassName: '12th Grade', collegeId: college.id },
        }),
      ]);
      console.log('✅ Classes created:', classes.map(c => c.sclassName).join(', '));
    }

    // Create sections if they don't exist
    let sections = await prisma.section.findMany({ where: { collegeId: college.id } });
    
    if (sections.length === 0) {
      sections = await Promise.all([
        prisma.section.create({
          data: { sectionName: 'A', collegeId: college.id, sclassId: classes[0].id },
        }),
        prisma.section.create({
          data: { sectionName: 'B', collegeId: college.id, sclassId: classes[0].id },
        }),
        prisma.section.create({
          data: { sectionName: 'A', collegeId: college.id, sclassId: classes[1].id },
        }),
      ]);
      console.log('✅ Sections created');
    }

    // Create subjects if they don't exist
    let subjects = await prisma.subject.findMany({ where: { collegeId: college.id } });
    
    if (subjects.length === 0) {
      subjects = await Promise.all([
        prisma.subject.create({
          data: {
            subCode: 'ENG101',
            subName: 'English Literature',
            sclassId: classes[0].id,
            collegeId: college.id,
            maxMarks: 100,
          },
        }),
        prisma.subject.create({
          data: {
            subCode: 'MATH101',
            subName: 'Advanced Mathematics',
            sclassId: classes[0].id,
            collegeId: college.id,
            maxMarks: 100,
          },
        }),
        prisma.subject.create({
          data: {
            subCode: 'SCI101',
            subName: 'Physics & Chemistry',
            sclassId: classes[0].id,
            collegeId: college.id,
            maxMarks: 100,
          },
        }),
      ]);
      console.log('✅ Subjects created:', subjects.map(s => s.subName).join(', '));
    }

    // Create users and roles
    const hashedPassword = await bcrypt.hash('Demo@123', 10);

    // Create admin if doesn't exist
    let adminUser = await prisma.user.findFirst({ where: { email: 'admin@demo.com' } });
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: 'admin@demo.com',
          password: hashedPassword,
          name: 'Demo Admin',
          phone: '9333333333',
          role: 'Admin',
          collegeId: college.id,
        },
      });

      await prisma.admin.create({
        data: {
          name: 'Demo Admin',
          email: 'admin@demo.com',
          password: hashedPassword,
          collegeId: college.id,
          userId: adminUser.id,
        },
      });
      console.log('✅ Admin created: admin@demo.com');
    }

    // Create teachers if they don't exist
    let teacherCount = await prisma.teacher.count({ where: { collegeId: college.id } });
    if (teacherCount === 0) {
      const teacherUsers = await Promise.all([
        prisma.user.create({
          data: {
            email: 'teacher1@demo.com',
            password: hashedPassword,
            name: 'Dr. Sarah Johnson',
            phone: '9876543210',
            role: 'Teacher',
            collegeId: college.id,
          },
        }),
        prisma.user.create({
          data: {
            email: 'teacher2@demo.com',
            password: hashedPassword,
            name: 'Prof. Michael Chen',
            phone: '9876543211',
            role: 'Teacher',
            collegeId: college.id,
          },
        }),
      ]);

      const teachers = await Promise.all([
        prisma.teacher.create({
          data: {
            name: 'Dr. Sarah Johnson',
            email: 'teacher1@demo.com',
            password: hashedPassword,
            collegeId: college.id,
            userId: teacherUsers[0].id,
            experience: 8,
            specialization: 'English Literature',
          },
        }),
        prisma.teacher.create({
          data: {
            name: 'Prof. Michael Chen',
            email: 'teacher2@demo.com',
            password: hashedPassword,
            collegeId: college.id,
            userId: teacherUsers[1].id,
            experience: 12,
            specialization: 'Mathematics',
          },
        }),
      ]);
      console.log('✅ Teachers created:', teachers.map(t => t.name).join(', '));
    }

    // Create students if they don't exist
    let studentCount = await prisma.student.count({ where: { collegeId: college.id } });
    if (studentCount < 5) {
      const studentData = [
        { name: 'Alex Rodriguez', email: 'alex@demo.com', rollNum: 1, gender: 'Male', dob: '2008-03-15' },
        { name: 'Emma Thompson', email: 'emma@demo.com', rollNum: 2, gender: 'Female', dob: '2008-07-22' },
        { name: 'Ryan Patel', email: 'ryan@demo.com', rollNum: 3, gender: 'Male', dob: '2008-11-08' },
        { name: 'Sofia Martinez', email: 'sofia@demo.com', rollNum: 4, gender: 'Female', dob: '2008-01-30' },
        { name: 'David Kim', email: 'david@demo.com', rollNum: 5, gender: 'Male', dob: '2008-09-12' },
      ];

      for (const student of studentData) {
        const existingStudent = await prisma.student.findFirst({ 
          where: { email: student.email, collegeId: college.id } 
        });
        
        if (!existingStudent) {
          const studentUser = await prisma.user.create({
            data: {
              email: student.email,
              password: hashedPassword,
              name: student.name,
              phone: `911111111${student.rollNum}`,
              role: 'Student',
              collegeId: college.id,
            },
          });

          await prisma.student.create({
            data: {
              name: student.name,
              studentId: `STU00${student.rollNum}`,
              email: student.email,
              rollNum: student.rollNum,
              password: hashedPassword,
              collegeId: college.id,
              userId: studentUser.id,
              sclassId: classes[0].id,
              sectionId: sections[0].id,
              dateOfBirth: new Date(student.dob),
              gender: student.gender,
              board: 'CBSE',
            },
          });
        }
      }
      console.log('✅ Students created');
    }

    // Create parents if they don't exist
    let parentCount = await prisma.parent.count({ where: { collegeId: college.id } });
    if (parentCount === 0) {
      const parentUsers = await Promise.all([
        prisma.user.create({
          data: {
            email: 'parent1@demo.com',
            password: hashedPassword,
            name: 'Mr. James Rodriguez',
            phone: '9222222222',
            role: 'Parent',
            collegeId: college.id,
          },
        }),
        prisma.user.create({
          data: {
            email: 'parent2@demo.com',
            password: hashedPassword,
            name: 'Mrs. Lisa Thompson',
            phone: '9222222223',
            role: 'Parent',
            collegeId: college.id,
          },
        }),
      ]);

      await Promise.all([
        prisma.parent.create({
          data: {
            name: 'Mr. James Rodriguez',
            email: 'parent1@demo.com',
            phone: '9222222222',
            password: hashedPassword,
            collegeId: college.id,
            userId: parentUsers[0].id,
            relation: 'Father',
            occupation: 'Software Engineer',
          },
        }),
        prisma.parent.create({
          data: {
            name: 'Mrs. Lisa Thompson',
            email: 'parent2@demo.com',
            phone: '9222222223',
            password: hashedPassword,
            collegeId: college.id,
            userId: parentUsers[1].id,
            relation: 'Mother',
            occupation: 'Doctor',
          },
        }),
      ]);
      console.log('✅ Parents created');
    }

    console.log('\n🎉 Demo data creation completed!\n');
    console.log('📝 Login Credentials (Password: Demo@123):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin: admin@demo.com');
    console.log('Teachers: teacher1@demo.com, teacher2@demo.com');
    console.log('Students: alex@demo.com, emma@demo.com, ryan@demo.com, sofia@demo.com, david@demo.com');
    console.log('Parents: parent1@demo.com, parent2@demo.com');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error creating demo data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoData();