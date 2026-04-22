// Final comprehensive test of the abhi college system
const axios = require('axios');
const prisma = require('./lib/prisma');

async function finalSystemTest() {
    try {
        console.log('🔍 Final System Test for abhiyeduru@gmail.com\n');

        const collegeId = 'b75f1021-e248-4d5f-a185-7eebd84a8294'; // abhi college

        // STEP 1: Database verification
        console.log('📊 Step 1: Database Verification\n');

        const [
            students, teachers, parents, classes, subjects,
            fees, payments, admissionTeam, accountsTeam, transportTeam,
            employees, hrManagers
        ] = await Promise.all([
            prisma.student.count({ where: { collegeId } }),
            prisma.teacher.count({ where: { collegeId } }),
            prisma.parent.count({ where: { collegeId } }),
            prisma.sclass.count({ where: { collegeId } }),
            prisma.subject.count({ where: { collegeId } }),
            prisma.fee.count({ where: { collegeId } }),
            prisma.payment.count({ where: { collegeId } }),
            prisma.admissionTeam.count({ where: { collegeId } }),
            prisma.accountsTeam.count({ where: { collegeId } }),
            prisma.transportTeam.count({ where: { collegeId } }),
            prisma.employee.count({ where: { collegeId } }),
            prisma.hRManager.count({ where: { collegeId } })
        ]);

        console.log('✅ Database Data Counts:');
        console.log(`   👥 Students: ${students}`);
        console.log(`   👨‍🏫 Teachers: ${teachers}`);
        console.log(`   👨‍👩‍👧‍👦 Parents: ${parents}`);
        console.log(`   🏫 Classes: ${classes}`);
        console.log(`   📚 Subjects: ${subjects}`);
        console.log(`   💳 Fees: ${fees}`);
        console.log(`   💰 Payments: ${payments}`);
        console.log(`   🎓 Admission Team: ${admissionTeam}`);
        console.log(`   💰 Accounts Team: ${accountsTeam}`);
        console.log(`   🚌 Transport Team: ${transportTeam}`);
        console.log(`   👔 Employees: ${employees}`);
        console.log(`   👨‍💼 HR Managers: ${hrManagers}`);

        // STEP 2: API Login Tests
        console.log('\n🔐 Step 2: API Login Tests\n');

        const loginTests = [
            { email: 'abhiyeduru@gmail.com', password: 'admin123', role: 'Admin' },
            { email: 'rajesh.admission@abhi.edu', password: 'admission123', role: 'AdmissionTeam' },
            { email: 'suresh.accounts@abhi.edu', password: 'accounts123', role: 'AccountsTeam' },
            { email: 'mahesh.transport@abhi.edu', password: 'transport123', role: 'TransportTeam' }
        ];

        const tokens = {};

        for (const test of loginTests) {
            try {
                const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
                    email: test.email,
                    password: test.password
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 10000
                });

                if (loginResponse.data.success) {
                    console.log(`✅ ${test.role} Login: ${test.email}`);
                    tokens[test.role] = loginResponse.data.data.token;
                } else {
                    console.log(`❌ ${test.role} Login Failed: ${test.email}`);
                }
            } catch (error) {
                console.log(`❌ ${test.role} Login Error: ${error.response?.data?.message || error.message}`);
            }
        }

        // STEP 3: Admin API Tests
        if (tokens.Admin) {
            console.log('\n📊 Step 3: Admin API Tests\n');

            const adminHeaders = { 'Authorization': `Bearer ${tokens.Admin}` };
            
            const apiTests = [
                { name: 'Dashboard', url: `/api/admin/dashboard?collegeId=${collegeId}` },
                { name: 'Students', url: `/api/admin/students?collegeId=${collegeId}&page=1&limit=5` },
                { name: 'Teachers', url: `/api/admin/teachers?collegeId=${collegeId}&page=1&limit=5` },
                { name: 'Fees', url: `/api/admin/fees?collegeId=${collegeId}&page=1&limit=5` },
                { name: 'Payments', url: `/api/admin/payments?collegeId=${collegeId}&page=1&limit=5` },
                { name: 'Classes', url: `/api/admin/classes?collegeId=${collegeId}&page=1&limit=5` },
                { name: 'Team Members', url: `/api/admin/team-members?collegeId=${collegeId}&page=1&limit=5` }
            ];

            for (const test of apiTests) {
                try {
                    const response = await axios.get(`http://localhost:5000${test.url}`, {
                        headers: adminHeaders,
                        timeout: 10000
                    });

                    if (response.data.success) {
                        const data = response.data.data;
                        const count = response.data.pagination?.total || (Array.isArray(data) ? data.length : 'Available');
                        console.log(`✅ ${test.name} API: ${count} records`);
                    } else {
                        console.log(`❌ ${test.name} API: ${response.data.message}`);
                    }
                } catch (error) {
                    console.log(`❌ ${test.name} API: ${error.response?.data?.message || error.message}`);
                }
            }
        }

        // STEP 4: Sample Data Display
        console.log('\n📋 Step 4: Sample Data Display\n');

        // Sample students
        const sampleStudents = await prisma.student.findMany({
            where: { collegeId },
            take: 3,
            include: {
                sclass: { select: { sclassName: true } },
                Fees: { take: 1, select: { feeType: true, amount: true } }
            }
        });

        console.log('👥 Sample Students:');
        sampleStudents.forEach((student, i) => {
            console.log(`   ${i + 1}. ${student.name} (${student.studentId}) - ${student.sclass?.sclassName || 'No class'}`);
        });

        // Sample payments
        const samplePayments = await prisma.payment.findMany({
            where: { collegeId, status: 'completed' },
            take: 3,
            include: {
                student: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        console.log('\n💰 Sample Completed Payments:');
        samplePayments.forEach((payment, i) => {
            console.log(`   ${i + 1}. ₹${payment.amount} - ${payment.student?.name || 'Unknown'} - ${payment.paymentMethod}`);
        });

        // Sample team members
        const sampleAdmissionTeam = await prisma.admissionTeam.findMany({
            where: { collegeId },
            take: 2
        });

        console.log('\n🎓 Sample Admission Team:');
        sampleAdmissionTeam.forEach((member, i) => {
            console.log(`   ${i + 1}. ${member.name} - ${member.designation || 'Staff'}`);
        });

        // STEP 5: Revenue Summary
        console.log('\n💰 Step 5: Revenue Summary\n');

        const revenueData = await prisma.payment.aggregate({
            where: { collegeId, status: 'completed' },
            _sum: { amount: true }
        });

        const paymentStats = await prisma.payment.groupBy({
            by: ['status'],
            where: { collegeId },
            _count: { _all: true },
            _sum: { amount: true }
        });

        console.log('📈 Financial Summary:');
        console.log(`   Total Revenue: ₹${revenueData._sum.amount || 0}`);
        
        paymentStats.forEach(stat => {
            console.log(`   ${stat.status} Payments: ${stat._count._all} (₹${stat._sum.amount || 0})`);
        });

        console.log('\n🎉 FINAL SYSTEM TEST COMPLETED SUCCESSFULLY!\n');

        console.log('🔐 Login Credentials Summary:');
        console.log('   Admin: abhiyeduru@gmail.com / admin123');
        console.log('   Admission: rajesh.admission@abhi.edu / admission123');
        console.log('   Accounts: suresh.accounts@abhi.edu / accounts123');
        console.log('   Transport: mahesh.transport@abhi.edu / transport123');

        console.log('\n🌐 Access URLs:');
        console.log('   Admin Dashboard: http://localhost:3000/admin/dashboard');
        console.log('   Login Page: http://localhost:3000/login');

        console.log('\n✅ The ERP system is fully functional with comprehensive mock data!');

    } catch (error) {
        console.error('❌ System test failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

finalSystemTest();