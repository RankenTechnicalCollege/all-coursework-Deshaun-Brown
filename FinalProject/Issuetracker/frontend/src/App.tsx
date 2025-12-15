import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import { AppLayout } from "@/components/layouts/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { BugsPage } from "@/pages/BugsPage";
import { BugEditorPage } from "@/pages/BugEditorPage";
import { ReportBugPage } from "@/pages/ReportBugPage";
import { UsersPage } from "@/pages/UsersPage";
import { UserEditorPage } from "@/pages/UserEditorPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";

function App() {
  return (
    <BrowserRouter>
  <AuthProvider>
    <Routes>

      {/* PUBLIC LAYOUT */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/* PROTECTED ROUTES */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/bugs" element={<BugsPage />} />
        <Route path="/bug/new" element={<BugEditorPage />} />
        <Route path="/bug/:bugId" element={<BugEditorPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Route>

      {/* AUTH */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

    </Routes>
  </AuthProvider>
</BrowserRouter>

  );
}

export default App;
