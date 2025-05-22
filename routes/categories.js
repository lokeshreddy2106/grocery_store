const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'grocery_store'
});

// Get all categories
router.get('/', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results);
  });
});

// Get category by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('SELECT * FROM categories WHERE category_id = ?', [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(results[0]);
  });
});

// Create new category (admin only)
router.post('/', (req, res) => {
  const { name, description, image_url } = req.body;
  
  db.query(
    'INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)',
    [name, description, image_url],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({
        id: result.insertId,
        message: 'Category created successfully'
      });
    }
  );
});

// Update category (admin only)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, image_url } = req.body;
  
  db.query(
    'UPDATE categories SET name = ?, description = ?, image_url = ? WHERE category_id = ?',
    [name, description, image_url, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json({ message: 'Category updated successfully' });
    }
  );
});

// Delete category (admin only)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM categories WHERE category_id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  });
});

// Get products in category
router.get('/:id/products', (req, res) => {
  const { id } = req.params;
  
  db.query(
    'SELECT * FROM products WHERE category_id = ?',
    [id],
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