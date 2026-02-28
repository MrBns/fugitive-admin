import { randomUUID } from "crypto";
import type { Post, CreatePostInput, UpdatePostInput } from "../../core/posts/post.entity.js";
import type { PostRepositoryPort } from "../../core/posts/post.repository.port.js";
import { db } from "../db/index.js";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export class PostRepository implements PostRepositoryPort {
  findAll(): Post[] {
    return db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all() as Post[];
  }

  findById(id: string): Post | null {
    return (db.prepare("SELECT * FROM posts WHERE id = ?").get(id) as Post) ?? null;
  }

  create(input: CreatePostInput): Post {
    const id = randomUUID();
    const now = new Date().toISOString();
    const slug = slugify(input.title) + "-" + id.slice(0, 8);

    db.prepare(`
      INSERT INTO posts (id, title, slug, content, excerpt, cover_image, status, author_id, author_name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      input.title,
      slug,
      input.content,
      input.excerpt ?? "",
      input.cover_image ?? "",
      input.status ?? "draft",
      input.author_id,
      input.author_name,
      now,
      now
    );

    const post = this.findById(id);
    if (!post) throw new Error(`Failed to retrieve post after insert (id=${id}). This may indicate a database constraint violation.`);
    return post;
  }

  update(id: string, input: UpdatePostInput): Post | null {
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
      input.title ?? null,
      input.content ?? null,
      input.excerpt ?? null,
      input.cover_image ?? null,
      input.status ?? null,
      now,
      id
    );

    return this.findById(id);
  }

  delete(id: string): void {
    db.prepare("DELETE FROM posts WHERE id = ?").run(id);
  }
}
