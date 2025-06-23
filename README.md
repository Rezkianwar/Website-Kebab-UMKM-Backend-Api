# Kebab UMKM Backend

Backend API untuk aplikasi manajemen UMKM Kebab menggunakan Node.js, Express, dan MongoDB.

## Features

- RESTful API dengan Express.js
- Authentication dengan JWT
- Database MongoDB dengan Mongoose
- Security middleware (Helmet, CORS, Rate Limiting)
- Error handling yang komprehensif
- Input validation dan sanitization

## Installation

```bash
npm install
```

## Environment Setup

Copy `.env.example` ke `.env` dan sesuaikan konfigurasi:

```bash
cp .env.example .env
```

Edit file `.env`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@cloud-name
```

## Running the Application

### Development
```bash
npm run start
```
OR
```bash
node server.js
```

### Production
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Auth required)
- `PUT /api/products/:id` - Update product (Auth required)
- `DELETE /api/products/:id` - Delete product (Auth required)

### Customers
- `GET /api/customers` - Get all customers (Auth required)
- `GET /api/customers/:id` - Get single customer (Auth required)
- `POST /api/customers` - Create customer (Auth required)
- `PUT /api/customers/:id` - Update customer (Auth required)
- `DELETE /api/customers/:id` - Delete customer (Auth required)

### Employees
- `GET /api/employees` - Get all employees (Auth required)
- `GET /api/employees/:id` - Get single employee (Auth required)
- `POST /api/employees` - Create employee (Auth required)
- `PUT /api/employees/:id` - Update employee (Auth required)
- `DELETE /api/employees/:id` - Delete employee (Auth required)

### Sales
- `GET /api/sales` - Get all sales (Auth required)
- `GET /api/sales/:id` - Get single sale (Auth required)
- `GET /api/sales/range` - Get sales by date range (Auth required)
- `GET /api/sales/stats` - Get sales statistics (Auth required)
- `POST /api/sales` - Create sale (Auth required)
- `PUT /api/sales/:id` - Update sale (Auth required)
- `DELETE /api/sales/:id` - Delete sale (Auth required)

## Project Structure

```
backend/
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   ├── auth.js            # Authentication logic
│   ├── products.js        # Products logic
│   ├── customers.js       # Customers logic
│   ├── employees.js       # Employees logic
│   └── sales.js           # Sales logic
├── middleware/
│   ├── auth.js            # Authentication middleware
│   ├── async.js           # Async handler
│   └── error.js           # Error handler
├── models/
│   ├── User.js            # User model
│   ├── Product.js         # Product model
│   ├── Customer.js        # Customer model
│   ├── Employee.js        # Employee model
│   └── Sale.js            # Sale model
├── routes/
│   ├── auth.js            # Auth routes
│   ├── products.js        # Product routes
│   ├── customers.js       # Customer routes
│   ├── employees.js       # Employee routes
│   └── sales.js           # Sales routes
├── utils/
│   └── errorResponse.js   # Custom error class
├── .env                   # Environment variables
├── .env.example           # Environment template
├── package.json
└── server.js              # Main server file
```

## Dependencies

### Production
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-origin resource sharing
- `helmet` - Security headers
- `morgan` - HTTP request logger
- `dotenv` - Environment variables
- `express-validator` - Input validation
- `express-mongo-sanitize` - NoSQL injection prevention
- `xss-clean` - XSS protection
- `express-rate-limit` - Rate limiting
- `hpp` - HTTP parameter pollution prevention
- `cookie-parser` - Cookie parsing

### Development
- `nodemon` - Development server auto-reload

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting (100 requests per 10 minutes)
- CORS configuration
- XSS protection
- NoSQL injection prevention
- HTTP parameter pollution prevention
- Security headers with Helmet

## Error Handling

Aplikasi menggunakan centralized error handling dengan custom error class:

```javascript
const ErrorResponse = require('../utils/errorResponse');

// Usage
return next(new ErrorResponse('Resource not found', 404));
```

## Database Models

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  role: String (enum: ['admin', 'staff'], default: 'staff'),
  createdAt: Date (default: Date.now)
}
```

### Product
```javascript
{
  name: String (required),
  description: String,
  price: Number (required),
  discountPrice: Number,
  category: String (required),
  imageUrl: String,
  isAvailable: Boolean (default: true),
  createdAt: Date (default: Date.now)
}
```

### Customer
```javascript
{
  name: String (required),
  email: String,
  phone: String (required),
  address: String,
  joinDate: Date (default: Date.now),
  totalOrders: Number (default: 0),
  totalSpent: Number (default: 0),
  notes: String,
  createdAt: Date (default: Date.now)
}
```

### Employee
```javascript
{
  name: String (required),
  email: String,
  phone: String (required),
  position: String (required),
  salary: Number,
  joinDate: Date (default: Date.now),
  address: String,
  status: String (enum: ['Aktif', 'Cuti', 'Tidak Aktif'], default: 'Aktif'),
  notes: String,
  createdAt: Date (default: Date.now)
}
```

### Sale
```javascript
{
  orderNumber: String (required, unique),
  customer: ObjectId (ref: 'Customer'),
  items: [{
    product: ObjectId (ref: 'Product', required),
    name: String (required),
    price: Number (required),
    quantity: Number (required)
  }],
  totalAmount: Number (required),
  paymentMethod: String (required),
  paymentStatus: String (enum: ['Belum Dibayar', 'Dibayar', 'Dibatalkan'], default: 'Belum Dibayar'),
  orderStatus: String (enum: ['Baru', 'Diproses', 'Siap', 'Selesai', 'Dibatalkan'], default: 'Baru'),
  orderType: String (enum: ['Dine-in', 'Take Away', 'Delivery'], required),
  notes: String,
  employee: ObjectId (ref: 'Employee'),
  createdAt: Date (default: Date.now)
}
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_production_jwt_secret
JWT_EXPIRE=30d
```

### PM2 Configuration
```javascript
module.exports = {
  apps: [{
    name: 'kebab-umkm-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.

