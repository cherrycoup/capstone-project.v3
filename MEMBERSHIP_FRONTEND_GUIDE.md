# Membership Feature - Frontend Implementation Guide

## Overview
The "Become a Member" feature provides a complete customer membership management system with admin controls. This guide covers the frontend components, pages, and integration points.

## Project Structure

### New Files Created

#### Components (`src/components/membership/`)
1. **BenefitsDisplay.jsx** - Displays membership tiers with benefits comparison
2. **ApplicationForm.jsx** - Form for membership application with file upload
3. **ApplicationStatusCard.jsx** - Shows current membership status and details
4. **MemberBadge.jsx** - Visual badge indicating member tier

#### Pages (`src/pages/`)
1. **`client/MembershipApplication.jsx`** - Multi-step application process
2. **`client/MembershipStatus.jsx`** - Member dashboard showing status and benefits
3. **`admin/AdminMemberships.jsx`** - Admin dashboard for managing applications

#### Utilities (`src/utils/`)
1. **`membership.js`** - Membership constants, helpers, and validation logic
2. **`api.js`** - Updated with membership API endpoints

#### Styles (`src/styles/`)
1. **`membership.css`** - All membership-related styling

## Component Documentation

### BenefitsDisplay Component

Displays all membership tiers with benefits.

```jsx
<BenefitsDisplay
    onSelectTier={(tier) => handleTierSelection(tier)}
    currentTier={userMembership?.tier}
    selectedTier={selectedTier}
/>
```

**Props:**
- `onSelectTier`: Callback when tier is selected
- `currentTier`: User's current tier (shows as "Current Tier")
- `selectedTier`: Currently selected tier (highlights with ring)

### ApplicationForm Component

Handles membership application form submission.

```jsx
<ApplicationForm
    selectedTier="Gold"
    onSubmit={handleApplicationSubmit}
    isLoading={isLoading}
    userInfo={user}
/>
```

**Props:**
- `selectedTier`: The selected membership tier
- `onSubmit`: Callback function for form submission
- `isLoading`: Shows loading state
- `userInfo`: Pre-populated user information

**Features:**
- Real-time validation
- File upload with preview
- Error handling
- Progress indication

### ApplicationStatusCard Component

Shows the current membership application status.

```jsx
<ApplicationStatusCard
    membership={customerMembership}
    onRenew={() => handleRenewal()}
    onReapply={() => handleReapplication()}
/>
```

**Props:**
- `membership`: Membership object with status and tier
- `onRenew`: Callback for renewal action
- `onReapply`: Callback to reapply after rejection

**Displays:**
- Status badge with icon
- Membership details (tier, points, expiration)
- Loyalty points balance
- Action buttons based on status

### MemberBadge Component

Visual badge for displaying member status.

```jsx
<MemberBadge membership={membership} size="md" />
```

**Props:**
- `membership`: Membership object
- `size`: 'sm', 'md', 'lg', 'xl'

**Features:**
- Emoji icon for tier
- Colored background
- Tooltip on hover

## Page Documentation

### MembershipApplication Page

**Path:** `/membership/apply`

**Access:** Logged-in customers

Two-step process:
1. **Benefits Display** - View tiers and select one
2. **Application Form** - Fill out application details

**Features:**
- Benefits comparison table
- FAQ section
- Progress indicator
- Form validation
- File upload for ID

### MembershipStatus Page

**Path:** `/membership/status`

**Access:** Logged-in customers

Shows:
- Current membership status
- Tier benefits
- Loyalty points
- Membership statistics
- Activity history
- Renewal options

**Features:**
- Real-time status updates
- Benefits summary
- Activity timeline
- Upgrade options

### AdminMemberships Page

**Path:** `/admin/memberships`

**Access:** Admins only

Features:
- View all applications
- Filter by status, tier, or search
- Approve/Reject applications
- View application details
- Export data to CSV
- Statistics dashboard

**Filters:**
- Status: Pending, Approved, Rejected
- Tier: Silver, Gold, Platinum
- Search: Name, email, phone

## API Integration

### Membership API Endpoints

```javascript
import { membershipAPI } from '@/utils/api';

// Customer endpoints
membershipAPI.applyForMembership(applicationData);
membershipAPI.getMyMembership();
membershipAPI.getApplicationStatus();
membershipAPI.getMembershipBenefits(tier);
membershipAPI.getMyMembershipHistory();
membershipAPI.renewMembership(data);

// Admin endpoints
membershipAPI.getAllApplications(filters);
membershipAPI.getApplicationById(applicationId);
membershipAPI.approveApplication(applicationId, data);
membershipAPI.rejectApplication(applicationId, data);
membershipAPI.getCustomerMembership(customerId);
membershipAPI.updateMembershipTier(customerId, tierData);
membershipAPI.renewMembershipAdmin(customerId, data);
membershipAPI.suspendMembership(customerId, data);
membershipAPI.getMembershipStats();
```

