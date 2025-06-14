import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { listJobsApi } from "@/http/apiCalls";
import CreateJobModal from "@/components/jobs/CreateJobModal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface JobDescription {
  _id: string;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  requirements: string[];
  created_at: string;
}

export default function JobDescriptions() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showArchived, setShowArchived] = useState<"all" | "archived" | "active">("active");

  const fetchJobDescriptions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await listJobsApi({ status: showArchived });
      setJobDescriptions(data);
    } catch (error: any) {
      setError(error.message || "Failed to fetch job descriptions");
      toast({
        title: "Error",
        description: error.message || "Failed to fetch job descriptions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDescriptions();
  }, [showArchived]);

  const handleCreateJob = () => {
    setIsCreateModalOpen(true);
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    fetchJobDescriptions(); // Refetch the list when modal closes
  };

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
          {['skeleton-1', 'skeleton-2', 'skeleton-3'].map((id) => (
            <Card key={id} className="animate-pulse">
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
    <div className="min-h-screen bg-white">
      <Header title="Job Descriptions" />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Descriptions</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Job
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-4">
            <RadioGroup
              value={showArchived}
              onValueChange={(value) => setShowArchived(value as typeof showArchived)}
              className="flex items-center gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="archived" id="archived" />
                <Label htmlFor="archived">Archived</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All</Label>
              </div>
            </RadioGroup>
          </div>
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
              <Card key={job._id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation(`/job-descriptions/${job._id}`)}>
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

        <CreateJobModal
          isOpen={isCreateModalOpen}
          onClose={handleModalClose}
          onSuccess={() => {
            // Success is already handled in handleModalClose
          }}
        />
      </main>
    </div>
  );
}
