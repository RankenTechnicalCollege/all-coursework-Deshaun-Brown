import { auth } from '../auth.js';

export async function isAuthenticated(req, res, next) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
    if (!session) {
      return res.status(401).json({
        message: 'Authentication required',
        error: 'No valid session found'
      });
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Authentication failed',
      error: error.message
    });
  }
}