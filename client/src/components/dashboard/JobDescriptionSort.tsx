import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { searchResumes } from "@/http/apiCalls";
import ResultModal from "./ResultModal";

const JobDescriptionSort: React.FC = () => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [result, setResult] = useState<any[]>([]);
  const [resultLoading, setResultLoading] = useState(false);
  const submitJobDescription = async (jobDescription: string) => {
    try {
      setResultLoading(true);
      const response = await searchResumes({ jobDescription : description });
      console.log(response);
      setResultLoading(false);
      return response;
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsResultModalOpen(true);
    const response: any = await submitJobDescription(
      (e.target as HTMLTextAreaElement).value
    );
    setResult(response.data);
    setIsResultModalOpen(true);
    setLoading(false);
  };

  return (
    <div className="w-full bg-card rounded-lg shadow p-6 mt-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h2 className="text-lg font-semibold mb-2 md:mb-0">Quick Search</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="job-description"
          className="block text-sm font-medium mb-1"
        >
          Job Description
        </label>
        <textarea
          id="job-description"
          className="w-full min-h-[130px] rounded border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-white"
          placeholder="Paste or type the job description here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit" className="mt-3 w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit & Sort"}
        </Button>
      </form>
      {/* render the result modal */}
      <ResultModal
        result={result}
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        loading={resultLoading}
      />
    </div>
  );
};

export default JobDescriptionSort;
