import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Define BlogPost interface locally and export it
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  authorName: string;
  published: boolean;
  tags?: string[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Define schema for form validation
const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  summary: z.string().min(1, "Summary is required"),
  authorName: z.string().min(1, "Author name is required"),
  published: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  publishedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

const PublicBlogEditor = () => {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditing = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [published, setPublished] = useState(false);
  const [slug, setSlug] = useState("");

  // Fetch blog post if editing
  useEffect(() => {
    const fetchBlogPost = async () => {
      if (isEditing && id) {
        try {
          setIsLoading(true);
          const data = await apiRequest("GET", `/api/blog/${id}`);
          setBlogPost(data);
          setTitle(data.title);
          setContent(data.content);
          setSummary(data.summary);
          setAuthorName(data.authorName || "");
          setTags(data.tags || []);
          setPublished(data.published);
          setSlug(data.slug);
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message || "Failed to fetch blog post",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBlogPost();
  }, [isEditing, id, toast]);

  // Generate a slug from the title
  useEffect(() => {
    if (title && !isEditing) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");
      setSlug(generatedSlug);
    }
  }, [title, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      const payload = {
        title,
        content,
        summary,
        authorName,
        tags,
        published,
        slug,
      };

      if (isEditing) {
        await apiRequest("PATCH", `/api/blog/${id}`, payload);
        toast({
          title: "Blog post updated",
          description: "Your blog post has been updated successfully.",
        });
        setLocation(`/blog/${id}`);
      } else {
        await apiRequest("POST", "/api/blog", payload);
        toast({
          title: "Blog post created",
          description: "Your blog post has been created successfully.",
        });
        setLocation('/blog');
      }
    } catch (error: any) {
      toast({
        title: isEditing ? "Error updating blog post" : "Error creating blog post",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Blog Post" : "Create New Blog Post"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog post title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Enter a brief summary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post content"
              className="min-h-[300px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="authorName">Author Name</Label>
            <Input
              id="authorName"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Enter author name"
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Add tags (press Enter)"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
            />
            <Label htmlFor="published">Published</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation('/blog')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : isEditing ? "Update" : "Create"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default PublicBlogEditor;
