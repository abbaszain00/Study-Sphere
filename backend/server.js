const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Basic route for GET request
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
