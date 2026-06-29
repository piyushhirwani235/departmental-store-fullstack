import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Save the token
      localStorage.setItem('token', res.data.token);
      
      // Print the exact data from your Node backend to the browser console
      console.log("BACKEND RESPONSE:", res.data);
      
      // Catch-all check: Look for the role inside a 'user' object OR directly on the data object
      const userRole = res.data?.user?.role || res.data?.role;
      console.log("REACT IDENTIFIED ROLE AS:", userRole);

      // Smart Redirect
      // Smart Redirect
      if (userRole === 'admin') {
        navigate('/admin'); // Fixed: Now leads directly to Admin Dashboard
      } else {
        navigate('/store'); // Fixed: Now leads to the Storefront
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Customer Login</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleChange} 
          required 
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
    </div>
  );
};

export default Login;