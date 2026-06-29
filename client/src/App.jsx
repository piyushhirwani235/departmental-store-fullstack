import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Customer Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminAddProduct from './pages/AdminAddProduct';
import AdminEditProduct from './pages/AdminEditProduct'; // NEW
import AdminUpdateStock from './pages/AdminUpdateStock';
import AdminViewProducts from './pages/AdminViewProducts';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Login />} />          {/* 1. Root goes to Login */}
          <Route path="/store" element={<Home />} />      {/* 2. Store moved here */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/my-orders" element={<MyOrders />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/add-product" element={<AdminAddProduct />} />
          <Route path="/admin/edit-product/:id" element={<AdminEditProduct />} /> {/* 3. Edit Route */}
          <Route path="/admin/update-stock" element={<AdminUpdateStock />} />
          <Route path="/admin/products" element={<AdminViewProducts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;