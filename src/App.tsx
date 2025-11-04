import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { initializeMockData } from "@/utils/mockData";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import ClientPCMap from "./pages/client/ClientPCMap";
import ClientReserve from "./pages/client/ClientReserve";
import ClientCafeteria from "./pages/client/ClientCafeteria";
import ClientReport from "./pages/client/ClientReport";
import ClientDemand from "./pages/client/ClientDemand";
import ClientAccount from "./pages/client/ClientAccount";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDataAnalysis from "./pages/admin/AdminDataAnalysis";
import AdminManagePCs from "./pages/admin/AdminManagePCs";
import AdminManageUsers from "./pages/admin/AdminManageUsers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/cliente" element={<ClientPCMap />} />
              <Route path="/dashboard/cliente/reserve" element={<ClientReserve />} />
              <Route path="/dashboard/cliente/cafeteria" element={<ClientCafeteria />} />
              <Route path="/dashboard/cliente/report" element={<ClientReport />} />
              <Route path="/dashboard/cliente/demand" element={<ClientDemand />} />
              <Route path="/dashboard/cliente/my-account" element={<ClientAccount />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/dashboard/admin/demand" element={<ClientDemand />} />
              <Route path="/dashboard/admin/data-analysis" element={<AdminDataAnalysis />} />
              <Route path="/dashboard/admin/manage-pcs" element={<AdminManagePCs />} />
              <Route path="/dashboard/admin/manage-users" element={<AdminManageUsers />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
