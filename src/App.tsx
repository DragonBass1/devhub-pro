import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Repositories from "./pages/Repositories";
import Pipelines from "./pages/Pipelines";
import Environments from "./pages/Environments";
import TestingQuality from "./pages/TestingQuality";
import SecurityPage from "./pages/SecurityPage";
import Observability from "./pages/Observability";
import ApiIntegrations from "./pages/ApiIntegrations";
import Backlog from "./pages/Backlog";
import DocumentationPage from "./pages/DocumentationPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoutes() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <ProjectProvider>
      <AppLayout />
    </ProjectProvider>
  );
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/repositorios" element={<Repositories />} />
                <Route path="/pipelines" element={<Pipelines />} />
                <Route path="/ambientes" element={<Environments />} />
                <Route path="/testes" element={<TestingQuality />} />
                <Route path="/seguranca" element={<SecurityPage />} />
                <Route path="/observabilidade" element={<Observability />} />
                <Route path="/apis" element={<ApiIntegrations />} />
                <Route path="/backlog" element={<Backlog />} />
                <Route path="/documentacao" element={<DocumentationPage />} />
                <Route path="/configuracoes" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
