const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama pelanggan harus diisi"],
      trim: true,
      maxlength: [100, "Nama tidak boleh lebih dari 100 karakter"],
    },
    email: {
      type: String,
      required: [true, "Email harus diisi"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
        "Email tidak valid",
      ],
    },
    phone: {
      type: String,
      required: [true, "Nomor telepon harus diisi"],
      maxlength: [20, "Nomor telepon tidak boleh lebih dari 20 karakter"],
    },
    address: {
      type: String,
      required: [true, "Alamat harus diisi"],
      maxlength: [500, "Alamat tidak boleh lebih dari 500 karakter"],
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      maxlength: [1000, "Catatan tidak boleh lebih dari 1000 karakter"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", CustomerSchema);
