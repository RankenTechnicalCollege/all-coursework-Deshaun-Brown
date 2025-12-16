import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
            {/* Bug routes */}
            <Route path="/bugs" element={<BugsPage />} />
            <Route path="/bugs/new" element={<BugEditorPage />} />
            <Route path="/bugs/:bugId" element={<BugEditorPage />} />
            <Route path="/bugs/report" element={<ReportBugPage />} />

            {/* User routes */}
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/new" element={<UserEditorPage />} />
            <Route path="/users/:userId" element={<UserEditorPage />} />
          </Route>

          {/* AUTH */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    
    </BrowserRouter>
  );
}

export default App;
