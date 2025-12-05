import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layouts/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import "./App.css";

function App() {
  return (
    
      <Routes>
        {/* Main layout with navbar and footer */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Add other protected routes here */}
        </Route>

        {/* Auth routes without layout */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    
  );
}

export default App;
