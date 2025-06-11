import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { SkillBadge } from "@/components/ui/skill-badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Separator } from "@/components/ui/separator";
import { AvatarWithInitials } from "@/components/ui/avatar-with-initials";
import { Skeleton } from "@/components/ui/skeleton";

interface JobDescription {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  requiredSkills: string[];
  preferredSkills: string[];
  educationRequirements: string[];
  experienceLevel: string;
  employmentType: string;
  salaryRange: string;
  benefits: string[];
  createdAt: string;
  updatedAt: string;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experience: string;
  education: string;
  resumeUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AssessmentResult {
  id: string;
  candidateId: string;
  jobDescriptionId: string;
  overallScore: number;
  skillMatches: {
    skill: string;
    score: number;
    explanation: string;
  }[];
  experienceMatch: {
    score: number;
    explanation: string;
  };
  educationMatch: {
    score: number;
    explanation: string;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface CandidateAssessment {
  candidate: Candidate;
  assessment: AssessmentResult;
}

interface SkillMatch {
  skill: string;
  match: number;
}

interface EnrichedAssessment {
  id: number;
  jobDescriptionId: number;
  candidateId: number;
  candidateName: string;
  candidatePosition: string;
  overallScore: number;
  skillMatches: SkillMatch[];
  experienceMatch: number;
  educationMatch: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

// Dummy data
const dummyJobDescription: JobDescription = {
  id: 1,
  title: "Senior Software Engineer",
  company: "Tech Corp",
  location: "San Francisco, CA",
  description: "We are looking for a Senior Software Engineer to join our team...",
  requirements: "• 5+ years of experience in software development\n• Strong knowledge of React and Node.js\n• Experience with cloud platforms",
  requiredSkills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
  preferredSkills: ["AWS", "Docker", "Kubernetes"],
  educationRequirements: ["Bachelor's in Computer Science or related field"],
  experienceLevel: "Senior",
  employmentType: "Full-time",
  salaryRange: "$120,000 - $180,000",
  benefits: ["Health insurance", "401(k)", "Remote work options"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const dummyAssessments: EnrichedAssessment[] = [
  {
    id: 1,
    jobDescriptionId: 1,
    candidateId: 1,
    candidateName: "John Doe",
    candidatePosition: "Software Engineer",
    overallScore: 85,
    skillMatches: [
      { skill: "React", match: 0.9 },
      { skill: "Node.js", match: 0.8 },
      { skill: "TypeScript", match: 0.85 }
    ],
    experienceMatch: 0.8,
    educationMatch: 0.9,
    strengths: ["Strong React experience", "Good communication skills"],
    weaknesses: ["Limited cloud experience"],
    recommendations: ["Consider for senior role", "Good team fit"]
  }
];

export default function JobDescriptionDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAssessments, setIsGeneratingAssessments] = useState(false);
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(dummyJobDescription);
  const [assessments, setAssessments] = useState<EnrichedAssessment[]>(dummyAssessments);
  const [error, setError] = useState<string | null>(null);

  // Parse the id parameter safely
  const jobId = id ? parseInt(id, 10) : 1;
  const isValidId = !isNaN(jobId);

  // Fetch job description
  useEffect(() => {
    const fetchJobDescription = async () => {
      if (!isValidId) {
        setError("Invalid job description ID");
        return;
      }

      try {
        setIsLoading(true);
        const data = await apiRequest("GET", `/api/job-descriptions/${jobId}`);
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

    fetchJobDescription();
  }, [jobId, toast]);

  // Fetch assessments for this job
  useEffect(() => {
    const fetchAssessments = async () => {
      if (!isValidId) {
        setError("Invalid job description ID");
        return;
      }

      try {
        const data = await apiRequest("GET", `/api/job-descriptions/${jobId}/assessments`);
        setAssessments(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch assessments",
          variant: "destructive",
        });
        setError(error.message || "Failed to fetch assessments");
      }
    };

    fetchAssessments();
  }, [jobId, toast]);

  const handleGenerateAssessments = async () => {
    if (!isValidId) {
      toast({
        title: "Error",
        description: "Invalid job description ID",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGeneratingAssessments(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add a new dummy assessment
      setAssessments([
        ...assessments,
        {
          id: assessments.length + 1,
          jobDescriptionId: jobId,
          candidateId: assessments.length + 1,
          candidateName: `Candidate ${assessments.length + 1}`,
          candidatePosition: "Software Engineer",
          overallScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
          skillMatches: [
            { skill: "React", match: Math.random() * 0.3 + 0.7 },
            { skill: "Node.js", match: Math.random() * 0.3 + 0.7 },
            { skill: "TypeScript", match: Math.random() * 0.3 + 0.7 }
          ],
          experienceMatch: Math.random() * 0.3 + 0.7,
          educationMatch: Math.random() * 0.3 + 0.7,
          strengths: ["Strong technical skills", "Good team player"],
          weaknesses: ["Could improve documentation"],
          recommendations: ["Good potential", "Consider for role"]
        }
      ]);
      
      toast({
        title: "Success",
        description: "Candidate assessments generated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate assessments",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAssessments(false);
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

  const hasAssessments = assessments && assessments.length > 0;
  const sortedAssessments = hasAssessments 
    ? [...assessments].sort((a, b) => {
        const scoreA = a.overallScore || 0;
        const scoreB = b.overallScore || 0;
        return scoreB - scoreA;
      })
    : [];
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Header title="Job Description">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/job-descriptions")}>
            <span className="material-icons mr-2">arrow_back</span>
            Back
          </Button>
          <Button onClick={() => setLocation("/candidates")}>
            <span className="material-icons mr-2">people</span>
            Match Candidates
          </Button>
        </div>
      </Header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Details */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl font-bold">{jobDescription.title}</CardTitle>
              {jobDescription.active ? (
                <Badge className="ml-2" variant="default">Active</Badge>
              ) : (
                <Badge className="ml-2" variant="outline">Inactive</Badge>
              )}
            </div>
            <CardDescription>
              <div className="text-sm flex flex-wrap gap-2 mt-1">
                {jobDescription.department && (
                  <span className="flex items-center">
                    <span className="material-icons text-sm mr-1">business</span>
                    {jobDescription.department}
                  </span>
                )}
                {jobDescription.location && (
                  <span className="flex items-center">
                    <span className="material-icons text-sm mr-1">location_on</span>
                    {jobDescription.location}
                  </span>
                )}
                {jobDescription.employmentType && (
                  <span className="flex items-center">
                    <span className="material-icons text-sm mr-1">work</span>
                    {jobDescription.employmentType}
                  </span>
                )}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-sm text-neutral-700 whitespace-pre-line">
                {jobDescription.description}
              </p>
            </div>

            {((jobDescription.minimumExperience != null && jobDescription.minimumExperience > 0) || 
              (jobDescription.preferredExperience != null && jobDescription.preferredExperience > 0)) && (
              <div>
                <h3 className="text-lg font-medium mb-2">Experience Requirements</h3>
                <div className="text-sm text-neutral-700">
                  {jobDescription.minimumExperience != null && jobDescription.minimumExperience > 0 && (
                    <p>Minimum: {jobDescription.minimumExperience} years</p>
                  )}
                  {jobDescription.preferredExperience != null && jobDescription.preferredExperience > 0 && (
                    <p>Preferred: {jobDescription.preferredExperience} years</p>
                  )}
                </div>
              </div>
            )}

            {jobDescription.requiredSkills && jobDescription.requiredSkills.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {jobDescription.requiredSkills.map((skill, index) => (
                    <SkillBadge key={index} skill={skill} />
                  ))}
                </div>
              </div>
            )}

            {jobDescription.preferredSkills && jobDescription.preferredSkills.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Preferred Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {jobDescription.preferredSkills.map((skill, index) => (
                    <SkillBadge key={index} skill={skill} className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800" />
                  ))}
                </div>
              </div>
            )}

            {jobDescription.educationRequirements && jobDescription.educationRequirements.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Education Requirements</h3>
                <ul className="list-disc list-inside text-sm text-neutral-700">
                  {jobDescription.educationRequirements.map((edu, index) => (
                    <li key={index}>{edu}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Candidate Assessments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Candidate Assessments</CardTitle>
              <Button 
                onClick={handleGenerateAssessments}
                disabled={isGeneratingAssessments} 
                size="sm"
              >
                <span className="material-icons mr-2">refresh</span>
                {isGeneratingAssessments ? "Processing..." : hasAssessments
                  ? "Regenerate Assessments"
                  : "Generate Assessments"}
              </Button>
            </div>
            <CardDescription>
              {hasAssessments 
                ? `${assessments.length} candidates assessed for this position`
                : "No candidate assessments yet. Click the button above to generate assessments."}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Top Matches */}
                <h3 className="text-lg font-medium">Top Matches</h3>
                {sortedAssessments.slice(0, 5).map((result, index) => (
                  <div key={result.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <Badge className="rounded-full w-8 h-8 flex items-center justify-center text-base font-bold">
                          {index + 1}
                        </Badge>
                      </div>
                      <div className="flex-grow overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                          <div className="flex items-center gap-2">
                            <AvatarWithInitials name={result.candidateName || `Candidate ${result.candidateId}`} />
                            <div>
                              <h4 className="font-medium truncate">{result.candidateName || `Candidate ${result.candidateId}`}</h4>
                              <p className="text-sm text-neutral-500 truncate">{result.candidatePosition || "No position specified"}</p>
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0 flex items-center gap-1">
                            <Badge variant={(result.overallScore || 0) >= 80 ? "default" : 
                                          (result.overallScore || 0) >= 60 ? "outline" : "secondary"}>
                              {result.overallScore || 0}% Match
                            </Badge>
                            <Link href={`/candidates/${result.candidateId}`}>
                              <Button variant="ghost" size="icon">
                                <span className="material-icons text-sm">visibility</span>
                              </Button>
                            </Link>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                          <div>
                            <p className="text-xs text-neutral-500">Skills Match</p>
                            <ProgressBar 
                              value={result.skillsMatchScore} 
                              colorClass={(result.skillsMatchScore || 0) >= 80 ? "bg-green-500" : 
                                          (result.skillsMatchScore || 0) >= 60 ? "bg-amber-500" : "bg-red-500"}
                              showLabel
                            />
                          </div>
                          <div>
                            <p className="text-xs text-neutral-500">Experience Match</p>
                            <ProgressBar 
                              value={result.experienceMatchScore} 
                              colorClass={(result.experienceMatchScore || 0) >= 80 ? "bg-green-500" : 
                                         (result.experienceMatchScore || 0) >= 60 ? "bg-amber-500" : "bg-red-500"}
                              showLabel
                            />
                          </div>
                          <div>
                            <p className="text-xs text-neutral-500">Education Match</p>
                            <ProgressBar 
                              value={result.educationMatchScore} 
                              colorClass={(result.educationMatchScore || 0) >= 80 ? "bg-green-500" : 
                                         (result.educationMatchScore || 0) >= 60 ? "bg-amber-500" : "bg-red-500"}
                              showLabel
                            />
                          </div>
                        </div>
                        
                        <Tabs defaultValue="strengths">
                          <TabsList className="mb-2">
                            <TabsTrigger value="strengths">Key Strengths</TabsTrigger>
                            <TabsTrigger value="insights">AI Insights</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="strengths" className="text-sm">
                            {result.keyStrengths && result.keyStrengths.length > 0 ? (
                              <ul className="list-disc list-inside pl-1 space-y-1">
                                {result.keyStrengths.map((strength, idx) => (
                                  <li key={idx}>{strength}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-neutral-500 italic">No key strengths identified</p>
                            )}
                          </TabsContent>
                          
                          <TabsContent value="insights" className="text-sm">
                            {result.insights ? (
                              <p className="whitespace-pre-line">{result.insights}</p>
                            ) : (
                              <p className="text-neutral-500 italic">No insights available</p>
                            )}
                          </TabsContent>
                        </Tabs>
                      </div>
                    </div>
                  </div>
                ))}
                
                {sortedAssessments.length > 5 && (
                  <Button variant="outline" className="w-full" onClick={() => setLocation("/candidates")}>
                    View All {sortedAssessments.length} Candidates
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
