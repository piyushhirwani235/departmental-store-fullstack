const db = require('../config/db');

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { cartItems, totalAmount } = req.body;

        // 1. Create the main Order in the database
        const [orderResult] = await db.execute(
            'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
            [userId, totalAmount, 'Pending']
        );
        const orderId = orderResult.insertId;

        // 2. Loop through the cart items
        for (let item of cartItems) {
            // Log the item in the order_items table
            await db.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );

            // FIX: Subtract the purchased quantity from the inventory stock!
            await db.execute(
                'UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?',
                [item.quantity, item.product_id]
            );
        }

        res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// NEW: Fetch orders for the logged-in customer
exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id; // We get this securely from the auth middleware
        
        const [orders] = await db.execute(
            'SELECT order_id, total_amount, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        
        res.json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: 'Server error fetching your orders' });
    }
};