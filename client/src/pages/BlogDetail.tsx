import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/api";
import { useState, useEffect } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { BlogPost } from "./PublicBlogEditor";

export default function BlogDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest("GET", `/api/blog/${id}`);
        setBlog(response);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setBlog(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  const handlePublish = async () => {
    if (!blog) return;
    
    try {
      setIsPublishing(true);
      const response = await apiRequest(
        "PATCH",
        `/api/blog/${id}`,
        { published: !blog.published }
      );
      setBlog(response);
      toast({
        title: blog.published ? "Blog post unpublished" : "Blog post published",
        description: blog.published ? "This post is now a draft." : "This post is now public.",
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Failed to update blog post",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiRequest("DELETE", `/api/blog/${id}`);
      toast({
        title: "Blog post deleted",
        description: "The blog post has been permanently deleted.",
      });
      setLocation("/blog");
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Failed to delete blog post",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Separator />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="space-y-4">
        <Card className="bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive">
              {error ? `Error loading blog post: ${error.message}` : "Blog post not found"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{blog.title}</h1>
          <div className="flex gap-2 mt-2">
            <Badge variant={blog.published ? "default" : "secondary"}>
              {blog.published ? "Published" : "Draft"}
            </Badge>
            {blog.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setLocation(`/blog/edit/${blog.id}`)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {blog.published ? "Unpublish" : "Publish"}
          </Button>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the blog post.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <Separator />
      <div className="prose max-w-none">
        {blog.content}
      </div>
    </div>
  );
}
