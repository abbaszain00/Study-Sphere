require('dotenv').config({ path: '../.env' });
const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());


const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

app.post('/api/signup', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('study-sphere');
    const users = database.collection('users');

    // Check if the user already exists
    const { email, password, firstName, lastName } = req.body;
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    const newUser = { firstName, lastName, email, password: hashedPassword };
    await users.insertOne(newUser);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
