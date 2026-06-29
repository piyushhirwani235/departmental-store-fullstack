import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        // 1. Retrieve the token from storage
        const token = localStorage.getItem('token'); 
        
        // 2. Pass the token securely in the headers using backticks for the URL
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching order history", error);
        setError("Failed to load your order history");
      }
    };

    fetchOrderHistory();
  }, []);

  return (
    <div className="store-container" style={{ padding: '2rem' }}>
      <header className="store-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>My Order History</h2>
        
        {/* IMPORTANT: Make sure '/store' matches exactly what is in your App.jsx routes for the storefront! */}
        <Link to="/store" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
          ← Back to Store
        </Link>
      </header>

      {error ? (
        <div style={{ color: '#dc3545', textAlign: 'center', marginTop: '2rem', background: '#f8d7da', padding: '1rem', borderRadius: '8px' }}>
          <h3>{error}</h3>
        </div>
      ) : (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#555', marginBottom: '1.5rem' }}>You haven't placed any orders yet.</h3>
              <Link to="/home" style={{ display: 'inline-block', padding: '10px 25px', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map(order => (
                <div key={order.order_id} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>Order #{order.order_id}</h4>
                    <p style={{ margin: 0, color: '#666' }}>Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#28a745', fontSize: '1.5rem' }}>₹{order.total_amount}</h3>
                    <span style={{ 
                      padding: '5px 12px', 
                      borderRadius: '4px', 
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      backgroundColor: order.status === 'Pending' ? '#ffc107' : 
                                       order.status === 'Processing' ? '#17a2b8' : 
                                       order.status === 'Cancelled' ? '#dc3545' : '#28a745',
                      color: order.status === 'Pending' ? '#333' : 'white'
                    }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrders;