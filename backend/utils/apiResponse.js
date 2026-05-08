/**
 * Standardized API response helpers.
 * Ensures a consistent response shape across all endpoints.
 */

/**
 * Send a success response.
 * @param {object} res - Express response object
 * @param {object|array} data - Response payload
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {string} message - Optional success message
 */
const success = (res, data = null, statusCode = 200, message = 'Success') => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send an error response.
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {object} errors - Optional validation errors
 */
const error = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = { success, error };
