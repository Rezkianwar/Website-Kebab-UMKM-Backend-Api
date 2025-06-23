// backend/middleware/upload.js
const multer = require("multer");

// Konfigurasi Multer untuk menyimpan file di memori
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Hanya izinkan tipe file gambar
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diizinkan!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Batas ukuran file 5MB
  },
});

module.exports = upload;
