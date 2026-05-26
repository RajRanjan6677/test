const express = require('express');
const cors = require('cors');

// Import the natural npm package for NLP operations
const natural = require('natural');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Example usage of the natural package (Sentiment Analysis / Tokenization)
app.post('/api/secondchance/analyze', (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text field is required for analysis' });
        }

        // Tokenize the input text using 'natural'
        const tokenizer = new natural.WordTokenizer();
        const tokens = tokenizer.tokenize(text);

        res.status(200).json({
            message: 'Text processed successfully using natural npm package',
            tokens: tokens,
            tokenCount: tokens.length
        });
    } catch (error) {
        res.status(500).json({ error: 'NLP analysis failed', message: error.message });
    }
});

app.get('/', (req, res) => {
    res.status(200).send('Index entry point with natural NLP package is active.');
});

app.listen(PORT, () => {
    console.log(`Index server running on port ${PORT}`);
});

module.exports = app;
