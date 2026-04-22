// Transfer data step by step to avoid transaction timeout
const prisma = require('./lib/prisma');

async function transferDataStepByStep() {
    try {
        console.log('🔄 Starting step-by-step data transfer to abhi college...\n');

        // Source college (has comprehensive data)
        const sourceCollegeId = '6da9561b-8071-4272-af50-6302dc57c71f'; // Demo College with 100 students
        
        // Target college (abhi college for abhiyeduru@gmail.com)
        const targetCollegeId = 'b75f1021-e248-4d5f-a185-7eebd84a8294'; // abhi college

        console.log(`📤 Source College ID: ${sourceCollegeId}`);
        console.log(`📥 Target College ID: ${targetCollegeId}`);

        // Check current data counts
        console.log('\n📊 Current data counts:');
        const [sourceStudents, targetStudents] = await Promise.all([
            prisma.student.count({ where: { collegeId: sourceCollegeId } }),
            prisma.student.count({ where: { collegeId: targetCollegeId } })
        ]);

        console.log(`   Source students: ${sourceStudents}`);
        console.log(`   Target students: ${targetStudents}\n`);

        // STEP 1: Clear target college data (respecting foreign key constraints)
        console.log('🧹 Step 1: Clearing target college data...\n');

        // Clear payments first (no dependencies)
        console.log('💳 Clearing payments...');
        const paymentsDeleted = await prisma.payment.deleteMany({
            where: { collegeId: targetCollegeId }
        });
        console.log(`   ✅ ${paymentsDeleted.count} payments cleared`);

        // Clear fees (depends on students)
        console.log('💰 Clearing fees...');
        const feesDeleted = await prisma.fee.deleteMany({
            where: { collegeId: targetCollegeId }
        });
        console.log(`   ✅ ${feesDeleted.count} fees cleared`);

        // Clear students (depends on classes, parents)
        console.log('👥 Clearing students...');
        const studentsDeleted = await prisma.student.deleteMany({
            where: { collegeId: targetCollegeId }
        });
        console.log(`   ✅ ${studentsDeleted.count} students cleared`);

        // Clear subjects (depends on classes, teachers)
        console.log('📚 Clearing subjects...');
        const subjectsDeleted = await prisma.subject.deleteMany({
            where: { collegeId: targetCollegeId }
        });
        console.log(`   ✅ ${subjectsDeleted.count} subjects cleared`);

        // Clear teachers
        console.log('👨‍🏫 Clearing teachers...');
        const teachersDeleted = await prisma.teacher.deleteMany({
            where: { collegeId: targetCollegeId }
        });
        console.log(`   ✅ ${teachersDeleted.count} teachers cleared`);

        // Clear classes
        console.log('🏫 Clearing classes...');
        const classesDeleted = await prisma.sclass.deleteMany({
            where: { collegeId: targetCollegeId }
        });
        console.log(`   ✅ ${classesDeleted.count} classes cleared`);

        // Clear parents
        console.log('👨‍👩‍👧‍👦 Clearing parents...');
        const parentsDeleted = await prisma.parent.deleteMany({
            where: { collegeId: targetCollegeId }
        });
        console.log(`   ✅ ${parentsDeleted.count} parents cleared`);

        // Clear employees and HR managers
        console.log('👔 Clearing employees...');
        const employeesDeleted = await prisma.employee.deleteMany({
            where: { collegeId: targetCollegeId }
        });
        console.log(`   ✅ ${employeesDeleted.count} employees cleared`);

        console.log('👨‍💼 Clearing HR managers...');
        const hrManagersDeleted = await prisma.hRManager.deleteMany({
            where: { collegeId: targetCollegeId }
        });
        console.log(`   ✅ ${hrManagersDeleted.count} HR managers cleared`);

        // Clear non-admin users
        console.log('👤 Clearing non-admin users...');
        const usersDeleted = await prisma.user.deleteMany({
            where: { 
                collegeId: targetCollegeId,
                email: { not: 'abhiyeduru@gmail.com' }
            }
        });
        console.log(`   ✅ ${usersDeleted.count} non-admin users cleared`);

        console.log('\n✅ Target college cleared successfully!\n');

        // STEP 2: Transfer data from source to target
        console.log('📦 Step 2: Transferring data from source to target...\n');

        // Transfer classes first (needed for students/teachers)
        console.log('🏫 Transferring classes...');
        const classesUpdated = await prisma.sclass.updateMany({
            where: { collegeId: sourceCollegeId },
            data: { collegeId: targetCollegeId }
        });
        console.log(`   ✅ ${classesUpdated.count} classes transferred`);

        // Transfer teachers
        console.log('👨‍🏫 Transferring teachers...');
        const teachersUpdated = await prisma.teacher.updateMany({
            where: { collegeId: sourceCollegeId },
            data: { collegeId: targetCollegeId }
        });
        console.log(`   ✅ ${teachersUpdated.count} teachers transferred`);

        // Transfer subjects
        console.log('📚 Transferring subjects...');
        const subjectsUpdated = await prisma.subject.updateMany({
            where: { collegeId: sourceCollegeId },
            data: { collegeId: targetCollegeId }
        });
        console.log(`   ✅ ${subjectsUpdated.count} subjects transferred`);

        // Transfer parents
        console.log('👨‍👩‍👧‍👦 Transferring parents...');
        const parentsUpdated = await prisma.parent.updateMany({
            where: { collegeId: sourceCollegeId },
            data: { collegeId: targetCollegeId }
        });
        console.log(`   ✅ ${parentsUpdated.count} parents transferred`);

        // Transfer students
        console.log('👥 Transferring students...');
        const studentsUpdated = await prisma.student.updateMany({
            where: { collegeId: sourceCollegeId },
            data: { collegeId: targetCollegeId }
        });
        console.log(`   ✅ ${studentsUpdated.count} students transferred`);

        // Transfer fees
        console.log('💰 Transferring fees...');
        const feesUpdated = await prisma.fee.updateMany({
            where: { collegeId: sourceCollegeId },
            data: { collegeId: targetCollegeId }
        });
        console.log(`   ✅ ${feesUpdated.count} fees transferred`);

        // Transfer payments
        console.log('💳 Transferring payments...');
        const paymentsUpdated = await prisma.payment.updateMany({
            where: { collegeId: sourceCollegeId },
            data: { collegeId: targetCollegeId }
        });
        console.log(`   ✅ ${paymentsUpdated.count} payments transferred`);

        // Transfer employees
        console.log('👔 Transferring employees...');
        const employeesUpdated = await prisma.employee.updateMany({
            where: { collegeId: sourceCollegeId },
            data: { collegeId: targetCollegeId }
        });
        console.log(`   ✅ ${employeesUpdated.count} employees transferred`);

        // Transfer HR managers
        console.log('👨‍💼 Transferring HR managers...');
        const hrManagersUpdated = await prisma.hRManager.updateMany({
            where: { collegeId: sourceCollegeId },
            data: { collegeId: targetCollegeId }
        });
        console.log(`   ✅ ${hrManagersUpdated.count} HR managers transferred`);

        // Transfer users (keep admin@demo.com in original college)
        console.log('👤 Transferring users...');
        const usersUpdated = await prisma.user.updateMany({
            where: { 
                collegeId: sourceCollegeId,
                email: { not: 'admin@demo.com' }
            },
            data: { collegeId: targetCollegeId }
        });
        console.log(`   ✅ ${usersUpdated.count} users transferred`);

        console.log('\n✅ All data transferred successfully!\n');

        // STEP 3: Verify final counts
        console.log('🔍 Step 3: Verifying final data counts...\n');
        
        const [finalStudents, finalTeachers, finalFees, finalPayments, finalParents, finalClasses, finalSubjects] = await Promise.all([
            prisma.student.count({ where: { collegeId: targetCollegeId } }),
            prisma.teacher.count({ where: { collegeId: targetCollegeId } }),
            prisma.fee.count({ where: { collegeId: targetCollegeId } }),
            prisma.payment.count({ where: { collegeId: targetCollegeId } }),
            prisma.parent.count({ where: { collegeId: targetCollegeId } }),
            prisma.sclass.count({ where: { collegeId: targetCollegeId } }),
            prisma.subject.count({ where: { collegeId: targetCollegeId } })
        ]);

        console.log('📊 Final data counts in abhi college:');
        console.log(`   Students: ${finalStudents}`);
        console.log(`   Teachers: ${finalTeachers}`);
        console.log(`   Classes: ${finalClasses}`);
        console.log(`   Subjects: ${finalSubjects}`);
        console.log(`   Parents: ${finalParents}`);
        console.log(`   Fees: ${finalFees}`);
        console.log(`   Payments: ${finalPayments}`);

        console.log('\n🎉 Data transfer completed successfully!');
        console.log('✅ abhiyeduru@gmail.com now has access to all comprehensive mock data');
        console.log('🔐 Login with: abhiyeduru@gmail.com / (your password)');
        console.log('🌐 Access admin dashboard at: http://localhost:3000/admin/dashboard');

    } catch (error) {
        console.error('❌ Transfer failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

transferDataStepByStep();