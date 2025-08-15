import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense, lazy } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import LoadingSpinner from "@/components/ui/loading-spinner";

// Lazy load all routes for better code splitting
const Home = lazy(() => import("@/pages/home"));
const Story = lazy(() => import("@/pages/story"));
const SubmitStory = lazy(() => import("@/pages/submit-story"));
const Stories = lazy(() => import("@/pages/stories"));
const Contact = lazy(() => import("@/pages/contact"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  // Real-time subscriptions will be initialized per page as needed
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/story/:id" component={Story} />
            <Route path="/submit" component={SubmitStory} />
            <Route path="/stories" component={Stories} />
            <Route path="/contact" component={Contact} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
