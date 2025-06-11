import { Candidate, Education, WorkExperience } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarWithInitials } from "@/components/ui/avatar-with-initials";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SkillBadge } from "@/components/ui/skill-badge";
import { Button } from "@/components/ui/button";
import { Check, Download, Mail, CheckCircle, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface CandidateDetailProps {
  candidate: Candidate;
}

export function CandidateDetail({ candidate }: CandidateDetailProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const getColorClassForScore = (score: number) => {
    if (score >= 85) return "bg-secondary";
    if (score >= 75) return "bg-success";
    if (score >= 65) return "bg-warning";
    return "bg-accent";
  };
  
  const getScoreText = (score: number) => {
    if (score >= 85) return "Very High";
    if (score >= 75) return "High";
    if (score >= 65) return "Medium";
    return "Low";
  };
  
  return (
    <div className="space-y-6">
      {/* Candidate Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <AvatarWithInitials 
                name={candidate.name} 
                className="h-16 w-16 text-xl" 
              />
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-neutral-800">{candidate.name}</h2>
                <p className="text-neutral-600">{candidate.position}</p>
                <div className="flex items-center mt-1">
                  <Mail className="h-4 w-4 text-neutral-500 mr-1" />
                  <a href={`mailto:${candidate.email}`} className="text-sm text-primary hover:underline">
                    {candidate.email}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="md:ml-auto flex items-center">
              <div className="bg-neutral-100 px-3 py-1 rounded-full flex items-center">
                <span className="font-medium text-secondary">{candidate.matchScore}% Match</span>
                <div className="ml-2 w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
              
              <Button className="ml-4" onClick={() => alert("Resume download not implemented in MVP")}>
                <Download className="h-4 w-4 mr-2" />
                Download CV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Content in Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Skills Section */}
            <div className="md:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Key Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {candidate.skills?.slice(0, 5).map((skill, index) => {
                      // Generate a score that's higher for first skills and lower for later ones
                      const score = Math.max(50, 95 - index * 10);
                      const level = score >= 90 ? "Expert" : score >= 80 ? "Advanced" : score >= 70 ? "Intermediate" : "Basic";
                      
                      return (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-neutral-700">{skill}</span>
                            <span className="text-sm text-neutral-600">{level}</span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2" 
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {candidate.skills && candidate.skills.length > 5 && (
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <h6 className="text-sm font-medium text-neutral-700 mb-2">Additional Skills</h6>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.slice(5).map((skill, i) => (
                          <SkillBadge key={i} skill={skill} />
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Experience Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {candidate.workHistory && candidate.workHistory.length > 0 ? (
                      candidate.workHistory.map((work, index) => (
                        <div key={index} className="flex">
                          <div className="flex-shrink-0 h-10 w-10 bg-neutral-100 rounded-md flex items-center justify-center">
                            <span className="material-icons text-neutral-600">business</span>
                          </div>
                          <div className="ml-4">
                            <h6 className="text-md font-medium text-neutral-800">{work.title}</h6>
                            <p className="text-sm text-neutral-600">{work.company}</p>
                            <p className="text-sm text-neutral-500">{work.period}</p>
                            <p className="mt-2 text-sm text-neutral-700">{work.description}</p>
                            {work.skills && work.skills.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {work.skills.map((skill, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-primary-light bg-opacity-10 text-primary-dark text-xs rounded-full">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-neutral-500 italic">No work experience information available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar Information */}
            <div>
              {/* Match Analysis */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Job Match Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-700">Skills Match</span>
                        <span className="text-sm text-secondary font-medium">
                          {Math.min(95, candidate.matchScore ? candidate.matchScore + 5 : 70)}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className="bg-secondary rounded-full h-2" 
                          style={{ width: `${Math.min(95, candidate.matchScore ? candidate.matchScore + 5 : 70)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-700">Experience</span>
                        <span className="text-sm text-secondary font-medium">
                          {Math.min(90, candidate.matchScore ? candidate.matchScore : 65)}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className="bg-secondary rounded-full h-2" 
                          style={{ width: `${Math.min(90, candidate.matchScore ? candidate.matchScore : 65)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-700">Education</span>
                        <span className="text-sm text-warning font-medium">
                          {Math.min(75, candidate.matchScore ? candidate.matchScore - 15 : 60)}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className="bg-warning rounded-full h-2" 
                          style={{ width: `${Math.min(75, candidate.matchScore ? candidate.matchScore - 15 : 60)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-700">Overall</span>
                        <span className="text-sm text-secondary font-medium">
                          {candidate.matchScore || 70}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className={`${getColorClassForScore(candidate.matchScore || 0)} rounded-full h-2`}
                          style={{ width: `${candidate.matchScore || 70}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h6 className="text-sm font-medium text-neutral-700 mb-2">Key Strengths</h6>
                    <ul className="space-y-2">
                      {candidate.skills?.slice(0, 3).map((skill, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="text-secondary h-4 w-4 mr-2 mt-0.5" />
                          <span className="text-sm text-neutral-700">{skill} experience</span>
                        </li>
                      ))}
                      {candidate.workHistory && candidate.workHistory.length > 0 && (
                        <li className="flex items-start">
                          <CheckCircle className="text-secondary h-4 w-4 mr-2 mt-0.5" />
                          <span className="text-sm text-neutral-700">
                            {candidate.workHistory.length > 2 ? "Extensive work history" : "Relevant work experience"}
                          </span>
                        </li>
                      )}
                    </ul>
                    
                    <h6 className="text-sm font-medium text-neutral-700 mt-4 mb-2">Potential Gaps</h6>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Info className="text-error h-4 w-4 mr-2 mt-0.5" />
                        <span className="text-sm text-neutral-700">
                          {candidate.matchScore && candidate.matchScore < 75 
                            ? "Skills gap for this position" 
                            : "Limited experience with specific technologies"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              {/* Education Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  {candidate.education && candidate.education.length > 0 ? (
                    <div className="space-y-5">
                      {candidate.education.map((edu, index) => (
                        <div key={index} className="flex">
                          <div className="flex-shrink-0 h-10 w-10 bg-neutral-100 rounded-md flex items-center justify-center">
                            <span className="material-icons text-neutral-600">school</span>
                          </div>
                          <div className="ml-4">
                            <h6 className="text-md font-medium text-neutral-800">{edu.degree}</h6>
                            <p className="text-sm text-neutral-600">{edu.institution}</p>
                            <p className="text-sm text-neutral-500">{edu.period}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-500 italic">No education information available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skills Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Technical Skills</h3>
                  <div className="space-y-4">
                    {candidate.skills?.filter((s, i) => i % 2 === 0).map((skill, index) => {
                      const score = Math.max(50, 95 - index * 5);
                      return (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-neutral-700">{skill}</span>
                            <span className="text-sm text-neutral-600">{score}%</span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2">
                            <div className="bg-primary rounded-full h-2" style={{ width: `${score}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Soft Skills</h3>
                  <div className="space-y-4">
                    {candidate.skills?.filter((s, i) => i % 2 === 1).map((skill, index) => {
                      const score = Math.max(50, 90 - index * 5);
                      return (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-neutral-700">{skill}</span>
                            <span className="text-sm text-neutral-600">{score}%</span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2">
                            <div className="bg-secondary rounded-full h-2" style={{ width: `${score}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
            </CardHeader>
            <CardContent>
              {candidate.workHistory && candidate.workHistory.length > 0 ? (
                <div className="space-y-8">
                  {candidate.workHistory.map((work, index) => (
                    <div key={index}>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 bg-neutral-100 rounded-md flex items-center justify-center">
                          <span className="material-icons text-neutral-600">business</span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-neutral-800">{work.title}</h3>
                          <p className="text-md text-neutral-600">{work.company}</p>
                          <p className="text-sm text-neutral-500">{work.period}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pl-16">
                        <p className="text-neutral-700">{work.description}</p>
                        
                        {work.skills && work.skills.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Technologies used:</h4>
                            <div className="flex flex-wrap gap-2">
                              {work.skills.map((skill, i) => (
                                <SkillBadge key={i} skill={skill} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-500">No work experience information available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle>Education History</CardTitle>
            </CardHeader>
            <CardContent>
              {candidate.education && candidate.education.length > 0 ? (
                <div className="space-y-8">
                  {candidate.education.map((edu, index) => (
                    <div key={index}>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 bg-neutral-100 rounded-md flex items-center justify-center">
                          <span className="material-icons text-neutral-600">school</span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-neutral-800">{edu.degree}</h3>
                          <p className="text-md text-neutral-600">{edu.institution}</p>
                          <p className="text-sm text-neutral-500">{edu.period}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-500">No education information available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes & Observations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <textarea 
                  className="w-full p-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                  rows={5}
                  placeholder="Add notes about this candidate..."
                ></textarea>
              </div>
              <div className="flex justify-end">
                <Button>Save Notes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
