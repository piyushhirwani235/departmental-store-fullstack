const db = require('./config/db');
const bcrypt = require('bcryptjs');

const recoverAndReset = async () => {
    try {
        console.log("Searching for admin account...");
        
        // 1. Find the admin email
        const [users] = await db.execute('SELECT email FROM users WHERE role = ?', ['admin']);
        
        if (users.length === 0) {
            console.log('❌ Error: Could not find an admin account in the database.');
            process.exit();
        }

        const adminEmail = users[0].email;
        console.log(`\n📧 Found Admin Email: ${adminEmail}`);

        // 2. Encrypt the new password
        const newPassword = 'admin123'; 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 3. Update the database
        await db.execute(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashedPassword, adminEmail]
        );

        console.log('✅ Success! Your admin password has been reset to: admin123\n');
        process.exit();
        
    } catch (error) {
        console.error('❌ Database error:', error);
        process.exit(1);
    }
};

recoverAndReset();