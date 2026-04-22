// Test all admin API endpoints to verify data visibility
// Run with: node test-api-endpoints.js

const axios = require('axios');

async function testAllEndpoints() {
    try {
        console.log('🔐 Testing admin login...');

        const loginData = {
            email: 'admin@demo.com',
            password: 'admin123'
        };

        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', loginData, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
        });

        if (!loginResponse.data.success) {
            console.log('❌ Login failed');
            return;
        }

        const token = loginResponse.data.data.token;
        const collegeId = loginResponse.data.data.user.collegeId;
        
        console.log(`✅ Login successful`);
        console.log(`   College ID: ${collegeId}`);
        console.log(`   User: ${loginResponse.data.data.user.name}`);

        const headers = { 'Authorization': `Bearer ${token}` };

        // Test all endpoints
        const endpoints = [
            { name: 'Dashboard', url: `/api/admin/dashboard?collegeId=${collegeId}` },
            { name: 'Students', url: `/api/admin/students?collegeId=${collegeId}&page=1&limit=10` },
            { name: 'Teachers', url: `/api/admin/teachers?collegeId=${collegeId}&page=1&limit=10` },
            { name: 'Fees', url: `/api/admin/fees?collegeId=${collegeId}&page=1&limit=10` },
            { name: 'Payments', url: `/api/admin/payments?collegeId=${collegeId}&page=1&limit=10` },
            { name: 'Classes', url: `/api/admin/classes?collegeId=${collegeId}&page=1&limit=10` },
        ];

        console.log('\n📊 Testing API endpoints...\n');

        for (const endpoint of endpoints) {
            try {
                const response = await axios.get(`http://localhost:5000${endpoint.url}`, {
                    headers,
                    timeout: 10000
                });

                if (response.data.success) {
                    const data = response.data.data;
                    const pagination = response.data.pagination;
                    
                    console.log(`✅ ${endpoint.name}:`);
                    
                    if (pagination) {
                        console.log(`   Total: ${pagination.total}`);
                        console.log(`   Returned: ${data.length}`);
                    } else if (Array.isArray(data)) {
                        console.log(`   Items: ${data.length}`);
                    } else {
                        console.log(`   Data: Available`);
                    }
                } else {
                    console.log(`❌ ${endpoint.name}: ${response.data.message}`);
                }
            } catch (error) {
                console.log(`❌ ${endpoint.name}: ${error.response?.data?.message || error.message}`);
            }
        }

        console.log('\n🎯 Testing specific data visibility...\n');

        // Test students endpoint with higher limit
        try {
            const studentsResponse = await axios.get(`http://localhost:5000/api/admin/students?collegeId=${collegeId}&page=1&limit=100`, {
                headers,
                timeout: 10000
            });

            if (studentsResponse.data.success) {
                console.log(`✅ All Students: ${studentsResponse.data.pagination.total} total`);
                console.log(`   Sample students:`);
                studentsResponse.data.data.slice(0, 3).forEach((student, i) => {
                    console.log(`   ${i + 1}. ${student.name} (${student.studentId}) - ${student.email}`);
                });
            }
        } catch (error) {
            console.log(`❌ Students detailed: ${error.response?.data?.message || error.message}`);
        }

        // Test payments endpoint
        try {
            const paymentsResponse = await axios.get(`http://localhost:5000/api/admin/payments?collegeId=${collegeId}&page=1&limit=10`, {
                headers,
                timeout: 10000
            });

            if (paymentsResponse.data.success) {
                console.log(`✅ Payments: ${paymentsResponse.data.pagination.total} total`);
                console.log(`   Sample payments:`);
                paymentsResponse.data.data.slice(0, 3).forEach((payment, i) => {
                    console.log(`   ${i + 1}. ₹${payment.amount} - ${payment.status} - ${payment.paymentMethod}`);
                });
            }
        } catch (error) {
            console.log(`❌ Payments detailed: ${error.response?.data?.message || error.message}`);
        }

        // Test fees endpoint
        try {
            const feesResponse = await axios.get(`http://localhost:5000/api/admin/fees?collegeId=${collegeId}&page=1&limit=10`, {
                headers,
                timeout: 10000
            });

            if (feesResponse.data.success) {
                console.log(`✅ Fees: ${feesResponse.data.data.length} returned`);
                console.log(`   Sample fees:`);
                feesResponse.data.data.slice(0, 3).forEach((fee, i) => {
                    console.log(`   ${i + 1}. ${fee.feeType} - ₹${fee.totalFee} - ${fee.feeStatus}`);
                });
            }
        } catch (error) {
            console.log(`❌ Fees detailed: ${error.response?.data?.message || error.message}`);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testAllEndpoints();