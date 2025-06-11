import { cn } from "@/lib/utils";

interface SkillBadgeProps {
  skill: string;
  className?: string;
}

export function SkillBadge({ skill, className }: SkillBadgeProps) {
  return (
    <div 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors", 
        className
      )}
    >
      {skill}
    </div>
  );
}