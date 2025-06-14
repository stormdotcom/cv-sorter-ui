import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogPost } from "./PublicBlogEditor";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface BlogListResponse {
  blogPosts: BlogPost[];
  pagination: {
    total: number;
    totalPages: number;
  };
}

export default function BlogList() {
  const [, setLocation] = useLocation();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [data, setData] = useState<BlogListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest("GET", `/api/blog?page=${page}&limit=${limit}`);
        setData(response);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, [page, limit]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Blog Posts</h1>
        </div>
        <Card className="bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading blog posts: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { blogPosts, pagination } = data || { blogPosts: [], pagination: { total: 0, totalPages: 0 } };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Button onClick={() => setLocation("/blog/new")} className="rounded-full">
          <span className="material-icons mr-2">add</span>
          New Post
        </Button>
      </div>

      {blogPosts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <span className="material-icons text-4xl text-gray-400 mb-2">article</span>
            <h3 className="text-xl font-medium mb-1">No blog posts yet</h3>
            <p className="text-gray-500 mb-4">Create your first blog post to share recruitment tips and insights</p>
            <Button onClick={() => setLocation("/blog/new")}>
              Create Your First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {blogPosts.map((post: BlogPost) => (
              <Card key={post.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl hover:text-primary cursor-pointer" onClick={() => setLocation(`/blog/${post.id}`)}>
                      {post.title}
                    </CardTitle>
                    {post.published ? (
                      <Badge variant="default" className="bg-green-500 hover:bg-green-600">Published</Badge>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {post.tags?.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="mr-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 line-clamp-2">{post.summary}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-gray-500">
                    By {post.authorName || "Anonymous"} • {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setLocation(`/blog/${post.id}`)}>
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <Pagination 
              currentPage={page} 
              totalPages={pagination.totalPages} 
              onPageChange={(p) => setPage(p)} 
            />
          )}
        </>
      )}
    </div>
  );
}
