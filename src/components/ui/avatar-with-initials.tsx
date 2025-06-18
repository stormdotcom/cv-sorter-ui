import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarWithInitialsProps {
  name: string;
  className?: string;
}

export function AvatarWithInitials({ name, className }: AvatarWithInitialsProps) {
  // Generate initials from the name
  const initials = name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  
  // Generate a unique color based on the name
  const colors = [
    "bg-red-100 text-red-800",
    "bg-green-100 text-green-800",
    "bg-blue-100 text-blue-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
  ];
  
  const colorIndex = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  
  return (
    <Avatar className={className}>
      <AvatarFallback className={cn(colors[colorIndex], "text-sm font-medium")}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
