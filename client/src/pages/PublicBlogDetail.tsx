import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

// Dummy data for blog post
const dummyPost = {
  id: "1",
  title: "The Future of AI in Recruitment",
  content: `Artificial Intelligence is revolutionizing the recruitment industry in unprecedented ways. From automated resume screening to predictive analytics, AI is transforming how companies find and hire talent.

The integration of AI in recruitment processes has led to significant improvements in efficiency and accuracy. Companies can now process thousands of applications in minutes, identify the best candidates based on objective criteria, and reduce unconscious bias in the hiring process.

However, it's important to note that AI should complement, not replace, human judgment in recruitment. The most successful implementations of AI in recruitment combine the efficiency of machines with the nuanced understanding of human recruiters.

As we move forward, we can expect to see even more sophisticated AI applications in recruitment, from advanced candidate matching to predictive performance analytics. The key will be to use these tools responsibly and ethically.`,
  authorName: "Jane Smith",
  publishedAt: "2024-03-15T10:00:00Z",
  createdAt: "2024-03-15T10:00:00Z",
  tags: ["AI", "Recruitment", "Technology", "Future of Work"],
  summary: "Exploring how artificial intelligence is transforming the recruitment landscape and what it means for the future of hiring."
};

export default function PublicBlogDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [post, setPost] = useState(dummyPost);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    // Simulate API call with dummy data
    const fetchPost = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPost(dummyPost);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch blog post'));
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // For navigating back to public blog list
  const goToBlogList = () => setLocation("/public-blog");
  
  // For navigating back to home
  const goToHome = () => setLocation("/");

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <Skeleton className="h-10 w-10 rounded-full mr-2" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-12 w-3/4 mb-4" />
        <div className="flex gap-2 mb-6">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-8" />
        <Skeleton className="h-64 w-full mb-8" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <span className="material-icons text-red-500 text-6xl mb-4">error</span>
        <h1 className="text-2xl font-bold mb-4">Failed to load blog post</h1>
        <p className="text-gray-600 mb-8">The post may have been removed or is unavailable.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={goToBlogList}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
          <Button variant="outline" onClick={goToHome}>
            Back to Homepage
          </Button>
        </div>
      </div>
    );
  }

  // Function to format the publish date
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Split content into paragraphs
  const paragraphs = post.content.split('\n').filter((p: string) => p.trim() !== '');

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="material-icons text-primary text-3xl mr-2">smart_toy</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              SmartHire
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="ghost" onClick={goToBlogList} className="text-xs sm:text-sm">
              <span className="material-icons mr-1 sm:mr-2 text-lg sm:text-xl">arrow_back</span>
              <span className="hidden xs:inline">Back to Blog</span>
              <span className="xs:hidden">Back</span>
            </Button>
            <Button variant="ghost" onClick={() => setLocation(`/public-blog/editor/${id}`)} className="text-xs sm:text-sm">
              <span className="material-icons mr-1 sm:mr-2 text-lg sm:text-xl">edit</span>
              <span className="hidden xs:inline">Edit Post</span>
              <span className="xs:hidden">Edit</span>
            </Button>
            <Button variant="ghost" onClick={goToHome} className="text-xs sm:text-sm">
              <span className="material-icons mr-1 sm:mr-2 text-lg sm:text-xl">home</span>
              <span className="hidden xs:inline">Home</span>
              <span className="xs:hidden">Home</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Blog Post Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Image or Placeholder */}
          <div className="h-64 bg-gradient-to-r from-primary/20 to-blue-100 flex items-center justify-center">
            <span className="material-icons text-primary text-7xl">article</span>
          </div>
          
          {/* Content Area */}
          <div className="p-8">
            {/* Post Meta */}
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3">
                <span className="material-icons">person</span>
              </div>
              <div>
                <p className="font-medium">{post.authorName || "Anonymous"}</p>
                <p className="text-sm text-gray-500">{formatDate(post.publishedAt || post.createdAt)}</p>
              </div>
            </div>
            
            {/* Post Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
            
            {/* Summary */}
            {post.summary && (
              <div className="bg-gray-50 p-4 rounded-lg mb-8 border-l-4 border-primary italic text-gray-700">
                {post.summary}
              </div>
            )}
            
            {/* Content */}
            <div className="prose prose-blue max-w-none">
              {paragraphs.map((paragraph: string, idx: number) => (
                <p key={idx} className="mb-6">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="mt-12 flex flex-col sm:flex-row justify-between gap-4">
          <Button variant="outline" onClick={goToBlogList}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
          <Button onClick={goToHome}>
            Back to Homepage
            <span className="material-icons ml-2">home</span>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <span className="material-icons text-primary text-3xl mr-2">smart_toy</span>
              <h2 className="text-xl font-bold text-white bg-gradient-to-r from-primary to-blue-400 bg-clip-text">SmartHire</h2>
            </div>
            <div className="flex space-x-8">
              <a href="/" className="hover:text-white">Home</a>
              <a href="/#features" className="hover:text-white">Features</a>
              <a href="/#benefits" className="hover:text-white">Benefits</a>
              <a href="/public-blog" className="hover:text-white">Blog</a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 SmartHire. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-transform duration-300 hover:scale-125">
                <span className="material-icons text-xl">facebook</span>
              </a>
              <a href="#" className="hover:text-primary transition-transform duration-300 hover:scale-125">
                <span className="material-icons text-xl">twitter</span>
              </a>
              <a href="#" className="hover:text-primary transition-transform duration-300 hover:scale-125">
                <span className="material-icons text-xl">linkedin</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
