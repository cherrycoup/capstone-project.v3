# API DOCUMENTATION

## Authentication

All API endpoints (except /api/auth/* and /api/health) require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:

```json
{
  "success": true/false,
  "message": "Description",
  "data": {}
}
```

## Authentication Endpoints

### Customer Login
**POST** `/api/auth/customer/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "type": "customer"
  }
}
```

### Customer Registration
**POST** `/api/auth/customer/register`

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "password": "password123",
  "address": "123 Main St"
}
```

### Staff Login
**POST** `/api/auth/staff/login`

Request:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

## Products Endpoints

### Get All Products
**GET** `/api/products`

Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "product-id",
      "productName": "Laptop",
      "stockLevel": 15,
      "price": 999.99,
      "description": "High-performance laptop",
      "category": "Electronics"
    }
  ]
}
```

### Get Low Stock Products
**GET** `/api/products/low-stock?threshold=10`

### Create Product
**POST** `/api/products` (Admin only)

Request:
```json
{
  "productName": "Laptop",
  "price": 999.99,
  "stockLevel": 15,
  "description": "High-performance laptop",
  "category": "Electronics"
}
```

### Update Product
**PUT** `/api/products/:id` (Admin only)

### Delete Product
**DELETE** `/api/products/:id` (Admin only)

## Orders Endpoints

### Get All Orders
**GET** `/api/orders` (Admin only)

### Create Order
**POST** `/api/orders`

Request:
```json
{
  "customerId": "customer-id-or-null-for-guest",
  "fullName": "John Doe",
  "contactNumber": "555-1234",
  "email": "john@example.com",
  "address": "123 Main St",
  "paymentMethod": "Credit Card",
  "referenceNumber": "ORD-20260611-ABCDE",
  "items": [
    {
      "productId": "product-id",
      "quantity": 1
    }
  ]
}
```

### Get Order by ID
**GET** `/api/orders/:id`

### Get Customer Orders
**GET** `/api/orders/customer/:customerId`

### Update Order Status
**PUT** `/api/orders/:id/status` (Admin only)

Request:
```json
{
  "status": "Completed"
}
```

Valid statuses: `Pending`, `Confirmed`, `Completed`, `Cancelled`

### Cancel Order
**PUT** `/api/orders/:id/cancel`

### Get Order Statistics
**GET** `/api/orders/stats` (Admin only)

Response:
```json
{
  "success": true,
  "data": {
    "totalOrders": 10,
    "completedOrders": 5,
    "totalRevenue": 5000.00,
    "pendingOrders": 2
  }
}
```

## Customers Endpoints

### Get All Customers
**GET** `/api/customers` (Admin only)

### Get Customer by ID
**GET** `/api/customers/:id`

### Get Customer by Email
**GET** `/api/customers/email/:email`

### Create Customer
**POST** `/api/customers`

Request:
```json
{
  "name": "John Doe",
  "contactInfo": {
    "email": "john@example.com",
    "phone": "555-1234",
    "address": "123 Main St"
  }
}
```

### Update Customer
**PUT** `/api/customers/:id`

### Delete Customer
**DELETE** `/api/customers/:id` (Admin only)

### Get Customer Statistics
**GET** `/api/customers/stats` (Admin only)

## Appointments Endpoints

### Get All Appointments
**GET** `/api/appointments` (Admin only)

### Create Appointment
**POST** `/api/appointments`

Request:
```json
{
  "customerId": "customer-id",
  "date": "2026-05-10",
  "timeSlot": "10:00 AM - 11:00 AM",
  "notes": "Product consultation"
}
```

### Get Available Slots
**GET** `/api/appointments/available-slots?date=2026-05-10`

Response:
```json
{
  "success": true,
  "data": [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM"
  ]
}
```

### Update Appointment Status
**PUT** `/api/appointments/:id/status` (Admin only)

Request:
```json
{
  "status": "Confirmed"
}
```

Valid statuses: `Scheduled`, `Confirmed`, `Completed`, `Cancelled`

### Get Appointment Statistics
**GET** `/api/appointments/stats` (Admin only)

## Commissions Endpoints

### Get All Commissions
**GET** `/api/commissions` (Admin only)

### Create Commission
**POST** `/api/commissions` (Admin only)

Request:
```json
{
  "orderId": "order-id",
  "percentage": 5
}
```

Note: Commission is only created for registered customers

### Get Commissions by Customer
**GET** `/api/commissions/customer/:customerId`

### Apply Commission
**PUT** `/api/commissions/:id/apply` (Admin only)

### Get Commission Statistics
**GET** `/api/commissions/stats` (Admin only)

Response:
```json
{
  "success": true,
  "data": {
    "totalCommissions": 10,
    "appliedCommissions": 5,
    "totalEarned": 500.00,
    "totalApplied": 250.00
  }
}
```

## Staff Endpoints

### Get All Staff
**GET** `/api/staff` (Admin only)

### Create Staff
**POST** `/api/staff` (Admin only)

Request:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "Admin",
  "phone": "555-9001",
  "department": "Management"
}
```

### Update Staff
**PUT** `/api/staff/:id` (Admin only)

### Update Staff Password
**PUT** `/api/staff/:id/password`

Request:
```json
{
  "oldPassword": "old123",
  "newPassword": "new123"
}
```

### Deactivate Staff
**PUT** `/api/staff/:id/deactivate` (Admin only)

### Get Staff Statistics
**GET** `/api/staff/stats` (Admin only)

## Error Handling

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

Error Response:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Rate Limiting

No rate limiting is currently implemented. Consider adding it for production.

## Pagination

Pagination is not currently implemented. All results are returned.

## Sorting & Filtering

Most endpoints return data sorted by creation date (newest first). Additional sorting and filtering options can be added as needed.
