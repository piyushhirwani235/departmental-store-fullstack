import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get('http://localhost:5000/api/admin/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setOrders(res.data);
      } catch (err) {
        setError('Not authorized to view this page or failed to load data.');
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setOrders(orders.map(order => 
        order.order_id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      alert('Failed to update status. Please try again.');
    }
  };

  return (
    <div className="store-container">
      <header className="store-header">
        <h2>Order Management</h2>
        <Link to="/admin" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Back to Dashboard
        </Link>
      </header>

      {error ? (
        <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}><h3>{error}</h3></div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#343a40', color: 'white', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>Order ID</th>
                <th style={{ padding: '12px' }}>Date</th>
                <th style={{ padding: '12px' }}>Customer Name</th>
                <th style={{ padding: '12px' }}>Total Amount</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No orders found.</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order.order_id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '12px' }}>#{order.order_id}</td>
                    <td style={{ padding: '12px' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '12px' }}>
                      <strong>{order.name}</strong> <br/>
                      <span style={{ fontSize: '0.85rem', color: '#666' }}>{order.email}</span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#28a745' }}>₹{order.total_amount}</td>
                    <td style={{ padding: '12px' }}>
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                        style={{
                          padding: '5px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          backgroundColor: order.status === 'Pending' ? '#ffc107' : 
                                           order.status === 'Processing' ? '#17a2b8' : 
                                           order.status === 'Cancelled' ? '#dc3545' : '#28a745',
                          color: order.status === 'Pending' ? '#333' : 'white',
                          border: '1px solid #ccc',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;