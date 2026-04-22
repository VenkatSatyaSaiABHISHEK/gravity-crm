// Script to add comprehensive fee and payment data
// Run with: node add-fee-payment-data.js

const prisma = require('./lib/prisma');

async function addFeePaymentData() {
    try {
        console.log('🚀 Starting to add fee and payment data...');

        // Get college
        const college = await prisma.college.findFirst();
        if (!college) {
            console.log('❌ No college found. Please create a college first.');
            return;
        }
        console.log(`✅ College: ${college.name}`);

        // Get all students
        const students = await prisma.student.findMany({
            where: { collegeId: college.id },
            include: {
                sclass: true,
                parent: true,
            },
        });

        if (students.length === 0) {
            console.log('❌ No students found. Please add students first.');
            return;
        }
        console.log(`✅ Found ${students.length} students`);

        // Fee types and amounts
        const feeTypes = [
            { type: 'Tuition Fee', amount: 50000, category: 'Academic' },
            { type: 'Lab Fee', amount: 15000, category: 'Academic' },
            { type: 'Library Fee', amount: 5000, category: 'Academic' },
            { type: 'Sports Fee', amount: 8000, category: 'Extra-curricular' },
            { type: 'Transport Fee', amount: 12000, category: 'Transport' },
            { type: 'Hostel Fee', amount: 35000, category: 'Accommodation' },
            { type: 'Exam Fee', amount: 3000, category: 'Academic' },
            { type: 'Development Fee', amount: 10000, category: 'Infrastructure' },
        ];

        // Payment methods
        const paymentMethods = [
            'razorpay',
            'bank_transfer',
            'cash',
            'cheque',
            'upi',
            'card',
            'net_banking'
        ];

        let feesCreated = 0;
        let paymentsCreated = 0;

        // Create fees for each student
        for (const student of students) {
            // Each student gets 3-5 different fee types
            const studentFeeTypes = feeTypes.slice(0, Math.floor(Math.random() * 3) + 3);
            
            for (const feeType of studentFeeTypes) {
                // Create due date (some past, some future)
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + (Math.random() * 120 - 60)); // ±60 days

                const fee = await prisma.fee.create({
                    data: {
                        studentId: student.id,
                        collegeId: college.id,
                        feeType: feeType.type,
                        feeCategory: feeType.category,
                        amount: feeType.amount,
                        dueDate: dueDate,
                        description: `${feeType.type} for ${student.name}`,
                        isActive: true,
                    },
                });

                feesCreated++;

                // 70% chance of payment (some fees paid, some pending)
                if (Math.random() < 0.7) {
                    // Payment amount (sometimes partial, sometimes full)
                    const paymentAmount = Math.random() < 0.8 
                        ? feeType.amount // Full payment
                        : Math.floor(feeType.amount * (0.3 + Math.random() * 0.4)); // Partial payment

                    // Payment date (within last 90 days)
                    const paymentDate = new Date();
                    paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 90));

                    // Random payment method
                    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

                    // Generate transaction ID
                    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

                    const payment = await prisma.payment.create({
                        data: {
                            studentId: student.id,
                            feeId: fee.id,
                            collegeId: college.id,
                            amount: paymentAmount,
                            paymentMethod: paymentMethod,
                            transactionId: transactionId,
                            status: 'completed',
                            paymentDate: paymentDate,
                            createdAt: paymentDate,
                            notes: `Payment for ${feeType.type} via ${paymentMethod}`,
                            receiptNumber: `RCP${Date.now()}${Math.floor(Math.random() * 1000)}`,
                        },
                    });

                    paymentsCreated++;
                }
            }
        }

        // Create some additional bulk payments for better data
        console.log('💰 Creating additional payment records...');

        for (let i = 0; i < 50; i++) {
            const randomStudent = students[Math.floor(Math.random() * students.length)];
            const randomFeeType = feeTypes[Math.floor(Math.random() * feeTypes.length)];
            const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
            
            // Payment date within last 6 months
            const paymentDate = new Date();
            paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 180));

            const amount = Math.floor(Math.random() * 30000) + 5000; // 5k to 35k
            const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;

            await prisma.payment.create({
                data: {
                    studentId: randomStudent.id,
                    collegeId: college.id,
                    amount: amount,
                    paymentMethod: paymentMethod,
                    transactionId: transactionId,
                    status: 'completed',
                    paymentDate: paymentDate,
                    createdAt: paymentDate,
                    notes: `${randomFeeType.type} payment via ${paymentMethod}`,
                    receiptNumber: `RCP${Date.now()}${Math.floor(Math.random() * 10000)}`,
                },
            });

            paymentsCreated++;
        }

        // Create some pending/failed payments for realistic data
        console.log('⏳ Creating pending and failed payment records...');

        for (let i = 0; i < 20; i++) {
            const randomStudent = students[Math.floor(Math.random() * students.length)];
            const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
            const amount = Math.floor(Math.random() * 25000) + 5000;
            const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;

            const status = Math.random() < 0.6 ? 'pending' : 'failed';

            await prisma.payment.create({
                data: {
                    studentId: randomStudent.id,
                    collegeId: college.id,
                    amount: amount,
                    paymentMethod: paymentMethod,
                    transactionId: transactionId,
                    status: status,
                    notes: `${status} payment via ${paymentMethod}`,
                    receiptNumber: status === 'completed' ? `RCP${Date.now()}${Math.floor(Math.random() * 10000)}` : null,
                },
            });

            paymentsCreated++;
        }

        console.log('============================================================');
        console.log('✅ FEE AND PAYMENT DATA ADDED SUCCESSFULLY!');
        console.log('============================================================');
        console.log(`📊 Summary:`);
        console.log(`   Fees Created: ${feesCreated}`);
        console.log(`   Payments Created: ${paymentsCreated}`);
        console.log(`   Students with Fees: ${students.length}`);
        console.log(`   College: ${college.name}`);
        console.log('');
        console.log('💳 Payment Methods Added:');
        paymentMethods.forEach(method => console.log(`   - ${method}`));
        console.log('');
        console.log('💰 Fee Types Added:');
        feeTypes.forEach(fee => console.log(`   - ${fee.type}: ₹${fee.amount}`));
        console.log('');
        console.log('🌐 Access at: http://localhost:3000');
        console.log('============================================================');

    } catch (error) {
        console.error('❌ Error adding fee and payment data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
addFeePaymentData();