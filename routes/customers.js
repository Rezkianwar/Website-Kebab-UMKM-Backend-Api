// routes/customers.js
const express = require("express");
const router = express.Router();
const {
  getCustomers,
  getCustomerCount,
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customers");

const { body, param } = require("express-validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");

// GET /api/customers
router.route("/").get(protect, getCustomers);

// GET /api/customers/count
router.route("/count").get(protect, getCustomerCount);

// POST /api/customers
router
  .route("/")
  .post(
    [
      body("name").notEmpty().withMessage("Nama pelanggan harus diisi"),
      body("email").isEmail().withMessage("Email tidak valid"),
      body("phone").notEmpty().withMessage("Nomor telepon harus diisi"),
      body("address").notEmpty().withMessage("Alamat harus diisi"),
      validate,
    ],
    createCustomer
  );

// GET /api/customers/:id
router
  .route("/:id")
  .get(
    [param("id").isMongoId().withMessage("ID pelanggan tidak valid"), validate],
    getCustomer
  )
  .put(
    [
      param("id").isMongoId().withMessage("ID pelanggan tidak valid"),
      body("name").optional().notEmpty().withMessage("Nama tidak boleh kosong"),
      body("email").optional().isEmail().withMessage("Email tidak valid"),
      validate,
    ],
    updateCustomer
  )
  .delete(
    [param("id").isMongoId().withMessage("ID pelanggan tidak valid"), validate],
    deleteCustomer
  );

module.exports = router;
