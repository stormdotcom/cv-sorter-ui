import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { path: "/candidates", label: "Candidates", icon: "people" },
  { path: "/job-descriptions", label: "Jobs", icon: "work" },
  { path: "/resume", label: "Files", icon: "description" },
];

export function Sidebar() {
  const [location] = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  // Check if on mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Handle link clicks on mobile to close the sheet
  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-neutral-200">
        <Link href="/">
          <h1 className="text-xl font-bold flex items-center cursor-pointer group">
            <span className="material-icons mr-2 text-primary group-hover:text-primary/80 transition-colors">smart_toy</span>
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              SmartHire
            </span>
          </h1>
        </Link>
      </div>
      
      {/* User info if logged in */}
      {user && (
        <div className="p-3 border-b border-neutral-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full flex justify-start items-center gap-2 hover:bg-neutral-100">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  {user.username ? user.username[0].toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm">{user.username}</span>
                  <span className="text-xs text-neutral-500">
                    {user.isAdmin ? 'Admin' : 'User'}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                <span className="material-icons mr-2 text-sm">logout</span>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      
      {/* Nav Links */}
      <nav className="p-2 flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-1">
              <Link href={item.path}>
                <div
                  className={cn(
                    "flex items-center p-2 rounded-md cursor-pointer transition-all duration-200",
                    location === item.path
                      ? "bg-primary text-white shadow-md"
                      : "text-neutral-700 hover:bg-neutral-100"
                  )}
                  onClick={handleLinkClick}
                >
                  <span className="material-icons mr-3">{item.icon}</span>
                  {item.label}
                </div>
              </Link>
            </li>
          ))}
          
          {/* Admin-only menu items */}
          {user?.isAdmin && (
            <>
              <li className="mt-4 mb-2 px-2">
                <div className="text-xs font-medium text-neutral-400 uppercase">Admin</div>
              </li>
              <li className="mb-1">
                <Link href="/blog/new">
                  <div
                    className={cn(
                      "flex items-center p-2 rounded-md cursor-pointer transition-all duration-200",
                      location === "/blog/new"
                        ? "bg-primary text-white shadow-md"
                        : "text-neutral-700 hover:bg-neutral-100"
                    )}
                    onClick={handleLinkClick}
                  >
                    <span className="material-icons mr-3">post_add</span>
                    New Blog Post
                  </div>
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/public-blog/editor">
                  <div
                    className={cn(
                      "flex items-center p-2 rounded-md cursor-pointer transition-all duration-200",
                      location === "/public-blog/editor"
                        ? "bg-primary text-white shadow-md"
                        : "text-neutral-700 hover:bg-neutral-100"
                    )}
                    onClick={handleLinkClick}
                  >
                    <span className="material-icons mr-3">edit_note</span>
                    Public Blog Editor
                  </div>
                </Link>
              </li>

            </>
          )}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-neutral-200">
        <Link href="/">
          <div className="flex items-center text-sm text-neutral-500 hover:text-primary cursor-pointer transition-colors" onClick={handleLinkClick}>
            <span className="material-icons mr-2 text-neutral-400">home</span>
            Back to Landing Page
          </div>
        </Link>
        
        <Link href="/public-blog">
          <div className="flex items-center text-sm text-neutral-500 mt-3 hover:text-primary cursor-pointer transition-colors" onClick={handleLinkClick}>
            <span className="material-icons mr-2 text-neutral-400">article</span>
            Public Blog
          </div>
        </Link>
        
        <Link href="/test-upload">
          <div className="flex items-center text-sm text-neutral-500 mt-3 hover:text-primary cursor-pointer transition-colors" onClick={handleLinkClick}>
            <span className="material-icons mr-2 text-neutral-400">upload_file</span>
            Test File Upload
          </div>
        </Link>
        
        {/* Login/Logout button */}
        {user ? (
          <div 
            className="flex items-center text-sm text-red-500 mt-3 hover:text-red-600 cursor-pointer transition-colors" 
            onClick={() => {
              handleLogout();
              handleLinkClick();
            }}
          >
            <span className="material-icons mr-2 text-red-500">logout</span>
            Logout
          </div>
        ) : (
          <Link href="/auth">
            <div className="flex items-center text-sm text-primary mt-3 hover:text-primary/80 cursor-pointer transition-colors" onClick={handleLinkClick}>
              <span className="material-icons mr-2 text-primary">login</span>
              Login / Register
            </div>
          </Link>
        )}
      </div>
    </>
  );

  // Mobile hamburger menu in fixed position
  const mobileMenuButton = (
    <div className="fixed top-4 left-4 z-50 md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="p-2 rounded-md bg-primary text-white shadow-md">
            <span className="material-icons">menu</span>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="h-full flex flex-col">
            {sidebarContent}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
  
  return (
    <>
      {/* Show mobile menu button */}
      {isMobile && mobileMenuButton}
      
      {/* Desktop sidebar */}
      {!isMobile && (
        <aside className="w-64 h-screen bg-white shadow-md z-10 fixed left-0 top-0 flex flex-col">
          {sidebarContent}
        </aside>
      )}
    </>
  );
}
