const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary using the keys from your .env file
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure the storage engine to automatically build folders in the cloud
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Group images dynamically by the category chosen in the form
        const category = req.body.category ? req.body.category.trim() : 'Uncategorized';
        
        return {
            folder: `DepartmentalStore/${category}`, 
            format: 'png', // Standardize all product uploads to PNG format
            public_id: req.body.name ? req.body.name.replace(/\s+/g, '_').toLowerCase() : 'product_' + Date.now(),
        };
    },
});

const upload = multer({ storage: storage });

module.exports = upload;