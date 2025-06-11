import { Stats } from "@shared/schema";
import { Header } from "@/components/layout/Header";
import StatCard from "@/components/dashboard/StatCard";
import FileUploadArea from "@/components/dashboard/FileUploadArea";
import { CandidateList } from "@/components/candidates/CandidateList";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

// Dummy data for dashboard stats
const mockStats: Stats = {
  totalCandidates: 156,
  processedToday: 23,
  pendingProcess: 8,
  topMatchScore: 92,
  // Add any other stats fields that might be needed
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>(mockStats);
  const [isLoading, setIsLoading] = useState(false); // Set to false since we're using mock data

  // Simulate loading state if needed
  useEffect(() => {
    const simulateLoading = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setStats(mockStats);
      setIsLoading(false);
    };

    simulateLoading();
  }, []);

  return (
    <>
      <Header title="Dashboard" />
      
      <div className="p-4 md:p-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {isLoading ? (
            <>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </>
          ) : (
            <>
              <StatCard 
                title="Total Candidates" 
                value={stats.totalCandidates.toString()} 
                trend="+12% from last week" 
                icon="people" 
                iconColor="text-primary" 
                trendColor="text-secondary"
              />
              <StatCard 
                title="Processed Today" 
                value={stats.processedToday.toString()} 
                trend="+5% from yesterday" 
                icon="fact_check" 
                iconColor="text-success" 
                trendColor="text-secondary"
              />
              <StatCard 
                title="Pending Process" 
                value={stats.pendingProcess.toString()} 
                description="Estimated time: 8 mins" 
                icon="pending" 
                iconColor="text-warning" 
              />
              <StatCard 
                title="Top Match Score" 
                value={`${stats.topMatchScore}%`} 
                description="For Senior Developer" 
                icon="star" 
                iconColor="text-accent" 
              />
            </>
          )}
        </div>
        
        {/* File Upload Area */}
        <FileUploadArea />
        
        {/* Recently Processed Candidates */}
        <CandidateList title="Recently Processed Candidates" limit={4} />
      </div>
    </>
  );
}
