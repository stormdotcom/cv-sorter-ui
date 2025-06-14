import '@/lib/pdfWorkerSetup';
import { Switch, Route, useLocation } from "wouter";
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { PageLoader } from "@/components/ui/loading";

// Lazy load all page components
const NotFound = lazy(() => import("@/pages/not-found"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Candidates = lazy(() => import("@/pages/Candidates"));
const CandidateDetail = lazy(() => import("@/pages/CandidateDetail"));
const JobDescriptions = lazy(() => import("@/pages/JobDescriptions"));
const JobDescriptionDetail = lazy(() => import("@/pages/JobDescriptionDetail"));
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const BlogList = lazy(() => import("@/pages/BlogList"));
const BlogDetail = lazy(() => import("@/pages/BlogDetail"));
const BlogEditor = lazy(() => import("@/pages/BlogEditor"));
const PublicBlog = lazy(() => import("@/pages/PublicBlog"));
const PublicBlogDetail = lazy(() => import("@/pages/PublicBlogDetail"));
const PublicBlogEditor = lazy(() => import("@/pages/PublicBlogEditor"));
const AuthPage = lazy(() => import("@/pages/auth-page"));
const Resumes = lazy(() => import("@/pages/Resumes"));
import { Sidebar } from "@/components/layout/Sidebar";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<PageLoader />}>
        <Sidebar />
      </Suspense>
      <main className="md:ml-64">
        <div className="w-full min-w-[1024px] max-w-[1440px] mx-auto p-4 overflow-x-auto">
          <Suspense fallback={<PageLoader />}>
            {children}
          </Suspense>
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
          <Suspense fallback={<PageLoader />}>
            <LandingPage />
          </Suspense>
        </Route>

        <Route path="/auth">
          <Suspense fallback={<PageLoader />}>
            <AuthPage />
          </Suspense>
        </Route>

        <Route path="/public-blog">
          <Suspense fallback={<PageLoader />}>
            <PublicBlog />
          </Suspense>
        </Route>

        <Route path="/public-blog/:id">
          <Suspense fallback={<PageLoader />}>
            <PublicBlogDetail />
          </Suspense>
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
          <Suspense fallback={<PageLoader />}>
            <PublicBlogEditor />
          </Suspense>
        </ProtectedRoute>

        <ProtectedRoute path="/public-blog/editor/:id" adminOnly>
          <Suspense fallback={<PageLoader />}>
            <PublicBlogEditor />
          </Suspense>
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
