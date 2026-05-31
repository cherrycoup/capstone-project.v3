# Membership Feature - Backend Implementation Guide

## Overview
The "Become a Member" feature has been fully implemented with comprehensive backend support. This guide outlines the backend setup, API endpoints, and integration points.

## Database Models

### Customer Model Updates
The `Customer` model includes the following membership fields:

```javascript
membership: {
    status: String,      // 'Pending', 'Approved', 'Active', 'Rejected', 'Expired', 'Suspended'
    tier: String,        // 'Silver', 'Gold', 'Platinum'
    pointsBalance: Number,
    joinedAt: Date,
    approvedAt: Date,
    expiresAt: Date,
    renewalCount: Number
}
```

### MembershipHistory Model
Tracks all membership-related actions and changes:

```javascript
membershipHistorySchema: {
    customerId: ObjectId,
    action: String,      // 'registered', 'approved', 'renewed', 'updated', 'suspended', 'rejected', 'points_earned', 'points_redeemed'
    previousStatus: String,
    newStatus: String,
    previousTier: String,
    newTier: String,
    pointsChange: Number,
    actorType: String,   // 'system', 'staff', 'customer'
    actorId: ObjectId,
    notes: String,
    timestamps: true
}
```

## API Endpoints

### Customer Endpoints

#### 1. Apply for Membership
**POST** `/api/memberships/apply`

**Authentication:** Required (Customer)

**Request Body:**
```json
{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "09123456789",
    "address": "123 Main St, City, Province 12345",
    "membershipType": "Gold",
    "additionalNotes": "I'm very interested in electrical products",
    "idFile": "<File object>"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Membership application submitted successfully",
    "data": {
        "customerId": "64abc123...",
        "status": "Pending",
        "tier": "Gold"
    }
}
```

#### 2. Get My Membership Status
**GET** `/api/memberships/me`

**Authentication:** Required (Customer)

**Response:**
```json
{
    "success": true,
    "data": {
        "membership": {
            "status": "Active",
            "tier": "Gold",
            "pointsBalance": 2500,
            "joinedAt": "2024-01-15T10:00:00Z",
            "approvedAt": "2024-01-16T14:30:00Z",
            "expiresAt": "2025-01-15T23:59:59Z",
            "renewalCount": 0
        }
    }
}
```

#### 3. Get My Membership History
**GET** `/api/memberships/me/history`

**Authentication:** Required (Customer)

**Query Parameters:**
- `limit`: Number of records to retrieve (default: 50)

**Response:**
```json
{
    "success": true,
    "data": {
        "history": [
            {
                "_id": "64abc123...",
                "customerId": "64abc123...",
                "action": "approved",
                "previousStatus": "Pending",
                "newStatus": "Active",
                "previousTier": "Silver",
                "newTier": "Gold",
                "actorType": "staff",
                "notes": "Membership approved to Gold tier",
                "createdAt": "2024-01-16T14:30:00Z"
            }
        ]
    }
}
```

### Admin Endpoints

#### 1. Get All Membership Applications
**GET** `/api/memberships/applications`

**Authentication:** Required (Admin/Staff)

**Query Parameters:**
- `status`: Filter by status ('Pending', 'Approved', 'Rejected')
- `tier`: Filter by tier ('Silver', 'Gold', 'Platinum')
- `search`: Search by name, email, or phone

**Response:**
```json
{
    "success": true,
    "data": {
        "applications": [
            {
                "_id": "64abc123...",
                "name": "John Doe",
                "contactInfo": {
                    "email": "john@example.com",
                    "phone": "09123456789",
                    "address": "123 Main St, City..."
                },
                "membership": {
                    "status": "Pending",
                    "tier": "Gold"
                },
                "applicationSubmittedAt": "2024-01-15T10:00:00Z"
            }
        ]
    }
}
```

#### 2. Get Application Details
**GET** `/api/memberships/applications/:applicationId`

**Authentication:** Required (Admin/Staff)

**Response:** Full customer and membership details

#### 3. Approve Application
**POST** `/api/memberships/applications/:applicationId/approve`

**Authentication:** Required (Admin/Staff)

**Request Body:**
```json
{
    "notes": "Application approved after verification",
    "tier": "Gold"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Application approved successfully",
    "data": {
        "customerId": "64abc123...",
        "status": "Active",
        "tier": "Gold"
    }
}
```

#### 4. Reject Application
**POST** `/api/memberships/applications/:applicationId/reject`

**Authentication:** Required (Admin/Staff)

**Request Body:**
```json
{
    "reason": "ID document does not meet requirements"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Application rejected",
    "data": {
        "customerId": "64abc123...",
        "status": "Rejected"
    }
}
```

