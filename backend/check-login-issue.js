// Script to check login issues and fix any demo mode references
// Run with: node check-login-issue.js

const prisma = require('./lib/prisma');
const bcrypt = require('bcryptjs');

async function checkLoginIssue() {
    try {
        console.log('🔍 Checking login system...');

        // Check admin user
        const adminUser = await prisma.user.findFirst({
            where: { 
                email: 'admin@demo.com'
            },
            include: {
                college: true
            }
        });

        if (!adminUser) {
            console.log('❌ Admin user not found!');
            return;
        }

        console.log('✅ Admin user found:');
        console.log(`   - Email: ${adminUser.email}`);
        console.log(`   - Role: ${adminUser.role}`);
        console.log(`   - College ID: ${adminUser.collegeId}`);
        console.log(`   - Active: ${adminUser.isActive}`);
        console.log(`   - College Name: ${adminUser.college?.name || 'No college'}`);

        // Test password
        const passwordMatch = await bcrypt.compare('admin123', adminUser.password);
        console.log(`   - Password Match: ${passwordMatch}`);

        // Check college
        const college = await prisma.college.findFirst({
            where: { id: adminUser.collegeId }
        });

        if (college) {
            console.log(`✅ College found: ${college.name} (${college.id})`);
        } else {
            console.log('❌ College not found for admin user!');
        }

        // Test login API manually
        console.log('\n🔐 Testing login process...');
        
        // Simulate login
        if (passwordMatch && adminUser.isActive) {
            console.log('✅ Login should work - credentials are correct');
            
            // Check if there are any middleware issues
            console.log('\n🔍 Checking for potential issues...');
            
            // Check if college ID matches
            if (adminUser.collegeId && college && adminUser.collegeId === college.id) {
                console.log('✅ College ID consistency check passed');
            } else {
                console.log('❌ College ID mismatch detected');
            }
            
        } else {
            console.log('❌ Login will fail - credentials or user status issue');
        }

        // Check for any remaining demo mode files
        console.log('\n🗂️  Checking for demo mode files...');
        
        const fs = require('fs');
        const path = require('path');
        
        const demoFiles = [
            'backend/middleware/demoMode.js',
            'backend/utils/demo-data.js',
            'backend/utils/demo-data-large.js'
        ];
        
        for (const file of demoFiles) {
            if (fs.existsSync(file)) {
                console.log(`⚠️  Demo file exists: ${file}`);
            } else {
                console.log(`✅ Demo file removed: ${file}`);
            }
        }

        console.log('\n============================================================');
        console.log('✅ LOGIN SYSTEM CHECK COMPLETE');
        console.log('============================================================');
        console.log('📋 Summary:');
        console.log(`   Admin User: ${adminUser ? 'Found' : 'Missing'}`);
        console.log(`   Password: ${passwordMatch ? 'Correct' : 'Wrong'}`);
        console.log(`   User Active: ${adminUser?.isActive ? 'Yes' : 'No'}`);
        console.log(`   College: ${college ? 'Found' : 'Missing'}`);
        console.log('');
        console.log('🔐 Login Credentials:');
        console.log('   Email: admin@demo.com');
        console.log('   Password: admin123');
        console.log('');
        console.log('🌐 Login URL: http://localhost:3000/login');
        console.log('============================================================');

    } catch (error) {
        console.error('❌ Error checking login system:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
checkLoginIssue();