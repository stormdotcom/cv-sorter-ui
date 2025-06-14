import { Header } from "@/components/layout/Header";
import StatCard from "@/components/dashboard/StatCard";
import FileUploadArea from "@/components/dashboard/FileUploadArea";
import { CandidateList } from "@/components/candidates/CandidateList";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getDashboardStatsApi, listCandidatesApi } from "@/http/apiCalls";
import JobDescriptionSort from "@/components/dashboard/JobDescriptionSort";
 
interface DashboardStats {
  totalCandidates: {
    value: number;
    meta: {
      trend: string;
      trendLabel: string;
    };
  };
  processedToday: {
    value: number;
    meta: {
      trend: string;
      trendLabel: string;
    };
  };
  pendingProcess: {
    value: number;
    meta: {
      estimatedTime: string;
    };
  };
}

export default function Dashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getDashboardStatsApi();
        setStats(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch dashboard stats",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCandidates = async () => {
      try {
        const { data } = await listCandidatesApi({ limit: 3 });
        setCandidates(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch recent candidates",
          variant: "destructive",
        });
      } finally {
        setIsLoadingCandidates(false);
      }
    };

    fetchStats();
    fetchCandidates();
  }, [toast]);

  return (
    <>
      <Header title="Dashboard" />
      
      <div className="space-y-6 w-full">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </>
          ) : stats ? (
            <>
              <StatCard 
                title="Total Candidates" 
                value={stats.totalCandidates.value.toString()} 
                trend={`${stats.totalCandidates.meta.trend} ${stats.totalCandidates.meta.trendLabel}`}
                icon="people" 
                iconColor="" 
                trendColor={stats.totalCandidates.meta.trend.startsWith('+') ? "text-success" : "text-destructive"}
              />
              <StatCard 
                title="Processed Today" 
                value={stats.processedToday.value.toString()} 
                trend={`${stats.processedToday.meta.trend} ${stats.processedToday.meta.trendLabel}`}
                icon="fact_check" 
                iconColor="text-success" 
                trendColor={stats.processedToday.meta.trend.startsWith('+') ? "text-success" : "text-destructive"}
              />
              <StatCard 
                title="Pending Process" 
                value={stats.pendingProcess.value.toString()} 
                description={`Estimated time: ${stats.pendingProcess.meta.estimatedTime}`}
                icon="pending" 
                iconColor="text-warning" 
              />
            </>
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-muted-foreground">Failed to load dashboard stats</p>
            </div>
          )}
        </div>
        
        {/* File Upload Area & Job Description Sort side by side */}
        <div className="flex flex-col md:flex-row gap-6 w-full">
          <div className="flex-1">
            <FileUploadArea />
          </div>
          <div className="flex-1">
            <JobDescriptionSort />
          </div>
        </div>
        
        {/* Recently Processed Candidates */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recently Processed Candidates</h2>
          <CandidateList 
            candidates={candidates} 
            isLoading={isLoadingCandidates} 
          />
        </div>
      </div>
    </>
  );
}
