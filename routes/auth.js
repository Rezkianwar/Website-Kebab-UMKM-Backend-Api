const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  updatePassword,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");
const { body, query } = require("express-validator");
const validate = require("../middleware/validate");

// POST /api/auth/register
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Nama harus diisi"),
    body("email").isEmail().withMessage("Email tidak valid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password minimal 6 karakter"),
    validate,
  ],
  register
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email tidak valid"),
    body("password").exists().withMessage("Password harus diisi"),
    validate,
  ],
  login
);

// PUT /api/auth/updatepassword
router.put(
  "/updatepassword",
  protect,
  [
    body("currentPassword").exists().withMessage("Password lama harus diisi"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password baru minimal 6 karakter"),
    validate,
  ],
  updatePassword
);

// Admin & Staff route - hanya admin dan staff yang bisa akses
// router.get("/admin/dashboard", protect, authorize("admin"), (req, res) => {
//   res.status(200).json({
//     success: true,
//     data: "Ini adalah dashboard admin",
//   });
// });

// GET /api/auth/me
router.get("/me", protect, getMe);

// POST /api/auth/logout
router.post("/logout", logout);

module.exports = router;
