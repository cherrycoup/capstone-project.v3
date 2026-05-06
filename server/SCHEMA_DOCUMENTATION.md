/**
 * DATABASE SCHEMA DOCUMENTATION
 * 
 * This file documents all the database models and their relationships.
 * All models use MongoDB with Mongoose ODM.
 */

/**
 * ========================================
 * 1. CUSTOMER
 * ========================================
 * Represents registered customers in the system.
 * 
 * Fields:
 * - _id: ObjectId (auto-generated, primary key)
 * - name: String (required)
 * - contactInfo.email: String (required, unique)
 * - contactInfo.phone: String (required)
 * - contactInfo.address: String (optional)
 * - createdAt: Date (auto)
 * - updatedAt: Date (auto)
 * 
 * Relationships:
 * - 1-to-many with Orders
 * - 1-to-many with Appointments
 * - 1-to-many with Commissions
 */

/**
 * ========================================
 * 2. PRODUCT (INVENTORY)
 * ========================================
 * Represents products/inventory items.
 * 
 * Fields:
 * - _id: ObjectId (auto-generated, primary key)
 * - productName: String (required, unique)
 * - stockLevel: Number (required, min: 0)
 * - price: Number (required, min: 0)
 * - description: String (optional)
 * - category: String (optional)
 * - createdAt: Date (auto)
 * - updatedAt: Date (auto)
 * 
 * Relationships:
 * - 1-to-many with OrderItem
 */

/**
 * ========================================
 * 3. ORDER
 * ========================================
 * Represents customer orders (registered or guest checkout).
 * 
 * Fields:
 * - _id: ObjectId (auto-generated, primary key)
 * - customerId: ObjectId (FK, nullable, refs Customer)
 * - fullName: String (required)
 * - contactNumber: String (required)
 * - address: String (required)
 * - paymentMethod: String (enum: "Credit Card", "Debit Card", "Cash", "Online Transfer")
 * - referenceNumber: String (unique)
 * - total: Number (required, min: 0)
 * - status: String (enum: "Pending", "Confirmed", "Completed", "Cancelled", default: "Pending")
 * - createdAt: Date (auto)
 * - updatedAt: Date (auto)
 * 
 * Relationships:
 * - many-to-1 with Customer (nullable for guest orders)
 * - 1-to-many with OrderItem
 * - 1-to-1 with Commission (optional)
 */

/**
 * ========================================
 * 4. ORDER_ITEM
 * ========================================
 * Represents individual items within an order.
 * 
 * Fields:
 * - _id: ObjectId (auto-generated, primary key)
 * - orderId: ObjectId (FK, required, refs Order)
 * - productId: ObjectId (FK, required, refs Product)
 * - productName: String (required, snapshot)
 * - price: Number (required, snapshot, min: 0)
 * - quantity: Number (required, min: 1)
 * - subtotal: Number (required, min: 0)
 * - createdAt: Date (auto)
 * 
 * Relationships:
 * - many-to-1 with Order
 * - many-to-1 with Product
 */

/**
 * ========================================
 * 5. COMMISSION (CASHBACK)
 * ========================================
 * Represents cashback/commission earned on orders.
 * 
 * Fields:
 * - _id: ObjectId (auto-generated, primary key)
 * - orderId: ObjectId (FK, required, unique, refs Order)
 * - customerId: ObjectId (FK, required, refs Customer)
 * - amount: Number (required, min: 0)
 * - percentage: Number (optional, 0-100)
 * - isApplied: Boolean (default: false)
 * - createdAt: Date (auto)
 * 
 * Relationships:
 * - 1-to-1 with Order (unique constraint)
 * - many-to-1 with Customer
 */

/**
 * ========================================
 * 6. APPOINTMENT
 * ========================================
 * Represents customer appointments/bookings.
 * 
 * Fields:
 * - _id: ObjectId (auto-generated, primary key)
 * - customerId: ObjectId (FK, required, refs Customer)
 * - date: Date (required)
 * - timeSlot: String (required)
 * - status: String (enum: "Scheduled", "Confirmed", "Completed", "Cancelled", default: "Scheduled")
 * - notes: String (optional)
 * - createdAt: Date (auto)
 * - updatedAt: Date (auto)
 * 
 * Relationships:
 * - many-to-1 with Customer
 */

/**
 * ========================================
 * 7. STAFF (ADMIN)
 * ========================================
 * Represents staff and admin users who manage the system.
 * 
 * Fields:
 * - _id: ObjectId (auto-generated, primary key)
 * - name: String (required)
 * - email: String (required, unique)
 * - password: String (required)
 * - role: String (enum: "Admin", "Staff", default: "Staff")
 * - phone: String (optional)
 * - department: String (optional)
 * - isActive: Boolean (default: true)
 * - createdAt: Date (auto)
 * - updatedAt: Date (auto)
 * 
 * Relationships:
 * - Manages Orders
 * - Manages Appointments
 * - Manages Inventory (Products)
 */

/**
 * ========================================
 * RELATIONSHIP DIAGRAM
 * ========================================
 * 
 * Customer (1) ─────────────→ (Many) Orders
 *    │                             │
 *    │                             ├─→ (1) Commission
 *    │                             └─→ (Many) OrderItems
 *    │                                    │
 *    │                                    └─→ (Many) Products
 *    │
 *    └─────────────→ (Many) Appointments
 *    
 * Staff/Admin manages all entities above
 */

export const SCHEMA_INFO = {
    description: "E-commerce system database schema",
    models: [
        "Customer",
        "Product",
        "Order",
        "OrderItem",
        "Commission",
        "Appointment",
        "Staff"
    ],
    database: "MongoDB",
    odm: "Mongoose"
};
