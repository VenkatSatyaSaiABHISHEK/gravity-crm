const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

// Verify JWT Token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
        return null;
    }
};

// Main authentication middleware
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from headers
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        // Check for demo mode token
        if (token.startsWith('demo-token-')) {
            // Demo mode authentication
            const demoUsers = {
                'Admin': {
                    id: 'demo-admin-001',
                    name: 'Demo Admin',
                    email: 'admin@demo.com',
                    role: 'Admin',
                    college: 'Demo College',
                    collegeId: 'demo-college-001',
                    isActive: true
                },
                'Teacher': {
                    id: 'demo-teacher-001',
                    name: 'Demo Teacher',
                    email: 'teacher1@demo.com',
                    role: 'Teacher',
                    college: 'Demo College',
                    collegeId: 'demo-college-001',
                    isActive: true
                },
                'Student': {
                    id: 'demo-student-001',
                    name: 'Demo Student',
                    email: 'student2@demo.com',
                    role: 'Student',
                    college: 'Demo College',
                    collegeId: 'demo-college-001',
                    isActive: true
                },
                'Parent': {
                    id: 'demo-parent-001',
                    name: 'Demo Parent',
                    email: 'parent1@demo.com',
                    role: 'Parent',
                    college: 'Demo College',
                    collegeId: 'demo-college-001',
                    isActive: true
                },
                'TransportTeam': {
                    id: 'demo-transport-001',
                    name: 'Demo Transport',
                    email: 'transport@demo.com',
                    role: 'TransportTeam',
                    college: 'Demo College',
                    collegeId: 'demo-college-001',
                    isActive: true
                },
                'AccountsTeam': {
                    id: 'demo-accounts-001',
                    name: 'Demo Accounts',
                    email: 'accounts@demo.com',
                    role: 'AccountsTeam',
                    college: 'Demo College',
                    collegeId: 'demo-college-001',
                    isActive: true
                },
                'HRTeam': {
                    id: 'demo-hr-001',
                    name: 'Demo HR',
                    email: 'hr@demo.com',
                    role: 'HRTeam',
                    college: 'Demo College',
                    collegeId: 'demo-college-001',
                    isActive: true
                }
            };

            // Get the user from localStorage by reading the request path
            // Extract role from the URL path (e.g., /api/teacher/... -> Teacher)
            let detectedRole = 'Admin'; // Default
            const path = req.path || req.url || '';
            
            if (path.includes('/teacher')) detectedRole = 'Teacher';
            else if (path.includes('/student')) detectedRole = 'Student';
            else if (path.includes('/parent')) detectedRole = 'Parent';
            else if (path.includes('/transport')) detectedRole = 'TransportTeam';
            else if (path.includes('/accounts')) detectedRole = 'AccountsTeam';
            else if (path.includes('/hr')) detectedRole = 'HRTeam';
            else if (path.includes('/admin')) detectedRole = 'Admin';

            const demoUser = demoUsers[detectedRole] || demoUsers['Admin'];

            // Set demo mode flag
            req.demoMode = true;
            req.user = demoUser;
            req.collegeId = demoUser.collegeId;
            req.role = demoUser.role;

            console.log(`🎯 Demo mode: Authenticated as ${demoUser.role} (${demoUser.name}) for ${path}`);
            return next();
        }

        // Verify token
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                college: true,
                AdminProfile: true,
                TeacherProfile: true,
                StudentProfile: true,
                ParentProfile: true,
            },
        });

        if (!user || !user.isActive) {
            return res.status(401).json({ success: false, message: 'User not found or inactive' });
        }

        // Validate domain if college-specific
        if (user.collegeId && req.collegeId && user.collegeId !== req.collegeId) {
            return res.status(403).json({ success: false, message: 'Access denied: Invalid college' });
        }

        // Attach user to request
        req.user = user;
        req.collegeId = user.collegeId;
        req.role = user.role;

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ success: false, message: 'Authentication error' });
    }
};

// Domain detection middleware
const detectDomain = async (req, res, next) => {
    try {
        const pickFirst = (value) => {
            if (!value) return null;
            const first = String(value).split(',')[0]?.trim();
            return first || null;
        };

        const extractHostname = (value) => {
            const raw = pickFirst(value);
            if (!raw) return null;

            try {
                // If it's a URL (Origin/Referer), parse hostname.
                if (/^https?:\/\//i.test(raw)) {
                    return new URL(raw).hostname;
                }
            } catch {
                // ignore
            }

            // Otherwise treat as host header value.
            return String(raw).split(':')[0];
        };

        const normalizeDomain = (value) => {
            const hostname = extractHostname(value);
            if (!hostname) return null;
            const d = String(hostname).trim().toLowerCase();
            if (!d) return null;
            return d.startsWith('www.') ? d.slice(4) : d;
        };

        const candidates = [
            req.headers['x-forwarded-host'],
            req.headers['x-original-host'],
            req.get('host'),
            req.get('origin'),
            req.get('referer'),
        ]
            .map(normalizeDomain)
            .filter(Boolean);

        const uniqueCandidates = Array.from(new Set(candidates));
        for (const domain of uniqueCandidates) {
            const collegeDomain = await prisma.collegeDomain.findUnique({
                where: { domain },
                include: { college: true },
            });

            if (collegeDomain && collegeDomain.status === 'active') {
                req.collegeId = collegeDomain.collegeId;
                req.collegeName = collegeDomain.collegeName;
                req.collegeData = collegeDomain.college;
                break;
            }
        }

        // For localhost or development, allow domain in query or headers
        if (!req.collegeId && (req.query.collegeId || req.headers['x-college-id'])) {
            req.collegeId = req.query.collegeId || req.headers['x-college-id'];
        }

        next();
    } catch (error) {
        console.error('Domain detection error:', error);
        next(); // Continue even if domain detection fails
    }
};

// Role-based access control middleware
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const normalizeRole = (role) => {
            if (!role) return '';
            return String(role).trim().toLowerCase();
        };

        const userRole = normalizeRole(req.user.role);
        const allowed = allowedRoles.map(normalizeRole);

        if (!allowed.includes(userRole)) {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied: Insufficient permissions' 
            });
        }

        next();
    };
};

// College-specific authorization (user must belong to college)
const authorizeCollege = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (req.user.role === 'SuperAdmin') {
        return next(); // SuperAdmin can access any college
    }

    if (!req.user.collegeId || !req.collegeId) {
        return res.status(403).json({ success: false, message: 'College not identified' });
    }

    if (req.user.collegeId !== req.collegeId) {
        return res.status(403).json({ success: false, message: 'Access denied: Invalid college' });
    }

    next();
};

module.exports = {
    authMiddleware,
    detectDomain,
    authorize,
    authorizeCollege,
    verifyToken,
};
