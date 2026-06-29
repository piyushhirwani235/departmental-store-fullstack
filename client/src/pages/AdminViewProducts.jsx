import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminViewProducts = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      const grouped = res.data.reduce((acc, product) => {
        if (!acc[product.category]) acc[product.category] = [];
        acc[product.category].push(product);
        return acc;
      }, {});
      setProductsByCategory(grouped);
      
      const initialExpanded = {};
      Object.keys(grouped).forEach(cat => initialExpanded[cat] = true);
      setExpandedCategories(initialExpanded);
    } catch (error) { console.error(error); }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts(); 
    } catch (error) { alert("Failed to delete product."); }
  };

  return (
    <div className="store-container" style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link to="/admin" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>← Back to Dashboard</Link>
        <h2>Complete Inventory</h2>
      </header>

      {Object.keys(productsByCategory).map(category => (
        <div key={category} style={{ marginBottom: '1rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div onClick={() => toggleCategory(category)} style={{ padding: '15px 20px', background: '#343a40', color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>{category} ({productsByCategory[category].length} items)</h3>
            <span>{expandedCategories[category] ? '▼' : '▶'}</span>
          </div>
          
          {expandedCategories[category] && (
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {productsByCategory[category].map(product => (
                <div key={product.product_id} style={{ display: 'flex', gap: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
                  
                  {/* Left Side: Image */}
                  <img src={product.image_url} alt={product.name} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                  
                  {/* Right Side: Details & Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0' }}>{product.name}</h3>
                      <p style={{ margin: '0 0 5px 0', color: '#666' }}>{product.description}</p>
                      <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#28a745' }}>₹{product.price}</p>
                      <p style={{ margin: 0 }}>Stock: {product.stock_quantity}</p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                      {/* FIX: Edit Button routing to new page */}
                      <Link to={`/admin/edit-product/${product.product_id}`}>
                        <button style={{ background: '#ffc107', color: '#333', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Edit Product</button>
                      </Link>
                      <button onClick={() => handleDelete(product.product_id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminViewProducts;