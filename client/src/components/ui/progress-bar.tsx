import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number | null;
  colorClass?: string;
  showLabel?: boolean;
}

export function ProgressBar({ 
  value, 
  colorClass = "bg-primary", 
  showLabel = false 
}: ProgressBarProps) {
  // Ensure value is between 0 and 100 and handle null values
  const safeValue = value !== null ? Math.max(0, Math.min(100, value)) : 0;
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex-grow h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full", colorClass)} 
          style={{ width: `${safeValue}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-xs w-8 text-right font-medium">
          {safeValue}%
        </div>
      )}
    </div>
  );
}