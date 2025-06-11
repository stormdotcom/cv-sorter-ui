import { ReactNode } from "react";
import { AvatarWithInitials } from "@/components/ui/avatar-with-initials";
import { useAuth } from "@/hooks/use-auth";

interface HeaderProps {
  title: string;
  children?: ReactNode;
}

export function Header({ title, children }: HeaderProps) {
  const { user } = useAuth();
  const userName = user?.username || "User";
  
  return (
    <header className="bg-white shadow-sm p-4 sticky top-0 z-10 my-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-800">{title}</h2>
        
        <div className="flex items-center mt-3 md:mt-0">
          {children}
          
          <div className="flex items-center ml-4">
            <button className="p-2 rounded-full text-neutral-600 hover:bg-neutral-100 mr-2">
              <span className="material-icons">notifications</span>
            </button>
            <AvatarWithInitials name={userName} className="bg-primary text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
