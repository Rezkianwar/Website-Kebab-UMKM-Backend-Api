// backend/routes/products.js
const express = require("express");
const upload = require("../middleware/upload"); // Pastikan ini mengimpor middleware Multer yang sudah diubah
const router = express.Router();
const {
  getProducts,
  getProductCount,
  createProduct,
  getTopProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");

const { body, param } = require("express-validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");

// GET /api/products
router.route("/").get(protect, getProducts);
// GET /api/products/count
router.route("/count").get(protect, getProductCount);

// POST /api/products
router.route("/").post(
  // Menggunakan 'imageUrl' sebagai nama field file, sesuaikan dengan frontend
  upload.single("imageUrl"),
  [
    body("name").notEmpty().withMessage("Nama produk harus diisi"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Harga harus lebih besar dari 0"),
    body("description").notEmpty().withMessage("Deskripsi produk harus diisi"),
    body("category")
      .isIn([
        "Kebab Daging",
        "Kebab Ayam",
        "Kebab Vegetarian",
        "Kebab Jumbo Mix",
        "Minuman",
        "Paket Hemat",
        "Lainnya",
      ])
      .withMessage("Kategori tidak valid"),
    validate,
  ],
  createProduct
);

// GET /api/products/top
router.route("/top").get(protect, getTopProducts);

// GET /api/products/:id
router
  .route("/:id")
  .get(
    [param("id").isMongoId().withMessage("ID produk tidak valid"), validate],
    getProduct
  )
  .put(
    // Menggunakan 'imageUrl' sebagai nama field file, sesuaikan dengan frontend
    upload.single("imageUrl"),
    [
      param("id").isMongoId().withMessage("ID produk tidak valid"),
      body("name").optional().notEmpty().withMessage("Nama tidak boleh kosong"),
      body("price")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Harga harus lebih besar dari 0"),
      validate,
    ],
    updateProduct
  )
  .delete(
    [param("id").isMongoId().withMessage("ID produk tidak valid"), validate],
    deleteProduct
  );

module.exports = router;
