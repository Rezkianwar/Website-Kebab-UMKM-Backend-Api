const Employee = require("../models/Employee");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
exports.getEmployees = asyncHandler(async (req, res, next) => {
  const employees = await Employee.find();

  res.status(200).json({
    success: true,
    count: employees.length,
    data: employees,
  });
});

// @desc    Get employee count
// @route   GET /api/employees/count
// @access  Private
exports.getEmployeeCount = asyncHandler(async (req, res, next) => {
  const count = await Employee.countDocuments();
  res.status(200).json({ success: true, count });
});

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(
      new ErrorResponse(
        `Pegawai dengan id ${req.params.id} tidak ditemukan`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: employee,
  });
});

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private
exports.createEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.create(req.body);

  res.status(201).json({
    success: true,
    data: employee,
  });
});

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
exports.updateEmployee = asyncHandler(async (req, res, next) => {
  let employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(
      new ErrorResponse(
        `Pegawai dengan id ${req.params.id} tidak ditemukan`,
        404
      )
    );
  }

  employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: employee,
  });
});

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
exports.deleteEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(
      new ErrorResponse(
        `Pegawai dengan id ${req.params.id} tidak ditemukan`,
        404
      )
    );
  }

  await employee.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
