import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminUpdateStock = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [stockInputs, setStockInputs] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      const grouped = res.data.reduce((acc, product) => {
        if (!acc[product.category]) acc[product.category] = [];
        acc[product.category].push(product);
        return acc;
      }, {});
      setProductsByCategory(grouped);
    } catch (error) { console.error(error); }
  };

  const handleStockChange = (productId, value) => {
    setStockInputs(prev => ({ ...prev, [productId]: value }));
  };

  const updateStock = async (productId) => {
    const newStock = stockInputs[productId];
    if (newStock === undefined || newStock === '') return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/products/${productId}/stock`, 
        { stock_quantity: newStock }, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert('Stock updated successfully!');
      
      // FIX: Clear the specific input box after success
      setStockInputs(prev => ({ ...prev, [productId]: '' }));
      
      fetchProducts(); 
    } catch (error) {
      alert('Failed to update stock');
    }
  };

  return (
    <div className="store-container" style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link to="/admin" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>← Back to Dashboard</Link>
        <h2>Quick Stock Update</h2>
      </header>

      {Object.keys(productsByCategory).map(category => (
        <div key={category} style={{ marginBottom: '2rem', background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginTop: 0 }}>{category}</h3>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            {productsByCategory[category].map(product => (
              <div key={product.product_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', border: '1px solid #eee', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={product.image_url} alt={product.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                  <strong>{product.name}</strong> 
                  <span style={{ color: '#666' }}>(Current Stock: {product.stock_quantity || 0})</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="number" placeholder="New Stock" value={stockInputs[product.product_id] || ''} onChange={(e) => handleStockChange(product.product_id, e.target.value)} style={{ padding: '5px', width: '100px' }} />
                  <button onClick={() => updateStock(product.product_id)} style={{ background: '#007bff', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>Update</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminUpdateStock;