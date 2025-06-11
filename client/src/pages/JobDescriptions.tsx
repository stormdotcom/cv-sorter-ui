import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { listJobsApi } from "@/http/apiCalls";

interface JobDescription {
  id: string;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  requirements: string[];
  created_at: string;
}

// Dummy data for job descriptions
const dummyJobDescriptions: JobDescription[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company_name: "TechCorp Inc.",
    location: "San Francisco, CA",
    job_type: "Full-time",
    requirements: [
      "5+ years of experience in software development",
      "Strong knowledge of React and Node.js",
      "Experience with cloud platforms (AWS/GCP)",
      "Excellent problem-solving skills"
    ],
    created_at: "2024-03-15T10:00:00Z"
  },
  {
    id: "2",
    title: "UX/UI Designer",
    company_name: "DesignHub",
    location: "Remote",
    job_type: "Contract",
    requirements: [
      "3+ years of UX/UI design experience",
      "Proficiency in Figma and Adobe Creative Suite",
      "Strong portfolio demonstrating user-centered design",
      "Experience with design systems"
    ],
    created_at: "2024-03-14T15:30:00Z"
  },
  {
    id: "3",
    title: "Product Manager",
    company_name: "InnovateTech",
    location: "New York, NY",
    job_type: "Full-time",
    requirements: [
      "4+ years of product management experience",
      "Strong analytical and strategic thinking",
      "Experience with Agile methodologies",
      "Excellent communication skills"
    ],
    created_at: "2024-03-13T09:15:00Z"
  }
];

export default function JobDescriptions() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCreateJob = () => {
    setLocation("/job-descriptions/new");
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await listJobsApi();
        setJobDescriptions(response.data || []);
      } catch (err) {
        setError("Failed to load job descriptions");
        toast({
          title: "Error",
          description: "Failed to load job descriptions",
          variant: "destructive",
        });
        setJobDescriptions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, [toast]);

  const filteredJobs = (jobDescriptions || []).filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.job_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Job Descriptions</h1>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Create Job Description
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Job Descriptions</h1>
          <Button onClick={handleCreateJob}>
            <Plus className="mr-2 h-4 w-4" />
            Create Job Description
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              <p className="mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Descriptions</h1>
        <Button onClick={handleCreateJob}>
          <Plus className="mr-2 h-4 w-4" />
          Create Job Description
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              {searchQuery ? "No jobs found matching your search" : "No job descriptions yet"}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation(`/job-descriptions/${job.id}`)}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-2">{job.company_name}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.job_type}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
