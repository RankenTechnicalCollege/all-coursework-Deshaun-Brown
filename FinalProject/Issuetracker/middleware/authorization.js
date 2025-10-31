// middleware/authorization.js
// Authorization middleware functions based on lecture notes pages 15-22
import { getRoleCodes, getEffectivePermissions } from './roles.js';

/**
 * isLoggedIn - Check that the user is logged in, nothing more
 */
export function isLoggedIn() {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'You are not logged in!' });
    } else {
      return next();
    }
  };
}

/**
 * hasAnyRole - Check that the user is logged in and has at least one role
 * Supports both string roles and array of roles
 */
export function hasAnyRole() {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'You are not logged in!' });
    } else if (req.user.role && typeof req.user.role === 'string') {
      return next();
    } else if (Array.isArray(req.user.role) && req.user.role[0]) {
      return next();
    } else {
      return res.status(403).json({ error: 'You have not been assigned a role!' });
    }
  };
}

/**
 * hasRole - Check that the user is logged in and has one of the allowed roles
 * Supports both string roles and array of roles
 * Uses rest operator to accept arbitrary number of allowed roles
 * @param {...string} allowedRoles - Role codes (e.g., 'DEV', 'QA', 'BA', 'PM', 'TM')
 * 
 * Examples:
 * hasRole() - user has at least one role
 * hasRole('DEV') - user has the DEV role
 * hasRole('DEV', 'QA', 'BA') - user has DEV, QA, or BA role
 */
export function hasRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'You are not logged in!' });
    } else if (!req.user.role) {
      return res.status(403).json({ error: 'You have not been assigned a role!' });
    } else if (Array.isArray(req.user.role) && !req.user.role[0]) {
      return res.status(403).json({ error: 'You have not been assigned a role!' });
    } else {
      // If no allowed roles specified, just check user has any role
      if (allowedRoles.length === 0) {
        return next();
      }
      
      // Normalize user's roles to array
      const authRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];

      // Check if user has any of the allowed roles (OR logic)
      for (const role of allowedRoles) {
        if (authRoles.includes(role)) {
          return next();
        }
      }

      // User is not in any of the allowed groups
      return res.status(403).json({ error: 'You do not have one of the allowed roles!' });
    }
  };
}

/**
 * hasAnyOfRoles - Check that the user has one of a set of allowed roles
 * @param {string[]} allowedRoles - Array of role codes (e.g., ['DEV', 'QA', 'BA'])
 */
export function hasAnyOfRoles(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'You are not logged in!' });
    }
    
    const userRoles = getRoleCodes(req);
    const hasRole = userRoles.some(role => allowedRoles.includes(role));
    
    if (hasRole) {
      return next();
    } else {
      return res.status(403).json({ 
        error: `You must have one of these roles: ${allowedRoles.join(', ')}` 
      });
    }
  };
}

/**
 * hasPermission - Check that the user has ALL of the specified permissions (DB-backed)
 * Uses rest operator to accept arbitrary number of required permissions
 * @param {...string} requiredPermissions - Permission names (e.g., 'canViewData', 'canEditAnyUser')
 * 
 * Examples:
 * hasPermission('canViewData') - user has canViewData
 * hasPermission('canEditAnyBug', 'canCloseAnyBug') - user has BOTH permissions (AND logic)
 */
export function hasPermission(...requiredPermissions) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'You are not logged in!' });
    }
    
    try {
      const perms = await getEffectivePermissions(req);
      
      if (!perms || Object.keys(perms).length === 0) {
        return res.status(403).json({ error: 'You do not have any permissions!' });
      }
      
      // Check that user has ALL required permissions (AND logic)
      for (const permission of requiredPermissions) {
        if (!perms[permission]) {
          return res.status(403).json({ 
            error: `You do not have permission ${permission}!` 
          });
        }
      }
      
      return next();  // User has all required permissions
    } catch (error) {
      return res.status(500).json({ error: 'Error checking permissions' });
    }
  };
}

/**
 * hasAnyPermission - Check that the user has at least one of the specified permissions
 * @param {string[]} permissions - Array of permission names
 */
export function hasAnyPermission(permissions) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'You are not logged in!' });
    }
    
    try {
      const perms = await getEffectivePermissions(req);
      const hasPermission = permissions.some(p => perms[p]);
      
      if (hasPermission) {
        return next();
      } else {
        return res.status(403).json({ 
          error: `You must have one of these permissions: ${permissions.join(', ')}` 
        });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Error checking permissions' });
    }
  };
}
