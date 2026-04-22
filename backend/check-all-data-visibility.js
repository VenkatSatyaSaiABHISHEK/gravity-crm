// Script to check all data visibility and ensure no "student not found" issues
// Run with: node check-all-data-visibility.js

const prisma = require('./lib/prisma');

async function checkAllDataVisibility() {
    try {
        console.log('🔍 Checking all data visibility...');

        // Get college
        const college = await prisma.college.findFirst();
        if (!college) {
            console.log('❌ No college found!');
            return;
        }
        console.log(`✅ College: ${college.name} (ID: ${college.id})`);

        // Check students
        const students = await prisma.student.findMany({
            where: { collegeId: college.id },
            include: {
                sclass: true,
                section: true,
                parent: true,
            },
        });
        console.log(`✅ Students: ${students.length} found`);

        // Check teachers
        const teachers = await prisma.teacher.findMany({
            where: { collegeId: college.id },
        });
        console.log(`✅ Teachers: ${teachers.length} found`);

        // Check employees
        const employees = await prisma.employee.findMany({
            where: { collegeId: college.id },
        });
        console.log(`✅ Employees: ${employees.length} found`);

        // Check parents
        const parents = await prisma.parent.findMany({
            where: { collegeId: college.id },
        });
        console.log(`✅ Parents: ${parents.length} found`);

        // Check fees
        const fees = await prisma.fee.findMany({
            where: { collegeId: college.id },
        });
        console.log(`✅ Fees: ${fees.length} found`);

        // Check payments
        const payments = await prisma.payment.findMany({
            where: { collegeId: college.id },
        });
        console.log(`✅ Payments: ${payments.length} found`);

        // Check classes
        const classes = await prisma.sclass.findMany({
            where: { collegeId: college.id },
        });
        console.log(`✅ Classes: ${classes.length} found`);

        // Check subjects
        const subjects = await prisma.subject.findMany({
            where: { collegeId: college.id },
        });
        console.log(`✅ Subjects: ${subjects.length} found`);

        // Check admin user
        const adminUser = await prisma.user.findFirst({
            where: { 
                email: 'admin@demo.com',
                role: 'Admin'
            },
        });
        console.log(`✅ Admin User: ${adminUser ? 'Found' : 'NOT FOUND'}`);
        if (adminUser) {
            console.log(`   - Email: ${adminUser.email}`);
            console.log(`   - Role: ${adminUser.role}`);
            console.log(`   - College ID: ${adminUser.collegeId}`);
            console.log(`   - Active: ${adminUser.isActive}`);
        }

        // Sample data check
        if (students.length > 0) {
            const sampleStudent = students[0];
            console.log('\n📋 Sample Student Data:');
            console.log(`   - Name: ${sampleStudent.name}`);
            console.log(`   - Email: ${sampleStudent.email}`);
            console.log(`   - Student ID: ${sampleStudent.studentId}`);
            console.log(`   - Class: ${sampleStudent.sclass?.sclassName || 'No class'}`);
            console.log(`   - Section: ${sampleStudent.section?.sectionName || 'No section'}`);
            console.log(`   - Parent: ${sampleStudent.parent?.name || 'No parent'}`);
        }

        if (payments.length > 0) {
            const samplePayment = payments[0];
            console.log('\n💳 Sample Payment Data:');
            console.log(`   - Amount: ₹${samplePayment.amount}`);
            console.log(`   - Method: ${samplePayment.paymentMethod}`);
            console.log(`   - Status: ${samplePayment.status}`);
            console.log(`   - Transaction ID: ${samplePayment.transactionId}`);
            console.log(`   - Receipt: ${samplePayment.receiptNumber || 'No receipt'}`);
        }

        if (fees.length > 0) {
            const sampleFee = fees[0];
            console.log('\n💰 Sample Fee Data:');
            console.log(`   - Type: ${sampleFee.feeType}`);
            console.log(`   - Amount: ₹${sampleFee.amount}`);
            console.log(`   - Due Date: ${sampleFee.dueDate}`);
            console.log(`   - Category: ${sampleFee.feeCategory || 'No category'}`);
        }

        // Check for potential issues
        console.log('\n🔍 Checking for potential issues...');

        // Students without classes
        const studentsWithoutClass = students.filter(s => !s.sclass);
        if (studentsWithoutClass.length > 0) {
            console.log(`⚠️  ${studentsWithoutClass.length} students without classes`);
        }

        // Students without parents
        const studentsWithoutParent = students.filter(s => !s.parent);
        if (studentsWithoutParent.length > 0) {
            console.log(`⚠️  ${studentsWithoutParent.length} students without parents`);
        }

        // Payments without receipts
        const paymentsWithoutReceipts = payments.filter(p => !p.receiptNumber && p.status === 'completed');
        if (paymentsWithoutReceipts.length > 0) {
            console.log(`⚠️  ${paymentsWithoutReceipts.length} completed payments without receipts`);
        }

        // Check college ID consistency
        const wrongCollegeStudents = students.filter(s => s.collegeId !== college.id);
        const wrongCollegeTeachers = teachers.filter(t => t.collegeId !== college.id);
        const wrongCollegeFees = fees.filter(f => f.collegeId !== college.id);
        const wrongCollegePayments = payments.filter(p => p.collegeId !== college.id);

        if (wrongCollegeStudents.length > 0) console.log(`⚠️  ${wrongCollegeStudents.length} students with wrong college ID`);
        if (wrongCollegeTeachers.length > 0) console.log(`⚠️  ${wrongCollegeTeachers.length} teachers with wrong college ID`);
        if (wrongCollegeFees.length > 0) console.log(`⚠️  ${wrongCollegeFees.length} fees with wrong college ID`);
        if (wrongCollegePayments.length > 0) console.log(`⚠️  ${wrongCollegePayments.length} payments with wrong college ID`);

        console.log('\n============================================================');
        console.log('✅ DATA VISIBILITY CHECK COMPLETE');
        console.log('============================================================');
        console.log(`📊 Summary:`);
        console.log(`   College: ${college.name} (${college.id})`);
        console.log(`   Students: ${students.length}`);
        console.log(`   Teachers: ${teachers.length}`);
        console.log(`   Employees: ${employees.length}`);
        console.log(`   Parents: ${parents.length}`);
        console.log(`   Fees: ${fees.length}`);
        console.log(`   Payments: ${payments.length}`);
        console.log(`   Classes: ${classes.length}`);
        console.log(`   Subjects: ${subjects.length}`);
        console.log(`   Admin User: ${adminUser ? 'Active' : 'Missing'}`);
        console.log('');
        console.log('🌐 All data should be visible in:');
        console.log('   - Admin Dashboard: http://localhost:3000/admin/dashboard');
        console.log('   - Students Page: http://localhost:3000/admin/students');
        console.log('   - Teachers Page: http://localhost:3000/admin/teachers');
        console.log('   - Payments Page: http://localhost:3000/admin/payments');
        console.log('   - Fees Page: http://localhost:3000/admin/fees');
        console.log('============================================================');

    } catch (error) {
        console.error('❌ Error checking data visibility:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
checkAllDataVisibility();