# Membership Feature - Quick Start Guide

## 🚀 Quick Start for Developers

### Frontend Setup

#### 1. View Membership Pages

**Non-member Flow:**
```bash
1. npm run dev                    # Start dev server
2. Visit http://localhost:5173
3. Click "Become a Member" button
4. Explore benefits and apply
```

**Member Dashboard:**
```bash
1. Log in as customer
2. Navigate to /membership/status
3. See membership details
```

**Admin Dashboard:**
```bash
1. Log in as admin
2. Navigate to /admin/memberships
3. Review applications
4. Approve/Reject as needed
```

#### 2. Key Components to Review

```javascript
// View tier benefits
import BenefitsDisplay from '@/components/membership/BenefitsDisplay';

// Show application form
import ApplicationForm from '@/components/membership/ApplicationForm';

// Display member badge
import MemberBadge from '@/components/membership/MemberBadge';

// Show membership status
import ApplicationStatusCard from '@/components/membership/ApplicationStatusCard';
```

#### 3. Using Membership Utilities

```javascript
import {
    MEMBERSHIP_TIERS,
    getTierDetails,
    validateApplicationData,
    isMembershipActive,
    calculateDiscount,
    calculateLoyaltyPoints
} from '@/utils/membership';

// Get tier info
const silverDetails = getTierDetails('Silver');
console.log(silverDetails.monthlyDiscount); // 5

// Validate form data
const { isValid, errors } = validateApplicationData(formData);

// Check if member is active
if (isMembershipActive(membership)) {
    const discount = calculateDiscount(1000, membership.tier);
    const points = calculateLoyaltyPoints(1000, membership);
}
```

#### 4. Using API

```javascript
import { membershipAPI } from '@/utils/api';

// Customer: Apply for membership
const response = await membershipAPI.applyForMembership({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '09123456789',
    address: '123 Main St, City, Province',
    membershipType: 'Gold',
    idFile: fileObject
});

// Customer: Get membership status
const { membership } = await membershipAPI.getMyMembership();

// Admin: Get all applications
const { applications } = await membershipAPI.getAllApplications({
    status: 'Pending',
    tier: 'Gold'
});

// Admin: Approve application
await membershipAPI.approveApplication(applicationId, {
    notes: 'Approved',
    tier: 'Gold'
});
```

---

### Backend Setup

#### 1. Start Backend Server

```bash
cd server
npm install          # If needed
npm start           # Starts on http://localhost:5000
```

#### 2. Test API Endpoints

**Apply for Membership:**
```bash
curl -X POST http://localhost:5000/api/memberships/apply \
  -H "Authorization: Bearer <customer_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "09123456789",
    "address": "123 Main St",
    "membershipType": "Gold",
    "additionalNotes": "I love your products"
  }'
```

**Get My Membership:**
```bash
curl -X GET http://localhost:5000/api/memberships/me \
  -H "Authorization: Bearer <customer_token>"
```

**List Applications (Admin):**
```bash
curl -X GET "http://localhost:5000/api/memberships/applications?status=Pending" \
  -H "Authorization: Bearer <admin_token>"
```

**Approve Application (Admin):**
```bash
curl -X POST http://localhost:5000/api/memberships/applications/<id>/approve \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"notes": "Approved", "tier": "Gold"}'
```

#### 3. Database Collections

Check MongoDB:
```bash
# View customers with memberships
db.customers.findOne({ 'membership.status': 'Active' })

# View membership history
db.membershiphistories.find({ action: 'approved' }).limit(5)

# Count members by tier
db.customers.aggregate([
  { $group: { _id: "$membership.tier", count: { $sum: 1 } } }
])
```

---

## 📝 Common Development Tasks

### Adding a New Membership Benefit

1. **Update `src/utils/membership.js`:**
```javascript
export const MEMBERSHIP_TIERS = {
    GOLD: {
        tier: 'Gold',
        // ... existing properties
        benefits: [
            // Add new benefit
            '📱 New benefit here',
            // ... other benefits
        ]
    }
}
```

2. **The component automatically displays it**

### Customizing Tier Details

Edit `src/utils/membership.js`:
```javascript
MEMBERSHIP_TIERS.GOLD.monthlyDiscount = 12; // Change from 10 to 12
```

Or `server/utils/membership.js` for backend calculations.

### Changing Colors/Icons

Edit `src/utils/membership.js`:
```javascript
GOLD: {
    displayColor: '#FCD34D',  // Change color
    displayIcon: '⭐',         // Change icon
    // ...
}
```

### Adding New Status

1. Add to `MEMBERSHIP_STATUS` in `src/utils/membership.js`
2. Add to backend `MEMBERSHIP_STATUSES` in `server/utils/membership.js`
3. Add styling in `src/styles/membership.css`
4. Update status logic in controllers

---

## 🔍 Debugging Tips

### Check if Member is Active

```javascript
import { isMembershipActive } from '@/utils/membership';

console.log(isMembershipActive(user.membership)); // true/false
```

### View Membership History

**Frontend:**
```javascript
const history = await membershipAPI.getMyMembershipHistory();
console.log(history);
```

**Backend:**
```bash
db.membershiphistories.find({ customerId: ObjectId('...') }).sort({ createdAt: -1 })
```

### Check Validation Errors