#### 5. Renew Membership
**POST** `/api/memberships/customer/:customerId/renew`

**Authentication:** Required (Admin/Staff)

**Response:**
```json
{
    "success": true,
    "message": "Membership renewed successfully",
    "data": {
        "expiresAt": "2026-01-15T23:59:59Z",
        "renewalCount": 1
    }
}
```

#### 6. Update Membership Tier
**PUT** `/api/memberships/customer/:customerId/tier`

**Authentication:** Required (Admin/Staff)

**Request Body:**
```json
{
    "tier": "Platinum"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Membership tier updated successfully",
    "data": {
        "tier": "Platinum"
    }
}
```

#### 7. Suspend Membership
**POST** `/api/memberships/customer/:customerId/suspend`

**Authentication:** Required (Admin/Staff)

**Request Body:**
```json
{
    "reason": "Violation of terms of service"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Membership suspended",
    "data": {
        "status": "Suspended"
    }
}
```

#### 8. Get Membership Statistics
**GET** `/api/memberships/stats`

**Authentication:** Required (Admin/Staff)

**Response:**
```json
{
    "success": true,
    "data": {
        "totalMembers": 150,
        "pending": 5,
        "approved": 12,
        "active": 130,
        "rejected": 3,
        "expired": 2,
        "suspended": 1,
        "byTier": {
            "silver": 45,
            "gold": 70,
            "platinum": 35
        }
    }
}
```

## Integration with Existing Systems

### 1. Order Processing
When processing orders, check member discounts:
```javascript
import { getActiveMembership, calculateMembershipPoints } from './utils/membership.js';

const applyMemberBenefits = (customer, orderAmount) => {
    const membership = getActiveMembership(customer);
    
    if (!membership) {
        return { discount: 0, points: 0 };
    }
    
    return {
        discount: orderAmount * membership.discountRate,
        points: calculateMembershipPoints({ customer, amount: orderAmount })
    };
};
```

### 2. Email Notifications
Send emails for:
- Application submitted
- Application approved
- Application rejected
- Membership renewed
- Membership about to expire (7 days before)
- Membership expired

Use templates in `utils/mailer.js`

### 3. Authentication
Membership status is stored in the `Customer` model. When a customer logs in:
- Their current membership status is returned
- Frontend can display member badge
- Member discounts are available at checkout

## Membership Tiers Configuration

All tiers are defined in `utils/membership.js`:

| Feature | Silver | Gold | Platinum |
|---------|--------|------|----------|
| Discount | 5% | 10% | 15% |
| Free Shipping Threshold | ₱2,000 | ₱1,000 | ₱500 |
| Points Multiplier | 1x | 1.5x | 2x |
| Annual Fee | Free | ₱500 | ₱2,000 |

## File Upload Handling

The membership application includes file uploads for ID documents:

1. **Setup**: Ensure multer middleware is configured for file uploads
2. **Storage**: Files are stored in `/uploads/membership-ids/`
3. **Validation**: Only JPG, PNG, and PDF files (max 5MB)
4. **Security**: Filenames are sanitized and stored securely

## Important Notes

1. **Membership Expiration**: Automatically handled based on `expiresAt` date
2. **Points Management**: Points are awarded per purchase and can be redeemed
3. **Renewal Process**: Can be done by customer or admin
4. **Tier Upgrade**: Customers can upgrade any time, fees are prorated
5. **Suspension**: Can be reversed by admin with notes

## Testing Endpoints

Use Postman or similar tool to test:

```bash
# Apply for membership (as customer)
POST http://localhost:5000/api/memberships/apply
Authorization: Bearer <customer_token>

# Get all applications (as admin)
GET http://localhost:5000/api/memberships/applications
Authorization: Bearer <admin_token>

# Approve application (as admin)
POST http://localhost:5000/api/memberships/applications/<id>/approve
Authorization: Bearer <admin_token>
```

## Future Enhancements

1. **Email Notifications**: Integrate with email service for notifications
2. **Points Redemption**: Allow customers to redeem points for discounts
3. **Member-Only Products**: Add products exclusive to members
4. **Tiered Pricing**: Different prices for different membership tiers
5. **Anniversary Rewards**: Special bonuses on membership anniversary
6. **Referral Program**: Rewards for referring other customers

## Troubleshooting

### Issue: Applications not showing up
- Check if `membership.status` is set to 'Pending'
- Verify customer exists in database
- Check MongoDB connection

### Issue: Discounts not applied
- Verify membership status is 'Active'
- Check expiration date hasn't passed
- Ensure tier is correctly set

### Issue: Email not sending
- Configure email service in `.env`
- Check `utils/mailer.js` implementation
- Verify SMTP credentials
