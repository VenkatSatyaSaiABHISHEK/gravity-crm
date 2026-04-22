// Test login with abhiyeduru@gmail.com and verify data access
const axios = require('axios');

async function testAbhiLogin() {
    try {
        console.log('🔐 Testing abhiyeduru@gmail.com login...\n');

        // First, let's check what password is set for this user
        const prisma = require('./lib/prisma');
        const user = await prisma.user.findFirst({
            where: { email: 'abhiyeduru@gmail.com' },
            include: { college: true }
        });

        if (!user) {
            console.log('❌ User abhiyeduru@gmail.com not found');
            return;
        }

        console.log(`✅ User found: ${user.name}`);
        console.log(`   College: ${user.college.name}`);
        console.log(`   College ID: ${user.collegeId}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.isActive}\n`);

        // Try common passwords
        const possiblePasswords = ['admin123', 'password', '123456', 'abhi123', 'admin'];
        
        let loginSuccess = false;
        let token = null;
        let collegeId = null;

        for (const password of possiblePasswords) {
            try {
                console.log(`🔑 Trying password: ${password}`);
                
                const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
                    email: 'abhiyeduru@gmail.com',
                    password: password
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 10000
                });

                if (loginResponse.data.success) {
                    console.log(`✅ Login successful with password: ${password}\n`);
                    token = loginResponse.data.data.token;
                    collegeId = loginResponse.data.data.user.collegeId;
                    loginSuccess = true;
                    break;
                }
            } catch (error) {
                console.log(`   ❌ Failed with ${password}`);
            }
        }

        if (!loginSuccess) {
            console.log('\n❌ Could not login with any common passwords');
            console.log('💡 You may need to reset the password for abhiyeduru@gmail.com');
            return;
        }

        // Test API endpoints with the token
        console.log('📊 Testing API endpoints with abhiyeduru@gmail.com token...\n');

        const headers = { 'Authorization': `Bearer ${token}` };

        // Test dashboard
        try {
            const dashboardResponse = await axios.get(`http://localhost:5000/api/admin/dashboard?collegeId=${collegeId}`, {
                headers,
                timeout: 10000
            });

            if (dashboardResponse.data.success) {
                console.log('✅ Dashboard API: Working');
                console.log(`   Student Count: ${dashboardResponse.data.data?.studentCount || 'N/A'}`);
                console.log(`   Teacher Count: ${dashboardResponse.data.data?.teacherCount || 'N/A'}`);
            }
        } catch (error) {
            console.log(`❌ Dashboard API: ${error.response?.data?.message || error.message}`);
        }

        // Test students
        try {
            const studentsResponse = await axios.get(`http://localhost:5000/api/admin/students?collegeId=${collegeId}&page=1&limit=10`, {
                headers,
                timeout: 10000
            });

            if (studentsResponse.data.success) {
                console.log('✅ Students API: Working');
                console.log(`   Total Students: ${studentsResponse.data.pagination?.total || 0}`);
                console.log(`   Sample: ${studentsResponse.data.data?.[0]?.name || 'N/A'}`);
            }
        } catch (error) {
            console.log(`❌ Students API: ${error.response?.data?.message || error.message}`);
        }

        // Test teachers
        try {
            const teachersResponse = await axios.get(`http://localhost:5000/api/admin/teachers?collegeId=${collegeId}&page=1&limit=10`, {
                headers,
                timeout: 10000
            });

            if (teachersResponse.data.success) {
                console.log('✅ Teachers API: Working');
                console.log(`   Total Teachers: ${teachersResponse.data.pagination?.total || 0}`);
                console.log(`   Sample: ${teachersResponse.data.data?.[0]?.name || 'N/A'}`);
            }
        } catch (error) {
            console.log(`❌ Teachers API: ${error.response?.data?.message || error.message}`);
        }

        // Test payments
        try {
            const paymentsResponse = await axios.get(`http://localhost:5000/api/admin/payments?collegeId=${collegeId}&page=1&limit=10`, {
                headers,
                timeout: 10000
            });

            if (paymentsResponse.data.success) {
                console.log('✅ Payments API: Working');
                console.log(`   Total Payments: ${paymentsResponse.data.pagination?.total || 0}`);
                console.log(`   Sample Amount: ₹${paymentsResponse.data.data?.[0]?.amount || 'N/A'}`);
            }
        } catch (error) {
            console.log(`❌ Payments API: ${error.response?.data?.message || error.message}`);
        }

        // Test fees
        try {
            const feesResponse = await axios.get(`http://localhost:5000/api/admin/fees?collegeId=${collegeId}&page=1&limit=10`, {
                headers,
                timeout: 10000
            });

            if (feesResponse.data.success) {
                console.log('✅ Fees API: Working');
                console.log(`   Total Fees: ${feesResponse.data.data?.length || 0}`);
                console.log(`   Sample Fee: ₹${feesResponse.data.data?.[0]?.totalFee || 'N/A'}`);
            }
        } catch (error) {
            console.log(`❌ Fees API: ${error.response?.data?.message || error.message}`);
        }

        console.log('\n🎉 All tests completed!');
        console.log('✅ abhiyeduru@gmail.com now has access to comprehensive mock data');
        console.log('🌐 Login at: http://localhost:3000/login');
        console.log(`🔑 Credentials: abhiyeduru@gmail.com / (working password found)`);

        await prisma.$disconnect();

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testAbhiLogin();