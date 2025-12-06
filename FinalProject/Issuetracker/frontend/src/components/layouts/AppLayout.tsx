import { Outlet } from "react-router-dom";
import {Navbar1} from "@/components/navbar1";
import { Footer } from "@/components/Footer";

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar1 />
      <main className="flex-1 bg-white">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;