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
import { getJobApi, archiveJobApi, unarchiveJobApi, listCandidateResumesByJobId, refetchResumeListApi } from "@/http/apiCalls";
import ResultCard from "@/components/dashboard/ResultCard";
import { format, formatDistanceToNow } from 'date-fns';

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
  const params = useParams();
  const id = params.id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resumeList, setResumeList] = useState<any[]>([]);
  const [resumeListLoading, setResumeListLoading] = useState(false);
  const [resumeListLastUpdated, setResumeListLastUpdated] = useState(null);
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

  // once the data load, call their resume list with ranking,
  const fetchResumeListByJobId = async (jobId: string) => {
    try {
      setResumeListLoading(true);
      const { data } = await listCandidateResumesByJobId(jobId);
      if(data.resultFiles.length === 0) {
        toast({
          title: "No resumes found",
          description: "No resumes found for this job",
        });
        return;
      }
      setResumeList(data.resultFiles);
      setResumeListLastUpdated(data.updatedAt);
      setResumeListLoading(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch resume list",
        variant: "destructive",
      });
      setResumeListLoading(false);
    }
  };

  const refetchResumeList = async (jobId: string) => {
    try {
      setResumeListLoading(true);
       await refetchResumeListApi(jobId);
      fetchResumeListByJobId(jobId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to refetch resume list",
        variant: "destructive",
      });
    } finally {
      setResumeListLoading(false);
    }
  };

  useEffect(() => { 
    if (jobDescription) {
      fetchResumeListByJobId(jobDescription._id);
    }
  }, [jobDescription?._id]);

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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl font-bold">{jobDescription.title}</CardTitle>
                {jobDescription.archived ? (
                  <Badge variant="outline">Archived</Badge>
                ) : (
                  <Badge variant="default">Active</Badge>
                )}
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                {jobDescription.company_name}
              </CardDescription>
              <div className="text-xs text-gray-500 mt-1">Created At: {new Date(jobDescription.created_at).toLocaleDateString()}</div>
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

        {/* Resume List Section */}
        <div className="lg:col-span-3">
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl font-semibold">Matching Resumes</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{resumeList.length} resumes found</CardDescription>
              </div>
              <div
                onClick={() => !resumeListLoading && jobDescription._id && refetchResumeList(jobDescription._id)}
                title="Refetch Resumes"
                className={`flex items-center gap-2 cursor-pointer select-none transition hover:bg-primary/10 rounded p-2 ${resumeListLoading ? 'opacity-60 pointer-events-none' : ''}`}
              >
                {resumeListLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                  <RotateCcw className="h-5 w-5 text-primary" />
                )}
                <span className="text-sm text-primary font-medium">
                  Refetch Resumes
                  {resumeListLastUpdated ? ` (Last updated: ${format(new Date(resumeListLastUpdated), 'yyyy-MM-dd HH:mm')} · ${formatDistanceToNow(new Date(resumeListLastUpdated), { addSuffix: true })})` : ''}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {resumeListLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : resumeList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No matching resumes found for this job description.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resumeList.map((item, index) => (
                    <ResultCard key={item._id || index} item={item} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
