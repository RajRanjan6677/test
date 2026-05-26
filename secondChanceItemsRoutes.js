const express = require('express');
const router = express.Router();
const multer = require('multer');
const { connectToDatabase } = require('../db'); // Assuming db.js is in the parent/config folder
const { ObjectId } = require('mongodb');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ==========================================
// 1. GET ALL ITEMS
// Route: /api/secondchance/items
// ==========================================
router.get('/items', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('secondHandItems');
        const items = await collection.find({}).toArray();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items', message: error.message });
    }
});

// ==========================================
// 2. GET ITEM BY ID
// Route: /api/secondchance/items/:id
// ==========================================
router.get('/items/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('secondHandItems');
        const item = await collection.findOne({ _id: new ObjectId(req.params.id) });
        
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch item', message: error.message });
    }
});

// ==========================================
// 3. POST NEW ITEM (With File Upload)
// Route: /api/secondchance/items
// ==========================================
router.post('/items', upload.single('file'), async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('secondHandItems');

        const newItem = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            condition: req.body.condition,
            price: parseFloat(req.body.price),
            createdAt: new Date(),
            // Save file info if an image/file was uploaded
            imageName: req.file ? req.file.originalname : null,
            imageData: req.file ? req.file.buffer.toString('base64') : null 
        };

        const result = await collection.insertOne(newItem);
        res.status(201).json({ message: 'Item added successfully', itemId: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add item', message: error.message });
    }
});

// ==========================================
// 4. DELETE ITEM BY ID
// Route: /api/secondchance/items/:id
// ==========================================
router.delete('/items/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('secondHandItems');
        
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Item not found or already deleted' });
        }

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item', message: error.message });
    }
});

module.exports = router;
