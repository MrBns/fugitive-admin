import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { account, session, user } from "./auth-schema";
import { relations } from "drizzle-orm";

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
  author_id: text("author_id").notNull().references(() => user.id, {
    onDelete: "cascade",
  }),
  author_name: text("author_name").default(""),
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const postAuthorRelations = relations(posts, ({ one }) => ({
  author: one(user, {
    fields: [posts.author_id],
    references: [user.id],
  }),
}));
