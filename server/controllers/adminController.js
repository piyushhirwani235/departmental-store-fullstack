const db = require('../config/db');

exports.getAllOrders = async (req, res) => {
    try {
        // Fetch all orders and join with the users table to get the customer's name
        const query = `
            SELECT o.order_id, o.total_amount, o.status, o.created_at, u.name, u.email 
            FROM orders o
            JOIN users u ON o.user_id = u.user_id
            ORDER BY o.created_at DESC
        `;
        const [orders] = await db.execute(query);
        res.json(orders);
    } catch (error) {
        console.error("Admin order fetch error:", error);
        res.status(500).json({ message: 'Server error fetching orders' });
    }
};
// ... existing getAllOrders code ...

// NEW: Update order status
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params; // The order ID from the URL
    const { status } = req.body; // The new status from the frontend

    try {
        await db.execute('UPDATE orders SET status = ? WHERE order_id = ?', [status, id]);
        res.json({ message: 'Order status updated successfully', order_id: id, status });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ message: 'Server error updating order' });
    }
};
// NEW: Fetch all unique categories from the products table
exports.getCategories = async (req, res) => {
    try {
        const [categories] = await db.execute('SELECT DISTINCT category FROM products WHERE category IS NOT NULL');
        // Extract just the strings into a flat array
        res.json(categories.map(c => c.category));
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: 'Server error fetching categories' });
    }
};

// UPDATED: addProduct function
exports.addProduct = async (req, res) => {
    const { name, description, price, category } = req.body;
    
    // Cloudinary automatically provides the secure cloud URL inside req.file.path
    const image_url = req.file ? req.file.path : null;

    try {
        const [result] = await db.execute(
            'INSERT INTO products (name, description, price, stock_quantity, category, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, 100, category.trim(), image_url]
        );
        res.status(201).json({ message: 'Product added successfully!', productId: result.insertId });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: 'Server error adding product' });
    }
};

// UPDATED: updateProduct function
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category } = req.body;

    try {
        if (req.file) {
            // If a new image is selected during an edit, update to the new cloud URL
            const image_url = req.file.path; 
            
            await db.execute(
                'UPDATE products SET name=?, description=?, price=?, category=?, image_url=? WHERE product_id=?',
                [name, description, price, category.trim(), image_url, id]
            );
        } else {
            // If no new image is provided, keep the existing image intact
            await db.execute(
                'UPDATE products SET name=?, description=?, price=?, category=? WHERE product_id=?',
                [name, description, price, category.trim(), id]
            );
        }
        res.json({ message: 'Product updated successfully!' });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: 'Server error updating product' });
    }
};
// NEW: Delete a product
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM products WHERE product_id = ?', [id]);
        res.json({ message: 'Product deleted successfully!' });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: 'Server error deleting product' });
    }
};
// Add this new function
exports.updateStockOnly = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock_quantity } = req.body;
        
        // Make sure you require 'db' at the top of this file if it isn't already!
        await db.execute('UPDATE products SET stock_quantity = ? WHERE product_id = ?', [stock_quantity, id]);
        res.status(200).json({ message: 'Stock updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating stock' });
    }
};