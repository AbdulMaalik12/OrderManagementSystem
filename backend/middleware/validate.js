const { error } = require('../utils/apiResponse');

/**
 * Joi validation middleware factory.
 * Returns a middleware that validates the specified request property
 * against the given Joi schema.
 *
 * @param {object} schema - Joi schema to validate against
 * @param {string} property - Request property to validate ('body', 'params', 'query')
 * @returns {function} Express middleware
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error: validationError, value } = schema.validate(req[property], {
      abortEarly: false, // Collect all errors
      stripUnknown: true, // Remove unknown fields
    });

    if (validationError) {
      const errors = validationError.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, ''),
      }));

      return error(res, 'Validation failed', 400, errors);
    }

    // Replace request property with validated & sanitized value
    req[property] = value;
    next();
  };
};

module.exports = validate;
