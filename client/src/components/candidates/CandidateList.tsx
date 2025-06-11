import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, Briefcase, Award, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

interface Candidate {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  resumeIds: string[];
  workExperience: any[];
  jobMatchAnalysis: {
    keyStrengths: string[];
    potentialGaps: string[];
  };
  created_at: string;
  updated_at: string;
  __v: number;
}

interface CandidateListProps {
  candidates: Candidate[];
  isLoading?: boolean;
}

export function CandidateList({ candidates = [], isLoading = false }: CandidateListProps) {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCandidates = (candidates || []).filter(candidate => {
    const searchLower = searchQuery.toLowerCase();
    return (
      candidate.name.toLowerCase().includes(searchLower) ||
      candidate.email.toLowerCase().includes(searchLower) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchLower))
    );
  });

  const handleViewCandidate = (id: string) => {
    setLocation(`/candidates/${id}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={`skeleton-${i}`} className="h-full">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 text-muted-foreground mb-4">
          <FileText className="w-full h-full" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No candidates found</h3>
        <p className="mt-2 text-sm text-gray-500">
          There are no candidates in the system yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by name, email, or skills..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900">No matches found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your search terms
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate._id} className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{candidate.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{candidate.email}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Skills</h4>
                  {candidate.skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No skills listed</p>
                  )}
                </div>

                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{candidate.resumeIds?.length || 0} {candidate.resumeIds?.length === 1 ? 'Resume' : 'Resumes'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{candidate.workExperience?.length || 0} {candidate.workExperience?.length === 1 ? 'Experience' : 'Experiences'}</span>
                  </div>
                </div>

                {candidate.jobMatchAnalysis?.keyStrengths?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Award className="h-4 w-4 text-green-600" />
                      Key Strengths
                    </h4>
                    <ul className="text-sm space-y-1">
                      {candidate.jobMatchAnalysis.keyStrengths.map((strength, index) => (
                        <li key={index} className="text-green-700">{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {candidate.jobMatchAnalysis?.potentialGaps?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      Potential Gaps
                    </h4>
                    <ul className="text-sm space-y-1">
                      {candidate.jobMatchAnalysis.potentialGaps.map((gap, index) => (
                        <li key={index} className="text-amber-700">{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleViewCandidate(candidate._id)}
                >
                  View Profile
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

