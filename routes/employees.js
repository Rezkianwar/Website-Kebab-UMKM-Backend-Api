// routes/employees.js
const express = require("express");
const router = express.Router();
const {
  getEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeCount,
} = require("../controllers/employees");

const { body, param } = require("express-validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");

// GET /api/employees
router.route("/").get(protect, getEmployees);

// GET /api/employees/count
router.route("/count").get(protect, getEmployeeCount);

// POST /api/employees
router
  .route("/")
  .post(
    [
      body("name").notEmpty().withMessage("Nama pegawai harus diisi"),
      body("email").isEmail().withMessage("Email tidak valid"),
      body("phone").notEmpty().withMessage("Nomor telepon harus diisi"),
      body("position")
        .isIn(["Manager", "Kasir", "Chef", "Pelayan", "Kurir", "Lainnya"])
        .withMessage("Posisi tidak valid"),
      body("salary")
        .isFloat({ gt: 0 })
        .withMessage("Gaji harus lebih besar dari 0"),
      body("address").notEmpty().withMessage("Alamat harus diisi"),
      validate,
    ],
    createEmployee
  );

// PUT /api/employees/:id
router
  .route("/:id")
  .get(
    [param("id").isMongoId().withMessage("ID pegawai tidak valid"), validate],
    getEmployee
  )
  .put(
    [
      param("id").isMongoId().withMessage("ID pegawai tidak valid"),
      body("name").optional().notEmpty().withMessage("Nama tidak boleh kosong"),
      body("email").optional().isEmail().withMessage("Email tidak valid"),
      validate,
    ],
    updateEmployee
  )
  .delete(
    [param("id").isMongoId().withMessage("ID pegawai tidak valid"), validate],
    deleteEmployee
  );

module.exports = router;
