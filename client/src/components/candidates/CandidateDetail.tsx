import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Briefcase, Award, AlertTriangle, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Candidate {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  resumeIds: string[];
  workExperience: Array<{
    title?: string;
    company?: string;
    duration?: string;
  }>;
  jobMatchAnalysis: {
    keyStrengths: string[];
    potentialGaps: string[];
  };
  created_at: string;
  updated_at: string;
  __v: number;
}

interface CandidateDetailProps {
  candidate: any;
}

export function CandidateDetail({ candidate }: CandidateDetailProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{candidate.name}</CardTitle>
          <div className="flex flex-col gap-1 text-muted-foreground">
            <p className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {candidate.email}
            </p>
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Joined {formatDate(candidate.created_at)}
            </p>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Skills & Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Skills</h3>
              {candidate.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {candidate?.skills.map((skill: any) => (
                    <Badge key={skill} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No skills listed</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Work Experience</h3>
              {candidate.workExperience?.length > 0 ? (
                <div className="space-y-4">
                  {candidate.workExperience.map((exp: any, index: number) => (
                    <div key={index} className="border-l-2 border-muted pl-4">
                      <h4 className="font-medium">{exp.role || 'Unspecified Position'}</h4>
                      <p className="text-sm text-muted-foreground">{exp.company || 'Company not specified'}</p>
                      {exp.duration && (
                        <p className="text-sm text-muted-foreground">{exp.duration}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No work experience listed</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Resumes</h3>
              {candidate.resumeIds?.length > 0 ? (
                <div className="space-y-2">
                  {candidate.resumeIds.map((resumeId: any) => (
                    <div key={resumeId} className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>Resume ID: {resumeId}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No resumes uploaded</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Award className="h-5 w-5" />
              Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {candidate?.keyStrengths?.length > 0 ? (
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4 text-green-600" />
                  Key Strengths
                </h3>
                <ul className="space-y-2">
                  {candidate.keyStrengths.map((strength: any, index: number) => (
                    <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                      <span className="mt-1">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  Key Strengths
                </h3>
                <p className="text-sm text-muted-foreground">No key strengths identified yet</p>
              </div>
            )}

            {candidate?.potentialGaps?.length > 0 ? (
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Potential Gaps
                </h3>
                <ul className="space-y-2">
                  {candidate.potentialGaps.map((gap: any, index: number  ) => (
                    <li key={index} className="text-sm text-amber-700 flex items-start gap-2">
                      <span className="mt-1">•</span>
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  Potential Gaps
                </h3>
                <p className="text-sm text-muted-foreground">No potential gaps identified yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
