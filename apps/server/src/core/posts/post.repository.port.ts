import type { Post, CreatePostInput, UpdatePostInput } from "./post.entity.js";

export interface PostRepositoryPort {
  findAll(): Post[];
  findById(id: string): Post | null;
  create(input: CreatePostInput): Post;
  update(id: string, input: UpdatePostInput): Post | null;
  delete(id: string): void;
}
