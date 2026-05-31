/**
 * Membership Benefits Configuration
 */
export const MEMBERSHIP_TIERS = {
    SILVER: {
        tier: 'Silver',
        monthlyDiscount: 5,
        freeShippingThreshold: 2000,
        pointsMultiplier: 1,
        benefits: [
            '5% discount on all purchases',
            'Free shipping on orders above P2,000',
            '1 loyalty point per P100 spent',
            'Monthly exclusive offers',
            'Birthday special discount (10%)',
            'Access to member-only products'
        ],
        annual_fee: 0,
        displayColor: '#9CA3AF',
        displayIcon: '🥈'
    },
    GOLD: {
        tier: 'Gold',
        monthlyDiscount: 10,
        freeShippingThreshold: 1000,
        pointsMultiplier: 1.5,
        benefits: [
            '10% discount on all purchases',
            'Free shipping on orders above P1,000',
            '1.5 loyalty points per P100 spent',
            'Priority customer support',
            'Birthday special discount (15%)',
            'Exclusive early access to sales',
            'Member-only events and workshops',
            'Free product returns (30 days)'
        ],
        annual_fee: 500,
        displayColor: '#FBBF24',
        displayIcon: '🥇'
    },
    PLATINUM: {
        tier: 'Platinum',
        monthlyDiscount: 15,
        freeShippingThreshold: 500,
        pointsMultiplier: 2,
        benefits: [
            '15% discount on all purchases',
            'Free shipping on orders above P500',
            '2 loyalty points per P100 spent',
            '24/7 VIP customer support',
            'Birthday special discount (20%)',
            'Exclusive access to premium products',
            'Quarterly VIP shopping events',
            'Free extended warranty on eligible items',
            'Concierge service for bulk orders',
            'Free product returns (60 days)'
        ],
        annual_fee: 2000,
        displayColor: '#06B6D4',
        displayIcon: '👑'
    }
};

/**
 * Membership Status Configuration
 */
export const MEMBERSHIP_STATUS = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    ACTIVE: 'Active',
    REJECTED: 'Rejected',
    EXPIRED: 'Expired',
    SUSPENDED: 'Suspended'
};

export const STATUS_COLORS = {
    Pending: '#F59E0B',
    Approved: '#10B981',
    Active: '#10B981',
    Rejected: '#EF4444',
    Expired: '#6B7280',
    Suspended: '#EF4444'
};

export const STATUS_ICONS = {
    Pending: '⏳',
    Approved: '✓',
    Active: '✓',
    Rejected: '✗',
    Expired: '⊘',
    Suspended: '⛔'
};

/**
 * Get membership tier details
 */
export const getTierDetails = (tier) => {
    const normalizedTier = tier?.toUpperCase();
    return MEMBERSHIP_TIERS[normalizedTier] || MEMBERSHIP_TIERS.SILVER;
};

/**
 * Get membership status badge info
 */
export const getStatusBadgeInfo = (status) => {
    return {
        color: STATUS_COLORS[status] || '#6B7280',
        icon: STATUS_ICONS[status] || '?',
        status
    };
};

/**
 * Check if membership is active
 */
export const isMembershipActive = (membership) => {
    if (!membership) return false;
    return (
        membership.status === 'Active' ||
        membership.status === 'Approved'
    ) && new Date(membership.expiresAt) > new Date();
};

/**
 * Check if membership is expired
 */
export const isMembershipExpired = (membership) => {
    if (!membership) return false;
    return new Date(membership.expiresAt) <= new Date();
};

/**
 * Get days until expiration
 */