```javascript
const { isValid, errors } = validateApplicationData(formData);
if (!isValid) {
    console.log('Validation errors:', errors);
    // { fullName: 'Too short', email: 'Invalid format' }
}
```

### Monitor API Calls

Open browser DevTools → Network tab:
1. Apply for membership → POST to `/api/memberships/apply`
2. Get status → GET to `/api/memberships/me`
3. Get history → GET to `/api/memberships/me/history`

---

## 📊 Testing Scenarios

### Scenario 1: Customer Applies for Membership

1. Visit `/membership/apply` (logged in)
2. View benefits
3. Select Gold tier
4. Fill form (use real data)
5. Upload ID (JPG/PNG/PDF, <5MB)
6. Submit
7. Check → `/membership/status` shows "Pending"

### Scenario 2: Admin Approves Application

1. Log in as admin
2. Visit `/admin/memberships`
3. Find pending application
4. Click "View"
5. Click "Approve"
6. Add notes
7. Confirm
8. Check → Status updates to "Active"
9. Customer sees updated status and badge

### Scenario 3: Member Renews

1. Member with expired membership logs in
2. Visit `/membership/status`
3. See "Renew Membership" button
4. Click to renew
5. Payment processed
6. Status updates to "Active" with new expiration

---

## 🚨 Common Issues

### Issue: "Cannot find module"

**Solution:** Restart dev server
```bash
Ctrl+C
npm run dev
```

### Issue: API 401 Unauthorized

**Solution:** Check authentication
```javascript
// Make sure token is in localStorage
const token = localStorage.getItem('pos-token');
console.log(token); // Should exist
```

### Issue: Form validation failing

**Solution:** Check validation rules in `utils/membership.js`
```javascript
// Full Name must be 2-100 chars, letters/spaces/hyphens only
const name = "John Doe-Smith"; // ✅ Valid
const name = "J"; // ❌ Too short
const name = "John123"; // ❌ Invalid chars
```

### Issue: File upload not working

**Solution:** Check file requirements
- Format: JPG, PNG, or PDF only
- Size: Less than 5MB
- Not corrupted

---

## 📚 Related Documentation

- **Backend API Guide:** `MEMBERSHIP_BACKEND_GUIDE.md`
- **Frontend Guide:** `MEMBERSHIP_FRONTEND_GUIDE.md`
- **Implementation Summary:** `MEMBERSHIP_IMPLEMENTATION_SUMMARY.md`
- **Project README:** `README.md`

---

## ✅ Checklist for Testing

### Frontend
- [ ] Can view membership benefits
- [ ] Can select a tier
- [ ] Can fill and submit application
- [ ] Validation works correctly
- [ ] File upload works
- [ ] Success message appears
- [ ] Redirects to /membership/status
- [ ] Status shows "Pending"

### Backend
- [ ] Application saved in database
- [ ] Membership history recorded
- [ ] Admin can view applications
- [ ] Admin can approve/reject
- [ ] Approval updates customer record
- [ ] Email notifications sent (when configured)

### Integration
- [ ] Member badge shows on dashboard
- [ ] Discounts apply at checkout
- [ ] Loyalty points calculated correctly
- [ ] Free shipping threshold works
- [ ] Expiration dates are correct

---

## 🎓 Learning Resources

### Code Examples

**Display member benefits:**
```jsx
<BenefitsDisplay 
    onSelectTier={handleTierSelect}
    currentTier={user.membership?.tier}
/>
```

**Apply for membership:**
```jsx
<ApplicationForm 
    selectedTier="Gold"
    onSubmit={handleSubmit}
    userInfo={user}
/>
```

**Show member status:**
```jsx
<ApplicationStatusCard 
    membership={user.membership}
    onRenew={handleRenewal}
/>
```

### File Navigation

```
frontend/src/
  ├── App.jsx                              # Routes defined here
  ├── pages/
  │   ├── client/
  │   │   ├── MembershipApplication.jsx    # Main application page
  │   │   └── MembershipStatus.jsx         # Dashboard
  │   └── admin/
  │       └── AdminMemberships.jsx         # Admin panel
  └── components/membership/
      ├── BenefitsDisplay.jsx
      ├── ApplicationForm.jsx
      ├── ApplicationStatusCard.jsx
      └── MemberBadge.jsx

server/
  ├── controllers/
  │   └── membershipController.js
  ├── routes/
  │   └── memberships.js
  └── models/
      ├── Customer.js
      └── MembershipHistory.js
```

---

## 💡 Tips for Success

1. **Read the comments** in code - they explain the logic
2. **Use browser DevTools** - Network tab shows API calls
3. **Check console** - Errors will help debug issues
4. **Test with real data** - Use actual emails and phone numbers
5. **Restart servers** - After making changes
6. **Clear cache** - If styles not updating
7. **Check tokens** - Most API errors are auth-related

---

## 🤝 Getting Help

### Resources
1. Check `MEMBERSHIP_BACKEND_GUIDE.md` for API details
2. Check `MEMBERSHIP_FRONTEND_GUIDE.md` for component usage
3. Look at existing components for patterns
4. Check network tab in DevTools for API errors

### Questions to Ask Yourself
- Is the user authenticated?
- Is the API endpoint correct?
- Is the token valid?
- Is the data being validated?
- Are there console errors?
- Is the database updated?

---

**Happy coding! 🎉**
