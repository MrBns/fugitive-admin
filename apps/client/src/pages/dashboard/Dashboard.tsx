import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  FileText,
  PlusCircle,
  TrendingUp,
  Eye,
  Layers,
  Zap,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  created_at: string;
  updated_at: string;
  author_name: string;
}

const modules = [
  {
    title: "Blog Management",
    description: "Create and manage blog posts",
    icon: FileText,
    href: "/dashboard/posts",
    action: "Manage Posts",
    badge: null as string | null,
    color: "text-blue-500",
  },
  {
    title: "NFT Management",
    description: "Manage NFT collections and assets",
    icon: Layers,
    href: "/dashboard/nft",
    action: "View NFTs",
    badge: "Soon",
    color: "text-purple-500",
  },
  {
    title: "DApp Features",
    description: "Configure your decentralized application",
    icon: Zap,
    href: "/dashboard/dapp",
    action: "Configure",
    badge: "Soon",
    color: "text-amber-500",
  },
];

export function Dashboard() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;
  const recentPosts = posts.slice(0, 4);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-5">
          <h1 className="text-xl font-bold">
            Welcome back, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Here's an overview of your admin panel.
          </p>
        </div>

        {/* Modules Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          {modules.map((mod) => (
            <Card key={mod.title} className="relative overflow-hidden hover:shadow-sm transition-shadow">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-start justify-between">
                  <mod.icon className={`h-4 w-4 ${mod.color}`} />
                  {mod.badge && (
                    <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                      {mod.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-sm font-semibold mt-2">{mod.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-xs text-muted-foreground mb-3">{mod.description}</p>
                <Button asChild size="sm" variant="outline" className="h-7 text-xs w-full">
                  <Link to={mod.href}>
                    {mod.action}
                    <ArrowRight className="ml-1.5 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Blog Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-3">
              <CardTitle className="text-xs font-medium text-muted-foreground">Total Posts</CardTitle>
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-xl font-bold">{posts.length}</div>
              <p className="text-[11px] text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-3">
              <CardTitle className="text-xs font-medium text-muted-foreground">Published</CardTitle>
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-xl font-bold">{publishedCount}</div>
              <p className="text-[11px] text-muted-foreground">Live</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-3">
              <CardTitle className="text-xs font-medium text-muted-foreground">Drafts</CardTitle>
              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-xl font-bold">{draftCount}</div>
              <p className="text-[11px] text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
            <CardTitle className="text-sm font-semibold">Recent Posts</CardTitle>
            <Button asChild size="sm" variant="outline" className="h-7 text-xs">
              <Link to="/dashboard/posts/new">
                <PlusCircle className="mr-1.5 h-3 w-3" />
                New Post
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {loading ? (
              <div className="text-xs text-muted-foreground py-4 text-center">Loading...</div>
            ) : recentPosts.length === 0 ? (
              <div className="text-center py-6">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No posts yet.</p>
                <Button asChild className="mt-3" size="sm">
                  <Link to="/dashboard/posts/new">Create your first post</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between px-3 py-2 rounded-md border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{post.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {format(new Date(post.created_at), "MMM d, yyyy")} · {post.author_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <Badge
                        variant={post.status === "published" ? "default" : "secondary"}
                        className="text-[10px] h-4 px-1.5"
                      >
                        {post.status}
                      </Badge>
                      <Button asChild size="sm" variant="ghost" className="h-6 text-xs px-2">
                        <Link to={`/dashboard/posts/${post.id}/edit`}>Edit</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

