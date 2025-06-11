import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Archive, RotateCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { getJobApi, archiveJobApi, unarchiveJobApi } from "@/http/apiCalls";

interface JobDescription {
  _id: string;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  requirements: string[];
  posted_on: string;
  updated_on: string;
  archived: boolean;
  created_at: string;
  updated_at: string;
  __v: number;
}

export default function JobDescriptionDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchJobDescription = async () => {
    if (!id) {
      setError("Invalid job description ID");
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await getJobApi(id);
      setJobDescription(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch job description",
        variant: "destructive",
      });
      setError(error.message || "Failed to fetch job description");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDescription();
  }, [id]);

  const handleArchiveToggle = async () => {
    if (!id || !jobDescription) return;

    try {
      setIsArchiving(true);
      if (jobDescription.archived) {
        await unarchiveJobApi(id);
      } else {
        await archiveJobApi(id);
      }
      
      toast({
        title: "Success",
        description: jobDescription.archived 
          ? "Job restored successfully" 
          : "Job archived successfully",
      });
      // Refetch the job to update the UI
      await fetchJobDescription();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 
          (jobDescription.archived 
            ? "Failed to restore job" 
            : "Failed to archive job"),
        variant: "destructive",
      });
    } finally {
      setIsArchiving(false);
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <Button onClick={() => setLocation("/job-descriptions")} className="mt-4">
          Back to Job Descriptions
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!jobDescription) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Header title="Job Description">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/job-descriptions")}>
            <span className="material-icons mr-2">arrow_back</span>
            Back
          </Button>
          <Button
            variant={jobDescription?.archived ? "default" : "outline"}
            onClick={handleArchiveToggle}
            disabled={isArchiving}
          >
            {isArchiving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {jobDescription?.archived ? "Restoring..." : "Archiving..."}
              </>
            ) : (
              <>
                {jobDescription?.archived ? (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Restore
                  </>
                ) : (
                  <>
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </>
                )}
              </>
            )}
          </Button>
        </div>
      </Header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Details */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">{jobDescription.title}</CardTitle>
                <CardDescription className="mt-2">
                  <div className="text-lg font-medium text-gray-700">{jobDescription.company_name}</div>
                </CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2">
                {jobDescription.archived ? (
                  <Badge variant="outline">Archived</Badge>
                ) : (
                  <Badge variant="default">Active</Badge>
                )}
                <div className="text-sm text-gray-500">
                  Posted: {new Date(jobDescription.posted_on).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center text-gray-600">
                <span className="material-icons text-sm mr-1">location_on</span>
                {jobDescription.location}
              </div>
              <div className="flex items-center text-gray-600">
                <span className="material-icons text-sm mr-1">work</span>
                {jobDescription.job_type.charAt(0).toUpperCase() + jobDescription.job_type.slice(1)}
              </div>
              <div className="flex items-center text-gray-600">
                <span className="material-icons text-sm mr-1">update</span>
                Updated: {new Date(jobDescription.updated_on).toLocaleDateString()}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Requirements</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {jobDescription.requirements.map((requirement, index) => (
                  <li key={index} className="text-base">{requirement}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
