import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export interface SearchFilters {
  keywords: string;
  classification: string;
  maxAge: string;
  minAge: string;
  closed: boolean;
  sortBy: string;
}

interface BugSearchInterfaceProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

export function BugSearchInterface({ onSearch, isLoading = false }: BugSearchInterfaceProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    keywords: "",
    classification: "",
    maxAge: "",
    minAge: "",
    closed: false,
    sortBy: "newest",
  });

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, keywords: e.target.value }));
  };

  const handleClassificationChange = (value: string) => {
    setFilters((prev) => ({ ...prev, classification: value }));
  };

  const handleMaxAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, maxAge: e.target.value }));
  };

  const handleMinAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, minAge: e.target.value }));
  };

  const handleClosedChange = (checked: boolean) => {
    setFilters((prev) => ({ ...prev, closed: checked }));
  };

  const handleSortByChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sortBy: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      keywords: "",
      classification: "",
      maxAge: "",
      minAge: "",
      closed: false,
      sortBy: "newest",
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  return (
    <div className="space-y-6 bg-muted p-6 rounded-xl border">
      {/* Keywords Search Bar */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Keywords</Label>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search bug title or description..."
            value={filters.keywords}
            onChange={handleKeywordsChange}
            disabled={isLoading}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleSearch}
            disabled={isLoading}
            title="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Classification Filter */}
      <div className="space-y-2">
        <Label htmlFor="classification" className="text-sm font-medium">
          Classification
        </Label>
        <Select value={filters.classification} onValueChange={handleClassificationChange}>
          <SelectTrigger id="classification" className="w-full max-w-sm">
            <SelectValue placeholder="All Classifications" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bug">Bug</SelectItem>
            <SelectItem value="feature">Feature</SelectItem>
            <SelectItem value="enhancement">Enhancement</SelectItem>
            <SelectItem value="documentation">Documentation</SelectItem>
            <SelectItem value="duplicate">Duplicate</SelectItem>
            <SelectItem value="invalid">Invalid</SelectItem>
            <SelectItem value="Validation">Validation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Age Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maxAge" className="text-sm font-medium">
            Max Age (days)
          </Label>
          <Input
            id="maxAge"
            type="number"
            placeholder="e.g., 7"
            value={filters.maxAge}
            onChange={handleMaxAgeChange}
            disabled={isLoading}
            min="0"
          />
          <p className="text-xs text-muted-foreground">Show bugs created in last X days</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minAge" className="text-sm font-medium">
            Min Age (days)
          </Label>
          <Input
            id="minAge"
            type="number"
            placeholder="e.g., 30"
            value={filters.minAge}
            onChange={handleMinAgeChange}
            disabled={isLoading}
            min="0"
          />
          <p className="text-xs text-muted-foreground">Show bugs older than X days</p>
        </div>
      </div>

      {/* Closed Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="closed"
          checked={filters.closed}
          onCheckedChange={(checked) => handleClosedChange(checked as boolean)}
          disabled={isLoading}
        />
        <Label htmlFor="closed" className="text-sm font-medium cursor-pointer">
          Include Closed Bugs
        </Label>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <Label htmlFor="sortBy" className="text-sm font-medium">
          Sort By
        </Label>
        <Select value={filters.sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger id="sortBy" className="w-full max-w-sm">
            <SelectValue placeholder="Newest" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="classification">Classification</SelectItem>
            <SelectItem value="assignedTo">Assigned To</SelectItem>
            <SelectItem value="createdBy">Reported By</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <Button onClick={handleSearch} disabled={isLoading} className="flex-1">
          {isLoading ? "Searching..." : "Search"}
        </Button>
        <Button variant="outline" onClick={handleReset} disabled={isLoading} className="flex-1">
          Reset
        </Button>
      </div>
    </div>
  );
}

export default BugSearchInterface;
