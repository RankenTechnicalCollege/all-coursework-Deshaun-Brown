import { isValidId } from '../database.js';

/**
 * Ensures a route param is a valid Mongo ObjectId
 * Usage: validId('userId') or validId('productId')
 */
export function validId(paramName) {
  return (req, res, next) => {
    const value = req.params?.[paramName];
    if (!value || !isValidId(value)) {
      return res.status(404).json({ message: `Invalid ${paramName}` });
    }
    return next();
  };
}
