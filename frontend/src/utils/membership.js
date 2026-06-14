/**
 * Membership Status Configuration
 */
export const MEMBERSHIP_STATUS = {
    PENDING: 'Pending',
    ACTIVE: 'Active',
    CANCELLED: 'Cancelled'
};

export const STATUS_COLORS = {
    Pending: '#F59E0B',
    Active: '#10B981',
    Cancelled: '#EF4444'
};

export const STATUS_ICONS = {
    Pending: '⏳',
    Active: '✓',
    Cancelled: '✗'
};

export const MEMBERSHIP_TIERS = {
    SILVER: {
        tier: 'Silver',
        displayIcon: '🥈',
        annual_fee: 0,
        monthlyDiscount: 10,
        pointsMultiplier: 1,
        freeShippingThreshold: 1000,
        displayColor: '#6B7280'
    },
    GOLD: {
        tier: 'Gold',
        displayIcon: '🥇',
        annual_fee: 1200,
        monthlyDiscount: 20,
        pointsMultiplier: 2,
        freeShippingThreshold: 750,
        displayColor: '#F59E0B'
    },
    PLATINUM: {
        tier: 'Platinum',
        displayIcon: '💎',
        annual_fee: 2400,
        monthlyDiscount: 40,
        pointsMultiplier: 3,
        freeShippingThreshold: 500,
        displayColor: '#8B5CF6'
    }
};

export const ACTIVE_MEMBERSHIP_SRP_DISCOUNT_PERCENT = 40;

const PHONE_REGEX = /^(?:\+63|0)9\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidPhoneNumber = (phone) => {
    if (!phone) return false;
    const normalized = phone.replace(/[\s\-()]/g, '');
    return PHONE_REGEX.test(normalized);
};

export const isValidAddress = (address) => {
    if (!address) return false;
    const normalized = address.trim();
    return normalized.length >= 10 && normalized.split(/\s+/).length >= 3;
};

export const getTierDetails = (tierName = 'Silver') => {
    return MEMBERSHIP_TIERS[tierName?.toUpperCase()] || MEMBERSHIP_TIERS.SILVER;
};

/**
 * Check if membership is active
 */
export const isMembershipActive = (membership) => {
    if (!membership) return false;
    return (
        membership.status === 'Active' ||
        membership.status === 'Approved'
    ) && membership.expiresAt && new Date(membership.expiresAt) > new Date();
};

/**
 * Check if membership is expired
 */
export const isMembershipExpired = (membership) => {
    if (!membership || !membership.expiresAt) return false;
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

export const validateApplicationData = (data = {}) => {
    const errors = {};
    const fullName = data.fullName?.trim() || '';
    const email = data.email?.trim() || '';
    const phone = data.phone?.trim() || '';
    const address = data.address?.trim() || '';
    const membershipType = data.membershipType;

    if (!fullName) {
        errors.fullName = 'Full name is required.';
    } else if (fullName.split(/\s+/).length < 2) {
        errors.fullName = 'Please enter your full name.';
    }

    if (!email) {
        errors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(email)) {
        errors.email = 'Please enter a valid email address.';
    }

    if (!phone) {
        errors.phone = 'Phone number is required.';
    } else if (!isValidPhoneNumber(phone)) {
        errors.phone = 'Enter a valid Philippine phone number, e.g. 09171234567 or +639171234567.';
    }

    if (!address) {
        errors.address = 'Complete address is required.';
    } else if (!isValidAddress(address)) {
        errors.address = 'Please enter a complete address with street, barangay, and city.';
    }

    if (!membershipType) {
        errors.membershipType = 'Please select a membership tier.';
    }

    if (!data.idFile) {
        errors.idFile = 'Please upload a valid ID document.';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateMembershipApplicationPageData = (data = {}) => {
    const errors = {};
    const fullName = data.fullName?.trim() || '';
    const email = data.email?.trim() || '';
    const phone = data.phone?.trim() || '';
    const address = data.address?.trim() || '';
    const paymentMethod = data.paymentMethod;
    const referenceNumber = data.referenceNumber?.trim() || '';

    if (!fullName || !email || !phone || !address) {
        errors.general = 'Please fill in all required personal information.';
    }

    if (!fullName) {
        errors.fullName = 'Full name is required.';
    } else if (fullName.split(/\s+/).length < 2) {
        errors.fullName = 'Please enter your full name.';
    }

    if (!email) {
        errors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(email)) {
        errors.email = 'Please enter a valid email address.';
    }

    if (!phone) {
        errors.phone = 'Phone number is required.';
    } else if (!isValidPhoneNumber(phone)) {
        errors.phone = 'Enter a valid Philippine phone number, e.g. 09171234567 or +639171234567.';
    }

    if (!address) {
        errors.address = 'Complete address is required.';
    } else if (!isValidAddress(address)) {
        errors.address = 'Please enter a complete address with street, barangay, and city.';
    }

    if (!data.packageDealId) {
        errors.packageDealId = 'Please select a membership package.';
    }

    if (!paymentMethod) {
        errors.paymentMethod = 'Please select a payment method.';
    }

    if ((paymentMethod === 'gcash' || paymentMethod === 'bank_transfer') && !referenceNumber) {
        errors.referenceNumber = `Please enter the payment reference number for ${paymentMethod === 'gcash' ? 'GCash' : 'Bank Transfer'}`;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export default {
    MEMBERSHIP_STATUS,
    STATUS_COLORS,
    STATUS_ICONS,
    MEMBERSHIP_TIERS,
    ACTIVE_MEMBERSHIP_SRP_DISCOUNT_PERCENT,
    isMembershipActive,
    isMembershipExpired,
    getDaysUntilExpiration,
    getTierDetails,
    isValidPhoneNumber,
    isValidAddress,
    validateApplicationData,
    validateMembershipApplicationPageData
};
