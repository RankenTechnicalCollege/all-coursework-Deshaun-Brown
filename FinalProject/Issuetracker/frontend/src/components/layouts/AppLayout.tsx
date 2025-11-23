import { Outlet } from "react-router-dom";
import { Navbar1 } from "@/components/navbar1";
import { Footer2 } from "@/components/footer2";

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar1 />
      <main className="flex-1 container mx-auto py-8">
        <Outlet />
      </main>
      <Footer2 />
    </div>
  );
}

export default AppLayout;