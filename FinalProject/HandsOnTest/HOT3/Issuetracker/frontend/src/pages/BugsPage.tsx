import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { BugList } from "@/components/BugList";
import { BugSearchInterface, type SearchFilters } from "@/components/BugSearchInterface";

export function BugsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [filters, setFilters] = useState<SearchFilters>({
    keywords: "",
    classification: "",
    maxAge: "",
    minAge: "",
    closed: false,
    sortBy: "newest",
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (next: SearchFilters) => {
    setFilters(next);
    setIsSearching(true);
    // Simple UX pulse; BugList fetches immediately when filters change
    setTimeout(() => setIsSearching(false), 300);
  };

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Bug Tracker</h1>
          <p className="text-muted-foreground mt-2">Manage and track all reported issues</p>
        </div>
        <Button 
          onClick={() => navigate("/bugs/new")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Bug
        </Button>
      </div>

      {/* Search + Filters */}
      <BugSearchInterface onSearch={handleSearch} isLoading={isSearching} />

      {/* Bug List Component */}
      <BugList filters={filters} />
    </div>
  );
}

export default BugsPage;