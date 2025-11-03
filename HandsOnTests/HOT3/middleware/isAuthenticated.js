import { auth } from '../auth.js';
import { findUserByEmail } from '../database.js';

export async function isAuthenticated(req, res, next) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
    if (!session) {
      return res.status(401).json({
        message: 'Authentication required',
        error: 'No valid session found'
      });
    }

    // Start with user from session
    let user = session.user;

    // If role (or name) is missing in the session payload, enrich from DB
    if (!user?.role || !user?.name) {
      try {
        const dbUser = await findUserByEmail(user.email, true);
        if (dbUser) {
          user = { ...user, role: dbUser.role ?? user.role, name: dbUser.name ?? user.name };
        }
      } catch {
        // Best-effort enrichment; continue with whatever we have
      }
    }

    req.user = user;
    req.session = session.session;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Authentication failed',
      error: error.message
    });
  }
}