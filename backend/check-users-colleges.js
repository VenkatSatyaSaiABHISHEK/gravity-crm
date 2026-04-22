// Check current users and colleges setup
const prisma = require('./lib/prisma');

async function checkUsersAndColleges() {
    try {
        console.log('🔍 Checking current users and colleges...\n');

        // Check specific users
        const users = await prisma.user.findMany({
            where: { 
                OR: [
                    { email: 'abhiyeduru@gmail.com' },
                    { email: 'admin@demo.com' }
                ]
            },
            include: { college: true }
        });

        console.log('📋 Current Users:');
        users.forEach(user => {
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   College: ${user.college?.name || 'No college'}`);
            console.log(`   College ID: ${user.collegeId}`);
            console.log(`   Active: ${user.isActive}`);
            console.log('');
        });

        // Check all colleges
        const colleges = await prisma.college.findMany();
        console.log('🏫 All Colleges:');
        colleges.forEach(college => {
            console.log(`   Name: ${college.name}`);
            console.log(`   ID: ${college.id}`);
            console.log('');
        });

        // Check data counts per college
        for (const college of colleges) {
            console.log(`📊 Data for ${college.name}:`);
            
            const [students, teachers, fees, payments] = await Promise.all([
                prisma.student.count({ where: { collegeId: college.id } }),
                prisma.teacher.count({ where: { collegeId: college.id } }),
                prisma.fee.count({ where: { collegeId: college.id } }),
                prisma.payment.count({ where: { collegeId: college.id } })
            ]);

            console.log(`   Students: ${students}`);
            console.log(`   Teachers: ${teachers}`);
            console.log(`   Fees: ${fees}`);
            console.log(`   Payments: ${payments}`);
            console.log('');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsersAndColleges();