// middleware/authorization.js
// Authorization middleware functions
import { getRoleCodes, getEffectivePermissions } from './roles.js';

/**
 * isAuthenticated - Check that the user is logged in
 */
export function isAuthenticated() {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'You are not logged in!' });
    }
    next();
  };
}

/**
 * hasAnyRole - Check that the user is logged in and has at least one role
 */
export function hasAnyRole() {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'You are not logged in!' });
    }
    
    const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];
    
    if (!userRoles.length || !userRoles[0]) {
      return res.status(403).json({ error: 'You have not been assigned a role!' });
    }
    
    next();
  };
}

/**
 * hasRole - Check that the user has one of the allowed roles
 * @param {...string} allowedRoles - Role codes (e.g., 'DEV', 'QA', 'BA', 'PM', 'TM')
 * 
 * Examples:
 * hasRole('DEV') - user has the DEV role
 * hasRole('DEV', 'QA', 'BA') - user has DEV, QA, or BA role
 */
export function hasRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'You are not logged in!' });
    }
    
    const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];
    
    if (!userRoles.length || !userRoles[0]) {
      return res.status(403).json({ error: 'You have not been assigned a role!' });
    }
    
    const hasAllowedRole = allowedRoles.some(role => userRoles.includes(role));
    
    if (!hasAllowedRole) {
      return res.status(403).json({ 
        error: `You must have one of these roles: ${allowedRoles.join(', ')}` 
      });
    }
    
    next();
  };
}

/**
 * hasPermission - Check that the user has ALL of the specified permissions
 * @param {...string} requiredPermissions - Permission names (e.g., 'canViewData', 'canEditAnyBug')
 * 
 * Examples:
 * hasPermission('canViewData') - user has canViewData
 * hasPermission('canEditAnyBug', 'canCloseAnyBug') - user has BOTH permissions
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
      
      for (const permission of requiredPermissions) {
        if (!perms[permission]) {
          return res.status(403).json({ 
            error: `You do not have permission: ${permission}` 
          });
        }
      }
      
      next();
    } catch (error) {
      return res.status(500).json({ error: 'Error checking permissions' });
    }
  };
}
