// Quick script to add fee and payment data
// Run with: node add-quick-fee-data.js

const prisma = require('./lib/prisma');

async function addQuickFeeData() {
    try {
        console.log('🚀 Starting to add fee and payment data...');

        // Get college
        const college = await prisma.college.findFirst();
        if (!college) {
            console.log('❌ No college found.');
            return;
        }
        console.log(`✅ College: ${college.name}`);

        // Get first 20 students for quick testing
        const students = await prisma.student.findMany({
            where: { collegeId: college.id },
            take: 20,
            include: { sclass: true },
        });

        console.log(`✅ Found ${students.length} students`);

        // Fee types
        const feeTypes = [
            { type: 'Tuition Fee', amount: 50000 },
            { type: 'Lab Fee', amount: 15000 },
            { type: 'Transport Fee', amount: 12000 },
            { type: 'Sports Fee', amount: 8000 },
        ];

        const paymentMethods = ['razorpay', 'upi', 'cash', 'bank_transfer', 'card'];

        let feesCreated = 0;
        let paymentsCreated = 0;

        // Create fees and payments in batches
        const feeData = [];
        const paymentData = [];

        for (const student of students) {
            for (const feeType of feeTypes) {
                // Create fee
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + (Math.random() * 60 - 30)); // ±30 days

                feeData.push({
                    studentId: student.id,
                    collegeId: college.id,
                    feeType: feeType.type,
                    feeCategory: 'Academic',
                    amount: feeType.amount,
                    dueDate: dueDate,
                    description: `${feeType.type} for ${student.name}`,
                    isActive: true,
                });

                // 80% chance of payment
                if (Math.random() < 0.8) {
                    const paymentDate = new Date();
                    paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 30));
                    
                    const paymentAmount = Math.random() < 0.9 ? feeType.amount : Math.floor(feeType.amount * 0.5);
                    const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

                    paymentData.push({
                        studentId: student.id,
                        collegeId: college.id,
                        amount: paymentAmount,
                        paymentMethod: method,
                        transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
                        status: 'completed',
                        paymentDate: paymentDate,
                        notes: `${feeType.type} payment via ${method}`,
                        receiptNumber: `RCP${Date.now()}${Math.floor(Math.random() * 1000)}`,
                    });
                }
            }
        }

        // Bulk create fees
        console.log('💰 Creating fees...');
        await prisma.fee.createMany({
            data: feeData,
        });
        feesCreated = feeData.length;

        // Bulk create payments
        console.log('💳 Creating payments...');
        await prisma.payment.createMany({
            data: paymentData,
        });
        paymentsCreated = paymentData.length;

        // Add some additional recent payments for dashboard
        console.log('📊 Adding recent payments for dashboard...');
        const recentPayments = [];
        
        for (let i = 0; i < 30; i++) {
            const randomStudent = students[Math.floor(Math.random() * students.length)];
            const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
            const amount = Math.floor(Math.random() * 25000) + 5000;
            
            const paymentDate = new Date();
            paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 7)); // Last 7 days

            recentPayments.push({
                studentId: randomStudent.id,
                collegeId: college.id,
                amount: amount,
                paymentMethod: method,
                transactionId: `TXN${Date.now()}${i}${Math.floor(Math.random() * 100)}`,
                status: 'completed',
                paymentDate: paymentDate,
                notes: `Recent payment via ${method}`,
                receiptNumber: `RCP${Date.now()}${i}`,
            });
        }

        await prisma.payment.createMany({
            data: recentPayments,
        });
        paymentsCreated += recentPayments.length;

        console.log('============================================================');
        console.log('✅ FEE AND PAYMENT DATA ADDED SUCCESSFULLY!');
        console.log('============================================================');
        console.log(`📊 Summary:`);
        console.log(`   Fees Created: ${feesCreated}`);
        console.log(`   Payments Created: ${paymentsCreated}`);
        console.log(`   Students: ${students.length}`);
        console.log(`   College: ${college.name}`);
        console.log('');
        console.log('💳 Payment Methods:');
        paymentMethods.forEach(method => console.log(`   - ${method}`));
        console.log('');
        console.log('💰 Fee Types:');
        feeTypes.forEach(fee => console.log(`   - ${fee.type}: ₹${fee.amount.toLocaleString()}`));
        console.log('');
        console.log('🌐 Access Admin Dashboard: http://localhost:3000/admin/dashboard');
        console.log('============================================================');

    } catch (error) {
        console.error('❌ Error adding fee and payment data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
addQuickFeeData();