import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { showError, showSuccess } from "@/lib/utils";
import type { Product } from "@/types/product";
import { Package } from "lucide-react";

export function ProductEditorPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | undefined>();
  const [isLoading, setIsLoading] = useState(!!productId);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) return;
    
    setIsLoading(true);
    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const response = await fetch(`${base}/api/products/${productId}`, { 
        credentials: 'include' 
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          showError("Please log in to edit products.");
          navigate("/login");
          return;
        }
        throw new Error(`Failed to fetch product (${response.status})`);
      }
      
      const data = await response.json();
      setProduct(data);
      setFormData({
        name: data.name || "",
        description: data.description || "",
        price: data.price?.toString() || "",
        category: data.category || "",
        stock: data.stock?.toString() || "0",
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch product";
      showError(errorMsg);
      console.error("Fetch product error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.name.trim() || !formData.description.trim() || !formData.price || !formData.category.trim()) {
      showError("Please fill in all required fields");
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      showError("Price must be a positive number");
      return;
    }

    const stock = formData.stock ? parseInt(formData.stock) : 0;
    if (isNaN(stock) || stock < 0) {
      showError("Stock must be a non-negative number");
      return;
    }

    setIsSaving(true);

    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const endpoint = product?._id 
        ? `${base}/api/products/${product._id}`
        : `${base}/api/products/new`;
      const method = product?._id ? 'PATCH' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          price,
          category: formData.category.trim(),
          stock,
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to save product (${response.status})`);
      }
      
      const message = product?._id ? "Product updated successfully!" : "Product created successfully!";
      showSuccess(message);
      
      setTimeout(() => {
        navigate("/products");
      }, 1500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save product";
      showError(errorMsg);
      console.error("Save product error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/products");
  };

  // Loading state
  if (isLoading && productId) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl flex items-center gap-2">
              <Package className="h-8 w-8" />
              {productId ? "Edit Product" : "Create Product"}
            </CardTitle>
            <CardDescription>
              {productId ? "Update product information" : "Add a new product to your catalog"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSaving}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed product description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isSaving}
                  rows={4}
                  required
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  disabled={isSaving}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="e.g., Electronics, Clothing, Food"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={isSaving}
                  required
                />
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                  disabled={isSaving}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? "Saving..." : (productId ? "Update Product" : "Create Product")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProductEditorPage;
