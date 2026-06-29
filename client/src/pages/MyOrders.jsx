import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get('http://localhost:5000/api/orders/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setOrders(res.data);
      } catch (err) {
        setError('Failed to load your order history.');
      }
    };

    fetchMyOrders();
  }, [navigate]);

  return (
    <div className="store-container">
      <header className="store-header">
        <h2>My Order History</h2>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Back to Store
        </Link>
      </header>

      {error ? (
        <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>
          <h3>{error}</h3>
        </div>
      ) : (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '8px' }}>
              <h3>You haven't placed any orders yet.</h3>
              <Link to="/" style={{ display: 'inline-block', marginTop: '10px', padding: '10px 20px', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map(order => (
                <div key={order.order_id} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 10px 0' }}>Order #{order.order_id}</h4>
                    <p style={{ margin: 0, color: '#666' }}>Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#28a745' }}>₹{order.total_amount}</h3>
                    <span style={{ 
                      padding: '5px 10px', 
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