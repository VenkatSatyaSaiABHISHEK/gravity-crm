// Reset password for abhiyeduru@gmail.com
const prisma = require('./lib/prisma');
const bcrypt = require('bcryptjs');

async function resetAbhiPassword() {
    try {
        console.log('🔑 Resetting password for abhiyeduru@gmail.com...\n');

        const newPassword = 'admin123';
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password
        const updatedUser = await prisma.user.updateMany({
            where: { email: 'abhiyeduru@gmail.com' },
            data: { password: hashedPassword }
        });

        console.log(`✅ Password updated for ${updatedUser.count} user(s)`);
        console.log(`🔑 New password: ${newPassword}`);
        console.log('📧 Email: abhiyeduru@gmail.com');

        // Also update admin profile if exists
        const user = await prisma.user.findFirst({
            where: { email: 'abhiyeduru@gmail.com' },
            include: { AdminProfile: true }
        });

        if (user && user.AdminProfile) {
            await prisma.admin.update({
                where: { userId: user.id },
                data: { password: hashedPassword }
            });
            console.log('✅ Admin profile password also updated');
        }

        console.log('\n🎉 Password reset completed!');
        console.log('🌐 You can now login at: http://localhost:3000/login');
        console.log('🔐 Credentials: abhiyeduru@gmail.com / admin123');

    } catch (error) {
        console.error('❌ Password reset failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetAbhiPassword();