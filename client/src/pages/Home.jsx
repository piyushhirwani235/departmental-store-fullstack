import { useState, useEffect, useContext } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // NEW: State to manage which category accordions are open
  const [expandedCategories, setExpandedCategories] = useState({});
  
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateQuantity } = useContext(CartContext); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
        
        const uniqueCategories = [...new Set(res.data.map(p => p.category))];
        setCategories(['All', ...uniqueCategories]);
        
        // Open all accordions by default
        const initialExpanded = {};
        uniqueCategories.forEach(cat => initialExpanded[cat] = true);
        setExpandedCategories(initialExpanded);
      } catch (error) { console.error("Error fetching products", error); }
    };
    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const cartUniqueCount = cart.length;

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  // Helper for the +/- buttons
  const handleQuantityChange = (cartItem, change) => {
    const newQty = cartItem.quantity + change;
    if (newQty <= 0) {
      removeFromCart(cartItem.product_id);
    } else {
      updateQuantity(cartItem.product_id, newQty);
    }
  };

  // 1. Filter products based on search and dropdown
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 2. Group the filtered products by category for the accordion layout
  const productsByCategory = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <div className="store-container" style={{ padding: '2rem' }}>
      <header className="store-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8f9fa', marginBottom: '2rem', borderRadius: '8px' }}>
        <h2 style={{ margin: 0 }}>Storefront</h2>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/my-orders" style={{ fontWeight: 'bold', color: '#555', textDecoration: 'none' }}>📦 My Orders</Link>
          <Link to="/cart" style={{ fontWeight: 'bold', color: '#333', textDecoration: 'none' }}>🛒 Cart ({cartUniqueCount})</Link>
          <button onClick={handleLogout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input type="text" placeholder="🔍 Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: '1', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }} />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer', background: 'white' }}>
          {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Grouped Accordion View (Mirrors Admin View) */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {Object.keys(productsByCategory).length === 0 ? (
           <div style={{ textAlign: 'center', padding: '3rem', color: '#666', background: 'white', borderRadius: '8px' }}>
             <h3>No products found matching your search.</h3>
           </div>
        ) : (
          Object.keys(productsByCategory).map(category => (
            <div key={category} style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              
              {/* Accordion Header */}
              <div onClick={() => toggleCategory(category)} style={{ padding: '15px 20px', background: '#343a40', color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>{category} ({productsByCategory[category].length} items)</h3>
                <span>{expandedCategories[category] ? '▼' : '▶'}</span>
              </div>
              
              {/* Accordion Body */}
              {expandedCategories[category] && (
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {productsByCategory[category].map(product => {
                    
                    // Check if this specific product is already in the cart
                    const cartItem = cart.find(item => item.product_id === product.product_id);

                    return (
                      <div key={product.product_id} style={{ display: 'flex', gap: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
                        
                        {/* Left Side: Image */}
                        <img src={product.image_url} alt={product.name} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                        
                        {/* Right Side: Details & Cart Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                          <div>
                            <h3 style={{ margin: '0 0 5px 0' }}>{product.name}</h3>
                            <p style={{ margin: '0 0 5px 0', color: '#666' }}>{product.description}</p>
                            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#28a745', fontSize: '1.2rem' }}>₹{product.price}</p>
                          </div>
                          
                          <div style={{ marginTop: '15px' }}>
                            {!cartItem ? (
                              <button onClick={() => addToCart(product)} style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                Add to Cart
                              </button>
                            ) : (
                              <div style={{ display: 'inline-flex', alignItems: 'center', border: '2px solid #007bff', borderRadius: '4px', overflow: 'hidden' }}>
                                <button onClick={() => handleQuantityChange(cartItem, -1)} style={{ background: '#f8f9fa', border: 'none', padding: '8px 15px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>-</button>
                                <span style={{ padding: '0 20px', fontWeight: 'bold', fontSize: '1.1rem' }}>{cartItem.quantity}</span>
                                <button onClick={() => handleQuantityChange(cartItem, 1)} style={{ background: '#f8f9fa', border: 'none', padding: '8px 15px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>+</button>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default Home;