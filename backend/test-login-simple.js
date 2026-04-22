// Simple login test without database operations
// Run with: node test-login-simple.js

const axios = require('axios');

async function testLogin() {
    try {
        console.log('🔐 Testing login API...');

        const loginData = {
            email: 'admin@demo.com',
            password: 'admin123'
        };

        console.log('Sending login request...');
        
        const response = await axios.post('http://localhost:5000/api/auth/login', loginData, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });

        console.log('✅ Login Response:');
        console.log(`   Success: ${response.data.success}`);
        
        if (response.data.success) {
            console.log(`   User: ${response.data.data.user.name}`);
            console.log(`   Role: ${response.data.data.user.role}`);
            console.log(`   College: ${response.data.data.user.college?.name || 'No college'}`);
            console.log(`   Token: ${response.data.data.token.substring(0, 20)}...`);
            
            // Test API with token
            console.log('\n📊 Testing API with token...');
            const token = response.data.data.token;
            const collegeId = response.data.data.user.collegeId;
            
            try {
                const studentsResponse = await axios.get(`http://localhost:5000/api/admin/students?collegeId=${collegeId}&page=1&limit=5`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    timeout: 10000
                });
                
                console.log(`✅ Students API: ${studentsResponse.data.success}`);
                console.log(`   Total Students: ${studentsResponse.data.pagination?.total || 0}`);
                console.log(`   Students in Response: ${studentsResponse.data.data?.length || 0}`);
                
            } catch (apiError) {
                console.log(`❌ Students API Error: ${apiError.response?.data?.message || apiError.message}`);
            }
            
        } else {
            console.log(`❌ Login failed: ${response.data.message}`);
        }

    } catch (error) {
        console.error('❌ Login test failed:');
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Message: ${error.response.data?.message || error.response.statusText}`);
        } else {
            console.error(`   Error: ${error.message}`);
        }
    }
}

// Run the test
testLogin();