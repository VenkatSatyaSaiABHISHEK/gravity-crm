// Clear abhi college data and transfer comprehensive mock data
const prisma = require('./lib/prisma');

async function clearAndTransferData() {
    try {
        console.log('🔄 Starting data clear and transfer to abhi college...\n');

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

        // Start transaction to clear target and transfer all data
        await prisma.$transaction(async (tx) => {
            console.log('🔄 Starting clear and transfer transaction...\n');

            // STEP 1: Clear existing data in target college (except admin user)
            console.log('🧹 Clearing existing data in target college...');

            // Clear payments first (has foreign key to students)
            const paymentsDeleted = await tx.payment.deleteMany({
                where: { collegeId: targetCollegeId }
            });
            console.log(`   🗑️ ${paymentsDeleted.count} payments cleared`);

            // Clear fees
            const feesDeleted = await tx.fee.deleteMany({
                where: { collegeId: targetCollegeId }
            });
            console.log(`   🗑️ ${feesDeleted.count} fees cleared`);

            // Clear students
            const studentsDeleted = await tx.student.deleteMany({
                where: { collegeId: targetCollegeId }
            });
            console.log(`   🗑️ ${studentsDeleted.count} students cleared`);

            // Clear teachers
            const teachersDeleted = await tx.teacher.deleteMany({
                where: { collegeId: targetCollegeId }
            });
            console.log(`   🗑️ ${teachersDeleted.count} teachers cleared`);

            // Clear parents
            const parentsDeleted = await tx.parent.deleteMany({
                where: { collegeId: targetCollegeId }
            });
            console.log(`   🗑️ ${parentsDeleted.count} parents cleared`);

            // Clear employees
            const employeesDeleted = await tx.employee.deleteMany({
                where: { collegeId: targetCollegeId }
            });
            console.log(`   🗑️ ${employeesDeleted.count} employees cleared`);

            // Clear HR managers
            const hrManagersDeleted = await tx.hRManager.deleteMany({
                where: { collegeId: targetCollegeId }
            });
            console.log(`   🗑️ ${hrManagersDeleted.count} HR managers cleared`);

            // Clear subjects
            const subjectsDeleted = await tx.subject.deleteMany({
                where: { collegeId: targetCollegeId }
            });
            console.log(`   🗑️ ${subjectsDeleted.count} subjects cleared`);

            // Clear classes
            const classesDeleted = await tx.sclass.deleteMany({
                where: { collegeId: targetCollegeId }
            });
            console.log(`   🗑️ ${classesDeleted.count} classes cleared`);

            // Clear non-admin users
            const usersDeleted = await tx.user.deleteMany({
                where: { 
                    collegeId: targetCollegeId,
                    email: { not: 'abhiyeduru@gmail.com' } // Keep the admin user
                }
            });
            console.log(`   🗑️ ${usersDeleted.count} non-admin users cleared\n`);

            // STEP 2: Transfer data from source to target
            console.log('📦 Transferring data from source to target...\n');

            // 1. Transfer Classes first (needed for students/teachers)
            console.log('🏫 Transferring classes...');
            const classesUpdated = await tx.sclass.updateMany({
                where: { collegeId: sourceCollegeId },
                data: { collegeId: targetCollegeId }
            });
            console.log(`   ✅ ${classesUpdated.count} classes transferred`);

            // 2. Transfer Subjects
            console.log('📚 Transferring subjects...');
            const subjectsUpdated = await tx.subject.updateMany({
                where: { collegeId: sourceCollegeId },
                data: { collegeId: targetCollegeId }
            });
            console.log(`   ✅ ${subjectsUpdated.count} subjects transferred`);

            // 3. Transfer Teachers
            console.log('👨‍🏫 Transferring teachers...');
            const teachersUpdated = await tx.teacher.updateMany({
                where: { collegeId: sourceCollegeId },
                data: { collegeId: targetCollegeId }
            });
            console.log(`   ✅ ${teachersUpdated.count} teachers transferred`);

            // 4. Transfer Parents
            console.log('👨‍👩‍👧‍👦 Transferring parents...');
            const parentsUpdated = await tx.parent.updateMany({
                where: { collegeId: sourceCollegeId },
                data: { collegeId: targetCollegeId }
            });
            console.log(`   ✅ ${parentsUpdated.count} parents transferred`);

            // 5. Transfer Students
            console.log('👥 Transferring students...');
            const studentsUpdated = await tx.student.updateMany({
                where: { collegeId: sourceCollegeId },
                data: { collegeId: targetCollegeId }
            });
            console.log(`   ✅ ${studentsUpdated.count} students transferred`);

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

            // 8. Transfer Employees
            console.log('👔 Transferring employees...');
            const employeesUpdated = await tx.employee.updateMany({
                where: { collegeId: sourceCollegeId },
                data: { collegeId: targetCollegeId }
            });
            console.log(`   ✅ ${employeesUpdated.count} employees transferred`);

            // 9. Transfer HR Managers
            console.log('👨‍💼 Transferring HR managers...');
            const hrManagersUpdated = await tx.hRManager.updateMany({
                where: { collegeId: sourceCollegeId },
                data: { collegeId: targetCollegeId }
            });
            console.log(`   ✅ ${hrManagersUpdated.count} HR managers transferred`);

            // 10. Transfer Users (students, teachers, etc.) - but keep admin@demo.com in original college
            console.log('👤 Transferring users...');
            const usersUpdated = await tx.user.updateMany({
                where: { 
                    collegeId: sourceCollegeId,
                    email: { not: 'admin@demo.com' } // Keep admin in original college
                },
                data: { collegeId: targetCollegeId }
            });
            console.log(`   ✅ ${usersUpdated.count} users transferred`);

            console.log('\n✅ All data transferred successfully!');
        });

        // Verify transfer
        console.log('\n🔍 Verifying transfer...');
        const [students, teachers, fees, payments, parents, classes, subjects] = await Promise.all([
            prisma.student.count({ where: { collegeId: targetCollegeId } }),
            prisma.teacher.count({ where: { collegeId: targetCollegeId } }),
            prisma.fee.count({ where: { collegeId: targetCollegeId } }),
            prisma.payment.count({ where: { collegeId: targetCollegeId } }),
            prisma.parent.count({ where: { collegeId: targetCollegeId } }),
            prisma.sclass.count({ where: { collegeId: targetCollegeId } }),
            prisma.subject.count({ where: { collegeId: targetCollegeId } })
        ]);

        console.log('\n📊 Final data counts in abhi college:');
        console.log(`   Students: ${students}`);
        console.log(`   Teachers: ${teachers}`);
        console.log(`   Classes: ${classes}`);
        console.log(`   Subjects: ${subjects}`);
        console.log(`   Parents: ${parents}`);
        console.log(`   Fees: ${fees}`);
        console.log(`   Payments: ${payments}`);

        console.log('\n🎉 Data transfer completed successfully!');
        console.log('✅ abhiyeduru@gmail.com now has access to all comprehensive mock data');
        console.log('🔐 Login with: abhiyeduru@gmail.com / (your password)');

    } catch (error) {
        console.error('❌ Transfer failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearAndTransferData();