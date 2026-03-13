const db = require('./db');

// --- 1. FETCH ALL PRODUCTS ---
exports.getAllProducts = async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products');
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- 2. ADD A NEW PRODUCT ---
exports.addProduct = async (req, res) => {
    const { name, sku, category, price, stock_quantity, reorder_level } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO products (name, sku, category, price, stock_quantity, reorder_level) VALUES (?, ?, ?, ?, ?, ?)',
            [name, sku, category, price, stock_quantity, reorder_level]
        );
        res.status(201).json({ message: "Product added successfully", productId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// --- 3. UPDATE PRODUCT STOCK ---
exports.updateStock = async (req, res) => {
    const { id } = req.params; // Get ID from the URL
    const { stock_quantity } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE products SET stock_quantity = ? WHERE id = ?',
            [stock_quantity, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Stock updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- 4. DELETE A PRODUCT ---
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};