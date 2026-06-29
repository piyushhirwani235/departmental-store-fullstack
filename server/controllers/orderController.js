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
        // Let's print exactly what the token decoded to!
        console.log("DECODED USER FROM TOKEN:", req.user);

        // Account for different common naming conventions
        const userId = req.user.id || req.user.userId || req.user._id;

        // Safety check: Stop the crash before it hits the database
        if (!userId) {
            return res.status(400).json({ message: "User ID is missing from the token payload" });
        }

        const [orders] = await db.execute(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [userId] 
        );
        
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: "Server error fetching orders" });
    }
};