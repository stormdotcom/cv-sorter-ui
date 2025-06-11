import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarWithInitials } from "@/components/ui/avatar-with-initials";
import { SkillBadge } from "@/components/ui/skill-badge";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  Filter 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface Candidate {
  id: number;
  name: string;
  email: string;
  position?: string;
  experience?: string;
  skills?: string[];
}

interface CandidateListProps {
  title: string;
  searchQuery?: string;
  limit?: number;
  isPaginated?: boolean;
}

// Dummy data
const dummyCandidates: Candidate[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    position: "Senior Developer",
    experience: "8 years",
    skills: ["React", "TypeScript", "Node.js", "AWS", "Docker"]
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    position: "UX Designer",
    experience: "5 years",
    skills: ["Figma", "UI/UX", "Prototyping", "User Research"]
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    position: "Frontend Developer",
    experience: "4 years",
    skills: ["Vue.js", "JavaScript", "CSS", "HTML"]
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    position: "Product Manager",
    experience: "6 years",
    skills: ["Agile", "Product Strategy", "User Stories", "JIRA"]
  }
];

export function CandidateList({ 
  title, 
  searchQuery = "", 
  limit = 10, 
  isPaginated = false 
}: CandidateListProps) {
  const [, navigate] = useLocation();
  const [page, setPage] = useState(1);
  const [jobFilter, setJobFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name:asc");
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [page, sortBy, jobFilter]);

  const handleViewCandidate = (id: number) => {
    navigate(`/candidates/${id}`);
  };
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Filter and sort candidates
  const filteredCandidates = dummyCandidates
    .filter(candidate => {
      if (jobFilter === "all") return true;
      return candidate.position === jobFilter;
    })
    .filter(candidate => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        candidate.name.toLowerCase().includes(query) ||
        candidate.email.toLowerCase().includes(query) ||
        candidate.skills?.some(skill => skill.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      const [field, direction] = sortBy.split(':');
      const multiplier = direction === 'asc' ? 1 : -1;
      
      if (field === 'name') {
        return multiplier * a.name.localeCompare(b.name);
      }
      return 0;
    });

  // Paginate results
  const paginatedCandidates = isPaginated
    ? filteredCandidates.slice((page - 1) * limit, page * limit)
    : filteredCandidates;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <CardTitle>{title}</CardTitle>
          
          {!isLoading && (
            <div className="mt-3 md:mt-0 flex flex-wrap gap-2">
              <Select value={jobFilter} onValueChange={setJobFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Jobs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  <SelectItem value="Senior Developer">Senior Developer</SelectItem>
                  <SelectItem value="UX Designer">UX Designer</SelectItem>
                  <SelectItem value="Product Manager">Product Manager</SelectItem>
                  <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name:asc">Name: A to Z</SelectItem>
                  <SelectItem value="name:desc">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : paginatedCandidates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {paginatedCandidates.map((candidate) => (
                  <tr 
                    key={candidate.id} 
                    className="hover:bg-neutral-50 cursor-pointer"
                    onClick={() => handleViewCandidate(candidate.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <AvatarWithInitials name={candidate.name} />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-800">{candidate.name}</div>
                          <div className="text-sm text-neutral-500">{candidate.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.skills?.slice(0, 3).map((skill: string, i: number) => (
                          <SkillBadge key={`${candidate.id}-${i}`} skill={skill} />
                        ))}
                        {(candidate.skills?.length || 0) > 3 && (
                          <span className="px-2 py-1 bg-neutral-200 text-neutral-600 text-xs rounded-full">
                            +{candidate.skills!.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-800">{candidate.position}</div>
                      <div className="text-sm text-neutral-500">{candidate.experience}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCandidate(candidate.id);
                        }}
                      >
                        <Eye className="h-4 w-4 text-primary" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4 text-neutral-600" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium">No candidates found</h3>
            <p className="mt-2 text-neutral-500">
              {searchQuery 
                ? "Try adjusting your search criteria or upload new CVs." 
                : "Upload some CV files to get started."}
            </p>
          </div>
        )}
        
        {isPaginated && filteredCandidates.length > limit && (
          <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3 sm:px-6 mt-4">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={page * limit >= filteredCandidates.length}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-neutral-700">
                  Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(page * limit, filteredCandidates.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredCandidates.length}</span> results
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page * limit >= filteredCandidates.length}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
