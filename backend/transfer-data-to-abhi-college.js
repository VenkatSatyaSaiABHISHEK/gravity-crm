// Transfer all comprehensive mock data to abhi college (abhiyeduru@gmail.com)
const prisma = require('./lib/prisma');

async function transferDataToAbhiCollege() {
    try {
        console.log('🔄 Starting data transfer to abhi college...\n');

        // Source college (has comprehensive data)
        const sourceCollegeId = '6da9561b-8071-4272-af50-6302dc57c71f'; // Demo College with 100 students
        
        // Target college (abhi college for abhiyeduru@gmail.com)
        const targetCollegeId = 'b75f1021-e248-4d5f-a185-7eebd84a8294'; // abhi college

        console.log(`📤 Source College ID: ${sourceCollegeId}`);
        console.log(`📥 Target College ID: ${targetCollegeId}`);

        // Verify colleges exist
        const [sourceCollege, targetCollege] = await Promise.all([
            prisma.college.findUnique({ where: { id: sourceCollegeId } }),
            prisma.college.findUnique({ where: { id: targetCollegeId } })
        ]);

        if (!sourceCollege || !targetCollege) {
            console.log('❌ One or both colleges not found');
            return;
        }

        console.log(`✅ Source: ${sourceCollege.name}`);
        console.log(`✅ Target: ${targetCollege.name}\n`);

        // Check current data counts
        console.log('📊 Current data counts:');
        const [sourceStudents, targetStudents] = await Promise.all([
            prisma.student.count({ where: { collegeId: sourceCollegeId } }),
            prisma.student.count({ where: { collegeId: targetCollegeId } })
        ]);

        console.log(`   Source students: ${sourceStudents}`);
        console.log(`   Target students: ${targetStudents}\n`);

        if (sourceStudents === 0) {
            console.log('❌ No data to transfer from source college');
            return;
        }

        // Start transaction to transfer all data
        await prisma.$transaction(async (tx) => {
            console.log('🔄 Starting data transfer transaction...\n');

            // 1. Transfer Students
            console.log('👥 Transferring students...');
            const studentsUpdated = await tx.student.updateMany({
                where: { collegeId: sourceCollegeId },
                data: { collegeId: targetCollegeId }
            });
            console.log(`   ✅ ${studentsUpdated.count} students transferred`);

            // 2. Transfer Teachers
            console.log('👨‍🏫 Transferring teachers...');
            const teachersUpdated = await tx.teacher.updateMany({
                where: { collegeId: sourceCollegeId },
                data: { collegeId: targetCollegeId }
            });
            console.log(`   ✅ ${teachersUpdated.count} teachers transferred`);

            // 3. Transfer Users (students, teachers, etc.)
            console.log('👤 Transferring users...');
            const usersUpdated = await tx.user.updateMany({
                where: { 
                    collegeId: sourceCollegeId,
                    email: { not: 'admin@demo.com' } // Keep admin in original college
                },
                data: { collegeId: targetCollegeId }
            });
            console.log(`   ✅ ${usersUpdated.count} users transferred`);

            // 4. Transfer Classes
            console.log('🏫 Transferring classes...');
            const classesUpdated = await tx.sclass.updateMany({
                where: { collegeId: sourceCollegeId },
                data: { collegeId: targetCollegeId }
            });
            console.log(`   ✅ ${classesUpdated.count} classes transferred`);

            // 5. Transfer Subjects
            console.log('📚 Transferring subjects...');
            const subjectsUpdated = await tx.subject.updateMany({
                where: { collegeId: sourceCollegeId },
                data: { collegeId: targetCollegeId }
            });
            console.log(`   ✅ ${subjectsUpdated.count} subjects transferred`);

            // 6. Transfer Fees
            console.log('💰 Transferring fees...');
            const feesUpdated = await tx.fee.updateMany({
                where: { collegeId: sourceCollegeId },
                data: { collegeId: targetCollegeId }
            });
            console.log(`   ✅ ${feesUpdated.count} fees transferred`);

            // 7. Transfer Payments
            console.log('💳 Transferring payments...');
            const paymentsUpdated = await tx.payment.updateMany({
                where: { collegeId: sourceCollegeId },
                data: { collegeId: targetCollegeId }
            });
            console.log(`   ✅ ${paymentsUpdated.count} payments transferred`);

            // 8. Transfer Parents
            console.log('👨‍👩‍👧‍👦 Transferring parents...');
            const parentsUpdated = await tx.parent.updateMany({
                where: { collegeId: sourceCollegeId },
                data: { collegeId: targetCollegeId }
            });
            console.log(`   ✅ ${parentsUpdated.count} parents transferred`);

            // 9. Transfer Employees
            console.log('👔 Transferring employees...');
            const employeesUpdated = await tx.employee.updateMany({
                where: { collegeId: sourceCollegeId },
                data: { collegeId: targetCollegeId }
            });
            console.log(`   ✅ ${employeesUpdated.count} employees transferred`);

            // 10. Transfer HR Managers
            console.log('👨‍💼 Transferring HR managers...');
            const hrManagersUpdated = await tx.hRManager.updateMany({
                where: { collegeId: sourceCollegeId },
                data: { collegeId: targetCollegeId }
            });
            console.log(`   ✅ ${hrManagersUpdated.count} HR managers transferred`);

            console.log('\n✅ All data transferred successfully!');
        });

        // Verify transfer
        console.log('\n🔍 Verifying transfer...');
        const [newSourceCount, newTargetCount] = await Promise.all([
            prisma.student.count({ where: { collegeId: sourceCollegeId } }),
            prisma.student.count({ where: { collegeId: targetCollegeId } })
        ]);

        console.log(`   Source students after transfer: ${newSourceCount}`);
        console.log(`   Target students after transfer: ${newTargetCount}`);

        // Check all data in target college
        const [students, teachers, fees, payments, parents] = await Promise.all([
            prisma.student.count({ where: { collegeId: targetCollegeId } }),
            prisma.teacher.count({ where: { collegeId: targetCollegeId } }),
            prisma.fee.count({ where: { collegeId: targetCollegeId } }),
            prisma.payment.count({ where: { collegeId: targetCollegeId } }),
            prisma.parent.count({ where: { collegeId: targetCollegeId } })
        ]);

        console.log('\n📊 Final data counts in abhi college:');
        console.log(`   Students: ${students}`);
        console.log(`   Teachers: ${teachers}`);
        console.log(`   Fees: ${fees}`);
        console.log(`   Payments: ${payments}`);
        console.log(`   Parents: ${parents}`);

        console.log('\n🎉 Data transfer completed successfully!');
        console.log('✅ abhiyeduru@gmail.com now has access to all comprehensive mock data');

    } catch (error) {
        console.error('❌ Transfer failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

transferDataToAbhiCollege();