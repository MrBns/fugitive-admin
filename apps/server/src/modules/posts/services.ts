import type { Post, CreatePostInput, UpdatePostInput } from "./entity.js";
import type { PostRepositoryPort } from "./repo_port.js";

export class PostService {
  constructor(private readonly repo: PostRepositoryPort) {}

  listPosts(): Post[] {
    return this.repo.findAll();
  }

  getPost(id: string): Post | null {
    return this.repo.findById(id);
  }

  createPost(input: CreatePostInput): Post {
    return this.repo.create(input);
  }

  updatePost(id: string, input: UpdatePostInput): Post | null {
    return this.repo.update(id, input);
  }

  deletePost(id: string): void {
    this.repo.delete(id);
  }
}
