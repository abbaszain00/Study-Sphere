require('dotenv').config({ path: '../.env' });
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const sanitizeHtml = require('sanitize-html');
const OpenAI = require('openai');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
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


const app = express();
app.use(express.json());
app.use(cors());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize MongoDB connection once
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

// Modified routes will use the 'db' variable to access the database

// Note: Make sure to handle authentication and validation as before

//Sign Up Route
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


//Signin Route
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


// Create a new document
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


// Get all documents
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


app.get('/api/documents/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    // await client.connect();
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
    // await client.close();
  }
});


// Update a document
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

// Delete a document
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

//Send Chatbot message
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    // Make sure to update this with the correct method to create chat completions according to OpenAI SDK version you are using
    const response = await openai.chat.completions.create({
      model: "text-embedding-3-small",
      messages: [{ role: "user", content: userMessage }],
    });
    res.json({ message: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error('Error processing chat message with OpenAI:', error);
    if (error.response && error.response.status === 429) {
      res.status(429).send('Too many requests, please try again later.');
    } else {
      res.status(500).send('Error processing your message.');
    }
  }
});

// Create a reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// In your contact route:
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    let mailOptions = {
      from: '"Website Contact" <info@example.com>',
      to: 'admin@example.com',
      subject: `New Contact from ${name}`,
      text: `You have received a new message from ${email}: ${message}`,
      html: `<b>You have received a new message from ${email}:</b><p>${message}</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

    const contacts = db.collection('contacts');
    await contacts.insertOne({ name, email, subject, message, createdAt: new Date() });
    res.status(201).json({ message: 'Your message has been sent successfully. Thank you!' });
  } catch (error) {
    console.error("Failed to send message or save in DB:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});






  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });