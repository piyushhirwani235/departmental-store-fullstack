import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const AdminEditProduct = () => {
  const { id } = useParams(); // Gets the ID from the URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '' });
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch the single product to populate the form
    const fetchProduct = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        const product = res.data.find(p => p.product_id === parseInt(id));
        if (product) {
          setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category
          });
          setCurrentImage(product.image_url);
        }
      } catch (error) { console.error(error); }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('name', formData.name); 
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      if (imageFile) data.append('image', imageFile);

      await axios.put(`http://localhost:5000/api/admin/products/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Product updated successfully!');
      navigate('/admin/products'); // Send back to inventory list
    } catch (error) {
      setMessage('❌ Failed to update product.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="store-container" style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link to="/admin/products" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>← Back to Inventory</Link>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3>Edit Product #{id}</h3>
        {message && <p style={{ color: 'red', fontWeight: 'bold' }}>{message}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ padding: '8px' }} />
          <textarea name="description" value={formData.description} onChange={handleChange} required style={{ padding: '8px', minHeight: '80px' }} />
          <input type="number" name="price" value={formData.price} onChange={handleChange} required style={{ padding: '8px' }} />
          <input type="text" name="category" value={formData.category} onChange={handleChange} required style={{ padding: '8px' }} />
          
          <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>Current Image:</p>
            {currentImage && <img src={currentImage} alt="Current" style={{ width: '80px', borderRadius: '4px' }} />}
            <p style={{ margin: '10px 0 5px 0', fontSize: '0.9rem' }}>Upload New Image (Leave blank to keep existing):</p>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <button type="submit" disabled={isLoading} style={{ padding: '10px', background: isLoading ? '#6c757d' : '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
            {isLoading ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProduct;