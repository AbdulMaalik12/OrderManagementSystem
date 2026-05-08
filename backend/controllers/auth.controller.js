const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { success, error } = require('../utils/apiResponse');
const { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } = require('../config/env');

/**
 * Generate access and refresh tokens for a user.
 */
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
  return { accessToken, refreshToken };
};

/**
 * POST /api/auth/register
 * Register a new user account.
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, businessName, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return error(res, 'An account with this email already exists.', 409);
    }

    // Create user
    const user = await User.create({ name, email, password, businessName, phone });

    // Generate tokens
    const tokens = generateTokens(user._id);

    return success(
      res,
      {
        user: user.toJSON(),
        ...tokens,
      },
      201,
      'Account created successfully'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Authenticate a user and return tokens.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with password field included
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return error(res, 'Invalid email or password.', 401);
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return error(res, 'Invalid email or password.', 401);
    }

    // Generate tokens
    const tokens = generateTokens(user._id);

    return success(res, {
      user: user.toJSON(),
      ...tokens,
    }, 200, 'Login successful');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/profile
 * Get the current user's profile.
 */
const getProfile = async (req, res, next) => {
  try {
    return success(res, { user: req.user.toJSON() });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/refresh
 * Refresh the access token using a refresh token.
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return error(res, 'Refresh token is required.', 400);
    }

    // Verify refresh token
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return error(res, 'User not found.', 401);
    }

    // Generate new tokens
    const tokens = generateTokens(user._id);

    return success(res, tokens, 200, 'Token refreshed successfully');
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Refresh token has expired. Please login again.', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      return error(res, 'Invalid refresh token.', 401);
    }
    next(err);
  }
};

module.exports = { register, login, getProfile, refreshToken };
