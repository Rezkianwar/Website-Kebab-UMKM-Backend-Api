const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama produk harus diisi"],
      trim: true,
      maxlength: [100, "Nama tidak boleh lebih dari 100 karakter"],
    },
    description: {
      type: String,
      required: [true, "Deskripsi produk harus diisi"],
      maxlength: [1000, "Deskripsi tidak boleh lebih dari 1000 karakter"],
    },
    price: {
      type: Number,
      required: [true, "Harga produk harus diisi"],
      min: [0, "Harga tidak boleh negatif"],
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, "Harga diskon tidak boleh negatif"],
    },
    category: {
      type: String,
      required: [true, "Kategori produk harus diisi"],
      enum: [
        "Kebab Daging",
        "Kebab Ayam",
        "Kebab Vegetarian",
        "Kebab Jumbo Mix",
        "Minuman",
        "Paket Hemat",
        "Lainnya",
      ],
    },
    tags: [String],
    ingredients: [String],
    imageUrl: {
      type: String,
      default: "no-image.jpg",
    },
    imagePublicId: {
      type: String, // Public ID dari Cloudinary
      default: null, // Default null jika tidak ada gambar Cloudinary
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    totalSold: {
      type: Number,
      default: 0,
      min: [0, "Total penjualan tidak boleh negatif"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
