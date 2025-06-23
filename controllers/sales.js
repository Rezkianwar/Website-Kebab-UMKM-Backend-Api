const Sale = require("../models/Sale");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
exports.getSales = asyncHandler(async (req, res, next) => {
  const sales = await Sale.find()
    .populate("customer", "name email phone")
    .populate("items.product", "name price")
    .populate("employee", "name");

  res.status(200).json({
    success: true,
    count: sales.length,
    data: sales,
  });
});

// @desc    Get sales by date range
// @route   GET /api/sales/range
// @access  Private
exports.getSalesByDateRange = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return next(
      new ErrorResponse("Tanggal awal dan akhir harus disediakan", 400)
    );
  }

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const sales = await Sale.find({
    createdAt: {
      $gte: start,
      $lte: end,
    },
  })
    .populate("customer", "name email phone")
    .populate("items.product", "name price")
    .populate("employee", "name");

  res.status(200).json({
    success: true,
    count: sales.length,
    data: sales,
  });
});

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
exports.createSale = asyncHandler(async (req, res, next) => {
  const sale = await Sale.create(req.body);
  res.status(201).json({ success: true, data: sale });
});

// @desc    Get recent sales
// @route   GET /api/sales/recent
// @access  Private
exports.getRecentSales = asyncHandler(async (req, res, next) => {
  const recentSales = await Sale.find()
    .sort({ createdAt: -1 }) // Terbaru terlebih dahulu
    .limit(5); // Ambil 5 transaksi terbaru

  res.status(200).json({
    success: true,
    data: recentSales,
  });
});

// @desc    Get single sale
// @route   GET /api/sales/:id
// @access  Private
exports.getSale = asyncHandler(async (req, res, next) => {
  const sale = await Sale.findById(req.params.id)
    .populate("customer", "name email phone")
    .populate("items.product", "name price")
    .populate("employee", "name");

  if (!sale) {
    return next(
      new ErrorResponse(
        `Penjualan dengan id ${req.params.id} tidak ditemukan`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: sale,
  });
});

// @desc    Update sale
// @route   PUT /api/sales/:id
// @access  Private
exports.updateSale = asyncHandler(async (req, res, next) => {
  let sale = await Sale.findById(req.params.id);

  if (!sale) {
    return next(
      new ErrorResponse(
        `Penjualan dengan id ${req.params.id} tidak ditemukan`,
        404
      )
    );
  }

  sale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: sale,
  });
});

// @desc    Delete sale
// @route   DELETE /api/sales/:id
// @access  Private
exports.deleteSale = asyncHandler(async (req, res, next) => {
  const sale = await Sale.findById(req.params.id);

  if (!sale) {
    return next(
      new ErrorResponse(
        `Penjualan dengan id ${req.params.id} tidak ditemukan`,
        404
      )
    );
  }

  await sale.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get sales statistics
// @route   GET /api/sales/stats
// @access  Private
exports.getSalesStats = asyncHandler(async (req, res, next) => {
  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get start of current month
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Get start of current year
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  // Get sales stats
  const todaySales = await Sale.aggregate([
    {
      $match: {
        createdAt: { $gte: today },
        paymentStatus: "Dibayar",
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  const monthlySales = await Sale.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfMonth },
        paymentStatus: "Dibayar",
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  const yearlySales = await Sale.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfYear },
        paymentStatus: "Dibayar",
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  // Get monthly sales breakdown
  const monthlyBreakdown = await Sale.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfYear },
        paymentStatus: "Dibayar",
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalSales: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      today:
        todaySales.length > 0
          ? todaySales[0]
          : { totalSales: 0, totalAmount: 0 },
      month:
        monthlySales.length > 0
          ? monthlySales[0]
          : { totalSales: 0, totalAmount: 0 },
      year:
        yearlySales.length > 0
          ? yearlySales[0]
          : { totalSales: 0, totalAmount: 0 },
      monthlyBreakdown,
    },
  });
});
