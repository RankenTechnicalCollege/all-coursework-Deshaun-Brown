"use client";

import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

type RoleCode = "DEV" | "QA" | "BA" | "PM" | "TM";

interface NavItem {
  to: string;
  label: string;
  roles: RoleCode[];
  requiresAuth?: boolean;
}

const navItems: NavItem[] = [
  { to: "/dashboard", label: "Home", roles: ["DEV", "QA", "BA", "PM", "TM"], requiresAuth: true },
  { to: "/bugs", label: "Bugs", roles: ["DEV", "QA", "BA", "PM", "TM"], requiresAuth: true },
  { to: "/reports", label: "Reports", roles: ["BA", "PM", "TM"], requiresAuth: true },
  { to: "/users", label: "Users", roles: ["TM"], requiresAuth: true },
];

const contextualLinks: Record<string, NavItem[]> = {
  "/bugs": [
    { to: "/bug/new", label: "New Bug", roles: ["DEV", "QA", "BA", "PM", "TM"], requiresAuth: true },
  ],
  "/users": [
    { to: "/users/new", label: "Add User", roles: ["TM"], requiresAuth: true },
  ],
  "/reports": [
    { to: "/reports/export", label: "Export", roles: ["BA", "PM", "TM"], requiresAuth: true },
  ],
};

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = user?.role as RoleCode | undefined;

  const visibleNavItems = user
    ? navItems.filter((item) => userRole && item.roles.includes(userRole))
    : [];

  const currentContextualLinks = user
    ? (contextualLinks[location.pathname] || []).filter(
        (item) => userRole && item.roles.includes(userRole)
      )
    : [];

  const handleLogout = async () => {
    await logout();
    navigate("/dashboard");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#616161] bg-[#0f0f0f] text-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand */}
        <Link
          to={user ? "/dashboard" : "/"}
          className="flex items-center gap-4 text-white hover:text-gray-100 no-underline"
        >
          <img
            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
            alt="Logo"
            className="h-7 w-7 bg-gray-200"
          />
          <span className="text-lg font-semibold">IssueTracker</span>
        </Link>

        {/* Desktop nav */}
        <nav className="items-center gap-6 text-sm font-medium md:flex">
          {visibleNavItems.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "transition hover:text-gray-200 no-underline",
                  isActive ? "text-white font-semibold" : "text-gray-200"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* Contextual links */}
          {currentContextualLinks.length > 0 && (
            <div className="border-l border-gray-600 pl-6">
              {currentContextualLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "ml-6 transition hover:text-gray-200 no-underline",
                      isActive ? "text-yellow-400 font-semibold" : "text-gray-400 text-xs"
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-gray-200">
            {user.name} ({userRole})
              </span>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-white hover:bg-white/10"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-gray-300 text-white hover:bg-white/10"
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-gray-200 text-black hover:bg-gray-100">
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
            <SheetHeader>
              <SheetTitle>
                <Link
                  to={user ? "/dashboard" : "/"}
                  className="flex items-center gap-2 text-white hover:text-gray-100 no-underline"
                >
                  <span className="text-lg font-semibold">IssueTracker</span>
                </Link>
              </SheetTitle>
            </SheetHeader>

            <div className="mt-6 flex flex-col gap-4">
              {visibleNavItems.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded px-3 py-2 text-base transition hover:bg-white/10 no-underline",
                      isActive && "bg-white/10 font-semibold"
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {currentContextualLinks.length > 0 && (
                <>
                  <div className="border-t border-gray-600 my-2" />
                  {currentContextualLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        cn(
                          "rounded px-3 py-2 text-sm transition hover:bg-yellow-400/20 no-underline",
                          isActive && "bg-yellow-400/20 text-yellow-400 font-semibold"
                        )
                      }
                    >
                      ⚡ {link.label}
                    </NavLink>
                  ))}
                </>
              )}

              {/* mobile logout */}
              <div className="mt-4 border-t border-gray-600 pt-4 flex gap-2">
                {user ? (
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 text-white hover:bg-white/10"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 text-black hover:bg-gray-700/10"
                    >
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button asChild className="flex-1 text-black">
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
