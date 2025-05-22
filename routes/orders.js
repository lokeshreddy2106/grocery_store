const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'grocery_store'
});

// Create new order
router.post('/', async (req, res) => {
  const { user_id, items, total_amount, delivery_address } = req.body;

  try {
    // Start transaction
    await db.promise().beginTransaction();

    // Create order
    const [orderResult] = await db.promise().query(
      'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
      [user_id, total_amount]
    );

    const order_id = orderResult.insertId;

    // Create order items
    for (const item of items) {
      await db.promise().query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order_id, item.product_id, item.quantity, item.price]
      );

      // Update product stock
      await db.promise().query(
        'UPDATE products SET stock_qty = stock_qty - ? WHERE product_id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Create delivery record
    await db.promise().query(
      'INSERT INTO delivery (order_id, delivery_address) VALUES (?, ?)',
      [order_id, delivery_address]
    );

    // Commit transaction
    await db.promise().commit();

    res.json({ 
      order_id,
      message: 'Order created successfully'
    });

  } catch (err) {
    // Rollback transaction on error
    await db.promise().rollback();
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's orders
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT o.*, d.delivery_address, d.delivery_status,
           JSON_ARRAYAGG(
             JSON_OBJECT(
               'product_id', oi.product_id,
               'quantity', oi.quantity,
               'price', oi.price,
               'name', p.name
             )
           ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.product_id
    LEFT JOIN delivery d ON o.order_id = d.order_id
    WHERE o.user_id = ?
    GROUP BY o.order_id
    ORDER BY o.order_date DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results);
  });
});

// Get order details
router.get('/:orderId', (req, res) => {
  const { orderId } = req.params;

  const query = `
    SELECT o.*, d.delivery_address, d.delivery_status,
           JSON_ARRAYAGG(
             JSON_OBJECT(
               'product_id', oi.product_id,
               'quantity', oi.quantity,
               'price', oi.price,
               'name', p.name
             )
           ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.product_id
    LEFT JOIN delivery d ON o.order_id = d.order_id
    WHERE o.order_id = ?
    GROUP BY o.order_id
  `;

  db.query(query, [orderId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(results[0]);
  });
});

// Update order status (admin only)
router.put('/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  db.query(
    'UPDATE orders SET status = ? WHERE order_id = ?',
    [status, orderId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json({ message: 'Order status updated successfully' });
    }
  );
});

// Update delivery status (admin only)
router.put('/:orderId/delivery', (req, res) => {
  const { orderId } = req.params;
  const { delivery_status } = req.body;

  db.query(
    'UPDATE delivery SET delivery_status = ? WHERE order_id = ?',
    [delivery_status, orderId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Delivery record not found' });
      }
      res.json({ message: 'Delivery status updated successfully' });
    }
  );
});

module.exports = router; 