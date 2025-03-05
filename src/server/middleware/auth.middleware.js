// server/middleware/auth.middleware.js
const supabase = require('../config/supabase');
const logger = require('../utils/logger');

/**
 * Middleware to authenticate user using Supabase JWT
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.authenticate = async (req, res, next) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized - No token provided'
        }
      });
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Verify the JWT with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      logger.warn(`Authentication failed: ${error?.message || 'Invalid token'}`);
      return res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized - Invalid token'
        }
      });
    }
    
    // Add user info to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role || 'user'
    };
    
    // Proceed to next middleware
    next();
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Authentication error'
      }
    });
  }
};

/**
 * Middleware to check if user has required role
 * @param {String|Array} roles - Required role(s)
 * @returns {Function} Middleware function
 */
exports.authorize = (roles) => {
  return (req, res, next) => {
    // Ensure user exists (authenticate middleware should be called first)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized - Authentication required'
        }
      });
    }
    
    // Convert single role to array
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    // Check if user's role is included in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`Authorization failed: User ${req.user.id} with role ${req.user.role} attempted to access a resource requiring ${allowedRoles.join(', ')}`);
      return res.status(403).json({
        success: false,
        error: {
          message: 'Forbidden - Insufficient permissions'
        }
      });
    }
    
    // User has required role, proceed to next middleware
    next();
  };
};