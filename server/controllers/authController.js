const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGNUP LOGIC
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // 1. Check if user already exists
        const [existingUsers] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert into database
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// LOGIN LOGIC
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find user by email
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        // 2. Compare passwords
        // Note: If your old Flask app didn't hash passwords, you may need to clear your old DB rows or update them!
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // 3. Generate JWT Token
        const token = jwt.sign(
            { id: user.user_id, role: user.role || 'customer' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role  // <--- ADD THIS EXACT LINE
}
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};