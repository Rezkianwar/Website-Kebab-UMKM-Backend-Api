const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: {
          type: Number,
          required: true,
          min: [1, "Jumlah minimal 1"],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: [
        "Tunai",
        "Kartu Kredit",
        "Kartu Debit",
        "Transfer Bank",
        "E-Wallet",
        "Lainnya",
      ],
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["Belum Dibayar", "Dibayar", "Dibatalkan"],
      default: "Belum Dibayar",
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ["Baru", "Diproses", "Siap", "Selesai", "Dibatalkan"],
      default: "Baru",
    },
    orderType: {
      type: String,
      required: true,
      enum: ["Dine-in", "Take Away", "Delivery"],
      default: "Dine-in",
    },
    notes: {
      type: String,
      maxlength: [500, "Catatan tidak boleh lebih dari 500 karakter"],
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
SaleSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    try {
      const date = new Date();
      const year = date.getFullYear().toString().substr(-2);
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);

      const todayStart = new Date(date.setHours(0, 0, 0, 0));
      const todayEnd = new Date(date.setHours(23, 59, 59, 999));

      const count = await this.constructor.countDocuments({
        createdAt: { $gte: todayStart, $lte: todayEnd },
      });

      this.orderNumber = `KB-${year}${month}${day}-${(count + 1)
        .toString()
        .padStart(4, "0")}`;
      console.log("Generated orderNumber:", this.orderNumber); // 🔍 Debugging
    } catch (err) {
      console.error("Gagal generate orderNumber:", err.message);
      throw new Error("Gagal membuat nomor penjualan");
    }
  }
  next();
});

module.exports = mongoose.model("Sale", SaleSchema);
