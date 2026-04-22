// Add admission teams and comprehensive fee data to abhi college
const prisma = require('./lib/prisma');
const bcrypt = require('bcryptjs');

async function addAdmissionTeamsAndFees() {
    try {
        console.log('🎓 Adding admission teams and comprehensive fee data...\n');

        const collegeId = 'b75f1021-e248-4d5f-a185-7eebd84a8294'; // abhi college

        // Verify college exists
        const college = await prisma.college.findUnique({
            where: { id: collegeId }
        });

        if (!college) {
            console.log('❌ College not found');
            return;
        }

        console.log(`✅ Working with college: ${college.name}\n`);

        // STEP 1: Create Admission Team Members
        console.log('👥 Step 1: Creating Admission Team Members...\n');

        const admissionTeamMembers = [
            {
                name: 'Rajesh Kumar',
                email: 'rajesh.admission@abhi.edu',
                phone: '+91-9876543210',
                password: 'admission123',
                designation: 'Senior Admission Officer'
            },
            {
                name: 'Priya Sharma',
                email: 'priya.admission@abhi.edu',
                phone: '+91-9876543211',
                password: 'admission123',
                designation: 'Admission Counselor'
            },
            {
                name: 'Amit Patel',
                email: 'amit.admission@abhi.edu',
                phone: '+91-9876543212',
                password: 'admission123',
                designation: 'Admission Coordinator'
            },
            {
                name: 'Sneha Reddy',
                email: 'sneha.admission@abhi.edu',
                phone: '+91-9876543213',
                password: 'admission123',
                designation: 'Admission Assistant'
            },
            {
                name: 'Vikram Singh',
                email: 'vikram.admission@abhi.edu',
                phone: '+91-9876543214',
                password: 'admission123',
                designation: 'Admission Manager'
            }
        ];

        for (const member of admissionTeamMembers) {
            try {
                const hashedPassword = await bcrypt.hash(member.password, 10);

                // Create user
                const user = await prisma.user.create({
                    data: {
                        name: member.name,
                        email: member.email,
                        password: hashedPassword,
                        phone: member.phone,
                        role: 'AdmissionTeam',
                        collegeId,
                        isEmailVerified: true,
                        isActive: true,
                    },
                });

                // Create admission team profile
                const admissionProfile = await prisma.admissionTeam.create({
                    data: {
                        name: member.name,
                        email: member.email,
                        phone: member.phone,
                        designation: member.designation,
                        collegeId,
                        userId: user.id,
                    },
                });

                console.log(`   ✅ ${member.name} - ${member.designation}`);
            } catch (error) {
                console.log(`   ❌ Failed to create ${member.name}: ${error.message}`);
            }
        }

        // STEP 2: Create Accounts Team Members
        console.log('\n💰 Step 2: Creating Accounts Team Members...\n');

        const accountsTeamMembers = [
            {
                name: 'Suresh Agarwal',
                email: 'suresh.accounts@abhi.edu',
                phone: '+91-9876543220',
                password: 'accounts123',
                designation: 'Chief Accountant'
            },
            {
                name: 'Meera Joshi',
                email: 'meera.accounts@abhi.edu',
                phone: '+91-9876543221',
                password: 'accounts123',
                designation: 'Fee Collection Officer'
            },
            {
                name: 'Ravi Gupta',
                email: 'ravi.accounts@abhi.edu',
                phone: '+91-9876543222',
                password: 'accounts123',
                designation: 'Accounts Assistant'
            }
        ];

        for (const member of accountsTeamMembers) {
            try {
                const hashedPassword = await bcrypt.hash(member.password, 10);

                // Create user
                const user = await prisma.user.create({
                    data: {
                        name: member.name,
                        email: member.email,
                        password: hashedPassword,
                        phone: member.phone,
                        role: 'AccountsTeam',
                        collegeId,
                        isEmailVerified: true,
                        isActive: true,
                    },
                });

                // Create accounts team profile
                const accountsProfile = await prisma.accountsTeam.create({
                    data: {
                        name: member.name,
                        email: member.email,
                        phone: member.phone,
                        designation: member.designation,
                        collegeId,
                        userId: user.id,
                    },
                });

                console.log(`   ✅ ${member.name} - ${member.designation}`);
            } catch (error) {
                console.log(`   ❌ Failed to create ${member.name}: ${error.message}`);
            }
        }

        // STEP 3: Create Transport Team Members
        console.log('\n🚌 Step 3: Creating Transport Team Members...\n');

        const transportTeamMembers = [
            {
                name: 'Mahesh Kumar',
                email: 'mahesh.transport@abhi.edu',
                phone: '+91-9876543230',
                password: 'transport123',
                designation: 'Transport Manager'
            },
            {
                name: 'Sunita Devi',
                email: 'sunita.transport@abhi.edu',
                phone: '+91-9876543231',
                password: 'transport123',
                designation: 'Transport Coordinator'
            }
        ];

        for (const member of transportTeamMembers) {
            try {
                const hashedPassword = await bcrypt.hash(member.password, 10);

                // Create user
                const user = await prisma.user.create({
                    data: {
                        name: member.name,
                        email: member.email,
                        password: hashedPassword,
                        phone: member.phone,
                        role: 'TransportTeam',
                        collegeId,
                        isEmailVerified: true,
                        isActive: true,
                    },
                });

                // Create transport team profile
                const transportProfile = await prisma.transportTeam.create({
                    data: {
                        name: member.name,
                        email: member.email,
                        phone: member.phone,
                        designation: member.designation,
                        collegeId,
                        userId: user.id,
                    },
                });

                console.log(`   ✅ ${member.name} - ${member.designation}`);
            } catch (error) {
                console.log(`   ❌ Failed to create ${member.name}: ${error.message}`);
            }
        }

        // STEP 4: Create Additional Fee Types and Structures
        console.log('\n💳 Step 4: Creating Additional Fee Types and Structures...\n');

        // Get all students
        const students = await prisma.student.findMany({
            where: { collegeId },
            select: { id: true, name: true, studentId: true, sclassId: true }
        });

        console.log(`   Found ${students.length} students to add fees for...\n`);

        // Define additional fee types
        const additionalFeeTypes = [
            {
                feeType: 'Admission Fee',
                feeCategory: 'One-time',
                amount: 15000,
                description: 'One-time admission processing fee'
            },
            {
                feeType: 'Security Deposit',
                feeCategory: 'Refundable',
                amount: 10000,
                description: 'Refundable security deposit'
            },
            {
                feeType: 'Activity Fee',
                feeCategory: 'Annual',
                amount: 8000,
                description: 'Annual co-curricular activities fee'
            },
            {
                feeType: 'Computer Lab Fee',
                feeCategory: 'Semester',
                amount: 6000,
                description: 'Computer lab usage and maintenance fee'
            },
            {
                feeType: 'Hostel Fee',
                feeCategory: 'Monthly',
                amount: 12000,
                description: 'Monthly hostel accommodation fee'
            },
            {
                feeType: 'Mess Fee',
                feeCategory: 'Monthly',
                amount: 8000,
                description: 'Monthly mess and food charges'
            },
            {
                feeType: 'Medical Fee',
                feeCategory: 'Annual',
                amount: 3000,
                description: 'Annual medical and health checkup fee'
            },
            {
                feeType: 'Identity Card Fee',
                feeCategory: 'One-time',
                amount: 500,
                description: 'Student identity card issuance fee'
            },
            {
                feeType: 'Uniform Fee',
                feeCategory: 'Annual',
                amount: 4000,
                description: 'School uniform and dress code fee'
            },
            {
                feeType: 'Stationery Fee',
                feeCategory: 'Semester',
                amount: 2500,
                description: 'Books and stationery charges'
            }
        ];

        let totalFeesCreated = 0;

        // Create fees for each student
        for (const student of students) {
            for (const feeType of additionalFeeTypes) {
                try {
                    // Calculate due date based on fee category
                    let dueDate = new Date();
                    switch (feeType.feeCategory) {
                        case 'One-time':
                            dueDate.setDate(dueDate.getDate() + 30); // 30 days from now
                            break;
                        case 'Monthly':
                            dueDate.setDate(dueDate.getDate() + 15); // 15 days from now
                            break;
                        case 'Semester':
                            dueDate.setMonth(dueDate.getMonth() + 2); // 2 months from now
                            break;
                        case 'Annual':
                            dueDate.setMonth(dueDate.getMonth() + 6); // 6 months from now
                            break;
                        default:
                            dueDate.setMonth(dueDate.getMonth() + 1); // 1 month from now
                    }

                    const fee = await prisma.fee.create({
                        data: {
                            studentId: student.id,
                            feeType: feeType.feeType,
                            feeCategory: feeType.feeCategory,
                            amount: feeType.amount,
                            dueDate,
                            frequency: feeType.feeCategory,
                            description: feeType.description,
                            isActive: true,
                            collegeId,
                        },
                    });

                    totalFeesCreated++;
                } catch (error) {
                    console.log(`   ❌ Failed to create ${feeType.feeType} for ${student.name}: ${error.message}`);
                }
            }
        }

        console.log(`   ✅ Created ${totalFeesCreated} additional fee records\n`);

        // STEP 5: Create Additional Payment Records
        console.log('💰 Step 5: Creating Additional Payment Records...\n');

        const paymentMethods = ['Razorpay', 'UPI', 'Cash', 'Bank Transfer', 'Card', 'Net Banking', 'Cheque'];
        const paymentStatuses = ['completed', 'pending', 'failed'];
        let totalPaymentsCreated = 0;

        // Create random payments for some fees
        const recentFees = await prisma.fee.findMany({
            where: { collegeId },
            take: 200, // Process 200 fees for payments
            orderBy: { createdAt: 'desc' }
        });

        for (const fee of recentFees) {
            // 70% chance of payment
            if (Math.random() < 0.7) {
                try {
                    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                    const status = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
                    
                    // For completed payments, use full amount. For others, use partial or full
                    let amount = fee.amount;
                    if (status !== 'completed') {
                        amount = Math.floor(fee.amount * (0.5 + Math.random() * 0.5)); // 50-100% of fee
                    }

                    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
                    const receiptNumber = status === 'completed' ? `RCP${Date.now()}${Math.random().toString(36).substr(2, 6)}` : null;

                    const payment = await prisma.payment.create({
                        data: {
                            studentId: fee.studentId,
                            feeId: fee.id,
                            amount,
                            paymentMethod,
                            status,
                            transactionId,
                            receiptNumber,
                            notes: `Payment for ${fee.feeType}`,
                            collegeId,
                            paidAt: status === 'completed' ? new Date() : null,
                        },
                    });

                    totalPaymentsCreated++;
                } catch (error) {
                    console.log(`   ❌ Failed to create payment for fee ${fee.id}: ${error.message}`);
                }
            }
        }

        console.log(`   ✅ Created ${totalPaymentsCreated} additional payment records\n`);

        // STEP 6: Verify final counts
        console.log('📊 Step 6: Final Data Summary...\n');

        const [
            admissionTeamCount,
            accountsTeamCount,
            transportTeamCount,
            totalStudents,
            totalTeachers,
            totalFees,
            totalPayments,
            totalParents
        ] = await Promise.all([
            prisma.admissionTeam.count({ where: { collegeId } }),
            prisma.accountsTeam.count({ where: { collegeId } }),
            prisma.transportTeam.count({ where: { collegeId } }),
            prisma.student.count({ where: { collegeId } }),
            prisma.teacher.count({ where: { collegeId } }),
            prisma.fee.count({ where: { collegeId } }),
            prisma.payment.count({ where: { collegeId } }),
            prisma.parent.count({ where: { collegeId } })
        ]);

        console.log('📈 Final Data Counts for abhi college:');
        console.log(`   👥 Students: ${totalStudents}`);
        console.log(`   👨‍🏫 Teachers: ${totalTeachers}`);
        console.log(`   👨‍👩‍👧‍👦 Parents: ${totalParents}`);
        console.log(`   🎓 Admission Team: ${admissionTeamCount}`);
        console.log(`   💰 Accounts Team: ${accountsTeamCount}`);
        console.log(`   🚌 Transport Team: ${transportTeamCount}`);
        console.log(`   💳 Total Fees: ${totalFees}`);
        console.log(`   💰 Total Payments: ${totalPayments}`);

        console.log('\n🎉 All teams and fee data added successfully!');
        console.log('✅ abhiyeduru@gmail.com now has comprehensive ERP data');
        console.log('🔐 Login credentials:');
        console.log('   Admin: abhiyeduru@gmail.com / admin123');
        console.log('   Admission: rajesh.admission@abhi.edu / admission123');
        console.log('   Accounts: suresh.accounts@abhi.edu / accounts123');
        console.log('   Transport: mahesh.transport@abhi.edu / transport123');

    } catch (error) {
        console.error('❌ Process failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

addAdmissionTeamsAndFees();