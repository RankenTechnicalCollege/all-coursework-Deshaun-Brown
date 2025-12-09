import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layouts/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { BugsPage } from "@/pages/BugsPage";
import { BugEditorPage } from "@/pages/BugEditorPage";
import { UsersPage } from "@/pages/UsersPage";
import { UserEditorPage } from "@/pages/UserEditorPage";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Main layout with navbar and footer */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/bugs" element={<BugsPage />} />
          <Route path="/bug/new" element={<BugEditorPage />} />
          <Route path="/bug/:bugId" element={<BugEditorPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/new" element={<UserEditorPage />} />
          <Route path="/users/:userId" element={<UserEditorPage />} />
          
          {/* Add other protected routes here */}
        </Route>

        {/* Auth routes without layout */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
