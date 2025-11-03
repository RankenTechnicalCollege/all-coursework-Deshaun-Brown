import Joi from 'joi';

/**
 * Joi validation middleware
 * - Displays all errors (abortEarly: false)
 * - Removes unknown keys (stripUnknown: true)
 * - Returns 400 on validation failure
 */
export function validate(schema) {
  if (!schema || !Joi.isSchema(schema)) {
    throw new Error('validate(schema) requires a Joi schema');
  }

  return (req, res, next) => {
    const options = { abortEarly: false, stripUnknown: true, convert: true };
    const { error, value } = schema.validate(req.body, options);

    if (error) {
      return res.status(400).json({
        message: 'Invalid request body',
        details: error.details.map(d => ({ message: d.message, path: d.path }))
      });
    }

    // Replace body with sanitized value
    req.body = value;
    return next();
  };
}
