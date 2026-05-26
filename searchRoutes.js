const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db'); // Adjust path as necessary

// ====================================================================
// GET Search / Filter Items
// Route: /api/secondchance/search
// Example: /api/secondchance/search?category=Electronics
// ====================================================================
router.get('/', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('secondHandItems');

        // Initialize an empty query object
        let query = {};

        // Check if a category query parameter is provided in the URL
        if (req.query.category) {
            // Using a case-insensitive regular expression for flexible matching
            query.category = { $regex: new RegExp(req.query.category, 'i') };
        }

        // Fetch the filtered items from the collection
        const filteredItems = await collection.find(query).toArray();

        // Return the results
        res.status(200).json(filteredItems);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to search items', 
            message: error.message 
        });
    }
});

module.exports = router;
