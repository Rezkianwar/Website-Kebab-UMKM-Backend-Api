const express = require("express");
const router = express.Router();
const {
  getSales,
  getSalesByDateRange,
  getSale,
  createSale,
  getRecentSales,
  updateSale,
  deleteSale,
  getSalesStats,
} = require("../controllers/sales");

const { body, param, query } = require("express-validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");

// GET /api/sales
router.route("/").get(protect, getSales);

// GET /api/sales/recent
router.route("/recent").get(protect, getRecentSales);

// POST /api/sales
router
  .route("/")
  .get(getSales)
  .post(
    [
      body("items")
        .isArray({ min: 1 })
        .withMessage("Harus ada setidaknya satu item"),
      body("items.*.product").isMongoId().withMessage("ID produk tidak valid"),
      body("items.*.name").notEmpty().withMessage("Nama produk harus diisi"),
      body("items.*.price")
        .isFloat({ gt: 0 })
        .withMessage("Harga harus lebih besar dari 0"),
      body("items.*.quantity")
        .isInt({ gt: 0 })
        .withMessage("Jumlah harus lebih besar dari 0"),
      body("totalAmount")
        .isFloat({ gt: 0 })
        .withMessage("Total amount harus lebih besar dari 0"),
      body("paymentMethod")
        .isIn([
          "Tunai",
          "Kartu Kredit",
          "Kartu Debit",
          "Transfer Bank",
          "E-Wallet",
          "Lainnya",
        ])
        .withMessage("Metode pembayaran tidak valid"),
      body("orderType")
        .isIn(["Dine-in", "Take Away", "Delivery"])
        .withMessage("Tipe pesanan tidak valid"),
      validate,
    ],
    createSale
  );

// GET /api/sales/range
router
  .route("/range")
  .get(
    [
      query("startDate").isISO8601().toDate().optional(),
      query("endDate").isISO8601().toDate().optional(),
      validate,
    ],
    getSalesByDateRange
  );

// GET /api/sales/stats
router.route("/stats").get(getSalesStats);

router
  .route("/:id")
  .get(
    [param("id").isMongoId().withMessage("ID penjualan tidak valid"), validate],
    getSale
  )
  .put(
    [
      param("id").isMongoId().withMessage("ID penjualan tidak valid"),
      body("paymentStatus")
        .optional()
        .isIn(["Belum Dibayar", "Dibayar", "Dibatalkan"])
        .withMessage("Status pembayaran tidak valid"),
      body("orderStatus")
        .optional()
        .isIn(["Baru", "Diproses", "Siap", "Selesai", "Dibatalkan"])
        .withMessage("Status pesanan tidak valid"),
      validate,
    ],
    updateSale
  )
  .delete(
    [param("id").isMongoId().withMessage("ID penjualan tidak valid"), validate],
    deleteSale
  );

module.exports = router;
