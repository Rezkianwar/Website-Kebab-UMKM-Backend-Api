const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama pegawai harus diisi'],
      trim: true,
      maxlength: [100, 'Nama tidak boleh lebih dari 100 karakter']
    },
    email: {
      type: String,
      required: [true, 'Email harus diisi'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email tidak valid'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Nomor telepon harus diisi'],
      maxlength: [20, 'Nomor telepon tidak boleh lebih dari 20 karakter']
    },
    position: {
      type: String,
      required: [true, 'Posisi harus diisi'],
      enum: ['Manager', 'Kasir', 'Chef', 'Pelayan', 'Kurir', 'Lainnya']
    },
    salary: {
      type: Number,
      required: [true, 'Gaji harus diisi']
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    address: {
      type: String,
      required: [true, 'Alamat harus diisi'],
      maxlength: [500, 'Alamat tidak boleh lebih dari 500 karakter']
    },
    status: {
      type: String,
      enum: ['Aktif', 'Cuti', 'Tidak Aktif'],
      default: 'Aktif'
    },
    notes: {
      type: String,
      maxlength: [1000, 'Catatan tidak boleh lebih dari 1000 karakter']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Employee', EmployeeSchema);
