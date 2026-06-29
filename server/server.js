const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // <--- 1. Add this at the top

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// 2. Tell Express to serve the "images" folder publicly
app.use('/images', express.static(path.join(__dirname, 'images')));

// --- ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
    res.send('Departmental Store API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});