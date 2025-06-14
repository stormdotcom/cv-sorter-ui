import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Header } from "@/components/layout/Header";
import { CandidateDetail as CandidateDetailComponent } from "@/components/candidates/CandidateDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Candidate } from "@shared/schema";
import { getCandidateApi } from "@/http/apiCalls";

// Dummy candidate data

export default function CandidateDetail() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const candidateId = params.id;
  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        // Simulate network delay
        const { data } = await getCandidateApi(candidateId);
        setCandidate(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch candidate:', err);
        setIsLoading(false);
      }
    };

    if (candidateId) {
      fetchCandidate();
    }
  }, [candidateId]);
  
  const handleBack = () => {
    setLocation("/candidates");
  };
  
  return (
    <>
      <Header title="Candidate Profile">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
      </Header>
      
      <div className="p-4 md:p-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : candidate ? (
          <CandidateDetailComponent candidate={candidate as unknown as Candidate} />
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Candidate not found</h3>
            <p className="mt-2 text-sm text-gray-500">
              The candidate you are looking for does not exist or has been removed.
            </p>
            <Button className="mt-4" onClick={handleBack}>
              Go back to candidates
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
