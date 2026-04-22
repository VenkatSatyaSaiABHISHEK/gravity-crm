// Script to add more students, parents, and fee data
// Run with: node add-more-students-parents-fees.js

const prisma = require('./lib/prisma');
const bcrypt = require('bcryptjs');

async function addMoreStudentsParentsFees() {
    try {
        console.log('🚀 Adding more students, parents, and fee data...');

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
            include: { Sections: true }
        });
        console.log(`✅ Found ${classes.length} classes`);

        // Check existing students count
        const existingStudents = await prisma.student.count({
            where: { collegeId: college.id }
        });
        console.log(`📊 Existing students: ${existingStudents}`);

        // Student names for variety
        const firstNames = [
            'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
            'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Vivek', 'Rudra', 'Shlok', 'Kian', 'Aryan', 'Kabir',
            'Saanvi', 'Diya', 'Aanya', 'Kiara', 'Myra', 'Anika', 'Navya', 'Pari', 'Aadhya', 'Angel',
            'Priya', 'Ananya', 'Sneha', 'Pooja', 'Divya', 'Sakshi', 'Isha', 'Neha', 'Zara', 'Kavya'
        ];

        const lastNames = [
            'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Shah', 'Reddy', 'Nair', 'Mehta',
            'Agarwal', 'Jain', 'Bansal', 'Malhotra', 'Chopra', 'Desai', 'Saxena', 'Joshi', 'Tiwari', 'Pandey'
        ];

        // Fee types with realistic amounts
        const feeTypes = [
            { type: 'Tuition Fee', amount: 45000, category: 'Academic', mandatory: true },
            { type: 'Admission Fee', amount: 25000, category: 'Academic', mandatory: true },
            { type: 'Lab Fee', amount: 12000, category: 'Academic', mandatory: false },
            { type: 'Library Fee', amount: 4000, category: 'Academic', mandatory: false },
            { type: 'Sports Fee', amount: 6000, category: 'Sports', mandatory: false },
            { type: 'Transport Fee', amount: 15000, category: 'Transport', mandatory: false },
            { type: 'Hostel Fee', amount: 35000, category: 'Accommodation', mandatory: false },
            { type: 'Exam Fee', amount: 2500, category: 'Academic', mandatory: true },
            { type: 'Development Fee', amount: 8000, category: 'Infrastructure', mandatory: true },
            { type: 'Computer Fee', amount: 7000, category: 'Academic', mandatory: false },
            { type: 'Activity Fee', amount: 3000, category: 'Extra-curricular', mandatory: false },
            { type: 'Medical Fee', amount: 2000, category: 'Health', mandatory: false }
        ];

        const paymentMethods = ['razorpay', 'upi', 'cash', 'bank_transfer', 'card', 'net_banking', 'cheque'];

        let studentsCreated = 0;
        let parentsCreated = 0;
        let feesCreated = 0;
        let paymentsCreated = 0;

        // Create 50 more students with parents and fees
        for (let i = existingStudents + 1; i <= existingStudents + 50; i++) {
            try {
                const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                const studentName = `${firstName} ${lastName}`;
                const studentEmail = `student${i}@demo.com`;
                const studentId = `STU${String(i).padStart(3, '0')}`;

                // Random class and section
                const randomClass = classes[Math.floor(Math.random() * classes.length)];
                const randomSection = randomClass.Sections.length > 0 
                    ? randomClass.Sections[Math.floor(Math.random() * randomClass.Sections.length)]
                    : null;

                // Create student user
                const hashedPassword = await bcrypt.hash('student123', 10);
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

                // Create parent user (70% chance)
                let parentUser = null;
                let parent = null;
                if (Math.random() < 0.7) {
                    const parentName = `${firstName}'s Parent`;
                    const parentEmail = `parent${i}@demo.com`;
                    const parentPassword = await bcrypt.hash('parent123', 10);

                    parentUser = await prisma.user.create({
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
                            occupation: ['Engineer', 'Doctor', 'Teacher', 'Business', 'Government'][Math.floor(Math.random() * 5)],
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
                        email: studentEmail,
                        studentId: studentId,
                        phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                        dateOfBirth: new Date(2005 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
                        gender: Math.random() < 0.5 ? 'Male' : 'Female',
                        address: `${Math.floor(Math.random() * 999) + 1}, Student Street, Demo City`,
                        admissionDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
                        sclassId: randomClass.id,
                        sectionId: randomSection?.id || null,
                        parentId: parent?.id || null,
                        collegeId: college.id,
                        userId: studentUser.id,
                        isActive: true,
                    },
                });

                studentsCreated++;

                // Create fees for this student
                const studentFeeTypes = feeTypes.filter(fee => 
                    fee.mandatory || Math.random() < 0.6 // 60% chance for optional fees
                );

                for (const feeType of studentFeeTypes) {
                    // Create due date (some past, some future)
                    const dueDate = new Date();
                    dueDate.setDate(dueDate.getDate() + (Math.random() * 180 - 90)); // ±90 days

                    const fee = await prisma.fee.create({
                        data: {
                            studentId: student.id,
                            collegeId: college.id,
                            feeType: feeType.type,
                            feeCategory: feeType.category,
                            amount: feeType.amount + Math.floor(Math.random() * 5000), // Add some variation
                            dueDate: dueDate,
                            description: `${feeType.type} for ${studentName} - ${randomClass.sclassName}`,
                            isActive: true,
                        },
                    });

                    feesCreated++;

                    // 75% chance of payment
                    if (Math.random() < 0.75) {
                        const paymentDate = new Date();
                        paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 60)); // Last 60 days
                        
                        // Payment amount (85% full payment, 15% partial)
                        const paymentAmount = Math.random() < 0.85 
                            ? fee.amount 
                            : Math.floor(fee.amount * (0.4 + Math.random() * 0.4));
                        
                        const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                        const txnId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

                        await prisma.payment.create({
                            data: {
                                studentId: student.id,
                                feeId: fee.id,
                                collegeId: college.id,
                                amount: paymentAmount,
                                paymentMethod: method,
                                transactionId: txnId,
                                status: 'completed',
                                paymentDate: paymentDate,
                                notes: `${feeType.type} payment via ${method}`,
                                receiptNumber: `RCP${Date.now()}${Math.floor(Math.random() * 10000)}`,
                            },
                        });

                        paymentsCreated++;
                    }
                }

                console.log(`✅ Created student ${i}: ${studentName} with ${studentFeeTypes.length} fees`);

                // Small delay to avoid conflicts
                if (i % 5 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

            } catch (error) {
                console.error(`❌ Error creating student ${i}:`, error.message);
            }
        }

        // Add some additional recent payments for better dashboard data
        console.log('💳 Adding recent payment transactions...');
        
        const allStudents = await prisma.student.findMany({
            where: { collegeId: college.id },
            take: 30
        });

        for (let i = 0; i < 25; i++) {
            try {
                const randomStudent = allStudents[Math.floor(Math.random() * allStudents.length)];
                const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                const amount = Math.floor(Math.random() * 40000) + 5000; // 5k to 45k
                
                const paymentDate = new Date();
                paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 7)); // Last 7 days

                await prisma.payment.create({
                    data: {
                        studentId: randomStudent.id,
                        collegeId: college.id,
                        amount: amount,
                        paymentMethod: method,
                        transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
                        status: 'completed',
                        paymentDate: paymentDate,
                        notes: `Recent ${method} payment`,
                        receiptNumber: `RCP${Date.now()}${i}${Math.floor(Math.random() * 1000)}`,
                    },
                });

                paymentsCreated++;
                await new Promise(resolve => setTimeout(resolve, 50));
            } catch (error) {
                console.error(`Error creating recent payment ${i}:`, error.message);
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
        console.log('💰 Fee Types Available:');
        feeTypes.forEach(fee => {
            console.log(`   - ${fee.type}: ₹${fee.amount.toLocaleString()} (${fee.category})`);
        });
        console.log('');
        console.log('💳 Payment Methods:');
        paymentMethods.forEach(method => console.log(`   - ${method}`));
        console.log('');
        console.log('🔐 New Login Credentials:');
        console.log(`   Students: student${existingStudents + 1}@demo.com to student${existingStudents + 50}@demo.com`);
        console.log(`   Password: student123`);
        console.log(`   Parents: parent${existingStudents + 1}@demo.com to parent${existingStudents + 50}@demo.com`);
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
addMoreStudentsParentsFees();