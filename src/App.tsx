import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/Pages/Login";
import Home from "@/Pages/Home";
import Shop from "./Pages/Shop";
import Notes from "./Pages/Notes";
import { useAuth } from "./utils/AuthContext";

import { Toaster } from "@/components/ui/sonner";

// Protected Route component - routes to login if user not authenticated
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Login Route component - redirects to home if already logged in
function LoginRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <Login />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page - accessible only when not logged in */}
        <Route path="/login" element={<LoginRoute />} />
        
        {/* Protected routes - only accessible when logged in */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
        <Route path="/Notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
        
        {/* Catch-all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App