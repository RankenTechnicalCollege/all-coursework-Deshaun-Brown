import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showError, showSuccess } from "@/lib/utils";
import { ArrowLeft, Trash2 } from "lucide-react";
import type { Product } from "@/types/product";

export function ProductEditorPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEditMode = productId && productId !== "new";

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setFetchingProduct(true);
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const response = await fetch(`${base}/api/products/${productId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const product: Product = await response.json();
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        category: product.category || "",
        stock: product.stock?.toString() || "",
      });
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load product");
      navigate("/products");
    } finally {
      setFetchingProduct(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return showError("Product name is required");
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      return showError("Valid price is required");
    }

    try {
      setLoading(true);
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const url = isEditMode
        ? `${base}/api/products/${productId}`
        : `${base}/api/products`;
      const method = isEditMode ? "PATCH" : "POST";

      const body = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category.trim(),
        stock: formData.stock ? parseInt(formData.stock, 10) : 0,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save product");
      }

      showSuccess(isEditMode ? "Product updated!" : "Product created!");
      navigate("/products");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditMode) return;
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      setDeleting(true);
      const base = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const response = await fetch(`${base}/api/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete product");
      }

      showSuccess("Product deleted successfully");
      navigate("/products");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  if (fetchingProduct) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/products")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Edit Product" : "Create Product"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the product"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Electronics, Clothing"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
              </Button>
              
              {isEditMode && (
                <Button
                  type="button"
                  variant="destructive"
                  disabled={deleting}
                  onClick={handleDelete}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProductEditorPage;