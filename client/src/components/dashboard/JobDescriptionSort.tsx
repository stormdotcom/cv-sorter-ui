import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface JobDescriptionSortProps {
  onSubmit?: (jobDescription: string) => void;
  onSortChange?: (sortBy: string) => void;
}


const JobDescriptionSort: React.FC<JobDescriptionSortProps> = ({ onSubmit, onSortChange }) => {
  const [jobDescription, setJobDescription] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (onSubmit) await onSubmit(jobDescription);
    setLoading(false);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    if (onSortChange) onSortChange(e.target.value);
  };

  return (
    <div className="w-full bg-card rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h2 className="text-lg font-semibold mb-2 md:mb-0">Job Description</h2>
        
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="job-description" className="block text-sm font-medium mb-1">
          Job Description
        </label>
        <textarea
          id="job-description"
          className="w-full min-h-[80px] rounded border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-white"
          placeholder="Paste or type the job description here..."
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
        />
        <Button type="submit" className="mt-3 w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit & Sort"}
        </Button>
      </form>
    </div>
  );
};

export default JobDescriptionSort; 
