const express = require('express');
const cors = require('cors');
const authController = require('./authController');
const productController = require('./productController'); // Import Product Logic
const authMiddleware = require('./authMiddleware'); // Import the Guard
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// --- AUTH ROUTES ---
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

// --- PRODUCT ROUTES (PROTECTED) ---
// Note how we put 'authMiddleware' in the middle. 
// It must pass the middleware before it reaches the controller!
app.get('/api/products', authMiddleware, productController.getAllProducts);
app.post('/api/products', authMiddleware, productController.addProduct);
// Update a specific product (PUT)
app.put('/api/products/:id', authMiddleware, productController.updateStock);

// Delete a specific product (DELETE)
app.delete('/api/products/:id', authMiddleware, productController.deleteProduct);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
