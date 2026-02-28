export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  status: "draft" | "published";
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  status?: "draft" | "published";
  author_id: string;
  author_name: string;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  excerpt?: string;
  cover_image?: string;
  status?: "draft" | "published";
}
