const ErrorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const User = require("../models/User");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Token diterima:", token); //
  }

  if (!token) {
    return next(new ErrorResponse("Tidak punya akses", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Verifikasi apakah decoded.id tersedia
    console.log("Decoded JWT:", decoded); // <-- Logging
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse("User tidak ditemukan", 404));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorResponse("Token tidak valid", 401));
  }
});
// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Role ${req.user.role} tidak diizinkan mengakses route ini`,
          403
        )
      );
    }
    next();
  };
};
