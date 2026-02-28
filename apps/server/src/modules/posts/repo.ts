import { randomUUID } from "crypto";
import { eq, desc } from "drizzle-orm";
import type { Post, CreatePostInput, UpdatePostInput } from "./entity.js";
import type { PostRepositoryPort } from "./repo_port.js";
import { db } from "../../lib/db/index.js";
import { posts } from "../../lib/db/schema.js";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export class PostRepository implements PostRepositoryPort {
  findAll(): Post[] {
    return db.select().from(posts).orderBy(desc(posts.created_at)).all() as Post[];
  }

  findById(id: string): Post | null {
    return (db.select().from(posts).where(eq(posts.id, id)).get() as Post) ?? null;
  }

  create(input: CreatePostInput): Post {
    const id = randomUUID();
    const now = new Date().toISOString();
    const slug = slugify(input.title) + "-" + id.slice(0, 8);

    db.insert(posts).values({
      id,
      title: input.title,
      slug,
      content: input.content,
      excerpt: input.excerpt ?? "",
      cover_image: input.cover_image ?? "",
      status: input.status ?? "draft",
      author_id: input.author_id,
      author_name: input.author_name,
      created_at: now,
      updated_at: now,
    }).run();

    const post = this.findById(id);
    if (!post) throw new Error(`Failed to retrieve post after insert (id=${id}). This may indicate a database constraint violation.`);
    return post;
  }

  update(id: string, input: UpdatePostInput): Post | null {
    const now = new Date().toISOString();

    const updateData: Partial<typeof posts.$inferInsert> = {
      updated_at: now,
    };
    if (input.title !== undefined) updateData.title = input.title;
    if (input.content !== undefined) updateData.content = input.content;
    if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
    if (input.cover_image !== undefined) updateData.cover_image = input.cover_image;
    if (input.status !== undefined) updateData.status = input.status;

    db.update(posts).set(updateData).where(eq(posts.id, id)).run();

    return this.findById(id);
  }

  delete(id: string): void {
    db.delete(posts).where(eq(posts.id, id)).run();
  }
}
