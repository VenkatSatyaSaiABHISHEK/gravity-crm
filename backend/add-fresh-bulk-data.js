// Add fresh bulk data with unique identifiers
const prisma = require('./lib/prisma');
const bcrypt = require('bcryptjs');

async function addFreshBulkData() {
    try {
        console.log('🚀 Starting to add fresh bulk data...\n');

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

        // Get existing counts
        const existingStudents = await prisma.student.count({ where: { collegeId: college.id } });
        const existingTeachers = await prisma.teacher.count({ where: { collegeId: college.id } });
        const existingEmployees = await prisma.employee.count({ where: { collegeId: college.id } });
        const existingParents = await prisma.parent.count({ where: { collegeId: college.id } });

        console.log('\n📊 Existing data:');
        console.log(`   Students: ${existingStudents}`);
        console.log(`   Teachers: ${existingTeachers}`);
        console.log(`   Employees: ${existingEmployees}`);
        console.log(`   Parents: ${existingParents}`);

        const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Arnav', 'Ayaan', 'Krishna', 'Ishaan',
                            'Ananya', 'Diya', 'Aadhya', 'Saanvi', 'Kiara', 'Anika', 'Navya', 'Angel', 'Pari', 'Myra'];
        const lastNames = ['Sharma', 'Verma', 'Reddy', 'Nair', 'Gupta', 'Kumar', 'Singh', 'Patel', 'Mehta', 'Shah'];

        // Add students to reach 100
        console.log('\n🎓 Adding students...');
        let studentCount = 0;
        const studentsToAdd = Math.max(0, 100 - existingStudents);
        
        for (let i = existingStudents + 1; i <= existingStudents + studentsToAdd; i++) {
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
                console.log(`   ⚠️  Student ${i} skipped:`, e.message.substring(0, 50));
            }
        }
        console.log(`✅ Students added: ${studentCount} (Total: ${existingStudents + studentCount})`);

        // Add teachers to reach 100
        console.log('\n👨‍🏫 Adding teachers...');
        const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'Economics', 'History', 'Geography', 'Art'];
        let teacherCount = 0;
        const teachersToAdd = Math.max(0, 100 - existingTeachers);

        for (let i = existingTeachers + 1; i <= existingTeachers + teachersToAdd; i++) {
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
                console.log(`   ⚠️  Teacher ${i} skipped:`, e.message.substring(0, 50));
            }
        }
        console.log(`✅ Teachers added: ${teacherCount} (Total: ${existingTeachers + teacherCount})`);

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

        // Add employees to reach 100
        console.log('\n👔 Adding employees...');
        const departments = ['Administration', 'Accounts', 'HR', 'IT', 'Library', 'Sports', 'Medical', 'Transport', 'Maintenance', 'Security'];
        const designations = ['Manager', 'Officer', 'Assistant', 'Coordinator', 'Supervisor', 'Head', 'Staff', 'Technician', 'Specialist', 'Executive'];
        let employeeCount = 0;
        const employeesToAdd = Math.max(0, 100 - existingEmployees);

        for (let i = existingEmployees + 1; i <= existingEmployees + employeesToAdd; i++) {
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
                console.log(`   ⚠️  Employee ${i} skipped:`, e.message.substring(0, 50));
            }
        }
        console.log(`✅ Employees added: ${employeeCount} (Total: ${existingEmployees + employeeCount})`);

        // Add parents
        console.log('\n👨‍👩‍👧 Adding parents...');
        let parentCount = 0;
        const parentsToAdd = Math.max(0, 50 - existingParents);

        for (let i = existingParents + 1; i <= existingParents + parentsToAdd; i++) {
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
                        password,
                        collegeId: college.id,
                    },
                });
                parentCount++;
            } catch (e) {
                console.log(`   ⚠️  Parent ${i} skipped:`, e.message.substring(0, 50));
            }
        }
        console.log(`✅ Parents added: ${parentCount} (Total: ${existingParents + parentCount})`);

        console.log('\n' + '='.repeat(60));
        console.log('✅ FRESH BULK DATA ADDED SUCCESSFULLY!');
        console.log('='.repeat(60));
        console.log('\n📊 Final Summary:');
        console.log(`   Students: ${existingStudents + studentCount}`);
        console.log(`   Teachers: ${existingTeachers + teacherCount}`);
        console.log(`   Employees: ${existingEmployees + employeeCount}`);
        console.log(`   Parents: ${existingParents + parentCount}`);
        console.log(`   College: ${college.name}`);
        console.log('\n🌐 Access at: http://localhost:3000');
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

addFreshBulkData();
