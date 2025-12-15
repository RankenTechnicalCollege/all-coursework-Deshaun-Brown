import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BugSearchInterface,  } from "@/components/BugSearchInterface";
import type { SearchFilters } from "@/components/BugSearchInterface";
import { BugList } from "@/components/BugList";

export function BugListPage() {
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    keywords: "",
    classification: "",
    maxAge: "",
    minAge: "",
    closed: false,
    sortBy: "newest",
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Bug Search</h1>
          <p className="text-muted-foreground mt-2">Find and filter bugs with advanced search</p>
        </div>
        <Button 
          onClick={() => navigate("/bug/new")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Bug
        </Button>
      </div>

      {/* Search Interface */}
      <BugSearchInterface onSearch={handleSearch} isLoading={isSearching} />

      {/* Bug List */}
      <BugList 
        filters={searchFilters}
        key={JSON.stringify(searchFilters)}
      />
    </div>
  );
}

export default BugListPage;
