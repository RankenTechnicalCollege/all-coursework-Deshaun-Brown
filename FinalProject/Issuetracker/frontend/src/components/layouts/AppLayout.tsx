import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 bg-white">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;