## Membership Utilities

### Constants

```javascript
import {
    MEMBERSHIP_TIERS,
    MEMBERSHIP_STATUS,
    STATUS_COLORS,
    STATUS_ICONS
} from '@/utils/membership';

// Access tier details
const tierDetails = MEMBERSHIP_TIERS.GOLD; // Returns tier info

// Check status
const isActive = isMembershipActive(membership);
const isExpired = isMembershipExpired(membership);
const daysLeft = getDaysUntilExpiration(membership.expiresAt);
```

### Validation

```javascript
import { validateApplicationData } from '@/utils/membership';

const { isValid, errors } = validateApplicationData({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '09123456789',
    address: '123 Main St...',
    idFile: file,
    membershipType: 'Gold'
});

if (!isValid) {
    console.log(errors); // { fullName: 'error message' }
}
```

## Navigation Integration

### Homepage Updates

The `ClientHomepage` now includes:

**For Non-Members:**
- "Become a Member" button in navigation
- CTA button to membership application

**For Members:**
- "Membership" link to status page
- "Dashboard" link

### Sidebar Updates

Add membership management to admin sidebar:

```jsx
<Link to="/admin/memberships">
    <Heart className="h-5 w-5 mr-3" />
    Memberships
</Link>
```

## Styling

### Key CSS Classes

```css
.membership-benefits-container    /* Main benefits display */
.membership-tier-card             /* Individual tier card */
.application-form-container       /* Application form wrapper */
.membership-status-badge          /* Status badge styles */
.membership-stat-card             /* Statistics cards */
.membership-history-timeline      /* Activity timeline */
```

### Responsive Design

- Mobile: Single column layout
- Tablet: 2-3 column layout
- Desktop: Full 3-column tier display
- Admin table: Responsive with horizontal scroll on mobile

## Form Validation Rules

### Membership Application

| Field | Rules |
|-------|-------|
| Full Name | 2-100 chars, letters/spaces/hyphens only |
| Email | Valid email format |
| Phone | 11 digits (Philippine format) |
| Address | 10-200 characters |
| ID File | JPG/PNG/PDF, max 5MB |
| Tier | Must select one tier |

## State Management

### Context Updates

The app uses AuthContext to manage user state:

```javascript
const { user, updateUser } = useAuth();

// User object includes:
{
    _id: '...',
    name: '...',
    email: '...',
    membership: {
        status: 'Active',
        tier: 'Gold',
        pointsBalance: 2500,
        ...
    }
}
```

## Error Handling

### User-Friendly Error Messages

```javascript
// API errors are caught and displayed as toasts
try {
    await membershipAPI.applyForMembership(data);
    toast.success('Application submitted!');
} catch (error) {
    toast.error(error.response?.data?.message || 'Failed to submit');
}
```

## Best Practices

1. **Use React.lazy()** for code splitting on routes
2. **Cache API responses** using the existing cache mechanism
3. **Validate locally** before sending to server
4. **Handle loading states** for all async operations
5. **Show success/error toasts** for all actions
6. **Use proper aria labels** for accessibility

## Testing

### Component Testing

```javascript
// Test BenefitsDisplay
<BenefitsDisplay 
    onSelectTier={jest.fn()} 
    selectedTier="Gold"
/>

// Test ApplicationForm
const { getByLabelText } = render(
    <ApplicationForm selectedTier="Silver" onSubmit={jest.fn()} />
);
```

### Integration Testing

```javascript
// Test full membership flow
1. Visit /membership/apply
2. Select a tier
3. Fill out form
4. Submit application
5. Verify redirect to /membership/status
```

## Troubleshooting

### Issue: Form not submitting
- Check that all required fields are filled
- Verify file upload is not empty
- Check browser console for validation errors

### Issue: Membership not showing
- Verify user is logged in
- Check `/membership/status` page
- Look for API errors in network tab

### Issue: Admin page not accessible
- Verify user role is 'Admin'
- Check authentication token
- Verify admin route protection

### Issue: Styles not loading
- Ensure `membership.css` is imported
- Check class names match in components
- Clear browser cache

## Future Enhancements

1. **Multi-language support** for all text
2. **SMS notifications** for status updates
3. **QR code** for in-store member verification
4. **Member profile** customization
5. **Referral tracking** in dashboard
6. **Points redemption** interface
7. **Birthday special** promotions
8. **Member directory** (optional public)

## Performance Optimization

1. **Lazy load benefits comparison table**
2. **Virtualize long member lists** in admin
3. **Cache tier details** locally
4. **Debounce search** in admin filters
5. **Pagination** for member history

## Accessibility

- Use semantic HTML
- Include aria labels
- Ensure color contrast
- Support keyboard navigation
- Provide focus indicators
