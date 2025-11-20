import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Sidebar } from "./components/layout/Sidebar";
import { Navbar } from "./components/layout/Navbar";

import Dashboard from "./pages/Dashboard";
import IocSearch from "./pages/IocSearch";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import Login from "./pages/Login";
import Register from "./pages/Register";

import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

import { useAuthStore } from "@/store/authStore";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />

        <BrowserRouter>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* PROTECTED ROUTES (everything inside MainLayout) */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

//
// ============================
// MAIN LAYOUT (SIDEBAR + NAVBAR)
// ============================
//
const MainLayout = () => {
  const token = useAuthStore((s) => s.token);

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar Left */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 overflow-auto">
          <Routes>
            {/* DEFAULT ROUTE */}
            <Route
              index
              element={
                token ? (
                  <Navigate to="dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* PROTECTED PAGES */}
            {/* IMPORTANT: THESE MUST BE RELATIVE PATHS! */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="ioc-search" element={<IocSearch />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />

            {/* 404 INSIDE LAYOUT */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
