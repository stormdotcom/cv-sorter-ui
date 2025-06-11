import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

// Define types locally
export interface BlogPost {
  id: number;
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

// Define schema locally
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

// Extend the schema for form validation
const blogFormSchema = blogPostSchema
  .extend({
    tags: z.array(z.string()).optional(),
    tagInput: z.string().optional(),
  })
  .omit({ publishedAt: true, createdAt: true, updatedAt: true });

type BlogFormValues = z.infer<typeof blogFormSchema>;

export default function BlogEditor() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditMode = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      summary: "",
      authorName: "",
      published: false,
      tags: [],
      tagInput: ""
    }
  });

  // Fetch blog post if editing
  useEffect(() => {
    const fetchBlogPost = async () => {
      if (isEditMode && id) {
        try {
          setIsLoading(true);
          const data = await apiRequest("GET", `/api/blog/${id}`);
          setBlogPost(data);
          setTags(data.tags || []);
          form.reset({
            ...data,
            tagInput: "",
          });
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
  }, [isEditMode, id, toast]);

  // Handle tag input
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        const newTags = [...tags, tagInput.trim()];
        setTags(newTags);
        form.setValue('tags', newTags);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    form.setValue('tags', newTags);
  };

  const onSubmit = async (data: BlogFormValues) => {
    try {
      setIsLoading(true);
      const { tagInput, ...blogData } = data;
      const payload = {
        ...blogData,
        tags,
      };

      if (isEditMode) {
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
        title: isEditMode ? "Error updating blog post" : "Error creating blog post",
        description: error.message || "Something went wrong.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate slug from title
  const generateSlug = () => {
    const title = form.getValues('title');
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      form.setValue('slug', slug);
    }
  };

  // Loading state
  if (isEditMode && isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? "Edit Blog Post" : "Create New Blog Post"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="h-32 bg-gray-200 animate-pulse rounded-md"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" onClick={() => setLocation("/blog")}>
          <span className="material-icons mr-2">arrow_back</span>
          Back to Blog
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit Blog Post" : "Create New Blog Post"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter blog post title" 
                        {...field}
                        onBlur={() => {
                          field.onBlur();
                          if (!form.getValues('slug')) {
                            generateSlug();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>URL Slug</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="url-friendly-slug" {...field} />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={generateSlug}
                          className="shrink-0"
                          title="Generate from title"
                        >
                          <span className="material-icons">auto_fix_high</span>
                        </Button>
                      </div>
                      <FormDescription>The URL-friendly identifier for this post</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 space-y-0 mt-8">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Published</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="authorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Author's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief summary of the blog post" 
                        {...field} 
                        rows={2}
                      />
                    </FormControl>
                    <FormDescription>A short description that appears in blog listings</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your blog post content here..." 
                        {...field} 
                        rows={12}
                        className="font-sans"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tagInput"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Input 
                          placeholder="Add tags (press Enter after each tag)" 
                          value={tagInput}
                          onChange={(e) => {
                            setTagInput(e.target.value);
                            field.onChange(e);
                          }}
                          onKeyDown={handleTagInputKeyDown}
                        />
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag, index) => (
                            <div 
                              key={index} 
                              className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                            >
                              <span>{tag}</span>
                              <button 
                                type="button" 
                                onClick={() => removeTag(tag)}
                                className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                              >
                                <span className="material-icons text-sm">close</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>Press Enter after typing each tag</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setLocation("/blog")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <span className="material-icons animate-spin mr-2">autorenew</span>
                  )}
                  {isEditMode ? "Update Post" : "Create Post"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
