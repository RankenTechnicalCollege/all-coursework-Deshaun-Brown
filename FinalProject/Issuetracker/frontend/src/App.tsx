import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layouts/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { BugsPage } from "@/pages/BugsPage";
import { UsersPage } from "@/pages/UsersPage";
import { BugEditorPage } from "@/pages/BugEditorPage";
import { UserEditorPage } from "@/pages/UserEditorPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import './App.css';


function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route 
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/bug/list" element={<BugsPage />} />
          <Route path="/bug/:bugId" element={<BugEditorPage />} />
          <Route path="/user/list" element={<UsersPage />} />
          <Route path="/user/:userId" element={<UserEditorPage />} />
        </Route>
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
