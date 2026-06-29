import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // This automatically recalculates when quantities change!
  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleQuantityChange = (cartItem, change) => {
    const newQty = cartItem.quantity + change;
    if (newQty <= 0) {
      removeFromCart(cartItem.product_id);
    } else {
      updateQuantity(cartItem.product_id, newQty);
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/');

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        { cartItems: cart, totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('✅ Order placed successfully! Stock updated.');
      clearCart();
      setTimeout(() => navigate('/store'), 3000); 
    } catch (error) {
      setMessage('❌ Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="store-container" style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Your Shopping Cart</h2>
        {/* FIX: Link now goes to /store */}
        <Link to="/store" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Back to Store
        </Link>
      </header>

      {message && <div style={{ padding: '1rem', background: '#d4edda', color: '#155724', marginBottom: '1rem', borderRadius: '4px', fontWeight: 'bold' }}>{message}</div>}

      {cart.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '2rem' }}>Your cart is empty.</p>
      ) : (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {cart.map((item) => (
              <li key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '1.5rem 0' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={item.image_url} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <h3 style={{ margin: '0 0 5px 0' }}>{item.name}</h3>
                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>₹{item.price} each</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                  {/* FIX: Dynamic Quantity Controls in Cart */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
                    <button onClick={() => handleQuantityChange(item, -1)} style={{ background: '#f8f9fa', border: 'none', borderRight: '1px solid #ccc', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                    <span style={{ padding: '0 15px', fontWeight: 'bold' }}>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item, 1)} style={{ background: '#f8f9fa', border: 'none', borderLeft: '1px solid #ccc', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                  </div>
                  
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem', minWidth: '80px', textAlign: 'right' }}>₹{item.price * item.quantity}</span>
                  
                  <button onClick={() => removeFromCart(item.product_id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          
          <div style={{ textAlign: 'right', marginTop: '2rem', borderTop: '2px solid #333', paddingTop: '1rem' }}>
            <h2 style={{ margin: '0 0 1rem 0' }}>Total: ₹{totalAmount}</h2>
            <button onClick={handleCheckout} disabled={isLoading} style={{ background: isLoading ? '#6c757d' : '#28a745', color: 'white', border: 'none', padding: '15px 30px', fontSize: '1.2rem', cursor: isLoading ? 'not-allowed' : 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
              {isLoading ? 'Processing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;