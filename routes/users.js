const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

// Create connection pool instead of single connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Lokesh',
    database: 'grocery_store',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Register user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log('Received registration request:', { name, email }); // Log registration attempt

        // Input validation
        if (!name || !email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Get connection from pool
        const connection = await pool.getConnection();

        try {
            // Check if user exists
            const [existingUsers] = await connection.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (existingUsers.length > 0) {
                console.log('User already exists:', email);
                return res.status(400).json({
                    success: false,
                    message: 'User already exists'
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            console.log('Attempting to insert new user:', email);

            // Insert user
            const [result] = await connection.query(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [name, email, hashedPassword]
            );

            console.log('User inserted successfully, ID:', result.insertId);

            // Get the created user
            const [newUser] = await connection.query(
                'SELECT user_id, name, email FROM users WHERE user_id = ?',
                [result.insertId]
            );

            // Create JWT token
            const token = jwt.sign(
                { id: result.insertId },
                process.env.JWT_SECRET || 'your_jwt_secret_key',
                { expiresIn: '1h' }
            );

            // Send success response
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                token,
                user: {
                    id: newUser[0].user_id,
                    name: newUser[0].name,
                    email: newUser[0].email
                }
            });

        } catch (err) {
            console.error('Database operation error:', err);
            throw err;
        } finally {
            // Release connection back to pool
            connection.release();
        }
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: err.message
        });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Get connection from pool
        const connection = await pool.getConnection();

        try {
            // Find user
            const [users] = await connection.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (users.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const user = users[0];

            // Verify password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Create JWT token
            const token = jwt.sign(
                { id: user.user_id },
                process.env.JWT_SECRET || 'your_jwt_secret_key',
                { expiresIn: '1h' }
            );

            // Send success response
            res.json({
                success: true,
                token,
                user: {
                    id: user.user_id,
                    name: user.name,
                    email: user.email
                }
            });

        } finally {
            // Release connection back to pool
            connection.release();
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// Verify token endpoint
router.get('/verify', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your_jwt_secret_key'
        );

        // Get connection from pool
        const connection = await pool.getConnection();

        try {
            // Get user data
            const [users] = await connection.query(
                'SELECT user_id, name, email FROM users WHERE user_id = ?',
                [decoded.id]
            );

            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                valid: true,
                user: users[0]
            });

        } finally {
            // Release connection back to pool
            connection.release();
        }
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({
            success: false,
            valid: false,
            message: 'Invalid token'
        });
    }
});

module.exports = router; 