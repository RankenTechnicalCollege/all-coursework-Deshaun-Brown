// middleware/roles.js (DB-backed)
// Loads role definitions from MongoDB and computes effective permissions for the current user.
import debug from 'debug';
import { connect } from '../database.js';

const debugRoles = debug('app:Roles');

// Normalize role codes from req.user.role, supporting string | string[] | object | object[]
export function getRoleCodes(req) {
  const r = req.user?.role;
  console.log('[getRoleCodes] Raw role from req.user:', r);
  if (typeof r === 'object') {
  console.log('[getRoleCodes] Object role:', r);
}
  if (!r) {
    console.log('[getRoleCodes] No role found, returning []');
    return [];
  }
  if (Array.isArray(r)) {
    const codes = r.map((x) => (typeof x === 'string' ? x : x?.code || x?.name || x)).filter(Boolean);
    console.log('[getRoleCodes] Array roles extracted:', codes);
    return codes;
  }
  if (typeof r === 'string') {
    console.log('[getRoleCodes] String role:', [r]);
    return [r];
  }
  if (typeof r === 'object') {
    const code = [r.code || r.name].filter(Boolean);
    console.log('[getRoleCodes] Object role extracted:', code);
    return code;
  }
  console.log('[getRoleCodes] Unknown role type, returning []');
  return [];
}

// Fetch roles from DB and merge permission flags with logical OR
export async function getEffectivePermissions(req) {
  if (req._effectivePermissions) return req._effectivePermissions;
  const codes = getRoleCodes(req);
  console.log('[getEffectivePermissions] Role codes:', codes);
  if (!codes.length) {
    console.log('[getEffectivePermissions] No role codes, returning empty permissions');
    req._effectivePermissions = {};
    return req._effectivePermissions;
  }
  const db = await connect();
  console.log('[getEffectivePermissions] Using DB:', db.databaseName);
  // Match roles by code OR name to support varied session role shapes
  const roles = await db
    .collection('roles')
    .find({ $or: [ { code: { $in: codes } }, { name: { $in: codes } } ] })
    .toArray();
  // Also log total roles present to detect empty collection/mismatch
  try {
    const total = await db.collection('roles').countDocuments();
    console.log('[getEffectivePermissions] Total roles in DB:', total);
  } catch {}
  console.log('[getEffectivePermissions] Roles found in DB:', roles.length, roles.map(r => r.code));
  const perms = {};
  for (const role of roles) {
    for (const [k, v] of Object.entries(role?.permissions || {})) {
      if (v) perms[k] = true;
    }
  }
  req._effectivePermissions = perms;
  console.log('[getEffectivePermissions] Effective permissions:', Object.keys(perms));
  debugRoles('effective permissions for %o -> %o', codes, Object.keys(perms));
  return perms;
}

export async function hasPermission(req, permission) {
  const perms = await getEffectivePermissions(req);
  return !!perms[permission];
}

export function requireRolePresent() {
  return async (req, res, next) => {
    const codes = getRoleCodes(req);
    if (codes.length) return next();
    return res.status(403).json({ error: 'Forbidden: user has no role assigned' });
  };
}

export function requirePermission(permission) {
  return async (req, res, next) => {
    const hasIt = await hasPermission(req, permission);
    console.log(`[requirePermission] Checking '${permission}':`, hasIt);
    if (hasIt) return next();
    console.log(`[requirePermission] DENIED - User lacks '${permission}'`);
    return res.status(403).json({ error: 'Forbidden: insufficient role/permission' });
  };
}

export function requireAnyPermission(permissions) {
  return async (req, res, next) => {
    const perms = await getEffectivePermissions(req);
    if (permissions.some((p) => perms[p])) return next();
    return res.status(403).json({ error: 'Forbidden: insufficient role/permission' });
  };
}
