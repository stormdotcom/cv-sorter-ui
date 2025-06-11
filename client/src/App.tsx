import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Candidates from "@/pages/Candidates";
import CandidateDetail from "@/pages/CandidateDetail";
import JobDescriptions from "@/pages/JobDescriptions";
import JobDescriptionDetail from "@/pages/JobDescriptionDetail";
import LandingPage from "@/pages/LandingPage";
import BlogList from "@/pages/BlogList";
import BlogDetail from "@/pages/BlogDetail";
import BlogEditor from "@/pages/BlogEditor";
import PublicBlog from "@/pages/PublicBlog";
import PublicBlogDetail from "@/pages/PublicBlogDetail";
import PublicBlogEditor from "@/pages/PublicBlogEditor";
import AuthPage from "@/pages/auth-page";
import { Sidebar } from "@/components/layout/Sidebar";
import Resumes from "./pages/Resumes";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:ml-64 ">
        <div className="w-full min-w-[1024px] max-w-[1440px] mx-auto p-4 overflow-x-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  const isLandingPage = location === "/";

  return (
    <>
      <Switch>
        {/* Public routes */}
        <Route path="/">
          <LandingPage />
        </Route>

        <Route path="/auth">
          <AuthPage />
        </Route>

        <Route path="/public-blog">
          <PublicBlog />
        </Route>

        <Route path="/public-blog/:id">
          <PublicBlogDetail />
        </Route>

        {/* Protected routes for the application */}
        <ProtectedRoute path="/dashboard">
          <AppLayout>
            <Dashboard />
          </AppLayout>
        </ProtectedRoute>

        <ProtectedRoute path="/candidates">
          <AppLayout>
            <Candidates />
          </AppLayout>
        </ProtectedRoute>

        <ProtectedRoute path="/candidates/:id">
          <AppLayout>
            <CandidateDetail />
          </AppLayout>
        </ProtectedRoute>

        <ProtectedRoute path="/job-descriptions">
          <AppLayout>
            <JobDescriptions />
          </AppLayout>
        </ProtectedRoute>

        <ProtectedRoute path="/job-descriptions/:id">
          <AppLayout>
            <JobDescriptionDetail />
          </AppLayout>
        </ProtectedRoute>

        <ProtectedRoute path="/blog">
          <AppLayout>
            <BlogList />
          </AppLayout>
        </ProtectedRoute>

        {/* Admin-only routes */}
        <ProtectedRoute path="/blog/new" adminOnly>
          <AppLayout>
            <BlogEditor />
          </AppLayout>
        </ProtectedRoute>

        <ProtectedRoute path="/blog/edit/:id" adminOnly>
          <AppLayout>
            <BlogEditor />
          </AppLayout>
        </ProtectedRoute>

        <ProtectedRoute path="/blog/:id">
          <AppLayout>
            <BlogDetail />
          </AppLayout>
        </ProtectedRoute>

        {/* Admin-only route for public blog editor */}
        <ProtectedRoute path="/public-blog/editor" adminOnly>
          <PublicBlogEditor />
        </ProtectedRoute>

        <ProtectedRoute path="/public-blog/editor/:id" adminOnly>
          <PublicBlogEditor />
        </ProtectedRoute>


        <ProtectedRoute path="/resume">
          <AppLayout>
            <Resumes />
          </AppLayout>
        </ProtectedRoute>

        {/* Test upload route removed - integrated into main app */}

        {/* 404 route */}
        <Route>
          <AppLayout>
            <NotFound />
          </AppLayout>
        </Route>
      </Switch>
      <Toaster />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
