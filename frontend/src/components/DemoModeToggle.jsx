import React from 'react';
import { enableDemoMode, setDemoUser, isDemoMode, getDemoUser } from '../utils/demoAuth';

const DemoModeToggle = () => {
  const [demoEnabled, setDemoEnabled] = React.useState(isDemoMode());
  const [currentUser, setCurrentUser] = React.useState(getDemoUser());

  React.useEffect(() => {
    // Update state when localStorage changes
    const handleStorageChange = () => {
      setDemoEnabled(isDemoMode());
      setCurrentUser(getDemoUser());
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for changes
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleEnableDemo = () => {
    enableDemoMode();
    setDemoEnabled(true);
    setCurrentUser(getDemoUser());
    window.location.reload(); // Refresh to apply changes
  };

  const handleSetRole = (role) => {
    const user = setDemoUser(role);
    setCurrentUser(user);
    
    // Navigate to appropriate dashboard
    const roleRoutes = {
      Admin: '/admin/dashboard',
      Teacher: '/teacher/dashboard',
      Student: '/student/dashboard',
      Parent: '/parent/dashboard',
      TransportTeam: '/transport/dashboard',
      AccountsTeam: '/accounts/dashboard',
      HRTeam: '/hr/dashboard'
    };
    
    const targetRoute = roleRoutes[role] || '/dashboard';
    window.location.href = targetRoute;
  };

  const handleDisableDemo = () => {
    localStorage.removeItem('DEMO_MODE');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setDemoEnabled(false);
    setCurrentUser(null);
    window.location.href = '/login';
  };

  if (demoEnabled) {
    return (
      <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 max-w-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-800">Demo Mode</span>
          </div>
          <button 
            onClick={handleDisableDemo}
            className="text-gray-400 hover:text-gray-600 text-xs"
            title="Disable Demo Mode"
          >
            ✕
          </button>
        </div>
        
        {currentUser && (
          <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
            <div className="font-medium text-gray-700">{currentUser.name}</div>
            <div className="text-gray-500">{currentUser.role}</div>
          </div>
        )}
        
        <div className="text-xs text-gray-600 mb-2">Switch Role:</div>
        <div className="grid grid-cols-2 gap-1">
          <button 
            onClick={() => handleSetRole('Admin')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              currentUser?.role === 'Admin' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
            }`}
          >
            Admin
          </button>
          <button 
            onClick={() => handleSetRole('Teacher')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              currentUser?.role === 'Teacher' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-green-100'
            }`}
          >
            Teacher
          </button>
          <button 
            onClick={() => handleSetRole('Student')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              currentUser?.role === 'Student' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
            }`}
          >
            Student
          </button>
          <button 
            onClick={() => handleSetRole('Parent')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              currentUser?.role === 'Parent' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
            }`}
          >
            Parent
          </button>
          <button 
            onClick={() => handleSetRole('TransportTeam')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              currentUser?.role === 'TransportTeam' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-yellow-100'
            }`}
          >
            Transport
          </button>
          <button 
            onClick={() => handleSetRole('AccountsTeam')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              currentUser?.role === 'AccountsTeam' 
                ? 'bg-indigo-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-indigo-100'
            }`}
          >
            Accounts
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleEnableDemo}
      className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 hover:bg-gray-700 transition-colors text-sm font-medium"
    >
      🎯 Enable Demo Mode
    </button>
  );
};

export default DemoModeToggle;