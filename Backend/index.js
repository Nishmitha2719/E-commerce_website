const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require('jsonwebtoken');

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'upload/images')),
  filename: (req, file, cb) =>
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
});

const upload = multer({ storage });

mongoose.connect(
  "mongodb+srv://nishmithashetty:greatstackdev@cluster0.eqor1gu.mongodb.net/"
)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Connection Error:", err));

app.post("/upload", upload.single('product'), (req, res) => {
  if (!req.file)
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});

const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true }
});

const Users = mongoose.model('Users', {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now }
});

const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Please authenticate using valid token" 
    });

  try {
    const data = jwt.verify(token, 'secret_ecom');
    req.user = data.user;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid token" 
    });
  }
};
try {
  const res = await fetch("http://localhost:4000/allproducts");
  if (!res.ok) throw new Error("Backend not ready");
  const data = await res.json();
  setProducts(data);
} catch (err) {
  console.error("Backend connection failed", err);
}

app.post('/signup', async (req, res) => {
  try {
    if (!req.body.email || !req.body.username || !req.body.password)
      return res.json({
        success: false,
        message: "All fields required" 
      });

    const email = req.body.email.toLowerCase();
    const existingUser = await Users.findOne({ email });

    if (existingUser)
      return res.json({
        success: false,
        message: "User already exists" 
      });

    let cart = {};
    for (let i = 0; i < 300; i++) cart[i] = 0;

    const user = new Users({
      name: req.body.username,
      email,
      password: req.body.password,
      cartData: cart
    });

    await user.save();
    const token = jwt.sign({ user: { id: user._id } }, 'secret_ecom');

    res.json({
      success: true,
      token,
      message: "Signup successful" 
    });

  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post('/login', async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email.toLowerCase() });

    if (!user)
      return res.json({
        success: false,
        message: "Wrong Email Id" 
      });

    if (req.body.password !== user.password)
      return res.json({
        success: false,
        message: "Wrong Password" 
      });

    const token = jwt.sign({ user: { id: user._id } }, 'secret_ecom');
    res.json({
      success: true,
      token,
      message: "Login successful" 
    });

  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/allproducts', async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

app.post('/addtocart', fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });

  userData.cartData[req.body.itemId] += 1;

  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );

  res.json({
    success: true,
    message: "Item added to cart" 
  });
});

app.post('/removefromcart', fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });

  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;

  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );

  res.json({
    success: true,
    message: "Item removed"
  });
});

app.post('/getcart', fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  res.json(user.cartData);
});

app.get('/newcollections', async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  res.send(newcollection);
});

app.get('/popularinwomen', async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular_in_women = products.slice(0, 4);
  res.send(popular_in_women);
});

app.listen(port, () =>
  console.log("Server Running on Port " + port)
);
