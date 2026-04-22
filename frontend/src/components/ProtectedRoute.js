import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { setDemoUser, isDemoMode } from '../utils/demoAuth';

const normalizeRole = (role) => {
  if (!role) return '';
  return String(role).trim().toLowerCase();
};

const getDefaultPathForRole = (role) => {
  const r = normalizeRole(role);
  switch (r) {
    case 'superadmin':
      return '/superadmin/dashboard';
    case 'admin':
      return '/admin/dashboard';
    case 'teacher':
      return '/teacher/dashboard';
    case 'student':
      return '/student/dashboard';
    case 'parent':
      return '/parent/dashboard';
    case 'accountsteam':
    case 'accounts':
      return '/accounts/dashboard';
    case 'transportteam':
    case 'transport':
      return '/transport/dashboard';
    case 'hrteam':
    case 'hr':
      return '/hr/dashboard';
    default:
      return '/';
  }
};

const readStoredAuth = () => {
  try {
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

const ProtectedRoute = ({ element, allowedRoles }) => {
  const location = useLocation();
  const [authReady, setAuthReady] = React.useState(false);
  
  React.useEffect(() => {
    const { token, user } = readStoredAuth();
    
    // Check if we're on localhost (development) or demo mode is enabled
    const isLocalhost = window.location.hostname === 'localhost';
    const demoModeEnabled = isDemoMode();
    
    // Enable demo mode on localhost or if explicitly enabled
    if (isLocalhost || demoModeEnabled) {
      // Auto-enable demo mode
      localStorage.setItem('DEMO_MODE', 'true');
      
      // Check if we need to set or update auth for the required role
      if (!token || !user || (allowedRoles && !allowedRoles.includes(user?.role))) {
        // Auto-set demo user with the required role
        const requiredRole = allowedRoles?.[0] || 'Admin';
        const demoUser = setDemoUser(requiredRole);
        console.log(`🎯 Demo mode: Set user as ${requiredRole} (${demoUser.name}) for ${location.pathname}`);
      }
      setAuthReady(true);
    } else {
      // Production mode: require proper auth
      setAuthReady(!!token && !!user);
    }
  }, [location.pathname, allowedRoles]);

  // Re-read auth after effect
  const { token: finalToken, user: finalUser } = readStoredAuth();
  
  // In demo mode (localhost or explicitly enabled), always allow access after setting up auth
  if (window.location.hostname === 'localhost' || isDemoMode()) {
    if (!authReady) return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
        <div className="text-sm text-gray-600">Loading demo mode...</div>
      </div>
    </div>;
    return element;
  }
  
  // Production mode: strict auth check
  if (!finalToken || !finalUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length && finalUser) {
    const userRole = normalizeRole(finalUser?.role);
    const allowed = allowedRoles.map(normalizeRole);

    if (!allowed.includes(userRole)) {
      return <Navigate to={getDefaultPathForRole(finalUser?.role)} replace />;
    }
  }

  return element;
};

export default ProtectedRoute;
