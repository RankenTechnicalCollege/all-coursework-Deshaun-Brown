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
import { Search, Plus, Filter, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

import { BugList } from "@/components/BugList";

export function BugsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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
          onClick={() => navigate("/bug/new")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Bug
        </Button>
      </div>

      {/* Search and Filters */}
<div className="space-y-4 bg-muted p-6 rounded-xl border overflow-visible">
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
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Filter by status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All</SelectItem>
    <SelectItem value="open">Open</SelectItem>
    <SelectItem value="in_progress">In Progress</SelectItem>
    <SelectItem value="closed">Closed</SelectItem>
  </SelectContent>
</Select>

          </div>

          {/* Sort By */}
          <div className="space-y-2">
  <label className="text-sm font-medium text-muted-foreground">
    Sort By
  </label>

  <Select value={sortBy} onValueChange={setSortBy}>
    <SelectTrigger className="w-[200px]">
      <SelectValue placeholder="Sort bugs" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="newest">Newest First</SelectItem>
      <SelectItem value="oldest">Oldest First</SelectItem>
      <SelectItem value="priority-high">Highest Priority</SelectItem>
      <SelectItem value="priority-low">Lowest Priority</SelectItem>
      <SelectItem value="title-az">Title A → Z</SelectItem>
      <SelectItem value="title-za">Title Z → A</SelectItem>
    </SelectContent>
  </Select>
</div>

        </div>
      </div>

      {/* Bug List Component */}
      <BugList />
    </div>
  );
}

export default BugsPage;