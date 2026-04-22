// Demo Authentication Utility for Development
export const enableDemoMode = () => {
  // Enable demo mode
  localStorage.setItem('DEMO_MODE', 'true');
  
  // Set demo admin user
  const demoUser = {
    id: 'demo-admin-001',
    name: 'Demo Admin',
    email: 'admin@demo.com',
    role: 'Admin',
    college: 'Demo College',
    collegeId: 'demo-college-001'
  };
  
  localStorage.setItem('token', 'demo-token-' + Date.now());
  localStorage.setItem('user', JSON.stringify(demoUser));
  
  console.log('Demo mode enabled with admin user');
  return demoUser;
};

export const setDemoUser = (role = 'Admin') => {
  const users = {
    Admin: {
      id: 'demo-admin-001',
      name: 'Demo Admin',
      email: 'admin@demo.com',
      role: 'Admin'
    },
    Teacher: {
      id: 'demo-teacher-001',
      name: 'Demo Teacher',
      email: 'teacher1@demo.com',
      role: 'Teacher'
    },
    Student: {
      id: 'demo-student-001',
      name: 'Demo Student',
      email: 'student2@demo.com',
      role: 'Student'
    },
    Parent: {
      id: 'demo-parent-001',
      name: 'Demo Parent',
      email: 'parent1@demo.com',
      role: 'Parent'
    },
    TransportTeam: {
      id: 'demo-transport-001',
      name: 'Demo Transport',
      email: 'transport@demo.com',
      role: 'TransportTeam'
    },
    AccountsTeam: {
      id: 'demo-accounts-001',
      name: 'Demo Accounts',
      email: 'accounts@demo.com',
      role: 'AccountsTeam'
    },
    HRTeam: {
      id: 'demo-hr-001',
      name: 'Demo HR',
      email: 'hr@demo.com',
      role: 'HRTeam'
    }
  };
  
  const user = users[role] || users.Admin;
  user.college = 'Demo College';
  user.collegeId = 'demo-college-001';
  
  localStorage.setItem('token', 'demo-token-' + Date.now());
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('DEMO_MODE', 'true');
  
  return user;
};

export const getDemoUser = () => {
  try {
    const userRaw = localStorage.getItem('user');
    return userRaw ? JSON.parse(userRaw) : null;
  } catch {
    return null;
  }
};

export const isDemoMode = () => {
  return localStorage.getItem('DEMO_MODE') === 'true' || 
         localStorage.getItem('DEV_MODE') === 'true' ||
         window.location.hostname === 'localhost';
};