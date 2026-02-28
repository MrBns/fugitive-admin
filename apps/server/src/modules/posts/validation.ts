import * as v from "valibot";

export const StatusSchema = v.picklist(["draft", "published"]);

export const CreatePostSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1, "Title is required")),
  content: v.pipe(v.string(), v.minLength(1, "Content is required")),
  excerpt: v.optional(v.string()),
  cover_image: v.optional(v.string()),
  status: v.optional(StatusSchema),
});

export const UpdatePostSchema = v.partial(
  v.object({
    title: v.pipe(v.string(), v.minLength(1)),
    content: v.string(),
    excerpt: v.string(),
    cover_image: v.string(),
    status: StatusSchema,
  })
);

export type CreatePostDto = v.InferOutput<typeof CreatePostSchema>;
export type UpdatePostDto = v.InferOutput<typeof UpdatePostSchema>;
