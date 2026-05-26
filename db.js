const { MongoClient } = require('mongodb');

// Connection URL and Database Name
const url = 'mongodb://localhost:27017';
const dbName = 'inventory_db';
const client = new MongoClient(url);

async function connectDB() {
    try {
        // Connect the client to the server
        await client.connect();
        console.log('Successfully connected to MongoDB server');
        
        const db = client.db(dbName);
        return db;
    } catch (error) {
        console.error('Connection to MongoDB failed:', error);
        process.exit(1);
    }
}

module.exports = connectDB;
