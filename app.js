const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./db'); // Adjust path based on your file structure

// Import route modules
const secondChanceItemsRoutes = require('./routes/secondChanceItemsRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Global database connection initialization (optional but recommended)
connectToDatabase()
    .then(() => console.log('Database initialized successfully.'))
    .catch(err => console.error('Database initialization failed:', err));

// ==========================================
// API Routes
// ==========================================

// Base items endpoints (handles /api/secondchance/items, etc.)
app.use('/api/secondchance', secondChanceItemsRoutes);

// Search endpoint (handles /api/secondchance/search)
app.use('/api/secondchance/search', searchRoutes);

// Root health check route
app.get('/', (req, res) => {
    res.status(200).send('SecondChance API is running smoothly.');
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
