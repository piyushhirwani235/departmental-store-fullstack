const express = require('express');
const router = express.Router();
// 1. Make sure getMyOrders is imported here
const { createOrder, getMyOrders } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/orders - Create a new order
router.post('/', authMiddleware, createOrder);

// GET /api/orders/me - Get the logged-in user's orders
router.get('/me', authMiddleware, getMyOrders);

module.exports = router;