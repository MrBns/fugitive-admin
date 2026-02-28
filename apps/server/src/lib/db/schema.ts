import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").default(""),
  cover_image: text("cover_image").default(""),
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  author_id: text("author_id").notNull(),
  author_name: text("author_name").default(""),
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull(),
});
