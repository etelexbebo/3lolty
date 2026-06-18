import React, { Suspense, useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { MuseumProvider } from "@/context/MuseumContext";
import { WebGLErrorBoundary, checkWebGLSupport } from "@/components/WebGLErrorBoundary";
import MuseumFallback from "@/components/MuseumFallback";
import Overlay from "@/components/Overlay";

const Experience = React.lazy(() => import("@/components/Experience"));

const queryClient = new QueryClient();

function Home() {
  const [webglOk, setWebglOk] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglOk(checkWebGLSupport());
  }, []);

  if (webglOk === null) {
    return (
      <div
        className="h-[100dvh] w-full flex items-center justify-center"
        style={{ background: "#0a0005" }}
      >
        <div className="text-primary/60 font-serif text-xl animate-pulse">...</div>
      </div>
    );
  }

  if (!webglOk) {
    return <MuseumFallback />;
  }

  return (
    <div className="h-[100dvh] w-full bg-background overflow-hidden relative">
      <MuseumProvider>
        <WebGLErrorBoundary fallback={<MuseumFallback />}>
          <Suspense
            fallback={
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: "#0a0005" }}
              >
                <span className="text-primary/60 font-serif text-2xl animate-pulse">
                  جاري التحميل...
                </span>
              </div>
            }
          >
            <Experience />
          </Suspense>
        </WebGLErrorBoundary>
        <Overlay />
      </MuseumProvider>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
