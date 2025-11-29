import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth-client";
import { showSuccess } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      showSuccess("Logged out successfully");
      setIsOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Match backend role codes (DEV, QA, BA, PM, TM)
  const userRole = Array.isArray(user?.role) ? user?.role?.[0] : user?.role;
  
  const isDeveloper = userRole === "DEV" || userRole === "developer";
  const isQA = userRole === "QA" || userRole === "qa";
  const isBusinessAnalyst = userRole === "BA" || userRole === "business analyst";
  const isProductManager = userRole === "PM" || userRole === "product manager";
  const isTechnicalManager = userRole === "TM" || userRole === "technical manager";

  const canViewUsers = isTechnicalManager || isProductManager;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 text-xl font-bold text-primary hover:text-primary/80"
          >
            <span>🐛</span>
            <span>Issue Tracker</span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated && (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`
                  }
                >
                  Dashboard
                </NavLink>

                {/* Show Bugs link to all authenticated users */}
                <NavLink
                  to="/bug/list"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`
                  }
                >
                  Bugs
                </NavLink>

                {/* Show Users link only to managers */}
                {canViewUsers && (
                  <NavLink
                    to="/user/list"
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors ${
                        isActive
                          ? "text-primary border-b-2 border-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`
                    }
                  >
                    Users
                  </NavLink>
                )}
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-medium">{user?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground">
                      {getRoleDisplayName(userRole)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </NavLink>
                <NavLink to="/register">
                  <Button size="sm">
                    Register
                  </Button>
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4 border-t pt-4">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">
                    {getRoleDisplayName(userRole)}
                  </p>
                </div>

                <NavLink
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:bg-gray-100"
                    }`
                  }
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/bug/list"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:bg-gray-100"
                    }`
                  }
                >
                  Bugs
                </NavLink>

                {canViewUsers && (
                  <NavLink
                    to="/user/list"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-lg font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-muted-foreground hover:bg-gray-100"
                      }`
                    }
                  >
                    Users
                  </NavLink>
                )}

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block"
                >
                  <Button className="w-full" variant="outline">
                    Login
                  </Button>
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block"
                >
                  <Button className="w-full">
                    Register
                  </Button>
                </NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

// Helper function to display role names
function getRoleDisplayName(role: string | undefined): string {
  const roleMap: Record<string, string> = {
    'DEV': 'Developer',
    'QA': 'Quality Analyst',
    'BA': 'Business Analyst',
    'PM': 'Product Manager',
    'TM': 'Technical Manager',
    'developer': 'Developer',
    'qa': 'Quality Analyst',
    'business analyst': 'Business Analyst',
    'product manager': 'Product Manager',
    'technical manager': 'Technical Manager',
  };
  return roleMap[role || ''] || 'User';
}

export default Navbar;