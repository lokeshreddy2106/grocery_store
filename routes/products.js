const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'grocery_store'
});

// Get all products
router.get('/', (req, res) => {
  const query = `
    SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.category_id
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results);
  });
});

// Get products by category
router.get('/category/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  
  db.query(
    'SELECT * FROM products WHERE category_id = ?',
    [categoryId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(results);
    }
  );
});

// Add new product (admin only)
router.post('/', (req, res) => {
  const { name, description, category_id, price, stock_qty, image_url } = req.body;
  
  db.query(
    'INSERT INTO products (name, description, category_id, price, stock_qty, image_url) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description, category_id, price, stock_qty, image_url],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ id: result.insertId, message: 'Product added successfully' });
    }
  );
});

// Update product (admin only)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, category_id, price, stock_qty, image_url } = req.body;
  
  db.query(
    'UPDATE products SET name = ?, description = ?, category_id = ?, price = ?, stock_qty = ?, image_url = ? WHERE product_id = ?',
    [name, description, category_id, price, stock_qty, image_url, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product updated successfully' });
    }
  );
});

// Delete product (admin only)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM products WHERE product_id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

// Search products
router.get('/search', (req, res) => {
  const { query } = req.query;
  
  db.query(
    'SELECT * FROM products WHERE name LIKE ? OR description LIKE ?',
    [`%${query}%`, `%${query}%`],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(results);
    }
  );
});

module.exports = router; 