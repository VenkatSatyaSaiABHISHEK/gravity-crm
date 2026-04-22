// Simple script to add fee and payment data without conflicts
// Run with: node add-simple-fee-data.js

const prisma = require('./lib/prisma');

function generateUniqueTransactionId() {
    return `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}${Math.floor(Math.random() * 100000)}`;
}

async function addSimpleFeeData() {
    try {
        console.log('🚀 Starting to add fee and payment data...');

        // Get college
        const college = await prisma.college.findFirst();
        if (!college) {
            console.log('❌ No college found.');
            return;
        }
        console.log(`✅ College: ${college.name}`);

        // Get all students
        const students = await prisma.student.findMany({
            where: { collegeId: college.id },
            include: { sclass: true },
        });

        console.log(`✅ Found ${students.length} students`);

        // Fee types
        const feeTypes = [
            { type: 'Tuition Fee', amount: 50000, category: 'Academic' },
            { type: 'Lab Fee', amount: 15000, category: 'Academic' },
            { type: 'Library Fee', amount: 5000, category: 'Academic' },
            { type: 'Sports Fee', amount: 8000, category: 'Sports' },
            { type: 'Transport Fee', amount: 12000, category: 'Transport' },
            { type: 'Exam Fee', amount: 3000, category: 'Academic' },
        ];

        const paymentMethods = ['razorpay', 'upi', 'cash', 'bank_transfer', 'card', 'net_banking'];

        let totalFees = 0;
        let totalPayments = 0;

        // Process each student individually to avoid conflicts
        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            console.log(`Processing student ${i + 1}/${students.length}: ${student.name}`);

            // Create 3-4 fees per student
            const studentFees = feeTypes.slice(0, Math.floor(Math.random() * 2) + 3);

            for (const feeType of studentFees) {
                try {
                    // Create fee
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
                            description: `${feeType.type} for ${student.name}`,
                            isActive: true,
                        },
                    });

                    totalFees++;

                    // 80% chance of payment
                    if (Math.random() < 0.8) {
                        const paymentDate = new Date();
                        paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 60)); // Last 60 days
                        
                        const paymentAmount = Math.random() < 0.9 ? feeType.amount : Math.floor(feeType.amount * 0.6);
                        const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

                        await prisma.payment.create({
                            data: {
                                studentId: student.id,
                                feeId: fee.id,
                                collegeId: college.id,
                                amount: paymentAmount,
                                paymentMethod: method,
                                transactionId: generateUniqueTransactionId(),
                                status: 'completed',
                                paymentDate: paymentDate,
                                notes: `${feeType.type} payment via ${method}`,
                                receiptNumber: `RCP${Date.now()}${Math.floor(Math.random() * 10000)}`,
                            },
                        });

                        totalPayments++;
                    }
                } catch (error) {
                    console.error(`Error processing fee for ${student.name}:`, error.message);
                }
            }

            // Add a small delay to avoid timestamp conflicts
            if (i % 10 === 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        // Add some additional recent payments for dashboard
        console.log('📊 Adding recent payments for dashboard...');
        
        for (let i = 0; i < 50; i++) {
            try {
                const randomStudent = students[Math.floor(Math.random() * students.length)];
                const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                const amount = Math.floor(Math.random() * 30000) + 5000;
                
                const paymentDate = new Date();
                paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 15)); // Last 15 days

                await prisma.payment.create({
                    data: {
                        studentId: randomStudent.id,
                        collegeId: college.id,
                        amount: amount,
                        paymentMethod: method,
                        transactionId: generateUniqueTransactionId(),
                        status: 'completed',
                        paymentDate: paymentDate,
                        notes: `Recent payment via ${method}`,
                        receiptNumber: `RCP${Date.now()}${i}${Math.floor(Math.random() * 1000)}`,
                    },
                });

                totalPayments++;
                
                // Small delay
                await new Promise(resolve => setTimeout(resolve, 50));
            } catch (error) {
                console.error(`Error creating recent payment ${i}:`, error.message);
            }
        }

        // Add some pending payments
        console.log('⏳ Adding pending payments...');
        
        for (let i = 0; i < 20; i++) {
            try {
                const randomStudent = students[Math.floor(Math.random() * students.length)];
                const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                const amount = Math.floor(Math.random() * 20000) + 5000;
                const status = Math.random() < 0.7 ? 'pending' : 'failed';

                await prisma.payment.create({
                    data: {
                        studentId: randomStudent.id,
                        collegeId: college.id,
                        amount: amount,
                        paymentMethod: method,
                        transactionId: generateUniqueTransactionId(),
                        status: status,
                        notes: `${status} payment via ${method}`,
                    },
                });

                totalPayments++;
                
                // Small delay
                await new Promise(resolve => setTimeout(resolve, 50));
            } catch (error) {
                console.error(`Error creating pending payment ${i}:`, error.message);
            }
        }

        console.log('============================================================');
        console.log('✅ FEE AND PAYMENT DATA ADDED SUCCESSFULLY!');
        console.log('============================================================');
        console.log(`📊 Final Summary:`);
        console.log(`   Total Fees Created: ${totalFees}`);
        console.log(`   Total Payments Created: ${totalPayments}`);
        console.log(`   Students Processed: ${students.length}`);
        console.log(`   College: ${college.name}`);
        console.log('');
        console.log('💳 Payment Methods:');
        paymentMethods.forEach(method => console.log(`   - ${method}`));
        console.log('');
        console.log('💰 Fee Types:');
        feeTypes.forEach(fee => console.log(`   - ${fee.type}: ₹${fee.amount.toLocaleString()}`));
        console.log('');
        console.log('📈 Payment Status:');
        console.log('   - Completed: ~80% of fees');
        console.log('   - Pending: ~15%');
        console.log('   - Failed: ~5%');
        console.log('');
        console.log('🌐 Access Admin Dashboard: http://localhost:3000/admin/dashboard');
        console.log('💰 Check Fee Management: http://localhost:3000/admin/fees');
        console.log('💳 Check Payment Records: http://localhost:3000/admin/payments');
        console.log('============================================================');

    } catch (error) {
        console.error('❌ Error adding fee and payment data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
addSimpleFeeData();