import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  children,
  adminOnly = false,
}: {
  path: string;
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!user) {
    // Log the redirection to help diagnose authentication issues
    console.log('Protected route access denied - redirecting to auth page');
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // If adminOnly is true and the user is not an admin, redirect to the dashboard
  if (adminOnly && !user.isAdmin) {
    return (
      <Route path={path}>
        <Redirect to="/dashboard" />
      </Route>
    );
  }

  return <Route path={path}>{children}</Route>;
}