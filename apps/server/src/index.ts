import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./lib/auth/index.js";
import postsHandler from "./modules/posts/handler.js";

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:5173", "http://localhost:3001"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// Better Auth handler
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

// Blog post routes
app.route("/api/posts", postsHandler);

export default {
  port: 3001,
  fetch: app.fetch,
};
