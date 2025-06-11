import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { CandidateList } from "@/components/candidates/CandidateList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function Candidates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery);
  };
  
  return (
    <>
      <Header title="Candidates">
        <form onSubmit={handleSearch} className="flex gap-2 mt-3 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search candidates..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" variant="default" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </Header>
      
      <div className="p-4 md:p-6">
        <CandidateList 
          title="All Candidates" 
          searchQuery={submittedQuery} 
          isPaginated 
        />
      </div>
    </>
  );
}
