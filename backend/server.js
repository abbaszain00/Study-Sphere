require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        // If you want to perform operations right after connecting, you can do it here
    } catch (e) {
        console.error("Failed to connect to MongoDB", e);
        // Ensures that the Node.js process exits properly on failure to connect
        process.exit(1);
    }
}

// Connect to MongoDB
connectDB().catch(console.error);

// Basic route for GET request
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
