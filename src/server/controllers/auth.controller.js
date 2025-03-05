// server/controllers/auth.controller.js
const supabase = require('../config/supabase');
const logger = require('../utils/logger');

/**
 * Login user via Supabase
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Please provide both email and password'
        }
      });
    }
    
    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      logger.warn(`Login failed for ${email}: ${error.message}`);
      return res.status(401).json({
        success: false,
        error: {
          message: error.message
        }
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        user: data.user,
        session: data.session
      }
    });
  } catch (error) {
    logger.error(`Error in login controller: ${error.message}`);
    next(error);
  }
};

/**
 * Register new user via Supabase
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Please provide email and password'
        }
      });
    }
    
    // Register with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'user' // Default role
        }
      }
    });
    
    if (error) {
      logger.error(`Registration failed: ${error.message}`);
      return res.status(400).json({
        success: false,
        error: {
          message: error.message
        }
      });
    }
    
    // If email confirmation is required
    if (data?.user?.identities?.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Registration successful. Please check your email to confirm your account.'
      });
    }
    
    return res.status(201).json({
      success: true,
      data: {
        user: data.user,
        session: data.session
      }
    });
  } catch (error) {
    logger.error(`Error in register controller: ${error.message}`);
    next(error);
  }
};

/**
 * Send password reset email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Please provide an email address'
        }
      });
    }
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.CLIENT_URL}/reset-password`
    });
    
    if (error) {
      logger.error(`Password reset failed: ${error.message}`);
      return res.status(400).json({
        success: false,
        error: {
          message: error.message
        }
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Password reset instructions sent to your email'
    });
  } catch (error) {
    logger.error(`Error in resetPassword controller: ${error.message}`);
    next(error);
  }
};

/**
 * Get current user info
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    // The user object is already attached to req by the authenticate middleware
    return res.status(200).json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    logger.error(`Error in getCurrentUser controller: ${error.message}`);
    next(error);
  }
};

/**
 * Logout user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.logout = async (req, res, next) => {
  try {
    // Get JWT from authorization header
    const token = req.headers.authorization.split(' ')[1];
    
    const { error } = await supabase.auth.signOut({
      jwt: token
    });
    
    if (error) {
      logger.error(`Logout failed: ${error.message}`);
      return res.status(400).json({
        success: false,
        error: {
          message: error.message
        }
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Successfully logged out'
    });
  } catch (error) {
    logger.error(`Error in logout controller: ${error.message}`);
    next(error);
  }
};