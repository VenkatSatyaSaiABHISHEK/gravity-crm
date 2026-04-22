// Complete script to add fee and payment data for all students
// Run with: node add-complete-fee-data.js

const prisma = require('./lib/prisma');

async function addCompleteFeeData() {
    try {
        console.log('🚀 Starting to add complete fee and payment data...');

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

        // Fee types with different amounts based on class
        const feeStructure = {
            'Tuition Fee': { base: 45000, variation: 10000 },
            'Lab Fee': { base: 12000, variation: 5000 },
            'Library Fee': { base: 3000, variation: 1000 },
            'Sports Fee': { base: 6000, variation: 2000 },
            'Transport Fee': { base: 10000, variation: 4000 },
            'Exam Fee': { base: 2500, variation: 500 },
            'Development Fee': { base: 8000, variation: 2000 },
        };

        const paymentMethods = [
            'razorpay', 'upi', 'cash', 'bank_transfer', 
            'card', 'net_banking', 'cheque'
        ];

        let totalFees = 0;
        let totalPayments = 0;

        // Process students in batches of 10
        const batchSize = 10;
        for (let i = 0; i < students.length; i += batchSize) {
            const batch = students.slice(i, i + batchSize);
            console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(students.length/batchSize)}...`);

            const feeData = [];
            const paymentData = [];

            for (const student of batch) {
                // Each student gets 4-6 different fee types
                const selectedFees = Object.entries(feeStructure)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, Math.floor(Math.random() * 3) + 4);

                for (const [feeType, config] of selectedFees) {
                    // Calculate fee amount with variation
                    const amount = config.base + Math.floor(Math.random() * config.variation);
                    
                    // Create due date (mix of past and future)
                    const dueDate = new Date();
                    dueDate.setDate(dueDate.getDate() + (Math.random() * 120 - 60)); // ±60 days

                    feeData.push({
                        studentId: student.id,
                        collegeId: college.id,
                        feeType: feeType,
                        feeCategory: feeType.includes('Tuition') || feeType.includes('Lab') || feeType.includes('Exam') ? 'Academic' : 'Other',
                        amount: amount,
                        dueDate: dueDate,
                        description: `${feeType} for ${student.name} - ${student.sclass?.sclassName || 'Class'}`,
                        isActive: true,
                    });

                    // 75% chance of payment
                    if (Math.random() < 0.75) {
                        const paymentDate = new Date();
                        paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 90)); // Last 90 days
                        
                        // Payment amount (85% full payment, 15% partial)
                        const paymentAmount = Math.random() < 0.85 
                            ? amount 
                            : Math.floor(amount * (0.4 + Math.random() * 0.4));
                        
                        const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                        const txnId = `TXN${Date.now()}${student.id.slice(-4)}${Math.floor(Math.random() * 100000)}${feeType.replace(/\s/g, '').slice(0,3)}`;

                        paymentData.push({
                            studentId: student.id,
                            collegeId: college.id,
                            amount: paymentAmount,
                            paymentMethod: method,
                            transactionId: txnId,
                            status: 'completed',
                            paymentDate: paymentDate,
                            notes: `${feeType} payment via ${method}`,
                            receiptNumber: `RCP${Date.now()}${Math.floor(Math.random() * 10000)}`,
                        });
                    }
                }
            }

            // Bulk create for this batch
            if (feeData.length > 0) {
                await prisma.fee.createMany({ data: feeData });
                totalFees += feeData.length;
            }

            if (paymentData.length > 0) {
                await prisma.payment.createMany({ data: paymentData });
                totalPayments += paymentData.length;
            }
        }

        // Add recent payments for better dashboard visualization
        console.log('📊 Adding recent payments for dashboard...');
        const recentPaymentData = [];
        
        for (let i = 0; i < 100; i++) {
            const randomStudent = students[Math.floor(Math.random() * students.length)];
            const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
            const amount = Math.floor(Math.random() * 40000) + 5000; // 5k to 45k
            
            // Recent payments (last 30 days)
            const paymentDate = new Date();
            paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 30));

            recentPaymentData.push({
                studentId: randomStudent.id,
                collegeId: college.id,
                amount: amount,
                paymentMethod: method,
                transactionId: `TXN${Date.now()}${i}${Math.floor(Math.random() * 1000)}`,
                status: 'completed',
                paymentDate: paymentDate,
                notes: `Recent ${method} payment`,
                receiptNumber: `RCP${Date.now()}${i}`,
            });
        }

        await prisma.payment.createMany({ data: recentPaymentData });
        totalPayments += recentPaymentData.length;

        // Add some pending/failed payments for realistic data
        console.log('⏳ Adding pending and failed payments...');
        const pendingPaymentData = [];
        
        for (let i = 0; i < 30; i++) {
            const randomStudent = students[Math.floor(Math.random() * students.length)];
            const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
            const amount = Math.floor(Math.random() * 25000) + 5000;
            const status = Math.random() < 0.7 ? 'pending' : 'failed';

            pendingPaymentData.push({
                studentId: randomStudent.id,
                collegeId: college.id,
                amount: amount,
                paymentMethod: method,
                transactionId: `TXN${Date.now()}${i}${Math.floor(Math.random() * 1000)}`,
                status: status,
                notes: `${status} ${method} payment`,
                receiptNumber: status === 'completed' ? `RCP${Date.now()}${i}` : null,
            });
        }

        await prisma.payment.createMany({ data: pendingPaymentData });
        totalPayments += pendingPaymentData.length;

        console.log('============================================================');
        console.log('✅ COMPLETE FEE AND PAYMENT DATA ADDED SUCCESSFULLY!');
        console.log('============================================================');
        console.log(`📊 Final Summary:`);
        console.log(`   Total Fees Created: ${totalFees}`);
        console.log(`   Total Payments Created: ${totalPayments}`);
        console.log(`   Students Processed: ${students.length}`);
        console.log(`   College: ${college.name}`);
        console.log('');
        console.log('💳 Payment Methods Available:');
        paymentMethods.forEach(method => console.log(`   - ${method}`));
        console.log('');
        console.log('💰 Fee Types Created:');
        Object.entries(feeStructure).forEach(([type, config]) => {
            console.log(`   - ${type}: ₹${config.base.toLocaleString()} - ₹${(config.base + config.variation).toLocaleString()}`);
        });
        console.log('');
        console.log('📈 Payment Status Distribution:');
        console.log('   - Completed: ~75% of fees');
        console.log('   - Pending: ~15%');
        console.log('   - Failed: ~10%');
        console.log('');
        console.log('🌐 Access Admin Dashboard: http://localhost:3000/admin/dashboard');
        console.log('💰 Check Fee Management: http://localhost:3000/admin/fees');
        console.log('💳 Check Payment Records: http://localhost:3000/admin/payments');
        console.log('============================================================');

    } catch (error) {
        console.error('❌ Error adding complete fee and payment data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
addCompleteFeeData();