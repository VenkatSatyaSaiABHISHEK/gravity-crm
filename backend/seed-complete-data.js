// Complete data seeding script with proper relationships
// Run with: node seed-complete-data.js

const prisma = require('./lib/prisma');
const bcrypt = require('bcryptjs');

async function seedData() {
    try {
        console.log('🚀 Starting complete data seeding...\n');

        // 1. Create College
        console.log('📚 Creating college...');
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

        // 2. Create Classes
        console.log('\n📖 Creating classes...');
        const classes = [];
        const classData = [
            { id: '1', name: '11th Science' },
            { id: '2', name: '11th Commerce' },
            { id: '3', name: '11th Arts' },
            { id: '4', name: '12th Science' },
            { id: '5', name: '12th Commerce' },
            { id: '6', name: '12th Arts' },
            { id: '7', name: '10th Grade' },
            { id: '8', name: '9th Grade' },
        ];

        for (const cls of classData) {
            const created = await prisma.sclass.upsert({
                where: { id: cls.id },
                update: {},
                create: {
                    id: cls.id,
                    sclassName: cls.name,
                    collegeId: college.id,
                },
            });
            classes.push(created);
        }
        console.log('✅ Classes created:', classes.length);

        // 3. Create Admin User
        console.log('\n👤 Creating admin user...');
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

        // 4. Create Teachers
        console.log('\n👨‍🏫 Creating teachers...');
        const teacherData = [
            { name: 'Mr. Rajesh Kumar', spec: 'Mathematics', exp: 15 },
            { name: 'Dr. Priya Sharma', spec: 'Physics', exp: 12 },
            { name: 'Ms. Anjali Verma', spec: 'Chemistry', exp: 10 },
            { name: 'Mr. Vikram Singh', spec: 'Biology', exp: 8 },
            { name: 'Dr. Ravi Mehta', spec: 'English', exp: 18 },
            { name: 'Ms. Neha Agarwal', spec: 'Computer Science', exp: 6 },
            { name: 'Mr. Amit Patel', spec: 'Economics', exp: 14 },
            { name: 'Dr. Kavya Reddy', spec: 'History', exp: 11 },
            { name: 'Mr. Arjun Nair', spec: 'Geography', exp: 9 },
            { name: 'Ms. Divya Gupta', spec: 'Political Science', exp: 7 },
            { name: 'Dr. Suresh Iyer', spec: 'Accountancy', exp: 16 },
            { name: 'Ms. Pooja Desai', spec: 'Business Studies', exp: 8 },
            { name: 'Mr. Karan Malhotra', spec: 'Physical Education', exp: 10 },
            { name: 'Dr. Sneha Kapoor', spec: 'Psychology', exp: 13 },
            { name: 'Mr. Rohan Chopra', spec: 'Sociology', exp: 9 },
            { name: 'Ms. Riya Bhatia', spec: 'Hindi', exp: 11 },
            { name: 'Dr. Varun Khanna', spec: 'Sanskrit', exp: 15 },
            { name: 'Ms. Nisha Shah', spec: 'Art & Craft', exp: 7 },
            { name: 'Mr. Harsh Jain', spec: 'Music', exp: 12 },
            { name: 'Dr. Isha Rao', spec: 'Environmental Science', exp: 10 },
        ];

        const teachers = [];
        for (const t of teacherData) {
            const teacherPassword = await bcrypt.hash('teacher123', 10);
            const email = `${t.name.toLowerCase().replace(/[^a-z]/g, '')}@teacher.edu`;
            
            const user = await prisma.user.upsert({
                where: { email_collegeId: { email, collegeId: college.id } },
                update: {},
                create: {
                    name: t.name,
                    email,
                    password: teacherPassword,
                    role: 'Teacher',
                    collegeId: college.id,
                    isActive: true,
                    isDeleted: false,
                },
            });

            teachers.push(user);
        }
        console.log('✅ Teachers created:', teachers.length);

        // 5. Create Students
        console.log('\n🎓 Creating students...');
        const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Arnav', 'Ayaan', 'Krishna', 'Ishaan',
                            'Ananya', 'Diya', 'Aadhya', 'Saanvi', 'Kiara', 'Anika', 'Navya', 'Angel', 'Pari', 'Myra',
                            'Priya', 'Rahul', 'Isha', 'Sakshi', 'Neha', 'Rohan', 'Amit', 'Pooja', 'Riya', 'Karan',
                            'Sneha', 'Vikram', 'Anjali', 'Rajesh', 'Kavya', 'Aryan', 'Divya', 'Harsh', 'Nisha', 'Varun',
                            'Shreya', 'Nikhil', 'Tanvi', 'Siddharth', 'Zara', 'Aditya', 'Nidhi', 'Roshan', 'Simran', 'Aryan'];
        
        const lastNames = ['Sharma', 'Verma', 'Reddy', 'Nair', 'Gupta', 'Kumar', 'Singh', 'Patel', 'Mehta', 'Shah',
                           'Agarwal', 'Jain', 'Rao', 'Iyer', 'Desai', 'Malhotra', 'Kapoor', 'Chopra', 'Bhatia', 'Khanna'];

        const students = [];
        for (let i = 1; i <= 50; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const name = `${firstName} ${lastName}`;
            const studentId = `STU${String(i).padStart(3, '0')}`;
            const classId = String((i % 8) + 1);
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.edu`;
            
            const studentPassword = await bcrypt.hash('student123', 10);
            
            const user = await prisma.user.upsert({
                where: { email_collegeId: { email, collegeId: college.id } },
                update: {},
                create: {
                    name,
                    email,
                    password: studentPassword,
                    role: 'Student',
                    collegeId: college.id,
                    isActive: true,
                    isDeleted: false,
                },
            });

            const student = await prisma.student.create({
                data: {
                    userId: user.id,
                    name,
                    studentId,
                    email,
                    password: studentPassword,
                    rollNum: i,
                    sclassId: classId,
                    phone: `+91 ${9800000000 + i}`,
                    gender: i % 2 === 0 ? 'Male' : 'Female',
                    dateOfBirth: new Date(2008, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
                    collegeId: college.id,
                },
            });

            students.push(student);
        }
        console.log('✅ Students created:', students.length);

        // 6. Create Parents
        console.log('\n👨‍👩‍👧 Creating parents...');
        const parents = [];
        for (let i = 1; i <= 10; i++) {
            const parentPassword = await bcrypt.hash('parent123', 10);
            const email = `parent${i}@demo.com`;
            
            const user = await prisma.user.upsert({
                where: { email_collegeId: { email, collegeId: college.id } },
                update: {},
                create: {
                    name: `Parent ${i}`,
                    email,
                    password: parentPassword,
                    role: 'Parent',
                    collegeId: college.id,
                    isActive: true,
                    isDeleted: false,
                },
            });

            const parent = await prisma.parent.upsert({
                where: { userId: user.id },
                update: {},
                create: {
                    userId: user.id,
                    name: `Parent ${i}`,
                    email,
                    phone: `+91 ${9700000000 + i}`,
                    collegeId: college.id,
                },
            });

            parents.push(parent);
        }
        console.log('✅ Parents created:', parents.length);

        // 7. Create Subjects
        console.log('\n📚 Creating subjects...');
        const subjectData = [
            { name: 'Mathematics', code: 'MATH101', classId: '1' },
            { name: 'Physics', code: 'PHY101', classId: '1' },
            { name: 'Chemistry', code: 'CHEM101', classId: '1' },
            { name: 'Biology', code: 'BIO101', classId: '1' },
            { name: 'English', code: 'ENG101', classId: '1' },
            { name: 'Computer Science', code: 'CS101', classId: '1' },
            { name: 'Economics', code: 'ECO101', classId: '2' },
            { name: 'Accountancy', code: 'ACC101', classId: '2' },
            { name: 'Business Studies', code: 'BUS101', classId: '2' },
            { name: 'History', code: 'HIS101', classId: '3' },
            { name: 'Geography', code: 'GEO101', classId: '3' },
            { name: 'Political Science', code: 'POL101', classId: '3' },
        ];

        for (let i = 0; i < subjectData.length; i++) {
            const s = subjectData[i];
            await prisma.subject.upsert({
                where: { id: String(i + 1) },
                update: {},
                create: {
                    id: String(i + 1),
                    subName: s.name,
                    subCode: s.code,
                    maxMarks: 100,
                    sclassId: s.classId,
                    collegeId: college.id,
                },
            });
        }
        console.log('✅ Subjects created:', subjectData.length);

        // 8. Create Fees
        console.log('\n💰 Creating fees...');
        const feeTypes = ['Tuition Fee', 'Lab Fee', 'Library Fee', 'Sports Fee', 'Transport Fee', 'Exam Fee', 'Annual Fee'];
        const feeAmounts = [50000, 5000, 5000, 10000, 15000, 20000, 25000];
        
        let feeCount = 0;
        for (let i = 0; i < students.length; i++) {
            for (let j = 0; j < 3; j++) {
                feeCount++;
                const feeType = feeTypes[j];
                const amount = feeAmounts[j];
                
                await prisma.fee.upsert({
                    where: { id: String(feeCount) },
                    update: {},
                    create: {
                        id: String(feeCount),
                        studentId: students[i].id,
                        feeType,
                        amount,
                        dueDate: new Date('2026-04-30'),
                        collegeId: college.id,
                    },
                });
            }
        }
        console.log('✅ Fees created:', feeCount);

        // 9. Create Payments
        console.log('\n💳 Creating payments...');
        const paymentMethods = ['Online', 'Cash', 'Cheque', 'UPI', 'Card'];
        let paymentCount = 0;
        
        for (let i = 1; i <= 100; i++) {
            const studentId = students[Math.floor(Math.random() * students.length)].id;
            const amount = [5000, 10000, 15000, 20000, 25000, 30000, 50000][Math.floor(Math.random() * 7)];
            const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
            const feeType = feeTypes[Math.floor(Math.random() * feeTypes.length)];
            const daysAgo = Math.floor(Math.random() * 90);
            const paymentDate = new Date();
            paymentDate.setDate(paymentDate.getDate() - daysAgo);
            
            paymentCount++;
            await prisma.payment.upsert({
                where: { id: String(i) },
                update: {},
                create: {
                    id: String(i),
                    transactionId: `TXN2026${String(i).padStart(5, '0')}`,
                    razorpayOrderId: `order_${Math.random().toString(36).substring(7)}`,
                    razorpayPaymentId: `pay_${Math.random().toString(36).substring(7)}`,
                    studentId,
                    amount,
                    paymentMethod: method,
                    status: 'completed',
                    paymentDate,
                    collegeId: college.id,
                },
            });
        }
        console.log('✅ Payments created:', paymentCount);

        // 10. Create Notices
        console.log('\n📢 Creating notices...');
        const noticeData = [
            { title: 'Annual Sports Day - May 15th', desc: 'Sports day celebration for all students. Participation is mandatory.', cat: 'Events', pri: 'high' },
            { title: 'Mid-term Exams Schedule', desc: 'Exam schedule has been released. Check your dashboard for details.', cat: 'Academic', pri: 'high' },
            { title: 'Parent-Teacher Meeting', desc: 'PTM scheduled for April 25th at 10:00 AM', cat: 'Meeting', pri: 'normal' },
            { title: 'Library New Books', desc: 'New collection of science and literature books available', cat: 'Library', pri: 'normal' },
            { title: 'Fee Payment Reminder', desc: 'Please pay pending fees by April 30th to avoid late charges', cat: 'Finance', pri: 'high' },
        ];

        for (let i = 0; i < noticeData.length; i++) {
            const n = noticeData[i];
            await prisma.notice.upsert({
                where: { id: String(i + 1) },
                update: {},
                create: {
                    id: String(i + 1),
                    title: n.title,
                    description: n.desc,
                    category: n.cat,
                    priority: n.pri,
                    publishedDate: new Date(),
                    collegeId: college.id,
                    isActive: true,
                },
            });
        }
        console.log('✅ Notices created:', noticeData.length);

        // 11. Create Transport Routes
        console.log('\n🚌 Creating transport routes...');
        const routeData = [
            { name: 'City Center Route', num: 'RT001', start: 'College Gate', end: 'City Center', dist: '15 km', time: '45 min', fee: 2500 },
            { name: 'Residential Route', num: 'RT002', start: 'College Gate', end: 'Green Valley', dist: '12 km', time: '35 min', fee: 2200 },
            { name: 'Tech Park Route', num: 'RT003', start: 'College Gate', end: 'Tech Park', dist: '18 km', time: '55 min', fee: 2800 },
            { name: 'Airport Express', num: 'RT004', start: 'College Gate', end: 'Airport Terminal', dist: '25 km', time: '70 min', fee: 3500 },
            { name: 'Mall Circuit', num: 'RT005', start: 'College Gate', end: 'Shopping Mall', dist: '8 km', time: '25 min', fee: 2000 },
        ];

        for (let i = 0; i < routeData.length; i++) {
            const r = routeData[i];
            await prisma.busRoute.upsert({
                where: { id: String(i + 1) },
                update: {},
                create: {
                    id: String(i + 1),
                    routeName: r.name,
                    routeNumber: r.num,
                    startPoint: r.start,
                    endPoint: r.end,
                    distance: r.dist,
                    estimatedTime: r.time,
                    fee: r.fee,
                    collegeId: college.id,
                    isActive: true,
                },
            });
        }
        console.log('✅ Transport routes created:', routeData.length);

        // 12. Create Buses
        console.log('\n🚐 Creating buses...');
        const busData = [
            { num: 'BUS001', reg: 'KA01AB1234', cap: 45, route: '1', driver: 'Rajesh Kumar', phone: '9876543210' },
            { num: 'BUS002', reg: 'KA01AB1235', cap: 45, route: '1', driver: 'Suresh Patel', phone: '9876543211' },
            { num: 'BUS003', reg: 'KA01AB1236', cap: 45, route: '2', driver: 'Mahesh Singh', phone: '9876543212' },
            { num: 'BUS004', reg: 'KA01AB1237', cap: 50, route: '3', driver: 'Vikram Rao', phone: '9876543213' },
            { num: 'BUS005', reg: 'KA01AB1238', cap: 50, route: '3', driver: 'Anil Kumar', phone: '9876543214' },
            { num: 'BUS006', reg: 'KA01AB1239', cap: 55, route: '4', driver: 'Ravi Sharma', phone: '9876543215' },
            { num: 'BUS007', reg: 'KA01AB1240', cap: 40, route: '5', driver: 'Deepak Gupta', phone: '9876543216' },
        ];

        for (let i = 0; i < busData.length; i++) {
            const b = busData[i];
            await prisma.bus.upsert({
                where: { id: String(i + 1) },
                update: {},
                create: {
                    id: String(i + 1),
                    busNumber: b.num,
                    registrationNo: b.reg,
                    capacity: b.cap,
                    routeId: b.route,
                    driverName: b.driver,
                    driverPhone: b.phone,
                    collegeId: college.id,
                    status: i === 4 ? 'maintenance' : 'active',
                },
            });
        }
        console.log('✅ Buses created:', busData.length);

        console.log('\n' + '='.repeat(60));
        console.log('✅ ALL DATA SEEDED SUCCESSFULLY!');
        console.log('='.repeat(60));
        
        console.log('\n📝 LOGIN CREDENTIALS:');
        console.log('   Admin: admin@demo.com / admin123');
        console.log('   Teachers: (any teacher email) / teacher123');
        console.log('   Students: (any student email) / student123');
        console.log('   Parents: parent1@demo.com to parent10@demo.com / parent123');
        
        console.log('\n📊 DATA SUMMARY:');
        console.log(`   College: ${college.name}`);
        console.log(`   Classes: ${classes.length}`);
        console.log(`   Teachers: ${teachers.length}`);
        console.log(`   Students: ${students.length}`);
        console.log(`   Parents: ${parents.length}`);
        console.log(`   Subjects: ${subjectData.length}`);
        console.log(`   Fees: ${feeCount}`);
        console.log(`   Payments: ${paymentCount}`);
        console.log(`   Notices: ${noticeData.length}`);
        console.log(`   Routes: ${routeData.length}`);
        console.log(`   Buses: ${busData.length}`);
        
        console.log('\n🌐 Access at: http://localhost:3000');
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('❌ Error seeding data:', error.message);
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

seedData();
