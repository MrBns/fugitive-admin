import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RichEditor } from "@/components/editor/RichEditor";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Link } from "react-router-dom";

const schema = v.object({
  title: v.pipe(v.string(), v.minLength(1, "Title is required")),
  excerpt: v.optional(v.string()),
  cover_image: v.optional(v.string()),
  status: v.picklist(["draft", "published"]),
});

type FormData = v.InferOutput<typeof schema>;

export function PostEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [content, setContent] = useState("<p></p>");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: { status: "draft" as const },
  });

  const status = watch("status");

  useEffect(() => {
    if (isEditing && id) {
      fetch(`/api/posts/${id}`, { credentials: "include" })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load post");
          return res.json();
        })
        .then((post) => {
          reset({
            title: post.title,
            excerpt: post.excerpt,
            cover_image: post.cover_image,
            status: post.status,
          });
          setContent(post.content);
        })
        .catch(() => setLoadError("Failed to load post. Please go back and try again."));
    }
  }, [id, isEditing, reset]);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError(null);

    const payload = { ...data, content };
    const url = isEditing ? `/api/posts/${id}` : "/api/posts";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Failed to save post");
      }

      navigate("/dashboard/posts");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className="p-8 max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard/posts">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Posts
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">
              {isEditing ? "Edit Post" : "New Post"}
            </h1>
          </div>

          {loadError && (
            <div className="mb-4 text-sm text-destructive bg-destructive/10 rounded-md p-3">
              {loadError}
            </div>
          )}
          {error && (
            <div className="mb-4 text-sm text-destructive bg-destructive/10 rounded-md p-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter post title..."
                    className="text-lg font-medium"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Content</Label>
                  <RichEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Start writing your blog post..."
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={status}
                        onValueChange={(val) =>
                          setValue("status", val as "draft" | "published")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cover_image">Cover Image URL</Label>
                      <Input
                        id="cover_image"
                        placeholder="https://..."
                        {...register("cover_image")}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={saving}>
                      {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      {saving ? "Saving..." : isEditing ? "Update Post" : "Save Post"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Brief description of the post..."
                      rows={4}
                      {...register("excerpt")}
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional short description shown in post listings.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}
