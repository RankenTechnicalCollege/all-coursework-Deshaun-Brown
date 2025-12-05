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
    "https://issuetracker-service-293672483239.us-central1.run.app",
  ],
  secret: process.env.BETTER_AUTH_SECRET || "dev-secret-change-me",
  // Use pluralized collection names (users, sessions, etc.) so they match the rest of the app
  database: mongodbAdapter(db, { client, usePlural: true }),
  emailAndPassword: {
    enabled: true,
  },
  session:{
       expiresIn: 300, // 5 minutes
       cookieCache: {
            enabled: true, // Enable caching session in cookie (default: `false`)    
            maxAge: 300 // 5 minutes
        },
   user: {
        additionalFields: {
            role: {
                type: "object",
                required: true,
            },
            profile: {
                type: "object",
                required: true,
                defaultValue: {}
               
            }
        },
  },
},
});

export default auth;
