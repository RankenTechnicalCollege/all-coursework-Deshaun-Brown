import { auth } from "../auth.js";
import { connect } from "../database.js";
import debug from "debug";

const debugAuth = debug("app:isAuthenticated");

export async function isAuthenticated(req, res, next) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "You must be logged in to access this resource",
      });
    }

    debugAuth("Session user:", session.user);

    // Fetch full user with role from database
    const db = await connect();
    const fullUser = await db.collection("users").findOne(
      { email: session.user.email },
      { projection: { password: 0 } }
    );

    debugAuth(`Full user from DB for ${session.user.email}:`, fullUser);

    if (!fullUser) {
      debugAuth(`User ${session.user.email} not found in database`);
      return res.status(401).json({
        error: "Unauthorized",
        message: "User not found in database",
      });
    }

    // Get role from database, fallback to session role, then default to DEV
    const userRole = fullUser.role || session.user.role || "DEV";

    // Attach full user data including role to request
    req.user = {
      _id: fullUser._id?.toString() || session.user.id,
      id: fullUser._id?.toString() || session.user.id,
      email: fullUser.email,
      fullName: fullUser.fullName || session.user.name || fullUser.email,
      role: userRole,
      createdAt: fullUser.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: fullUser.updatedAt?.toISOString(),
    };
    req.session = session.session;

    debugAuth("[isAuthenticated] User authenticated:", {
      email: req.user.email,
      role: req.user.role,
      fullName: req.user.fullName,
    });

    return next();
  } catch (err) {
    console.error("[isAuthenticated] Error:", err);
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired session",
    });
  }
}
