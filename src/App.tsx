import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext"; // MEJORA: Exporta useAuth si no.
import { SidebarProvider } from "./contexts/SidebarContext";  // Relativo desde src/.
import { Sidebar } from "@/components/Sidebar"; // FIX: Importa Sidebar aquí.
import { initializeMockData } from "@/utils/mockData"; // Opcional; ahora Supabase seed.

// Pages: Lazy para perf.
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ClientPCMap = lazy(() => import("./pages/client/ClientPCMap"));
const ClientReserve = lazy(() => import("./pages/client/ClientReserve"));
const ClientCafeteria = lazy(() => import("./pages/client/ClientCafeteria"));
const ClientReport = lazy(() => import("./pages/client/ClientReport")); // FIX: Consistente.
const ClientAccount = lazy(() => import("./pages/client/ClientAccount"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminPCManagement = lazy(() => import("./pages/admin/AdminPCManagement"));
const AdminUserManagement = lazy(() => import("./pages/admin/AdminUserManagement"));
const AdminDemand = lazy(() => import("./pages/admin/AdminDemand"));
const NotFound = lazy(() => import("./pages/NotFound"));

// ProtectedRoute wrapper.
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// Layout con Sidebar.
const ProtectedLayout = ({ children }: { children: JSX.Element }) => (
  <ProtectedRoute>
    <div className="flex min-h-screen bg-background">
      <Sidebar /> {/* FIX: Ahora importado, no error. */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  </ProtectedRoute>
);

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // MEJORA: Seed async opcional (solo dev; remueve en prod).
    const seedData = async () => {
      try {
        await initializeMockData(); // Ahora Supabase seed.
      } catch (error) {
        console.error('Error seeding data:', error); // Silencioso.
      }
    };
    seedData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SidebarProvider>
            <BrowserRouter>
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen" aria-label="Cargando interfaz cyberpunk">
                  Cargando cyber-matrix...
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  
                  {/* Protected con layout. */}
                  <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
                  <Route path="/dashboard/cliente" element={<ProtectedLayout><ClientPCMap /></ProtectedLayout>} />
                  <Route path="/dashboard/cliente/reserve" element={<ProtectedLayout><ClientReserve /></ProtectedLayout>} /> {/* FIX: 'resave' → 'reserve'. */}
                  <Route path="/dashboard/cliente/cafeteria" element={<ProtectedLayout><ClientCafeteria /></ProtectedLayout>} />
                  <Route path="/dashboard/cliente/report" element={<ProtectedLayout><ClientReport /></ProtectedLayout>} /> {/* FIX: ClientReport consistente. */}
                  <Route path="/dashboard/cliente/my-account" element={<ProtectedLayout><ClientAccount /></ProtectedLayout>} />
                  <Route path="/dashboard/admin" element={<ProtectedLayout><AdminDashboard /></ProtectedLayout>} />
                  <Route path="/dashboard/admin/demand" element={<ProtectedLayout><AdminDemand /></ProtectedLayout>} />
                  <Route path="/dashboard/admin/manage-pcs" element={<ProtectedLayout><AdminPCManagement /></ProtectedLayout>} />
                  <Route path="/dashboard/admin/manage-users" element={<ProtectedLayout><AdminUserManagement /></ProtectedLayout>} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </SidebarProvider>
          
          {/* Toasters fuera de Sidebar para páginas públicas. */}
          <Toaster />
          <Sonner />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;