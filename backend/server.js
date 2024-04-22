require('dotenv').config({ path: '../.env' }); // Load environment variables from .env file

// Import required modules
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const sanitizeHtml = require('sanitize-html');
const OpenAI = require('openai');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Authentication middleware to verify JWT token in request headers
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Assuming token is sent as "Bearer <token>"
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Append userId to the request
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Initialize express application
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB client setup
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// OpenAI client setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize MongoDB connection 
let db;
const connectToMongoDB = async () => {
  try {
    await client.connect();
    db = client.db('study-sphere');
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    process.exit(1); // Exit in case of connection failure
  }
};

// Call this function when your server starts
connectToMongoDB();


// API endpoint for user registration
app.post('/api/signup', async (req, res) => {
  try {
    const users = db.collection('users');
    const { email, password, firstName, lastName } = req.body;
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { firstName, lastName, email, password: hashedPassword };
    await users.insertOne(newUser);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// API endpoint for user login
app.post('/api/login', async (req, res) => {
  try {
    const users = db.collection('users');
    const { email, password } = req.body;
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign(
        { userId: user._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.status(200).json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// API endpoint to create a new document, uses HTML sanitation to prevent XSS
app.post('/api/documents', authenticate, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.userId;
  const sanitizedContent = sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
    allowedAttributes: {
      'a': ['href', 'name', 'target'],
      'img': ['src']
    }
  });
  const newDocument = {
    title,
    content: sanitizedContent,
    userId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  try {
    const documents = db.collection('documents');
    await documents.insertOne(newDocument);
    res.status(201).json({ message: 'Document created successfully', document: newDocument });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// API endpoint to retrieve all documents for a user
app.get('/api/documents', authenticate, async (req, res) => {
  const userId = req.userId;
  try {
    const documents = db.collection('documents');
    const userDocuments = await documents.find({ userId: userId }).toArray();    res.status(200).json(userDocuments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API endpoint to fetch a specific document by ID
app.get('/api/documents/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const database = client.db('study-sphere');
    const documents = database.collection('documents');
    const document = await documents.findOne({ _id: new ObjectId(id), userId: req.userId });

    if (!document) {
      return res.status(404).send({ message: 'Document not found' });
    }
    console.log('Fetched document content:', document.content);

    res.status(200).json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
  }
});


// API endpoint to update a document
app.put('/api/documents/:id', authenticate, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.userId;
  const documentId = req.params.id;

  const sanitizedContent = sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
    allowedAttributes: {
      'a': ['href', 'name', 'target'],
      'img': ['src']
    }
  });

  const updatedDocument = {
    title,
    content: sanitizedContent,
    updatedAt: new Date()
  };

  try {
    const documents = db.collection('documents');
    const result = await documents.updateOne(
      { _id: new ObjectId(documentId), userId },
      { $set: updatedDocument }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json({ message: 'Document updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API endpoint to delete a document
app.delete('/api/documents/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const documents = db.collection('documents');
    const deletedDoc = await documents.deleteOne({ _id: new ObjectId(id) });

    if (deletedDoc.deletedCount === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Chatbot API endpoint for sending messages
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    if (response && response.choices && response.choices.length > 0) {
      const botMessage = response.choices[0].message.content;
      if (typeof botMessage === 'string') {
        res.json({ message: botMessage.trim() });
      } else {
        throw new Error("Received non-string response from AI");
      }
    } else {
      throw new Error("No response from AI");
    }
  } catch (error) {
    console.error('Error processing chat message with OpenAI:', error);
    res.status(500).send('Error processing your message: ' + error.message);
  }
});

// Setup Nodemailer transport using Mailtrap
var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
      user: process.env.MAILTRAP_USER,  // Use environment variable
      pass: process.env.MAILTRAP_PASS   // Use environment variable
  }
});
// Contact form endpoint to send an email
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
      let mailOptions = {
          from: '"Website Contact" <info@example.com>',
          to: 'your-email@example.com',  
          subject: `New Contact from ${name}`,
          text: `You have received a new message from ${email}: ${message}`,
          html: `<b>You have received a new message from ${email}:</b><p>${message}</p>`
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
      res.status(201).json({ message: 'Your message has been sent successfully. Thank you!' });
  } catch (error) {
      console.error("Failed to send message:", error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
// API endpoint to change user's password
app.post('/api/change-password', authenticate, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.userId;

  try {
    const users = db.collection('users');
    const user = await users.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: 'Invalid current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await users.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// API endpoint to delete a user account
app.delete('/api/delete-account', authenticate, async (req, res) => {
  const userId = req.userId;
  try {
    const users = db.collection('users');
    const documents = db.collection('documents');

    // Start by deleting the user's documents
    const deleteDocsResult = await documents.deleteMany({ userId: userId });
    console.log(`Deleted ${deleteDocsResult.deletedCount} documents for the user.`);

    // Then delete the user account
    const deleteUserResult = await users.deleteOne({ _id: new ObjectId(userId) });
    if (deleteUserResult.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Account and all associated documents deleted successfully' });
  } catch (error) {
    console.error("Failed to delete user account and documents:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// API endpoint to retrieve user details

app.get('/api/user', authenticate, async (req, res) => {
  const userId = req.userId;

  try {
    const users = db.collection('users');
    // Exclude password from the results
    const user = await users.findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});






// Start the server


  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });