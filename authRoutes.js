const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db'); // Adjust path based on your structure
const { ObjectId } = require('mongodb');

// ==========================================
// 1. REGISTER NEW USER
// Route: POST /api/auth/register
// ==========================================
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields (name, email, password) are required.' });
        }

        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'A user with this email already exists.' });
        }

        const newUser = {
            name,
            email: email.toLowerCase(),
            password, // Note: In production, ensure you hash this password using bcrypt
            createdAt: new Date()
        };

        const result = await usersCollection.insertOne(newUser);
        res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed', message: error.message });
    }
});

// ==========================================
// 2. LOGIN USER
// Route: POST /api/auth/login
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        // Find the user by email
        const user = await usersCollection.findOne({ email: email.toLowerCase() });
        if (!user || user.password !== password) { // Simple text check (use bcrypt.compare in production)
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Return user info (excluding password for security)
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed', message: error.message });
    }
});

// ==========================================
// 3. UPDATE USER INFORMATION
// Route: PUT /api/auth/update/:id
// ==========================================
router.put('/update/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email } = req.body;

        if (!name && !email) {
            return res.status(400).json({ error: 'Please provide at least one field to update (name or email).' });
        }

        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        // Build the update document dynamically
        let updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email.toLowerCase();

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({ message: 'User profile updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Update failed', message: error.message });
    }
});

module.exports = router;
