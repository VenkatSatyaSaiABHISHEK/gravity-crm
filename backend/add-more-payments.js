// Add more payment records with correct schema
const prisma = require('./lib/prisma');

async function addMorePayments() {
    try {
        console.log('💳 Adding more payment records...\n');

        const collegeId = 'b75f1021-e248-4d5f-a185-7eebd84a8294'; // abhi college

        // Get recent fees that don't have payments yet
        const feesWithoutPayments = await prisma.fee.findMany({
            where: { 
                collegeId,
                Payments: { none: {} } // Fees with no payments
            },
            take: 300, // Process 300 fees
            include: {
                student: { select: { name: true, studentId: true } }
            }
        });

        console.log(`Found ${feesWithoutPayments.length} fees without payments\n`);

        const paymentMethods = ['Razorpay', 'UPI', 'Cash', 'Bank Transfer', 'Card', 'Net Banking', 'Cheque'];
        const paymentStatuses = ['completed', 'pending', 'failed'];
        let paymentsCreated = 0;

        for (const fee of feesWithoutPayments) {
            // 75% chance of creating a payment
            if (Math.random() < 0.75) {
                try {
                    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                    const status = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
                    
                    // For completed payments, use full amount. For others, use partial
                    let amount = fee.amount;
                    if (status !== 'completed') {
                        amount = Math.floor(fee.amount * (0.3 + Math.random() * 0.7)); // 30-100% of fee
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
                            notes: `Payment for ${fee.feeType} - ${fee.student?.name || 'Student'}`,
                            collegeId,
                            paymentDate: status === 'completed' ? new Date() : null,
                        },
                    });

                    paymentsCreated++;

                    if (paymentsCreated % 50 === 0) {
                        console.log(`   ✅ Created ${paymentsCreated} payments so far...`);
                    }
                } catch (error) {
                    console.log(`   ❌ Failed to create payment for fee ${fee.id}: ${error.message}`);
                }
            }
        }

        console.log(`\n✅ Created ${paymentsCreated} new payment records\n`);

        // Get final counts
        const [totalFees, totalPayments, completedPayments, pendingPayments] = await Promise.all([
            prisma.fee.count({ where: { collegeId } }),
            prisma.payment.count({ where: { collegeId } }),
            prisma.payment.count({ where: { collegeId, status: 'completed' } }),
            prisma.payment.count({ where: { collegeId, status: 'pending' } })
        ]);

        console.log('📊 Final Payment Summary:');
        console.log(`   Total Fees: ${totalFees}`);
        console.log(`   Total Payments: ${totalPayments}`);
        console.log(`   Completed Payments: ${completedPayments}`);
        console.log(`   Pending Payments: ${pendingPayments}`);
        console.log(`   Failed Payments: ${totalPayments - completedPayments - pendingPayments}`);

        // Calculate total revenue
        const revenueData = await prisma.payment.aggregate({
            where: { collegeId, status: 'completed' },
            _sum: { amount: true }
        });

        console.log(`   Total Revenue: ₹${revenueData._sum.amount || 0}`);

        console.log('\n🎉 Payment records added successfully!');

    } catch (error) {
        console.error('❌ Failed to add payments:', error);
    } finally {
        await prisma.$disconnect();
    }
}

addMorePayments();