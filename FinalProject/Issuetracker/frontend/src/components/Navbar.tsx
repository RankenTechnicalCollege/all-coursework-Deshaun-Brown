"use client";

import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";


const navItems = [
  { to: "/dashboard", label: "Home", roles: ["DEV", "QA", "BA", "PM", "TM"] },
  { to: "/bugs", label: "Bugs", roles: ["DEV", "QA", "BA", "PM", "TM"] },
  { to: "/reports", label: "Reports", roles: ["BA", "PM", "TM"] },
  { to: "/users", label: "Users", roles: ["TM"] },
];

export function Navbar() {
  const { user } = useAuth();
  const userRole = user?.role as string | undefined;
  const visibleNavItems = user
    ? navItems.filter((item) => userRole && item.roles.includes(userRole))
    : [];

  return (
    <header className="sticky top-0 z-40 border-b border-[#222] bg-[#0f0f0f] text-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 text-white hover:text-white">
          <span className="text-lg font-semibold">IssueTracker</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {user &&
            visibleNavItems.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "transition hover:text-gray-200",
                    isActive ? "text-white font-semibold" : "text-gray-200"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-gray-200">Welcome, {user.name ?? user.email}</span>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-white hover:bg-white/10"
                onClick={() => {
                  /* add logout */
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" className="border-gray-300 text-white hover:bg-white/10">
                <Link to="/login" className="text-white">Login</Link>
              </Button>
              <Button size="sm" className="bg-gray-200 text-black hover:bg-gray-100">
                <Link to="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#0f0f0f] text-white">
            <div className="mt-6 flex flex-col gap-4">
              {user &&
                visibleNavItems.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        "rounded px-3 py-2 text-base transition hover:bg-white/10",
                        isActive && "bg-white/10 font-semibold"
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}

              <div className="mt-2 flex gap-2">
                {user ? (
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 text-white hover:bg-white/10"
                    onClick={() => {
                      /* add logout */
                    }}
                  >
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1 border-gray-300 text-white hover:bg-white/10">
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button className="flex-1 bg-gray-200 text-black hover:bg-gray-100">
                      <Link to="/register">Sign up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default Navbar;
