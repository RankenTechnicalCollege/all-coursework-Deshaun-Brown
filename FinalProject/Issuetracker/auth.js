import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getClient, getDatabase } from "./database.js";

const client = await getClient();
const db = await getDatabase();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || `http://localhost:${process.env.PORT || 8080}`,
  trustedOrigins: [
    `http://localhost:${process.env.PORT || 8080}`,
    "http://localhost:3000",
    "http://localhost:5173",
  ],
  secret: process.env.BETTER_AUTH_SECRET || "dev-secret-change-me",
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: true,
    maxAge: 60 * 60, // seconds (1 hour)
  },
  user: {
    additionalFields: {
      role: { type: "object", required: false },
      profile: { type: "object", required: false },
    },
  },
});

export default auth;
