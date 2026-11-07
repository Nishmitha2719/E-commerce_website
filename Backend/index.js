const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;
const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/ecommerce";
const jwtSecret = process.env.JWT_SECRET || "secret_ecom";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// PERF: uploaded file names include a timestamp and never change, so browsers can
// cache them for a long time instead of re-downloading every product image on each visit.
app.use('/images', express.static(path.join(__dirname, 'upload/images'), {
  maxAge: '30d',
  immutable: true,
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'upload/images')),
  filename: (req, file, cb) => cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
});

const upload = multer({ storage });

mongoose.connect(mongoURL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));

app.post("/upload", upload.single('product'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: 0, message: "No file uploaded" });
  res.json({ success: 1, image_url: `http://localhost:${port}/images/${req.file.filename}` });
});

const Product = mongoose.model("Product", {
  id: { type: Number, required: true, index: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true, index: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true }
});

const Users = mongoose.model('Users', {
  name: { type: String },
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now }
});

const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).json({ errors: "Please authenticate using valid token" });
  try {
    const data = jwt.verify(token, jwtSecret);
    req.user = data.user;
    next();
  } catch {
    res.status(401).json({ errors: "Please authenticate using a valid token" });
  }
};

app.post('/signup', async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.username || !req.body.password)
      return res.status(400).json({ success: false, errors: "Missing required fields" });
    const email = req.body.email.trim().toLowerCase();
    const existingUser = await Users.findOne({ email }).lean();
    if (existingUser) return res.status(400).json({ success: false, errors: "existing user found with same email address" });

    let cart = {};
    for (let i = 0; i < 300; i++) cart[i] = 0;

    const user = new Users({
      name: req.body.username,
      email,
      password: req.body.password,
      cartData: cart
    });

    await user.save();
    const token = jwt.sign({ user: { id: user._id } }, jwtSecret);
    res.json({ success: true, token });
  } catch {
    res.status(500).json({ success: false });
  }
});

app.post('/login', async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.password)
      return res.status(400).json({ success: false, errors: "Missing email or password" });

    const user = await Users.findOne({ email: req.body.email.trim().toLowerCase() }).lean();
    if (!user) return res.json({ success: false, errors: "Wrong Email Id" });

    const passCompare = req.body.password === user.password;
    if (!passCompare) return res.json({ success: false, errors: "Wrong Password" });

    const token = jwt.sign({ user: { id: user._id } }, jwtSecret);
    res.json({ success: true, token });
  } catch {
    res.status(500).json({ success: false });
  }
});

// PERF: .lean() returns plain objects (much faster than full Mongoose documents for read-only lists).
app.get('/allproducts', async (req, res) => {
  try {
    const products = await Product.find({}).lean();
    res.json(products);
  } catch {
    res.status(500).json({ success: false });
  }
});

app.post('/addtocart', fetchUser, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, errors: "User not authenticated" });

    const { itemId } = req.body;
    const userId = req.user.id;
    const user = await Users.findById(userId);
    if (!user) return res.status(404).json({ success: false, errors: "User not found" });

    user.cartData[itemId] = (user.cartData[itemId] || 0) + 1;
    user.markModified('cartData');
    await user.save();

    res.json({ success: true, message: `Item ${itemId} added to cart` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, errors: "Internal server error" });
  }
});

app.post('/removefromcart', fetchUser, async (req, res) => {
  try {
    const { itemId } = req.body;
    const user = await Users.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, errors: "User not found" });

    if (user.cartData[itemId] > 0) {
      user.cartData[itemId] -= 1;
      user.markModified('cartData');
      await user.save();
    }

    res.json({ success: true, message: `Item ${itemId} removed from cart` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, errors: "Internal server error" });
  }
});

app.post('/getcart', fetchUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select('cartData').lean();
    if (!user) return res.status(404).json({ success: false, errors: "User not found" });
    res.json(user.cartData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// PERF: previously loaded every product and sliced in JavaScript.
// Same result (last 8 products, never the very first one), but only 8 documents are read.
app.get('/newcollections', async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const skip = Math.max(1, total - 8);
    const newcollection = await Product.find({}).sort({ _id: 1 }).skip(skip).lean();
    res.json(newcollection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, errors: "Internal server error" });
  }
});

// PERF: let MongoDB return just 4 women's products instead of all of them.
app.get('/popularinwomen', async (req, res) => {
  try {
    const popular_in_women = await Product.find({ category: "women" }).sort({ _id: 1 }).limit(4).lean();
    res.json(popular_in_women);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, errors: "Internal server error" });
  }
});

app.post('/addproduct', async (req, res) => {
  try {
    if (!req.body.name || !req.body.image || !req.body.category || !req.body.new_price || !req.body.old_price) {
      return res.status(400).json({ success: false, errors: "Missing required product fields" });
    }

    // PERF: only fetch the highest id instead of every product
    const last = await Product.findOne({}).sort({ id: -1 }).select('id').lean();
    let id = last ? last.id + 1 : 1;

    const product = new Product({
      id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
      available: req.body.available !== false
    });

    await product.save();
    res.json({ success: true, message: "Product added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, errors: "Internal server error" });
  }
});

app.post('/removeproduct', async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({ success: false, errors: "Product ID is required" });
    }

    await Product.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, errors: "Internal server error" });
  }
});

app.listen(port, () =>
    console.log("Server Running on Port " + port));
