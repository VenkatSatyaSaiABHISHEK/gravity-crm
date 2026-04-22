// Add 100 students, 100 teachers, 100 employees to existing database
const prisma = require('./lib/prisma');
const bcrypt = require('bcryptjs');

async function addBulkData() {
    try {
        console.log('🚀 Starting to add bulk data to existing database...\n');

        // Get or create a college
        let college = await prisma.college.findFirst();
        if (!college) {
            console.log('📚 Creating default college...');
            college = await prisma.college.create({
                data: {
                    name: 'Demo College',
                    email: 'admin@demo.com',
                    phone: '+91 9876543210',
                    address: '123 Education Street',
                    city: 'Demo City',
                    state: 'Demo State',
                    country: 'India',
                    pincode: '123456',
                    status: 'active',
                },
            });
        }
        console.log('✅ College:', college.name);

        // Get or create classes
        let classes = await prisma.sclass.findMany({ where: { collegeId: college.id } });
        if (classes.length === 0) {
            console.log('\n📖 Creating classes...');
            const classNames = ['11th Science', '11th Commerce', '11th Arts', '12th Science', '12th Commerce', '12th Arts', '10th Grade', '9th Grade'];
            for (const name of classNames) {
                await prisma.sclass.create({
                    data: {
                        sclassName: name,
                        collegeId: college.id,
                    },
                });
            }
            classes = await prisma.sclass.findMany({ where: { collegeId: college.id } });
        }
        console.log('✅ Classes:', classes.length);

        // Add 100 Students
        console.log('\n🎓 Adding 100 students...');
        const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Arnav', 'Ayaan', 'Krishna', 'Ishaan',
                            'Ananya', 'Diya', 'Aadhya', 'Saanvi', 'Kiara', 'Anika', 'Navya', 'Angel', 'Pari', 'Myra'];
        const lastNames = ['Sharma', 'Verma', 'Reddy', 'Nair', 'Gupta', 'Kumar', 'Singh', 'Patel', 'Mehta', 'Shah'];

        let studentCount = 0;
        for (let i = 1; i <= 100; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const name = `${firstName} ${lastName}`;
            const email = `student${i}@demo.com`;
            const classId = classes[Math.floor(Math.random() * classes.length)].id;

            try {
                const password = await bcrypt.hash('student123', 10);
                const user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password,
                        role: 'Student',
                        collegeId: college.id,
                        isActive: true,
                        isDeleted: false,
                    },
                });

                await prisma.student.create({
                    data: {
                        userId: user.id,
                        name,
                        studentId: `STU${String(i).padStart(3, '0')}`,
                        email,
                        password,
                        rollNum: i,
                        sclassId: classId,
                        phone: `+91 ${9800000000 + i}`,
                        gender: i % 2 === 0 ? 'Male' : 'Female',
                        dateOfBirth: new Date(2008, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
                        collegeId: college.id,
                    },
                });
                studentCount++;
            } catch (e) {
                // Skip if student already exists
            }
        }
        console.log('✅ Students added:', studentCount);

        // Add 100 Teachers
        console.log('\n👨‍🏫 Adding 100 teachers...');
        const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'Economics', 'History', 'Geography', 'Art'];
        let teacherCount = 0;

        for (let i = 1; i <= 100; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const name = `${firstName} ${lastName}`;
            const email = `teacher${i}@demo.com`;
            const subject = subjects[Math.floor(Math.random() * subjects.length)];

            try {
                const password = await bcrypt.hash('teacher123', 10);
                const user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password,
                        role: 'Teacher',
                        collegeId: college.id,
                        isActive: true,
                        isDeleted: false,
                    },
                });

                await prisma.teacher.create({
                    data: {
                        userId: user.id,
                        name,
                        email,
                        password,
                        specialization: subject,
                        experience: Math.floor(Math.random() * 20) + 1,
                        phone: `+91 ${9900000000 + i}`,
                        gender: i % 2 === 0 ? 'Male' : 'Female',
                        qualification: 'M.Sc., B.Ed',
                        collegeId: college.id,
                        isActive: true,
                    },
                });
                teacherCount++;
            } catch (e) {
                // Skip if teacher already exists
            }
        }
        console.log('✅ Teachers added:', teacherCount);

        // Create or get HR Manager first
        console.log('\n👔 Setting up HR Manager...');
        let hrManager = await prisma.hRManager.findFirst({
            where: { collegeId: college.id },
        });

        if (!hrManager) {
            const password = await bcrypt.hash('hrmanager123', 10);
            const user = await prisma.user.create({
                data: {
                    name: 'HR Manager',
                    email: 'hrmanager@demo.com',
                    password,
                    role: 'HRManager',
                    collegeId: college.id,
                    isActive: true,
                    isDeleted: false,
                },
            });

            hrManager = await prisma.hRManager.create({
                data: {
                    name: 'HR Manager',
                    email: 'hrmanager@demo.com',
                    phone: '+91 9999999999',
                    designation: 'HR Manager',
                    department: 'Human Resources',
                    collegeId: college.id,
                    userId: user.id,
                    isActive: true,
                },
            });
        }
        console.log('✅ HR Manager:', hrManager.name);

        // Add 100 HR Employees
        console.log('\n👔 Adding 100 HR employees...');
        const departments = ['Administration', 'Accounts', 'HR', 'IT', 'Library', 'Sports', 'Medical', 'Transport', 'Maintenance', 'Security'];
        const designations = ['Manager', 'Officer', 'Assistant', 'Coordinator', 'Supervisor', 'Head', 'Staff', 'Technician', 'Specialist', 'Executive'];
        let employeeCount = 0;

        for (let i = 1; i <= 100; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const name = `${firstName} ${lastName}`;
            const email = `employee${i}@demo.com`;
            const department = departments[Math.floor(Math.random() * departments.length)];
            const designation = designations[Math.floor(Math.random() * designations.length)];

            try {
                const password = await bcrypt.hash('employee123', 10);
                const user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password,
                        role: 'HRTeam',
                        collegeId: college.id,
                        isActive: true,
                        isDeleted: false,
                    },
                });

                await prisma.employee.create({
                    data: {
                        name,
                        email,
                        phone: `+91 ${9700000000 + i}`,
                        employeeId: `EMP${String(i).padStart(3, '0')}`,
                        department,
                        designation,
                        dateOfJoining: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
                        dateOfBirth: new Date(1990, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
                        gender: i % 2 === 0 ? 'Male' : 'Female',
                        qualification: 'B.Tech / B.A / B.Com',
                        experience: Math.floor(Math.random() * 15),
                        salary: Math.floor(Math.random() * 100000) + 30000,
                        collegeId: college.id,
                        hrManagerId: hrManager.id,
                        status: 'Active',
                    },
                });
                employeeCount++;
            } catch (e) {
                // Skip if employee already exists
            }
        }
        console.log('✅ Employees added:', employeeCount);

        // Add Parents
        console.log('\n👨‍👩‍👧 Adding parents...');
        let parentCount = 0;
        for (let i = 1; i <= 50; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const name = `${firstName} ${lastName}`;
            const email = `parent${i}@demo.com`;

            try {
                const password = await bcrypt.hash('parent123', 10);
                const user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password,
                        role: 'Parent',
                        collegeId: college.id,
                        isActive: true,
                        isDeleted: false,
                    },
                });

                await prisma.parent.create({
                    data: {
                        userId: user.id,
                        name,
                        email,
                        phone: `+91 ${9600000000 + i}`,
                        collegeId: college.id,
                    },
                });
                parentCount++;
            } catch (e) {
                // Skip if parent already exists
            }
        }
        console.log('✅ Parents added:', parentCount);

        console.log('\n' + '='.repeat(60));
        console.log('✅ BULK DATA ADDED SUCCESSFULLY!');
        console.log('='.repeat(60));
        console.log('\n📊 Summary:');
        console.log(`   Students: ${studentCount}`);
        console.log(`   Teachers: ${teacherCount}`);
        console.log(`   Employees: ${employeeCount}`);
        console.log(`   Parents: ${parentCount}`);
        console.log(`   College: ${college.name}`);
        console.log('\n🌐 Access at: http://localhost:3000');
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

addBulkData();
