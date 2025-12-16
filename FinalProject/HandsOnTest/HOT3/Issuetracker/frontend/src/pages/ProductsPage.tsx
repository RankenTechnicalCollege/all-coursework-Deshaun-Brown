import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductList } from "@/components/ProductList";

export function ProductsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-2">Manage your product catalog</p>
        </div>
        <Button 
          onClick={() => navigate("/products/new")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Product
        </Button>
      </div>

      {/* Product List */}
      <ProductList />
    </div>
  );
}

export default ProductsPage;