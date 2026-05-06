#!/usr/bin/env node

/**
 * PROJECT SETUP GUIDE
 * 
 * This guide will help you set up the entire project.
 */

console.log(`
╔════════════════════════════════════════════════════════════╗
║         E-COMMERCE MANAGEMENT SYSTEM SETUP GUIDE          ║
╚════════════════════════════════════════════════════════════╝

📋 PROJECT STRUCTURE
=====================================
frontend/      - React Vite application
server/        - Node.js Express backend
  ├── models/        - Database models
  ├── controllers/    - Business logic
  ├── routes/         - API endpoints
  ├── middleware/     - Authentication & authorization
  └── db/             - Database connection


📦 STEP 1: SERVER SETUP
=====================================

1. Navigate to server directory:
   cd server

2. Install dependencies:
   npm install

3. Create .env file in server directory:
   PORT=5000
   URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your-secret-key

4. Start MongoDB (if using local):
   mongod

5. Seed the database:
   node seedDatabase.js

6. Start the server:
   npm start

The server will run on http://localhost:5000


⚛️ STEP 2: FRONTEND SETUP
=====================================

1. Navigate to frontend directory:
   cd frontend

2. Install dependencies:
   npm install

3. Update API_BASE_URL in src/utils/api.js if needed:
   const API_BASE_URL = "http://localhost:5000/api";

4. Start the development server:
   npm run dev

The frontend will run on http://localhost:5173


🔐 STEP 3: DEFAULT CREDENTIALS
=====================================

ADMIN LOGIN:
  Email: admin@example.com
  Password: (check your seed data)

CUSTOMER LOGIN:
  Email: john@example.com
  Password: (set during registration)


🔗 API ENDPOINTS
=====================================

AUTH ENDPOINTS:
  POST   /api/auth/customer/login      - Customer login
  POST   /api/auth/customer/register   - Customer registration
  POST   /api/auth/staff/login         - Staff login

PRODUCTS:
  GET    /api/products                 - Get all products
  GET    /api/products/:id             - Get product by ID
  POST   /api/products                 - Create product (Admin)
  PUT    /api/products/:id             - Update product (Admin)
  DELETE /api/products/:id             - Delete product (Admin)
  GET    /api/products/low-stock       - Get low stock products

ORDERS:
  GET    /api/orders                   - Get all orders (Admin)
  GET    /api/orders/:id               - Get order details
  GET    /api/orders/customer/:id      - Get customer's orders
  POST   /api/orders                   - Create order
  PUT    /api/orders/:id/status        - Update order status (Admin)
  PUT    /api/orders/:id/cancel        - Cancel order

CUSTOMERS:
  GET    /api/customers                - Get all customers (Admin)
  GET    /api/customers/:id            - Get customer by ID
  POST   /api/customers                - Create customer
  PUT    /api/customers/:id            - Update customer
  DELETE /api/customers/:id            - Delete customer (Admin)

APPOINTMENTS:
  GET    /api/appointments             - Get all appointments (Admin)
  GET    /api/appointments/:id         - Get appointment by ID
  POST   /api/appointments             - Create appointment
  GET    /api/appointments/available-slots - Get available time slots
  PUT    /api/appointments/:id         - Update appointment
  PUT    /api/appointments/:id/status  - Update status

COMMISSIONS:
  GET    /api/commissions              - Get all commissions (Admin)
  GET    /api/commissions/customer/:id - Get customer commissions
  POST   /api/commissions              - Create commission
  PUT    /api/commissions/:id/apply    - Apply commission


📂 DATABASE MODELS
=====================================

1. Customer       - Customer information
2. Product        - Inventory/Products
3. Order          - Customer orders
4. OrderItem      - Items in orders
5. Commission     - Cashback/Commission
6. Appointment    - Customer appointments
7. Staff          - Admin/Staff users


🛠️ TROUBLESHOOTING
=====================================

Issue: "Connection refused" to MongoDB
  → Make sure MongoDB is running
  → Check URI in .env file

Issue: "Port already in use"
  → Change PORT in .env
  → Or kill the process using that port

Issue: CORS errors
  → Check cors configuration in server/index.js
  → Make sure API_BASE_URL matches your backend URL

Issue: "Unauthorized" errors
  → Check JWT_SECRET matches in frontend and backend
  → Check token in localStorage
  → Try logging in again


📚 FEATURES IMPLEMENTED
=====================================

✅ Customer Management
✅ Product/Inventory Management
✅ Order Management with status tracking
✅ Guest Checkout Support
✅ Appointment Booking System
✅ Commission/Cashback System
✅ Staff/Admin Management
✅ Authentication & Authorization
✅ Admin Dashboard
✅ Responsive UI


🎯 NEXT STEPS
=====================================

1. Customize branding and styling
2. Add more validation rules
3. Implement payment gateway integration
4. Add email notifications
5. Add more reporting features
6. Set up CI/CD pipeline
7. Deploy to production


📞 SUPPORT
=====================================

For more information, check the database schema
documentation in: server/SCHEMA_DOCUMENTATION.md
`);
