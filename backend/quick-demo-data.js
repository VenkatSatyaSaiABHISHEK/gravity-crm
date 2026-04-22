const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function quickDemo() {
  try {
    console.log('Adding quick demo data...');
    
    // Just check if we have basic data
    const collegeCount = await prisma.college.count();
    const userCount = await prisma.user.count();
    
    console.log(`Found ${collegeCount} colleges and ${userCount} users`);
    
    if (collegeCount === 0) {
      console.log('No data found. Creating basic structure...');
      
      const college = await prisma.college.create({
        data: {
          name: 'Demo College',
          email: 'demo@college.com',
          phone: '9999999999',
          address: '123 Demo Street',
        },
      });
      
      console.log('College created:', college.name);
    } else {
      console.log('Demo data already exists!');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

quickDemo();