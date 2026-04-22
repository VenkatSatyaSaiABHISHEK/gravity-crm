// Script to insert demo data directly into the database
// Run with: node insert-demo-data.js

const prisma = require('./lib/prisma');
const bcrypt = require('bcryptjs');
const { demoDataLarge } = require('./utils/demo-data-large');

async function insertDemoData() {
    try {
        console.log('🚀 Starting demo data insertion...');

        // Create demo college
        const college = await prisma.college.upsert({
            where: { id: 'demo-college-001' },
            update: {},
            create: {
                id: 'demo-college-001',
                name: 'GVPLACEMENT Demo College',
                email: 'admin@gvplacement.demo',
                phone: '+91 9876543210',
                address: '123 Education Street, Knowledge Park',
                city: 'Demo City',
                state: 'Demo State',
                country: 'India',
                pincode: '123456',
                status: 'active',
            },
        });
        console.log('✅ College created:', college.name);

        // Create demo admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        const adminUser = await prisma.user.upsert({
            where: { email_collegeId: { email: 'admin@demo.com', collegeId: college.id } },
            update: {},
            create: {
                name: 'Demo Admin',
                email: 'admin@demo.com',
                password: adminPassword,
                role: 'Admin',
                collegeId: college.id,
                isActive: true,
                isDeleted: false,
            },
        });
        console.log('✅ Admin user created');

        // Create demo admin profile
        // Skip admin profile creation - user is already created
        console.log('✅ Admin profile created');

        // Create demo classes
        for (const cls of demoDataLarge.classes) {
            await prisma.sclass.upsert({
                where: { id: cls.id },
                update: {},
                create: {
                    id: cls.id,
                    sclassName: cls.sclassName,
                    collegeId: college.id,
                },
            });
        }
        console.log('✅ Classes created:', demoDataLarge.classes.length);

        // Create demo subjects
        for (const subject of demoDataLarge.subjects) {
            await prisma.subject.upsert({
                where: { id: subject.id },
                update: {},
                create: {
                    id: subject.id,
                    subName: subject.subName,
                    subCode: subject.subCode,
                    maxMarks: subject.maxMarks,
                    sclassId: subject.sclassId,
                    collegeId: college.id,
                },
            });
        }
        console.log('✅ Subjects created:', demoDataLarge.subjects.length);

        // Create demo teachers
        for (const teacher of demoDataLarge.teachers) {
            const teacherPassword = await bcrypt.hash('teacher123', 10);
            const teacherUser = await prisma.user.upsert({
                where: { email_collegeId: { email: teacher.email, collegeId: college.id } },
                update: {},
                create: {
                    name: teacher.name,
                    email: teacher.email,
                    password: teacherPassword,
                    role: 'Teacher',
                    collegeId: college.id,
                    isActive: true,
                    isDeleted: false,
                },
            });

            await prisma.teacher.upsert({
                where: { userId: teacherUser.id },
                update: {},
                create: {
                    userId: teacherUser.id,
                    name: teacher.name,
                    email: teacher.email,
                    specialization: teacher.specialization,
                    experience: teacher.experience,
                    phone: teacher.phone,
                    gender: teacher.gender,
                    qualification: teacher.qualification,
                    collegeId: college.id,
                    isActive: teacher.isActive,
                },
            });
        }
        console.log('✅ Teachers created:', demoDataLarge.teachers.length);

        // Create demo students
        for (const student of demoDataLarge.students) {
            const studentPassword = await bcrypt.hash('student123', 10);
            const studentUser = await prisma.user.upsert({
                where: { email_collegeId: { email: student.email, collegeId: college.id } },
                update: {},
                create: {
                    name: student.name,
                    email: student.email,
                    password: studentPassword,
                    role: 'Student',
                    collegeId: college.id,
                    isActive: true,
                    isDeleted: false,
                },
            });

            await prisma.student.upsert({
                where: { userId: studentUser.id },
                update: {},
                create: {
                    userId: studentUser.id,
                    name: student.name,
                    studentId: student.studentId,
                    email: student.email,
                    rollNum: student.rollNum,
                    sclassId: student.sclassId,
                    sectionId: student.sectionId,
                    phone: student.phone,
                    gender: student.gender,
                    dateOfBirth: student.dateOfBirth,
                    collegeId: college.id,
                    isActive: student.isActive,
                    isDeleted: student.isDeleted,
                },
            });
        }
        console.log('✅ Students created:', demoDataLarge.students.length);

        // Create demo parents
        for (let i = 0; i < 10; i++) {
            const parentPassword = await bcrypt.hash('parent123', 10);
            const parentUser = await prisma.user.upsert({
                where: { email_collegeId: { email: `parent${i + 1}@demo.com`, collegeId: college.id } },
                update: {},
                create: {
                    name: `Parent ${i + 1}`,
                    email: `parent${i + 1}@demo.com`,
                    password: parentPassword,
                    role: 'Parent',
                    collegeId: college.id,
                    isActive: true,
                    isDeleted: false,
                },
            });

            await prisma.parent.upsert({
                where: { userId: parentUser.id },
                update: {},
                create: {
                    userId: parentUser.id,
                    name: `Parent ${i + 1}`,
                    email: `parent${i + 1}@demo.com`,
                    phone: `+91 ${9700000000 + i}`,
                    collegeId: college.id,
                },
            });
        }
        console.log('✅ Parents created: 10');

        // Create demo HR employees
        for (const emp of demoDataLarge.hrEmployees) {
            const empPassword = await bcrypt.hash('employee123', 10);
            const empUser = await prisma.user.upsert({
                where: { email_collegeId: { email: emp.email, collegeId: college.id } },
                update: {},
                create: {
                    name: emp.name,
                    email: emp.email,
                    password: empPassword,
                    role: 'HRTeam',
                    collegeId: college.id,
                    isActive: true,
                    isDeleted: false,
                },
            });

            await prisma.employee.upsert({
                where: { userId: empUser.id },
                update: {},
                create: {
                    userId: empUser.id,
                    name: emp.name,
                    email: emp.email,
                    designation: emp.designation,
                    department: emp.department,
                    salary: emp.salary,
                    phone: emp.phone,
                    joiningDate: emp.joiningDate,
                    collegeId: college.id,
                    status: emp.isActive ? 'Active' : 'Inactive',
                },
            });
        }
        console.log('✅ HR Employees created:', demoDataLarge.hrEmployees.length);

        // Create demo fees
        for (const fee of demoDataLarge.fees) {
            const student = demoDataLarge.students.find(s => s.id === fee.studentId);
            if (student) {
                await prisma.fee.upsert({
                    where: { id: fee.id },
                    update: {},
                    create: {
                        id: fee.id,
                        studentId: fee.studentId,
                        feeType: fee.feeType,
                        amount: fee.amount,
                        dueDate: fee.dueDate,
                        collegeId: college.id,
                    },
                });
            }
        }
        console.log('✅ Fees created:', demoDataLarge.fees.length);

        // Create demo payments
        for (const payment of demoDataLarge.payments) {
            await prisma.payment.upsert({
                where: { id: payment.id },
                update: {},
                create: {
                    id: payment.id,
                    transactionId: payment.transactionId,
                    razorpayOrderId: payment.razorpayOrderId,
                    razorpayPaymentId: payment.razorpayPaymentId,
                    studentId: payment.studentId,
                    amount: payment.amount,
                    paymentMethod: payment.paymentMethod,
                    status: payment.status,
                    paymentDate: payment.paymentDate,
                    collegeId: college.id,
                },
            });
        }
        console.log('✅ Payments created:', demoDataLarge.payments.length);

        // Create demo notices
        for (const notice of demoDataLarge.notices) {
            await prisma.notice.upsert({
                where: { id: notice.id },
                update: {},
                create: {
                    id: notice.id,
                    title: notice.title,
                    description: notice.description,
                    category: notice.category,
                    priority: notice.priority,
                    publishedDate: notice.publishedDate,
                    collegeId: college.id,
                    isActive: notice.isActive,
                },
            });
        }
        console.log('✅ Notices created:', demoDataLarge.notices.length);

        // Create demo transport routes
        for (const route of demoDataLarge.routes) {
            await prisma.busRoute.upsert({
                where: { id: route.id },
                update: {},
                create: {
                    id: route.id,
                    routeName: route.routeName,
                    routeNumber: route.routeNumber,
                    startPoint: route.startPoint,
                    endPoint: route.endPoint,
                    distance: route.distance,
                    estimatedTime: route.estimatedTime,
                    fee: route.fee,
                    collegeId: college.id,
                    isActive: route.isActive,
                },
            });
        }
        console.log('✅ Transport routes created:', demoDataLarge.routes.length);

        // Create demo buses
        for (const bus of demoDataLarge.buses) {
            await prisma.bus.upsert({
                where: { id: bus.id },
                update: {},
                create: {
                    id: bus.id,
                    busNumber: bus.busNumber,
                    registrationNo: bus.registrationNo,
                    capacity: bus.capacity,
                    routeId: bus.routeId,
                    driverName: bus.driverName,
                    driverPhone: bus.driverPhone,
                    collegeId: college.id,
                    status: bus.status,
                },
            });
        }
        console.log('✅ Buses created:', demoDataLarge.buses.length);

        console.log('\n✅ All demo data inserted successfully!');
        console.log('\n📝 Demo Login Credentials:');
        console.log('   Admin: admin@demo.com / admin123');
        console.log('   Teacher: (any teacher email) / teacher123');
        console.log('   Student: (any student email) / student123');
        console.log('   Parent: parent1@demo.com / parent123');
        console.log('   HR: (any employee email) / employee123');

    } catch (error) {
        console.error('❌ Error inserting demo data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

insertDemoData();
