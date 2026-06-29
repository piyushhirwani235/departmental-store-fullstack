import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // Sends admin back to the login page
  };

  const cardStyle = {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '2rem', background: 'white',
    borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textDecoration: 'none', color: '#333', minHeight: '150px',
    transition: 'transform 0.2s'
  };

  return (
    <div className="store-container" style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Admin Control Center</h2>
        {/* FIX: Admin Logout Button */}
        <button onClick={handleLogout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Logout Admin
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <Link to="/admin/add-product" style={cardStyle}><h1 style={{ margin: 0, fontSize: '3rem' }}>📦</h1><h3 style={{ marginTop: '1rem' }}>Add New Product</h3></Link>
        <Link to="/admin/update-stock" style={cardStyle}><h1 style={{ margin: 0, fontSize: '3rem' }}>📊</h1><h3 style={{ marginTop: '1rem' }}>Update Stock</h3></Link>
        <Link to="/admin/products" style={cardStyle}><h1 style={{ margin: 0, fontSize: '3rem' }}>📋</h1><h3 style={{ marginTop: '1rem' }}>View All Products</h3></Link>
        <Link to="/admin/orders" style={cardStyle}><h1 style={{ margin: 0, fontSize: '3rem' }}>🛒</h1><h3 style={{ marginTop: '1rem' }}>View Orders</h3></Link>
      </div>
    </div>
  );
};

export default AdminDashboard;