import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import { AppLayout } from "@/components/layouts/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { BugsPage } from "@/pages/BugsPage";
import { BugEditorPage } from "@/pages/BugEditorPage";
import { UsersPage } from "@/pages/UsersPage";
import { UserEditorPage } from "@/pages/UserEditorPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Protected Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route path="/bugs" element={<BugsPage />} />
            <Route path="/bug/new" element={<BugEditorPage />} />
            <Route path="/bug/:bugId" element={<BugEditorPage />} />

            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/new" element={<UserEditorPage />} />
            <Route path="/users/:userId" element={<UserEditorPage />} />
          </Route>

          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
