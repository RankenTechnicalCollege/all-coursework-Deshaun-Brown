import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export interface UserSearchFilters {
  keywords: string;
  role: string;
  maxAge: string;
  minAge: string;
  sortBy: string;
}

interface UserSearchInterfaceProps {
  onSearch: (filters: UserSearchFilters) => void;
  isLoading?: boolean;
}

export function UserSearchInterface({ onSearch, isLoading = false }: UserSearchInterfaceProps) {
  const [filters, setFilters] = useState<UserSearchFilters>({
    keywords: "",
    role: "",
    maxAge: "",
    minAge: "",
    sortBy: "name",
  });

  const handleKeywordsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, keywords: e.target.value }));
  };

  const handleRoleChange = (value: string) => {
    setFilters((prev) => ({ ...prev, role: value }));
  };

  const handleMaxAgeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, maxAge: e.target.value }));
  };

  const handleMinAgeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, minAge: e.target.value }));
  };

  const handleSortByChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sortBy: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    const reset: UserSearchFilters = {
      keywords: "",
      role: "",
      maxAge: "",
      minAge: "",
      sortBy: "name",
    };
    setFilters(reset);
    onSearch(reset);
  };

  return (
    <div className="space-y-6 bg-muted p-6 rounded-xl border">
      {/* Keywords */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Keywords</Label>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search name or email..."
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

      {/* Role */}
      <div className="space-y-2">
        <Label htmlFor="role" className="text-sm font-medium">
          Role
        </Label>
        <Select value={filters.role} onValueChange={handleRoleChange}>
          <SelectTrigger id="role" className="w-full max-w-sm">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DEV">Developer</SelectItem>
            <SelectItem value="QA">Quality Analyst</SelectItem>
            <SelectItem value="BA">Business Analyst</SelectItem>
            <SelectItem value="PM">Product Manager</SelectItem>
            <SelectItem value="TM">Technical Manager</SelectItem>
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
          <p className="text-xs text-muted-foreground">Users created in last X days</p>
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
          <p className="text-xs text-muted-foreground">Users older than X days</p>
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <Label htmlFor="sortBy" className="text-sm font-medium">
          Sort By
        </Label>
        <Select value={filters.sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger id="sortBy" className="w-full max-w-sm">
            <SelectValue placeholder="Given Name" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Given Name</SelectItem>
            <SelectItem value="role">Role</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
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

export default UserSearchInterface;
