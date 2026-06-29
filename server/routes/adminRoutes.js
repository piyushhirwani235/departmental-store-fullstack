const express = require('express');
const router = express.Router();

// Import the entire controller object to handle both destructuring and specific references
const adminController = require('../controllers/adminController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Extract specific functions for cleaner route definitions
const { getAllOrders, updateOrderStatus, getCategories, addProduct, updateProduct, deleteProduct, updateStockOnly } = adminController;

router.get('/orders', authMiddleware, adminMiddleware, getAllOrders);
router.put('/orders/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

router.get('/categories', authMiddleware, adminMiddleware, getCategories);
router.post('/products', authMiddleware, adminMiddleware, upload.single('image'), addProduct);

// Updated Routes
router.put('/products/:id', authMiddleware, adminMiddleware, upload.single('image'), updateProduct);
router.delete('/products/:id', authMiddleware, adminMiddleware, deleteProduct);

// New Stock Route
router.put('/products/:id/stock', authMiddleware, adminMiddleware, updateStockOnly);

module.exports = router;