export const getDaysUntilExpiration = (expiresAt) => {
    const now = new Date();
    const expiration = new Date(expiresAt);
    const diffTime = expiration - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

/**
 * Format membership info for display
 */
export const formatMembershipInfo = (membership) => {
    if (!membership) {
        return {
            tier: 'Not a Member',
            status: 'None',
            pointsBalance: 0,
            isActive: false
        };
    }

    return {
        tier: membership.tier,
        status: membership.status,
        pointsBalance: membership.pointsBalance || 0,
        isActive: isMembershipActive(membership),
        isExpired: isMembershipExpired(membership),
        daysUntilExpiration: getDaysUntilExpiration(membership.expiresAt),
        joinedAt: new Date(membership.joinedAt).toLocaleDateString(),
        expiresAt: new Date(membership.expiresAt).toLocaleDateString()
    };
};

/**
 * Calculate loyalty points from purchase amount
 */
export const calculateLoyaltyPoints = (amount, membership) => {
    const tierDetails = getTierDetails(membership?.tier);
    const basePoints = Math.floor(amount / 100);
    return Math.floor(basePoints * tierDetails.pointsMultiplier);
};

/**
 * Calculate discount amount
 */
export const calculateDiscount = (amount, membership) => {
    if (!isMembershipActive(membership)) return 0;
    const tierDetails = getTierDetails(membership.tier);
    return Math.floor((amount * tierDetails.monthlyDiscount) / 100);
};

/**
 * Check if eligible for free shipping
 */
export const isEligibleForFreeShipping = (amount, membership) => {
    if (!isMembershipActive(membership)) return false;
    const tierDetails = getTierDetails(membership.tier);
    return amount >= tierDetails.freeShippingThreshold;
};

/**
 * Validation rules
 */
export const VALIDATION_RULES = {
    fullName: {
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-Z\s'-]+$/,
        message: 'Full name should contain only letters, spaces, hyphens, and apostrophes'
    },
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },
    phone: {
        pattern: /^(\+63|0)?[0-9]{10}$/,
        message: 'Please enter a valid phone number (11 digits for PH format)'
    },
    address: {
        minLength: 10,
        maxLength: 200,
        message: 'Address must be between 10 and 200 characters'
    }
};

/**
 * Validate membership application data
 */
export const validateApplicationData = (data) => {
    const errors = {};

    // Validate Full Name
    if (!data.fullName?.trim()) {
        errors.fullName = 'Full name is required';
    } else if (data.fullName.length < VALIDATION_RULES.fullName.minLength) {
        errors.fullName = 'Full name is too short';
    } else if (!VALIDATION_RULES.fullName.pattern.test(data.fullName)) {
        errors.fullName = VALIDATION_RULES.fullName.message;
    }

    // Validate Email
    if (!data.email?.trim()) {
        errors.email = 'Email is required';
    } else if (!VALIDATION_RULES.email.pattern.test(data.email)) {
        errors.email = VALIDATION_RULES.email.message;
    }

    // Validate Phone
    if (!data.phone?.trim()) {
        errors.phone = 'Phone number is required';
    } else if (!VALIDATION_RULES.phone.pattern.test(data.phone.replace(/\D/g, ''))) {
        errors.phone = VALIDATION_RULES.phone.message;
    }

    // Validate Address
    if (!data.address?.trim()) {
        errors.address = 'Address is required';
    } else if (data.address.length < VALIDATION_RULES.address.minLength) {
        errors.address = 'Address is too short';
    }

    // Validate ID Upload
    if (!data.idFile) {
        errors.idFile = 'Valid ID upload is required';
    }

    // Validate Membership Type
    if (!data.membershipType) {
        errors.membershipType = 'Please select a membership tier';
    } else if (!Object.keys(MEMBERSHIP_TIERS).includes(data.membershipType.toUpperCase())) {
        errors.membershipType = 'Invalid membership tier selected';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export default {
    MEMBERSHIP_TIERS,
    MEMBERSHIP_STATUS,
    getTierDetails,
    getStatusBadgeInfo,
    isMembershipActive,
    isMembershipExpired,
    getDaysUntilExpiration,
    formatMembershipInfo,
    calculateLoyaltyPoints,
    calculateDiscount,
    isEligibleForFreeShipping,
    validateApplicationData
};
