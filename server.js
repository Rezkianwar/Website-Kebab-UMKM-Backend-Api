// backend/server.js
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require("./routes/auth");
const products = require("./routes/products");
const customers = require("./routes/customers");
const employees = require("./routes/employees");
const sales = require("./routes/sales");

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security middleware
app.use(helmet());
app.use(cors());
// app.use(mongoSanitize());
// app.use(xss());
// Middleware sanitasi manual (aman untuk req.body & req.query)
app.use((req, res, next) => {
  const sanitizeInput = (input) => {
    if (typeof input === "string") {
      // Anda bisa menambahkan logika sanitasi di sini
      // Misalnya, membersihkan karakter berbahaya atau membatasi panjang
      // Untuk XSS, Anda bisa menggunakan DOMPurify atau xss-clean jika tidak dikomentari
    }
    return input;
  };

  if (req.query) {
    for (let key in req.query) {
      req.query[key] = sanitizeInput(req.query[key]);
    }
  }

  if (req.body) {
    for (let key in req.body) {
      req.body[key] = sanitizeInput(req.body[key]);
    }
  }

  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use("/api/", limiter);

// Prevent http param pollution
app.use(hpp());

// --- PENTING: Hapus atau modifikasi baris ini jika semua gambar akan dari Cloudinary ---
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Jika Anda tidak lagi melayani gambar lokal, hapus baris di atas.
// Jika Anda masih memiliki gambar lama yang dilayani lokal, pertahankan.
// Namun, rekomendasi saya adalah memigrasikan semua ke Cloudinary untuk konsistensi.
// --- AKHIR PENTING ---

// Mount routers
app.use("/api/auth", auth);
app.use("/api/products", products);
app.use("/api/customers", customers);
app.use("/api/employees", employees);
app.use("/api/sales", sales);

// Basic route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Serve static files from React build folder in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "public")));

  // app.get("*", (req, res) => {
  //   res.sendFile(path.join(__dirname, "public", "index.html"));
  // });
}

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
