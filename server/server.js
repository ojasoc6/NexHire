const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:5501',
    'http://127.0.0.1:5501'
  ],
  credentials: true
}));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  family: 4
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const freelancerRoutes = require("./routes/freelancers");
app.use("/api/freelancers", freelancerRoutes);

const inquiryRoutes = require("./routes/inquiries");
app.use("/api/inquiries", inquiryRoutes);

const uploadRoutes = require("./routes/upload");
app.use("/api/upload", uploadRoutes);

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// Test route
app.get("/", (req, res) => {
  res.send("NexHire API running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));