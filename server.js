const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// In-memory products
let products = [];

// Routes
app.get('/', (req, res) => res.json({ message: "✅ KenyaMarket Backend Running" }));

app.get('/api/products', (req, res) => res.json(products));

app.post('/api/products', upload.single('image'), (req, res) => {
  const { name, price, category, description, seller } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const newProduct = {
    id: Date.now(),
    name,
    price: parseInt(price),
    category: category || "general",
    description: description || "",
    seller: seller || "Unknown",
    imageUrl,
    createdAt: new Date()
  };

  products.push(newProduct);
  res.json({ success: true, product: newProduct });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory database (you can later change to MongoDB)
let products = [];
let users = [];

// ====================== API ROUTES ======================

// Health Check
app.get('/', (req, res) => {
  res.json({ message: "✅ KenyaMarket Backend is Running!" });
});

// Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Add new product
app.post('/api/products', (req, res) => {
  const { name, price, category, description, seller } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ success: false, message: "Name and price are required" });
  }

  const newProduct = {
    id: Date.now(),
    name,
    price: parseInt(price),
    category: category || "general",
    description: description || "",
    seller: seller || "Unknown Seller",
    createdAt: new Date()
  };

  products.push(newProduct);
  res.status(201).json({ success: true, product: newProduct });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }

  if (password === "123456") {
    const role = email.includes("seller") ? "seller" : "customer";
    const user = {
      id: Date.now(),
      name: email.split('@')[0],
      email: email,
      role: role
    };
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  res.json({ success: true, message: "Product deleted" });
});

// Get seller's products
app.get('/api/seller/products', (req, res) => {
  res.json(products);
});

// Clear all data (for testing)
app.delete('/api/clear', (req, res) => {
  products = [];
  res.json({ success: true, message: "All data cleared" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 KenyaMarket Backend Running Successfully!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌐 Ready for frontend connection`);
});
