import React, { useEffect, useState } from "react";
import { Info, Bot } from "lucide-react";

interface ResultCardProps {
  item: any;
}

const ResultCard: React.FC<ResultCardProps> = ({ item }) => {
  const [animatedRank, setAnimatedRank] = useState(0);

  useEffect(() => {
    let current = 0;
    const target = item.rank || 0;
    const duration = 5000; // 5 seconds
    const intervalMs = 500;
    const steps = Math.ceil(duration / intervalMs);
    const increment = target / steps;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      current = Math.min(target, Math.round(step * increment));
      setAnimatedRank(current);
      if (current >= target || step >= steps) {
        setAnimatedRank(target);
        clearInterval(interval);
      }
    }, intervalMs);
    return () => clearInterval(interval);
  }, [item.rank]);

  return (
    <div className="bg-gray-100 rounded-lg p-4 shadow flex flex-col gap-2">
      {/* Rank and Info */}
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 flex items-center gap-2">
          <div className="w-28">
            <div className="text-xs text-muted-foreground mb-0.5">Ranking</div>
            <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-2 bg-primary rounded-full transition-all"
                style={{ width: `${animatedRank}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-semibold w-8 text-right">{animatedRank}/100</span>
        </div>
        {/* Tooltip for summary */}
        <div className="relative group">
          <Info className="h-5 w-5 text-primary cursor-pointer" />
          <div className="absolute left-1/2 z-10 hidden group-hover:flex flex-col items-start min-w-[220px] max-w-xs -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs text-gray-700">
            <div className="flex items-center gap-1 mb-1 text-primary font-semibold">
              <Bot className="h-4 w-4" /> AI Summary
            </div>
            <div className="text-gray-700 whitespace-pre-line">
              {item.summary || 'No summary available.'}
            </div>
          </div>
        </div>
      </div>
      <div className="font-semibold text-base truncate">{item.fileName}</div>
      <div className="text-xs text-muted-foreground line-clamp-2 mb-1">{item.shortDescription}</div>
      {item.topSkills && item.topSkills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {item.topSkills.slice(0, 3).map((skill: string) => (
            <span key={skill} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
              {skill}
            </span>
          ))}
          {item.topSkills.length > 3 && (
            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
              +{item.topSkills.length - 3} more
            </span>
          )}
        </div>
      )}
      {item.jobTitles && item.jobTitles.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {item.jobTitles.map((title: string) => (
            <span key={title} className="bg-muted text-xs px-2 py-0.5 rounded-full">
              {title}
            </span>
          ))}
        </div>
      )}
      <div className="text-xs text-muted-foreground">{item.technicalDomain}</div>
      <div className="text-xs text-muted-foreground">{item.businessDomain}</div>
    </div>
  );
};

export default ResultCard; 
