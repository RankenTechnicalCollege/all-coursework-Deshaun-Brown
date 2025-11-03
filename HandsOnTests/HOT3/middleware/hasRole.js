import debug from 'debug';
import { isAuthenticated } from './isAuthenticated.js';

const debugRole = debug('app:MW:hasRole');

/**
 * Factory: require one of the given roles.
 * Usage: hasRole('admin') or hasRole(['admin','manager'])
 */
export function hasRole(required) {
  const requiredRoles = Array.isArray(required) ? required : [required];

  return async (req, res, next) => {
    // Ensure user context is present; if not, authenticate first
    if (!req.user) {
      await isAuthenticated(req, res, (err) => err && debugRole('auth error', err));
      if (!req.user) return; // isAuthenticated already responded
    }

    const userRole = req.user?.role;
    if (!userRole) {
      return res.status(403).json({ message: 'Access denied: no role assigned' });
    }

    const has = requiredRoles.includes(userRole);
    if (!has) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }

    return next();
  };
}
