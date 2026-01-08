import React from 'react';
import { BrowserRouter as Router, Routes as Switch, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { TRPCProvider } from '@/hooks/useTrpc';
import { MainNavigation } from '@/components/MainNavigation';
import { Home } from '@/pages/Home';
import { Dashboard } from '@/pages/Dashboard';
import { AlertCenter } from '@/pages/AlertCenter';
import { InvestigationTools } from '@/pages/InvestigationTools';
import { ImageAnalysis } from '@/pages/ImageAnalysis';
import { BloomSeedGenerator } from '@/pages/BloomSeedGenerator';
import { BloomDistribution } from '@/pages/BloomDistribution';
import { AdminPanel } from '@/pages/AdminPanel';
import { InvestigationCases } from '@/pages/InvestigationCases';
import { LESettings } from '@/pages/LESettings';
import { IntelligentAlerts } from '@/pages/IntelligentAlerts';
import { CrawlerControl } from '@/pages/CrawlerControl';
import { EntityExtraction } from '@/pages/EntityExtraction';
import { AIAlertSystem } from '@/pages/AIAlertSystem';
import { RelationshipGraph } from '@/pages/RelationshipGraph';
import { TeamOperations } from '@/pages/TeamOperations';
import { LoginPage } from '@/pages/Login';
import { NotFound } from '@/pages/NotFound';
import { AuthDebug } from '@/pages/AuthDebug';

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-900">
      <div className="text-white">Loading...</div>
    </div>
  );
}

/**
 * Main App Layout
 */
function AppLayout() {
  const location = useLocation();
  const { logout } = useAuth();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex h-screen bg-slate-900">
      {!isLoginPage && <MainNavigation logout={logout} />}
      <main className={`flex-1 overflow-auto ${isLoginPage ? "" : "md:ml-64"}`}>
        <AppRoutes />
      </main>
    </div>
  );
}

/**
 * Router
 */
function AppRoutes() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path={"/login"} component={LoginPage} />

      {/* Protected Routes */}
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/team-operations"} component={TeamOperations} />
      <Route path={"/image-analysis"} component={ImageAnalysis} />
      <Route path={"/bloom-seed-generator"} component={BloomSeedGenerator} />
      <Route path={"/admin"} component={AdminPanel} />
      <Route path={"/alerts"} component={AlertCenter} />
      <Route path={"/cases"} component={InvestigationCases} />
      <Route path={"/le-settings"} component={LESettings} />
      <Route path={"/intelligent-alerts"} component={IntelligentAlerts} />
      <Route path={"/investigation-tools"} component={InvestigationTools} />
      <Route path={"/crawler-control"} component={CrawlerControl} />
      <Route path={"/bloom-distribution"} component={BloomDistribution} />
      <Route path={"/entity-extraction"} component={EntityExtraction} />
      <Route path={"/ai-alerts"} component={AIAlertSystem} />
            <Route path={"/relationship-graph"} component={RelationshipGraph} />
      <Route path={"/auth-debug"} component={AuthDebug} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Main App Component with Auth Check
 */
function App() {
  // TEST MODE: Bypass authentication
  const TEST_MODE = true;
  const { user, loading, isAuthenticated } = useAuth();

  // In test mode, skip authentication check
  if (TEST_MODE) {
    return (
      <ErrorBoundary>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster />
            <AppLayout />
          </TooltipProvider>
        </ThemeProvider>
      </ErrorBoundary>
    );
  }

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          {!isAuthenticated ? <LoginPage /> : <AppLayout />}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function AppWithProviders() {
  return (
    <TRPCProvider>
      <AuthProvider>
        <Router>
          <App />
        </Router>
      </AuthProvider>
    </TRPCProvider>
  );
}

export default AppWithProviders;
