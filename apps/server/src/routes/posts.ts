import { Hono } from "hono";
import { db } from "../db.js";
import { auth } from "../auth.js";
import { randomUUID } from "crypto";

const posts = new Hono();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Middleware to check auth
posts.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  c.set("session" as never, session);
  await next();
});

// List posts
posts.get("/", (c) => {
  const allPosts = db
    .prepare("SELECT * FROM posts ORDER BY created_at DESC")
    .all();
  return c.json(allPosts);
});

// Get single post
posts.get("/:id", (c) => {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(c.req.param("id"));
  if (!post) return c.json({ error: "Not found" }, 404);
  return c.json(post);
});

// Create post
posts.post("/", async (c) => {
  const session = (c.get as (key: string) => unknown)("session") as {
    user: { id: string; name: string };
  };
  const body = await c.req.json<{
    title: string;
    content: string;
    excerpt?: string;
    cover_image?: string;
    status?: string;
  }>();
  
  const id = randomUUID();
  const now = new Date().toISOString();
  const slug = slugify(body.title) + "-" + id.slice(0, 8);

  db.prepare(`
    INSERT INTO posts (id, title, slug, content, excerpt, cover_image, status, author_id, author_name, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    body.title,
    slug,
    body.content,
    body.excerpt || "",
    body.cover_image || "",
    body.status || "draft",
    session.user.id,
    session.user.name,
    now,
    now
  );

  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(id);
  return c.json(post, 201);
});

// Update post
posts.put("/:id", async (c) => {
  const body = await c.req.json<{
    title?: string;
    content?: string;
    excerpt?: string;
    cover_image?: string;
    status?: string;
  }>();
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE posts SET
      title = COALESCE(?, title),
      content = COALESCE(?, content),
      excerpt = COALESCE(?, excerpt),
      cover_image = COALESCE(?, cover_image),
      status = COALESCE(?, status),
      updated_at = ?
    WHERE id = ?
  `).run(
    body.title,
    body.content,
    body.excerpt,
    body.cover_image,
    body.status,
    now,
    c.req.param("id")
  );

  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(c.req.param("id"));
  return c.json(post);
});

// Delete post
posts.delete("/:id", (c) => {
  db.prepare("DELETE FROM posts WHERE id = ?").run(c.req.param("id"));
  return c.json({ success: true });
});

export default posts;
