// Simple script to add students, parents, and fees with correct schema
// Run with: node add-students-parents-simple.js

const prisma = require('./lib/prisma');
const bcrypt = require('bcryptjs');

async function addStudentsParentsSimple() {
    try {
        console.log('🚀 Adding students, parents, and fees...');

        // Get college
        const college = await prisma.college.findFirst();
        if (!college) {
            console.log('❌ No college found.');
            return;
        }
        console.log(`✅ College: ${college.name}`);

        // Get existing classes
        const classes = await prisma.sclass.findMany({
            where: { collegeId: college.id },
        });
        console.log(`✅ Found ${classes.length} classes`);

        // Check existing students count
        const existingStudents = await prisma.student.count({
            where: { collegeId: college.id }
        });
        console.log(`📊 Existing students: ${existingStudents}`);

        // Student names
        const names = [
            'Rahul Kumar', 'Priya Singh', 'Amit Sharma', 'Sneha Patel', 'Vikash Gupta',
            'Pooja Verma', 'Ravi Reddy', 'Kavya Nair', 'Suresh Mehta', 'Anita Jain',
            'Deepak Shah', 'Meera Desai', 'Ajay Malhotra', 'Sita Chopra', 'Kiran Saxena',
            'Neha Agarwal', 'Rohit Bansal', 'Divya Tiwari', 'Manoj Pandey', 'Sunita Joshi'
        ];

        // Fee types
        const feeTypes = [
            { type: 'Tuition Fee', amount: 50000, category: 'Academic' },
            { type: 'Lab Fee', amount: 15000, category: 'Academic' },
            { type: 'Sports Fee', amount: 8000, category: 'Sports' },
            { type: 'Transport Fee', amount: 12000, category: 'Transport' },
            { type: 'Exam Fee', amount: 3000, category: 'Academic' }
        ];

        const paymentMethods = ['razorpay', 'upi', 'cash', 'bank_transfer', 'card'];

        let studentsCreated = 0;
        let parentsCreated = 0;
        let feesCreated = 0;
        let paymentsCreated = 0;

        // Create 20 students with parents and fees
        for (let i = 1; i <= 20; i++) {
            try {
                const studentName = names[i - 1] || `Student ${existingStudents + i}`;
                const studentEmail = `student${existingStudents + i}@demo.com`;
                const studentId = `STU${String(existingStudents + i).padStart(3, '0')}`;
                const randomClass = classes[Math.floor(Math.random() * classes.length)];

                // Hash password
                const hashedPassword = await bcrypt.hash('student123', 10);

                // Create student user
                const studentUser = await prisma.user.create({
                    data: {
                        name: studentName,
                        email: studentEmail,
                        password: hashedPassword,
                        role: 'Student',
                        collegeId: college.id,
                        isActive: true,
                    },
                });

                // Create parent user (80% chance)
                let parent = null;
                if (Math.random() < 0.8) {
                    const parentName = `${studentName.split(' ')[0]}'s Parent`;
                    const parentEmail = `parent${existingStudents + i}@demo.com`;
                    const parentPassword = await bcrypt.hash('parent123', 10);

                    const parentUser = await prisma.user.create({
                        data: {
                            name: parentName,
                            email: parentEmail,
                            password: parentPassword,
                            role: 'Parent',
                            collegeId: college.id,
                            isActive: true,
                        },
                    });

                    // Create parent profile
                    parent = await prisma.parent.create({
                        data: {
                            name: parentName,
                            email: parentEmail,
                            phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                            occupation: ['Engineer', 'Doctor', 'Teacher', 'Business'][Math.floor(Math.random() * 4)],
                            address: `${Math.floor(Math.random() * 999) + 1}, Demo Street, Demo City`,
                            collegeId: college.id,
                            userId: parentUser.id,
                        },
                    });

                    parentsCreated++;
                }

                // Create student profile
                const student = await prisma.student.create({
                    data: {
                        name: studentName,
                        studentId: studentId,
                        email: studentEmail,
                        phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                        password: hashedPassword, // Required field
                        dateOfBirth: new Date(2005 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
                        gender: Math.random() < 0.5 ? 'Male' : 'Female',
                        sclassId: randomClass.id,
                        parentId: parent?.id || null,
                        collegeId: college.id,
                        userId: studentUser.id,
                        isActive: true,
                    },
                });

                studentsCreated++;

                // Create fees for this student
                for (const feeType of feeTypes) {
                    // 70% chance for each fee type
                    if (Math.random() < 0.7) {
                        const dueDate = new Date();
                        dueDate.setDate(dueDate.getDate() + (Math.random() * 90 - 45)); // ±45 days

                        const fee = await prisma.fee.create({
                            data: {
                                studentId: student.id,
                                collegeId: college.id,
                                feeType: feeType.type,
                                feeCategory: feeType.category,
                                amount: feeType.amount,
                                dueDate: dueDate,
                                description: `${feeType.type} for ${studentName}`,
                                isActive: true,
                            },
                        });

                        feesCreated++;

                        // 75% chance of payment
                        if (Math.random() < 0.75) {
                            const paymentDate = new Date();
                            paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 30)); // Last 30 days
                            
                            const paymentAmount = Math.random() < 0.9 ? fee.amount : Math.floor(fee.amount * 0.6);
                            const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

                            await prisma.payment.create({
                                data: {
                                    studentId: student.id,
                                    feeId: fee.id,
                                    collegeId: college.id,
                                    amount: paymentAmount,
                                    paymentMethod: method,
                                    transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
                                    status: 'completed',
                                    paymentDate: paymentDate,
                                    notes: `${feeType.type} payment via ${method}`,
                                    receiptNumber: `RCP${Date.now()}${Math.floor(Math.random() * 10000)}`,
                                },
                            });

                            paymentsCreated++;
                        }
                    }
                }

                console.log(`✅ Created student ${existingStudents + i}: ${studentName}`);

                // Small delay
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                console.error(`❌ Error creating student ${existingStudents + i}:`, error.message);
            }
        }

        console.log('============================================================');
        console.log('✅ STUDENTS, PARENTS, AND FEES ADDED SUCCESSFULLY!');
        console.log('============================================================');
        console.log(`📊 Summary:`);
        console.log(`   New Students Created: ${studentsCreated}`);
        console.log(`   New Parents Created: ${parentsCreated}`);
        console.log(`   New Fees Created: ${feesCreated}`);
        console.log(`   New Payments Created: ${paymentsCreated}`);
        console.log(`   College: ${college.name}`);
        console.log('');
        console.log('🔐 Login Credentials:');
        console.log(`   Students: student${existingStudents + 1}@demo.com to student${existingStudents + 20}@demo.com`);
        console.log(`   Password: student123`);
        console.log(`   Parents: parent${existingStudents + 1}@demo.com to parent${existingStudents + 20}@demo.com`);
        console.log(`   Password: parent123`);
        console.log('');
        console.log('🌐 Website Access:');
        console.log('   Admin Dashboard: http://localhost:3000/admin/dashboard');
        console.log('   Students Page: http://localhost:3000/admin/students');
        console.log('   Parents Page: http://localhost:3000/admin/parents');
        console.log('   Fees Page: http://localhost:3000/admin/fees');
        console.log('   Payments Page: http://localhost:3000/admin/payments');
        console.log('');
        console.log('✅ All data is now visible on the website!');
        console.log('============================================================');

    } catch (error) {
        console.error('❌ Error adding students, parents, and fees:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
addStudentsParentsSimple();