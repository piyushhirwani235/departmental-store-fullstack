import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminAddProduct = () => {
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', category: '' });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      const uniqueCategories = [...new Set(res.data.map(item => item.category))];
      setCategories(uniqueCategories);
      setFilteredCategories(uniqueCategories);
    } catch (error) { console.error(error); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, category: value });
    setFilteredCategories(categories.filter(cat => cat.toLowerCase().includes(value.toLowerCase())));
    setShowDropdown(true);
  };

  const selectCategory = (cat) => {
    setFormData({ ...formData, category: cat });
    setShowDropdown(false);
  };

  const handleAddNewCategory = () => {
    const newCat = formData.category.trim();
    if (newCat && !categories.includes(newCat)) {
      setCategories([...categories, newCat]);
      setShowDropdown(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categories.includes(formData.category.trim())) {
      setMessage('❌ Please select a valid category or add your new one.');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('name', formData.name); 
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('stock_quantity', formData.stock); 
      data.append('category', formData.category.trim());
      if (imageFile) data.append('image', imageFile);

      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage('✅ Product added successfully!');
      setFormData({ name: '', description: '', price: '', stock: '', category: '' });
      setImageFile(null);
      document.getElementById('imageInput').value = ""; 
    } catch (error) {
      setMessage('❌ Failed to add product.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="store-container" style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link to="/admin" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>← Back to Dashboard</Link>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3>Add New Product</h3>
        {message && <p style={{ fontWeight: 'bold', color: message.includes('❌') ? 'red' : 'green' }}>{message}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required style={{ padding: '8px' }} />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required style={{ padding: '8px', minHeight: '80px' }} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="number" name="price" placeholder="Price (₹)" value={formData.price} onChange={handleChange} required style={{ padding: '8px', flex: 1 }} />
            <input type="number" name="stock" placeholder="Initial Stock" value={formData.stock} onChange={handleChange} required style={{ padding: '8px', flex: 1 }} />
          </div>
          
          <div style={{ position: 'relative' }}>
            <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleCategoryChange} onFocus={() => setShowDropdown(true)} onBlur={() => setTimeout(() => setShowDropdown(false), 200)} required style={{ padding: '8px', width: '100%' }} />
            {showDropdown && (
              <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #ccc', listStyle: 'none', padding: 0, margin: 0, zIndex: 10 }}>
                {filteredCategories.map((cat, i) => <li key={i} onMouseDown={() => selectCategory(cat)} style={{ padding: '10px', cursor: 'pointer' }}>{cat}</li>)}
                <li onMouseDown={handleAddNewCategory} style={{ padding: '10px', color: 'blue', cursor: 'pointer' }}>+ Add "{formData.category}"</li>
              </ul>
            )}
          </div>
          
          <input type="file" id="imageInput" accept="image/*" onChange={handleFileChange} required style={{ padding: '8px' }} />
          <button type="submit" disabled={isLoading} style={{ padding: '10px', background: isLoading ? '#6c757d' : '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
            {isLoading ? 'Uploading to Cloudinary...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;