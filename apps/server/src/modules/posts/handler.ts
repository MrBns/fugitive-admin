import { Hono } from "hono";
import * as v from "valibot";
import { auth } from "../../lib/auth/index.js";
import { PostRepository } from "./repo.js";
import { PostService } from "./services.js";
import { CreatePostSchema, UpdatePostSchema } from "./validation.js";

const repo = new PostRepository();
const service = new PostService(repo);

const postsHandler = new Hono();

// Auth middleware
postsHandler.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  c.set("session" as never, session);
  await next();
});

// GET /api/posts
postsHandler.get("/", (c) => {
  return c.json(service.listPosts());
});

// GET /api/posts/:id
postsHandler.get("/:id", (c) => {
  const post = service.getPost(c.req.param("id"));
  if (!post) return c.json({ error: "Not found" }, 404);
  return c.json(post);
});

// POST /api/posts
postsHandler.post("/", async (c) => {
  const session = (c.get as (key: string) => unknown)("session") as {
    user: { id: string; name: string };
  };

  const body = await c.req.json();
  const result = v.safeParse(CreatePostSchema, body);

  if (!result.success) {
    return c.json({ error: "Validation failed", issues: result.issues }, 400);
  }

  const post = service.createPost({
    ...result.output,
    author_id: session.user.id,
    author_name: session.user.name,
  });

  return c.json(post, 201);
});

// PUT /api/posts/:id
postsHandler.put("/:id", async (c) => {
  const body = await c.req.json();
  const result = v.safeParse(UpdatePostSchema, body);

  if (!result.success) {
    return c.json({ error: "Validation failed", issues: result.issues }, 400);
  }

  const post = service.updatePost(c.req.param("id"), result.output);
  if (!post) return c.json({ error: "Not found" }, 404);
  return c.json(post);
});

// DELETE /api/posts/:id
postsHandler.delete("/:id", (c) => {
  service.deletePost(c.req.param("id"));
  return c.json({ success: true });
});

export default postsHandler;
