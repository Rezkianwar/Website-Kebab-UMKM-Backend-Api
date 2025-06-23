const Customer = require("../models/Customer");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all customers
// @access  Private
// @route   GET /api/customers/count
exports.getCustomerCount = asyncHandler(async (req, res, next) => {
  const count = await Customer.countDocuments();
  res.status(200).json({ success: true, count });
});
// @route   GET /api/customers
exports.getCustomers = asyncHandler(async (req, res, next) => {
  const customers = await Customer.find();

  res.status(200).json({
    success: true,
    count: customers.length,
    data: customers,
  });
});

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
exports.getCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return next(
      new ErrorResponse(
        `Pelanggan dengan id ${req.params.id} tidak ditemukan`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: customer,
  });
});

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
exports.createCustomer = asyncHandler(async (req, res, next) => {
  console.log("Incoming Request Body:", req.body); // Log request body
  console.log("Email Received:", req.body.email); // Log email secara spesifik
  const customer = await Customer.create(req.body);

  res.status(201).json({
    success: true,
    data: customer,
  });
});

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
exports.updateCustomer = asyncHandler(async (req, res, next) => {
  let customer = await Customer.findById(req.params.id);

  if (!customer) {
    return next(
      new ErrorResponse(
        `Pelanggan dengan id ${req.params.id} tidak ditemukan`,
        404
      )
    );
  }

  customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: customer,
  });
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
exports.deleteCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return next(
      new ErrorResponse(
        `Pelanggan dengan id ${req.params.id} tidak ditemukan`,
        404
      )
    );
  }

  await customer.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
