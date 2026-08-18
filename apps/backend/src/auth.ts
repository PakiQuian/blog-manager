import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "./db.js";

const isProduction = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.CORS_ORIGIN ?? "http://localhost:5173"],
  // Frontend and backend live on different Render subdomains in production, which counts as
  // cross-site for cookies (onrender.com is a public suffix). Without this, the session cookie
  // never reaches the API and every protected request looks logged-out.
  advanced: isProduction
    ? { defaultCookieAttributes: { sameSite: "none", secure: true } }
    : undefined,
});
