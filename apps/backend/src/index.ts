import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth.js";
import articles from "./routes/articles.js";
import publicRoutes from "./routes/public.js";
import type { Variables } from "./types.js";

const app = new Hono<{ Variables: Variables }>();

app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});

app.all("/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api/articles", articles);
app.route("/api/public", publicRoutes);

app.get("/api/health", (c) => c.json({ ok: true }));

const port = Number(process.env.PORT) || 3000;
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Backend listening on http://localhost:${info.port}`);
});
