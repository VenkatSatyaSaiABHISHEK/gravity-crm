// Check all pages for data and fill empty pages with fee data
const axios = require('axios');
const prisma = require('./lib/prisma');
const bcrypt = require('bcryptjs');

async function checkAllPagesAndFillData() {
    try {
        console.log('🔍 Checking all pages and filling empty pages with data...\n');

        const collegeId = 'b75f1021-e248-4d5f-a185-7eebd84a8294'; // abhi college

        // STEP 1: Login and get token
        console.log('🔐 Step 1: Getting admin token...\n');
        
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
        const headers = { 'Authorization': `Bearer ${token}` };
        console.log('✅ Admin login successful\n');

        // STEP 2: Check all API endpoints
        console.log('📊 Step 2: Checking all API endpoints...\n');

        const endpoints = [
            { name: 'Dashboard', url: `/api/admin/dashboard?collegeId=${collegeId}`, critical: true },
            { name: 'Students', url: `/api/admin/students?collegeId=${collegeId}&page=1&limit=10`, critical: true },
            { name: 'Teachers', url: `/api/admin/teachers?collegeId=${collegeId}&page=1&limit=10`, critical: true },
            { name: 'Fees', url: `/api/admin/fees?collegeId=${collegeId}&page=1&limit=10`, critical: true },
            { name: 'Payments', url: `/api/admin/payments?collegeId=${collegeId}&page=1&limit=10`, critical: true },
            { name: 'Classes', url: `/api/admin/classes?collegeId=${collegeId}&page=1&limit=10`, critical: true },
            { name: 'Subjects', url: `/api/admin/subjects?collegeId=${collegeId}&page=1&limit=10`, critical: true },
            { name: 'Team Members', url: `/api/admin/team-members?collegeId=${collegeId}&page=1&limit=10`, critical: false },
            { name: 'HR Dashboard', url: `/api/admin/hr-dashboard?collegeId=${collegeId}`, critical: false },
        ];

        const emptyPages = [];
        const workingPages = [];

        for (const endpoint of endpoints) {
            try {
                const response = await axios.get(`http://localhost:5000${endpoint.url}`, {
                    headers,
                    timeout: 15000
                });

                if (response.data.success) {
                    const data = response.data.data;
                    const count = response.data.pagination?.total || (Array.isArray(data) ? data.length : 1);
                    
                    if (count === 0 || (Array.isArray(data) && data.length === 0)) {
                        console.log(`❌ ${endpoint.name}: EMPTY (${count} records)`);
                        emptyPages.push(endpoint);
                    } else {
                        console.log(`✅ ${endpoint.name}: ${count} records`);
                        workingPages.push({ ...endpoint, count });
                    }
                } else {
                    console.log(`❌ ${endpoint.name}: API Error - ${response.data.message}`);
                    if (endpoint.critical) emptyPages.push(endpoint);
                }
            } catch (error) {
                console.log(`❌ ${endpoint.name}: ${error.response?.data?.message || error.message}`);
                if (endpoint.critical) emptyPages.push(endpoint);
            }
        }

        // STEP 3: Check database counts
        console.log('\n📊 Step 3: Database verification...\n');

        const [
            studentsCount, teachersCount, feesCount, paymentsCount, 
            classesCount, subjectsCount, parentsCount, admissionTeamCount,
            accountsTeamCount, transportTeamCount, employeesCount, hrManagersCount
        ] = await Promise.all([
            prisma.student.count({ where: { collegeId } }),
            prisma.teacher.count({ where: { collegeId } }),
            prisma.fee.count({ where: { collegeId } }),
            prisma.payment.count({ where: { collegeId } }),
            prisma.sclass.count({ where: { collegeId } }),
            prisma.subject.count({ where: { collegeId } }),
            prisma.parent.count({ where: { collegeId } }),
            prisma.admissionTeam.count({ where: { collegeId } }),
            prisma.accountsTeam.count({ where: { collegeId } }),
            prisma.transportTeam.count({ where: { collegeId } }),
            prisma.employee.count({ where: { collegeId } }),
            prisma.hRManager.count({ where: { collegeId } })
        ]);

        console.log('Database Counts:');
        console.log(`   Students: ${studentsCount}`);
        console.log(`   Teachers: ${teachersCount}`);
        console.log(`   Fees: ${feesCount}`);
        console.log(`   Payments: ${paymentsCount}`);
        console.log(`   Classes: ${classesCount}`);
        console.log(`   Subjects: ${subjectsCount}`);
        console.log(`   Parents: ${parentsCount}`);
        console.log(`   Admission Team: ${admissionTeamCount}`);
        console.log(`   Accounts Team: ${accountsTeamCount}`);
        console.log(`   Transport Team: ${transportTeamCount}`);
        console.log(`   Employees: ${employeesCount}`);
        console.log(`   HR Managers: ${hrManagersCount}`);

        // STEP 4: Fill missing data
        console.log('\n🔧 Step 4: Filling missing data...\n');

        // Add more parents if needed
        if (parentsCount < 20) {
            console.log('👨‍👩‍👧‍👦 Adding more parents...');
            
            const studentsWithoutParents = await prisma.student.findMany({
                where: { 
                    collegeId,
                    parentId: null 
                },
                take: 30
            });

            let parentsAdded = 0;
            for (let i = 0; i < Math.min(20, studentsWithoutParents.length); i++) {
                try {
                    const student = studentsWithoutParents[i];
                    const parentEmail = `parent${parentsCount + i + 1}@abhi.edu`;
                    const hashedPassword = await bcrypt.hash('parent123', 10);

                    // Create parent user
                    const parentUser = await prisma.user.create({
                        data: {
                            name: `Parent of ${student.name}`,
                            email: parentEmail,
                            password: hashedPassword,
                            phone: `+91-98765432${String(i).padStart(2, '0')}`,
                            role: 'Parent',
                            collegeId,
                            isActive: true,
                        },
                    });

                    // Create parent profile
                    const parent = await prisma.parent.create({
                        data: {
                            name: `Parent of ${student.name}`,
                            email: parentEmail,
                            phone: `+91-98765432${String(i).padStart(2, '0')}`,
                            occupation: ['Engineer', 'Doctor', 'Teacher', 'Business', 'Government'][i % 5],
                            address: `Address ${i + 1}, City, State`,
                            collegeId,
                            userId: parentUser.id,
                        },
                    });

                    // Link student to parent
                    await prisma.student.update({
                        where: { id: student.id },
                        data: { parentId: parent.id }
                    });

                    parentsAdded++;
                } catch (error) {
                    console.log(`   ❌ Failed to create parent ${i + 1}: ${error.message}`);
                }
            }
            console.log(`   ✅ Added ${parentsAdded} parents`);
        }

        // Add more employees if needed
        if (employeesCount < 20) {
            console.log('👔 Adding more employees...');
            
            const employeeRoles = [
                'Administrative Officer', 'Librarian', 'Lab Assistant', 'Security Guard',
                'Maintenance Staff', 'IT Support', 'Counselor', 'Nurse',
                'Accountant', 'Receptionist', 'Clerk', 'Supervisor'
            ];

            let employeesAdded = 0;
            for (let i = employeesCount; i < 20; i++) {
                try {
                    const employee = await prisma.employee.create({
                        data: {
                            name: `Employee ${i + 1}`,
                            email: `employee${i + 1}@abhi.edu`,
                            phone: `+91-98765433${String(i).padStart(2, '0')}`,
                            position: employeeRoles[i % employeeRoles.length],
                            department: ['Administration', 'IT', 'Maintenance', 'Security', 'Medical'][i % 5],
                            salary: 25000 + (i * 2000),
                            joiningDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
                            collegeId,
                        },
                    });
                    employeesAdded++;
                } catch (error) {
                    console.log(`   ❌ Failed to create employee ${i + 1}: ${error.message}`);
                }
            }
            console.log(`   ✅ Added ${employeesAdded} employees`);
        }

        // Add more fee types if needed
        console.log('💳 Adding additional fee types...');
        
        const additionalFeeTypes = [
            { type: 'Registration Fee', category: 'One-time', amount: 2000 },
            { type: 'Caution Money', category: 'Refundable', amount: 5000 },
            { type: 'Magazine Fee', category: 'Annual', amount: 1000 },
            { type: 'Cultural Fee', category: 'Annual', amount: 3000 },
            { type: 'Internet Fee', category: 'Semester', amount: 2000 },
            { type: 'Parking Fee', category: 'Annual', amount: 1500 },
            { type: 'Locker Fee', category: 'Annual', amount: 800 },
            { type: 'Graduation Fee', category: 'One-time', amount: 10000 }
        ];

        const students = await prisma.student.findMany({
            where: { collegeId },
            take: 50 // Add fees for 50 students
        });

        let additionalFeesAdded = 0;
        for (const student of students) {
            for (const feeType of additionalFeeTypes) {
                // Check if this fee type already exists for this student
                const existingFee = await prisma.fee.findFirst({
                    where: {
                        studentId: student.id,
                        feeType: feeType.type,
                        collegeId
                    }
                });

                if (!existingFee) {
                    try {
                        let dueDate = new Date();
                        switch (feeType.category) {
                            case 'One-time':
                                dueDate.setDate(dueDate.getDate() + 30);
                                break;
                            case 'Annual':
                                dueDate.setMonth(dueDate.getMonth() + 6);
                                break;
                            case 'Semester':
                                dueDate.setMonth(dueDate.getMonth() + 3);
                                break;
                            default:
                                dueDate.setMonth(dueDate.getMonth() + 1);
                        }

                        await prisma.fee.create({
                            data: {
                                studentId: student.id,
                                feeType: feeType.type,
                                feeCategory: feeType.category,
                                amount: feeType.amount,
                                dueDate,
                                frequency: feeType.category,
                                description: `${feeType.type} for ${student.name}`,
                                isActive: true,
                                collegeId,
                            },
                        });
                        additionalFeesAdded++;
                    } catch (error) {
                        // Fee might already exist, continue
                    }
                }
            }
        }
        console.log(`   ✅ Added ${additionalFeesAdded} additional fee records`);

        // Add more payment records
        console.log('💰 Adding more payment records...');
        
        const unpaidFees = await prisma.fee.findMany({
            where: {
                collegeId,
                Payments: { none: {} }
            },
            take: 100,
            include: {
                student: { select: { name: true } }
            }
        });

        const paymentMethods = ['Razorpay', 'UPI', 'Cash', 'Bank Transfer', 'Card', 'Net Banking'];
        const paymentStatuses = ['completed', 'pending', 'failed'];
        let additionalPaymentsAdded = 0;

        for (const fee of unpaidFees) {
            if (Math.random() < 0.6) { // 60% chance of payment
                try {
                    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                    const status = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
                    const amount = status === 'completed' ? fee.amount : Math.floor(fee.amount * (0.5 + Math.random() * 0.5));
                    
                    await prisma.payment.create({
                        data: {
                            studentId: fee.studentId,
                            feeId: fee.id,
                            amount,
                            paymentMethod,
                            status,
                            transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
                            receiptNumber: status === 'completed' ? `RCP${Date.now()}${Math.random().toString(36).substr(2, 6)}` : null,
                            notes: `Payment for ${fee.feeType}`,
                            collegeId,
                            paymentDate: status === 'completed' ? new Date() : null,
                        },
                    });
                    additionalPaymentsAdded++;
                } catch (error) {
                    // Continue on error
                }
            }
        }
        console.log(`   ✅ Added ${additionalPaymentsAdded} additional payment records`);

        // STEP 5: Re-check all endpoints
        console.log('\n🔍 Step 5: Re-checking all endpoints after data addition...\n');

        for (const endpoint of endpoints) {
            try {
                const response = await axios.get(`http://localhost:5000${endpoint.url}`, {
                    headers,
                    timeout: 15000
                });

                if (response.data.success) {
                    const data = response.data.data;
                    const count = response.data.pagination?.total || (Array.isArray(data) ? data.length : 1);
                    console.log(`✅ ${endpoint.name}: ${count} records`);
                } else {
                    console.log(`❌ ${endpoint.name}: ${response.data.message}`);
                }
            } catch (error) {
                console.log(`❌ ${endpoint.name}: ${error.response?.data?.message || error.message}`);
            }
        }

        // STEP 6: Final summary
        console.log('\n📊 Step 6: Final Data Summary...\n');

        const [
            finalStudents, finalTeachers, finalFees, finalPayments,
            finalParents, finalEmployees, finalAdmissionTeam, finalAccountsTeam
        ] = await Promise.all([
            prisma.student.count({ where: { collegeId } }),
            prisma.teacher.count({ where: { collegeId } }),
            prisma.fee.count({ where: { collegeId } }),
            prisma.payment.count({ where: { collegeId } }),
            prisma.parent.count({ where: { collegeId } }),
            prisma.employee.count({ where: { collegeId } }),
            prisma.admissionTeam.count({ where: { collegeId } }),
            prisma.accountsTeam.count({ where: { collegeId } })
        ]);

        const revenueData = await prisma.payment.aggregate({
            where: { collegeId, status: 'completed' },
            _sum: { amount: true }
        });

        console.log('🎉 FINAL SYSTEM STATUS:');
        console.log(`   👥 Students: ${finalStudents}`);
        console.log(`   👨‍🏫 Teachers: ${finalTeachers}`);
        console.log(`   👨‍👩‍👧‍👦 Parents: ${finalParents}`);
        console.log(`   👔 Employees: ${finalEmployees}`);
        console.log(`   🎓 Admission Team: ${finalAdmissionTeam}`);
        console.log(`   💰 Accounts Team: ${finalAccountsTeam}`);
        console.log(`   💳 Total Fees: ${finalFees}`);
        console.log(`   💰 Total Payments: ${finalPayments}`);
        console.log(`   💵 Total Revenue: ₹${revenueData._sum.amount || 0}`);

        console.log('\n✅ All pages checked and filled with comprehensive data!');
        console.log('🌐 System is ready for full demonstration');
        console.log('🔐 Login: abhiyeduru@gmail.com / admin123');

    } catch (error) {
        console.error('❌ Process failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAllPagesAndFillData();