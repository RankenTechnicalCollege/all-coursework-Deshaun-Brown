import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Filter, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

import type { Bug } from "@/types/bug";
import { useEffect } from "react";
import { showError } from "@/lib/utils";

export function BugsPage() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch bugs on mount
  useEffect(() => {
    if (!authLoading) {
      fetchBugs();
    }
  }, [authLoading]);

  const fetchBugs = async () => {
    setIsLoading(true);
    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
      const res = await fetch(`${base}/bugs`, { credentials: "include" });
      if (!res.ok) throw new Error(`Failed to fetch bugs (${res.status})`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.bugs || [];
      setBugs(list);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load bugs";
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter bugs
  const filteredBugs = bugs.filter((bug) => {
    const matchesSearch =
      bug.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || bug.closed === (statusFilter === "closed");
    return matchesSearch && matchesStatus;
  });

  // Sort bugs
  const sortedBugs = [...filteredBugs].sort((a, b) => {
    const aDate = new Date((a as any).createdAt || (a as any).createdOn || 0).getTime();
    const bDate = new Date((b as any).createdAt || (b as any).createdOn || 0).getTime();
    switch (sortBy) {
      case "newest":
        return bDate - aDate;
      case "oldest":
        return aDate - bDate;
      case "title":
        return (a.title || "").localeCompare(b.title || "");
      default:
        return 0;
    }
  });

  const getStatusIcon = (closed: boolean) => {
    if (closed) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    return <AlertCircle className="h-5 w-5 text-orange-600" />;
  };

  const getStatusBadge = (closed: boolean) => {
    if (closed) {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Closed</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">Open</span>;
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

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading bugs...</p>
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
          onClick={() => navigate("/bug/new")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Bug
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 bg-gray-50 p-6 rounded-lg border">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bugs by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Filter className="h-3.5 w-3.5" />
              Status
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              Sort By
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {sortedBugs.length} of {bugs.length} bugs
      </p>

      {/* Empty State */}
      {!isLoading && sortedBugs.length === 0 && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground text-lg">No bugs found matching your criteria.</p>
            <Button onClick={() => navigate("/bug/new")} variant="outline">
              Create the first bug
            </Button>
          </div>
        </div>
      )}

      {/* Bugs List */}
      {!isLoading && sortedBugs.length > 0 && (
        <div className="grid gap-4">
          {sortedBugs.map((bug) => (
            <div
              key={bug._id}
              onClick={() => navigate(`/bug/${bug._id}`)}
              className="p-4 border rounded-lg hover:shadow-md transition cursor-pointer bg-white"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left side - Bug info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(bug.closed)}
                    <h3 className="text-lg font-semibold truncate">{bug.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {bug.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>By {bug.createdBy}</span>
                    <span>•</span>
                    <span>{new Date((bug as any).createdAt || (bug as any).createdOn).toLocaleDateString()}</span>
                    {bug.classification && (
                      <>
                        <span>•</span>
                        <span className="capitalize px-2 py-1 bg-gray-100 rounded">
                          {bug.classification}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right side - Status badge */}
                <div className="flex-shrink-0">
                  {getStatusBadge(bug.closed)}
                </div>
              </div>

              {/* Footer - Additional info */}
              <div className="mt-3 pt-3 border-t flex flex-wrap gap-4 text-xs text-muted-foreground">
                {bug.assignedTo && (
                  <div>
                    <span className="font-medium">Assigned to:</span> {bug.assignedTo}
                  </div>
                )}
                {bug.classification && (
                  <div>
                    <span className="font-medium">Classified by:</span> {bug.classification}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BugsPage;