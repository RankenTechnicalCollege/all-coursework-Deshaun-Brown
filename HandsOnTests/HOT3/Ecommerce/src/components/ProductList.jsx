import { useState, useEffect } from 'react';
import './ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error Loading Products</h2>
        <p>{error}</p>
        <button onClick={fetchProducts}>Retry</button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty">
        <h2>No Products Found</h2>
        <p>There are no products in the database yet.</p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <header className="product-header">
        <h1>Product Catalog</h1>
        <p className="product-count">{products.length} product{products.length !== 1 ? 's' : ''} available</p>
      </header>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-category">{product.category}</div>
            <h3 className="product-name">{product.name}</h3>
            
            {product.description && (
              <p className="product-description">{product.description}</p>
            )}
            
            <div className="product-footer">
              <span className="product-price">${product.price.toFixed(2)}</span>
              <span className="product-id">ID: {product._id}</span>
            </div>
            
            {product.createdOn && (
              <div className="product-meta">
                <small>Added: {new Date(product.createdOn).toLocaleDateString()}</small>
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="refresh-button" onClick={fetchProducts}>
        Refresh Products
      </button>
    </div>
  );
}

export default ProductList;
