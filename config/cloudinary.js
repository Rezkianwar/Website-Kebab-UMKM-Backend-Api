// config/cloudinary.js
const { v2: cloudinary } = require("cloudinary");

// Otomatis membaca CLOUDINARY_URL dari .env
cloudinary.config(true); // true = use environment variable

module.exports = cloudinary;
