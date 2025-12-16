
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showError } from "@/lib/utils";
import type { Product } from "@/types/product";
import { ProductListItem } from "@/components/ProductListItem";
import { Search } from "lucide-react";

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [searchName]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const params = new URLSearchParams({
        sortBy: "newest",
        pageSize: "1000",
        ...(searchName && { name: searchName }),
      });

      const res = await fetch(`${base}/api/products?${params.toString()}`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch products (${res.status})`);
      }

      const data = await res.json();
      const productsList: Product[] = data?.products ?? [];
      setProducts(productsList);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load products";
      setError(msg);
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  // LOADING UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  // ERROR UI
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-red-600 text-4xl">⚠️</div>
          <p className="text-red-600 font-medium">{error}</p>
          <Button variant="outline" onClick={fetchProducts}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // EMPTY UI
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-4xl">📦</div>
          <p className="text-muted-foreground text-lg">
            {searchName ? "No products match your search." : "No products found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
        {searchName && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setSearchName("");
            }}
          >
            Clear
          </Button>
        )}
      </form>

      <p className="text-sm text-muted-foreground">
        Found {products.length} product{products.length !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {products.map((product, index) => (
          <div
            key={product._id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <ProductListItem item={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;