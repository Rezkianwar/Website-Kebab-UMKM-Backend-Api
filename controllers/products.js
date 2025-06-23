const Product = require("../models/Product");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const cloudinary = require("../config/cloudinary");
// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  console.log("Fetching all products");
  const products = await Product.find();

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

// @desc    Get product count
// @route   GET /api/products/count
// @access  Public
exports.getProductCount = asyncHandler(async (req, res, next) => {
  const count = await Product.countDocuments();
  res.status(200).json({ success: true, count });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private
exports.createProduct = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    price,
    category,
    isAvailable,
    discountPrice,
    tags,
    ingredients,
  } = req.body;

  let imageUrl = "no-image.jpg"; // Default
  let imagePublicId = null; // Default

  // Jika ada file gambar di-upload melalui Multer
  if (req.file) {
    try {
      // Konversi buffer file ke base64 data URI
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

      // Unggah ke Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "product_images", // Opsional: folder di Cloudinary Anda
        resource_type: "auto", // Deteksi tipe file secara otomatis
      });

      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return next(
        new ErrorResponse("Gagal mengunggah gambar ke Cloudinary", 500)
      );
    }
  }

  const product = await Product.create({
    name,
    description,
    price,
    discountPrice: discountPrice || 0,
    category,
    tags: tags ? JSON.parse(tags) : [], // Jika tags dikirim sebagai stringified JSON
    ingredients: ingredients ? JSON.parse(ingredients) : [], // Jika ingredients dikirim sebagai stringified JSON
    imageUrl, // URL gambar dari Cloudinary
    imagePublicId, // Public ID dari Cloudinary
    isAvailable: isAvailable === "true" || isAvailable === true,
  });

  res.status(201).json({
    success: true,
    data: product,
  });
});

// @desc    Get top products by sales
// @route   GET /api/products/top
// @access  Private
exports.getTopProducts = asyncHandler(async (req, res, next) => {
  const topProducts = await Product.find()
    .sort({ totalSold: -1 }) // Urutkan berdasarkan total penjualan turun
    .limit(5); // Ambil 5 produk terlaris

  res.status(200).json({
    success: true,
    data: topProducts,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(
        `Produk dengan id ${req.params.id} tidak ditemukan`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Produk tidak ditemukan`, 404));
  }

  let newImageUrl = product.imageUrl;
  let newImagePublicId = product.imagePublicId;

  // Jika ada file gambar baru di-upload
  if (req.file) {
    try {
      // Hapus gambar lama dari Cloudinary jika ada publicId
      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }

      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "product_images",
        resource_type: "auto",
      });

      newImageUrl = result.secure_url;
      newImagePublicId = result.public_id;
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return next(
        new ErrorResponse("Gagal mengunggah gambar baru ke Cloudinary", 500)
      );
    }
  } else if (req.body.deleteImage === "true" && product.imagePublicId) {
    // Kasus dimana gambar dihapus dari frontend (misal ada checkbox "Hapus Gambar")
    try {
      await cloudinary.uploader.destroy(product.imagePublicId);
      newImageUrl = "no-image.jpg";
      newImagePublicId = null;
    } catch (deleteError) {
      console.error("Cloudinary delete error:", deleteError);
      return next(
        new ErrorResponse("Gagal menghapus gambar lama dari Cloudinary", 500)
      );
    }
  } else if (req.body.imageUrl === "" && product.imagePublicId) {
    // Jika imageUrl dikirim kosong dari frontend TANPA file baru,
    // asumsikan gambar dihapus. (Ini bisa terjadi jika Anda tidak pakai checkbox deleteImage)
    try {
      await cloudinary.uploader.destroy(product.imagePublicId);
      newImageUrl = "no-image.jpg";
      newImagePublicId = null;
    } catch (deleteError) {
      console.error("Cloudinary delete error:", deleteError);
      return next(
        new ErrorResponse("Gagal menghapus gambar lama dari Cloudinary", 500)
      );
    }
  }

  const updatedFields = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    discountPrice: req.body.discountPrice || 0,
    category: req.body.category,
    tags: req.body.tags ? JSON.parse(req.body.tags) : [],
    ingredients: req.body.ingredients ? JSON.parse(req.body.ingredients) : [],
    imageUrl: newImageUrl,
    imagePublicId: newImagePublicId,
    isAvailable:
      req.body.isAvailable === "true" || req.body.isAvailable === true,
  };

  product = await Product.findByIdAndUpdate(req.params.id, updatedFields, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(
        `Produk dengan id ${req.params.id} tidak ditemukan`,
        404
      )
    );
  }

  // Hapus gambar dari Cloudinary jika ada public ID
  if (product.imagePublicId) {
    try {
      await cloudinary.uploader.destroy(product.imagePublicId);
      console.log(`Image ${product.imagePublicId} deleted from Cloudinary.`);
    } catch (cloudinaryErr) {
      console.error(
        `Failed to delete image ${product.imagePublicId} from Cloudinary:`,
        cloudinaryErr
      );
      // Lanjutkan penghapusan produk meskipun penghapusan gambar gagal
      // Anda bisa memilih untuk mengembalikan error di sini jika penghapusan gambar wajib
    }
  }

  await product.deleteOne();

  res.status(204).json({
    success: true,
    data: {},
  });
});
