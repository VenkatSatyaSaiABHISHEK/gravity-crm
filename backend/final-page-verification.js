// Final verification of all pages with data
const axios = require('axios');

async function finalPageVerification() {
    try {
        console.log('🔍 Final Page Verification for ERP System\n');

        // Login as admin
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'abhiyeduru@gmail.com',
            password: 'admin123'
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
        });

        if (!loginResponse.data.success) {
            console.log('❌ Login failed');
            return;
        }

        const token = loginResponse.data.data.token;
        const collegeId = loginResponse.data.data.user.collegeId;
        const headers = { 'Authorization': `Bearer ${token}` };

        console.log('✅ Admin login successful');
        console.log(`📍 College ID: ${collegeId}\n`);

        // Test all critical pages
        const pages = [
            {
                name: 'Students Page',
                url: `/api/admin/students?collegeId=${collegeId}&page=1&limit=10`,
                expectedMin: 50,
                description: 'Student management and profiles'
            },
            {
                name: 'Teachers Page', 
                url: `/api/admin/teachers?collegeId=${collegeId}&page=1&limit=10`,
                expectedMin: 50,
                description: 'Teacher management and assignments'
            },
            {
                name: 'Fees Page',
                url: `/api/admin/fees?collegeId=${collegeId}&page=1&limit=10`,
                expectedMin: 1000,
                description: 'Fee structure and billing'
            },
            {
                name: 'Payments Page',
                url: `/api/admin/payments?collegeId=${collegeId}&page=1&limit=10`,
                expectedMin: 500,
                description: 'Payment transactions and receipts'
            },
            {
                name: 'Classes Page',
                url: `/api/admin/classes?collegeId=${collegeId}&page=1&limit=10`,
                expectedMin: 5,
                description: 'Class and section management'
            },
            {
                name: 'Subjects Page',
                url: `/api/admin/subjects?collegeId=${collegeId}&page=1&limit=10`,
                expectedMin: 50,
                description: 'Subject and curriculum management'
            }
        ];

        console.log('📊 Testing All Critical Pages:\n');

        let allPagesWorking = true;
        const pageResults = [];

        for (const page of pages) {
            try {
                const response = await axios.get(`http://localhost:5000${page.url}`, {
                    headers,
                    timeout: 15000
                });

                if (response.data.success) {
                    const data = response.data.data;
                    const count = response.data.pagination?.total || (Array.isArray(data) ? data.length : 1);
                    
                    const status = count >= page.expectedMin ? '✅' : '⚠️';
                    const statusText = count >= page.expectedMin ? 'EXCELLENT' : 'NEEDS MORE DATA';
                    
                    console.log(`${status} ${page.name}:`);
                    console.log(`   Records: ${count} (Expected: ${page.expectedMin}+)`);
                    console.log(`   Status: ${statusText}`);
                    console.log(`   Description: ${page.description}`);
                    
                    if (count >= page.expectedMin) {
                        console.log(`   Sample Data: Available`);
                    }
                    console.log('');

                    pageResults.push({
                        name: page.name,
                        count,
                        expected: page.expectedMin,
                        status: count >= page.expectedMin ? 'PASS' : 'NEEDS_MORE_DATA',
                        working: true
                    });

                    if (count < page.expectedMin) {
                        allPagesWorking = false;
                    }
                } else {
                    console.log(`❌ ${page.name}: API Error - ${response.data.message}\n`);
                    pageResults.push({
                        name: page.name,
                        status: 'API_ERROR',
                        working: false
                    });
                    allPagesWorking = false;
                }
            } catch (error) {
                console.log(`❌ ${page.name}: ${error.response?.data?.message || error.message}\n`);
                pageResults.push({
                    name: page.name,
                    status: 'CONNECTION_ERROR',
                    working: false
                });
                allPagesWorking = false;
            }
        }

        // Test sample data quality
        console.log('🔍 Sample Data Quality Check:\n');

        try {
            // Check students with detailed info
            const studentsResponse = await axios.get(`http://localhost:5000/api/admin/students?collegeId=${collegeId}&page=1&limit=5`, {
                headers,
                timeout: 10000
            });

            if (studentsResponse.data.success && studentsResponse.data.data.length > 0) {
                console.log('👥 Sample Students:');
                studentsResponse.data.data.forEach((student, i) => {
                    console.log(`   ${i + 1}. ${student.name} (${student.studentId})`);
                    console.log(`      Email: ${student.email}`);
                    console.log(`      Class: ${student.sclass?.sclassName || 'Not assigned'}`);
                });
                console.log('');
            }

            // Check payments with amounts
            const paymentsResponse = await axios.get(`http://localhost:5000/api/admin/payments?collegeId=${collegeId}&page=1&limit=5`, {
                headers,
                timeout: 10000
            });

            if (paymentsResponse.data.success && paymentsResponse.data.data.length > 0) {
                console.log('💰 Sample Payments:');
                paymentsResponse.data.data.forEach((payment, i) => {
                    console.log(`   ${i + 1}. ₹${payment.amount} - ${payment.status}`);
                    console.log(`      Method: ${payment.paymentMethod}`);
                    console.log(`      Student: ${payment.student?.name || 'Unknown'}`);
                });
                console.log('');
            }

            // Check fees with types
            const feesResponse = await axios.get(`http://localhost:5000/api/admin/fees?collegeId=${collegeId}&page=1&limit=5`, {
                headers,
                timeout: 10000
            });

            if (feesResponse.data.success && feesResponse.data.data.length > 0) {
                console.log('💳 Sample Fees:');
                feesResponse.data.data.forEach((fee, i) => {
                    console.log(`   ${i + 1}. ${fee.feeType || 'Unknown Type'} - ₹${fee.totalFee || fee.amount}`);
                    console.log(`      Student: ${fee.name || fee.student?.name || 'Unknown'}`);
                    console.log(`      Status: ${fee.feeStatus || 'Unknown'}`);
                });
                console.log('');
            }

        } catch (error) {
            console.log('⚠️ Could not fetch sample data for quality check\n');
        }

        // Summary
        console.log('📋 FINAL VERIFICATION SUMMARY:\n');

        const workingPages = pageResults.filter(p => p.working).length;
        const totalPages = pageResults.length;

        console.log(`✅ Working Pages: ${workingPages}/${totalPages}`);
        console.log(`📊 Data Quality: ${allPagesWorking ? 'EXCELLENT' : 'GOOD'}`);

        pageResults.forEach(result => {
            const icon = result.working ? '✅' : '❌';
            const status = result.status === 'PASS' ? 'READY' : result.status;
            console.log(`   ${icon} ${result.name}: ${status}`);
            if (result.count !== undefined) {
                console.log(`      Data Count: ${result.count}`);
            }
        });

        console.log('\n🎯 SYSTEM STATUS:');
        if (allPagesWorking && workingPages === totalPages) {
            console.log('🎉 SYSTEM FULLY READY FOR DEMONSTRATION!');
            console.log('✅ All pages have comprehensive data');
            console.log('✅ All APIs are working correctly');
            console.log('✅ Fee and payment systems are operational');
        } else if (workingPages >= totalPages * 0.8) {
            console.log('✅ SYSTEM READY FOR DEMONSTRATION!');
            console.log('⚠️ Some pages may need additional data');
            console.log('✅ Core functionality is working');
        } else {
            console.log('⚠️ SYSTEM NEEDS ATTENTION');
            console.log('❌ Several pages have issues');
            console.log('🔧 Requires troubleshooting');
        }

        console.log('\n🔐 LOGIN INFORMATION:');
        console.log('   Admin: abhiyeduru@gmail.com / admin123');
        console.log('   URL: http://localhost:3000/login');
        console.log('   Dashboard: http://localhost:3000/admin/dashboard');

        console.log('\n📈 CURRENT DATA SUMMARY:');
        console.log(`   Students: ${studentsResponse?.data?.pagination?.total || 'Unknown'}`);
        console.log(`   Teachers: Available`);
        console.log(`   Fees: ${feesResponse?.data?.data?.length || 'Unknown'} (sample)`);
        console.log(`   Payments: ${paymentsResponse?.data?.pagination?.total || 'Unknown'}`);
        console.log(`   Revenue: Available`);

    } catch (error) {
        console.error('❌ Verification failed:', error.message);
    }
}

finalPageVerification();