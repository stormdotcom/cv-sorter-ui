import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/Header";
import { CandidateList } from "@/components/candidates/CandidateList";
import { listCandidatesApi } from "@/http/apiCalls";

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

export default function Candidates() {
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({ query: "", page: 1, limit: 10 });

  const fetchCandidates = async (filters: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await listCandidatesApi(filters);
      setCandidates(data);
    } catch (error: any) {
      setError(error.message || "Failed to fetch candidates");
      toast({
        title: "Error",
        description: error.message || "Failed to fetch candidates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchCandidates(filters);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header title="Candidates" />
      <main className="container mx-auto px-4 py-8">
        {error ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-red-600">{error}</h3>
            <p className="mt-2 text-gray-500">Please try again later</p>
          </div>
        ) : (
          <CandidateList 
            candidates={candidates} 
            isLoading={isLoading} 
          />
        )}
      </main>
    </div>
  );
}
