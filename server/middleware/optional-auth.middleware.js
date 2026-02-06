const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Optional authentication - doesn't fail if token is missing, but sets req.user if valid token exists
const optionalAuthenticate = async (req, res, next) => {
  try {
    // Try to get token from HttpOnly cookie first
    let token = req.cookies?.token;
    
    // Fallback to Authorization header for compatibility
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }
    
    // If no token, just continue without setting req.user
    if (!token) {
      return next();
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.userId);
      
      if (user) {
        // Remove password from user object and convert id
        const { password, ...userWithoutPassword } = user;
        userWithoutPassword.id = userWithoutPassword.id || userWithoutPassword._id;
        req.user = userWithoutPassword;
      }
    } catch (tokenError) {
      // Invalid or expired token - just continue without req.user
      // Don't fail the request, just don't set req.user
      console.log('Optional auth: Invalid token, continuing without authentication');
    }
    
    next();
  } catch (error) {
    // Any other error - continue without authentication
    console.error('Optional auth error:', error);
    next();
  }
};

module.exports = optionalAuthenticate;

