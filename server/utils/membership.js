import Customer from "../models/Customer.js";

export const MEMBERSHIP_TIERS = {
    Prime: {
        discountRate: 0.4,
        pointsPerPeso: 0.01,
    },
    Stater: {
        discountRate: 0.4,
        pointsPerPeso: 0.01,
    },
    Bronze: {
        discountRate: 0.4,
        pointsPerPeso: 0.01,
    },
};

export const MEMBERSHIP_STATUSES = ["None", "Pending", "Active", "Expired", "Suspended", "Rejected"];

export const getTierBenefits = (tier = "Prime") =>
    MEMBERSHIP_TIERS[tier] || MEMBERSHIP_TIERS.Prime;

export const DAY_MS = 24 * 60 * 60 * 1000;

export const getExpiryDate = (date, days = 365) => {
    const startDate = new Date(date);
    return new Date(startDate.getTime() + days * DAY_MS);
};

export const isMembershipExpired = (membership) => {
    if (!membership || !membership.expiresAt) return false;
    const expiresAt = new Date(membership.expiresAt);
    return !Number.isNaN(expiresAt.getTime()) && expiresAt <= new Date();
};

export const expireActiveMemberships = async () => {
    const now = new Date();
    return Customer.updateMany(
        {
            'membership.status': 'Active',
            'membership.expiresAt': { $lt: now },
        },
        {
            $set: {
                'membership.status': 'Expired',
                role: 'Guest',
                updatedAt: new Date(),
            },
        }
    );
};

export const getActiveMembership = (customer) => {
    if (!customer) {
        return null;
    }

    const membership = customer.membership || {};
    if (membership.status !== "Active") {
        return null;
    }

    if (membership.expiresAt && new Date(membership.expiresAt) < new Date()) {
        return null;
    }

    const tier = membership.tier || "Prime";
    return {
        tier,
        ...getTierBenefits(tier),
    };
};

export const calculateMembershipPoints = ({ customer, amount }) => {
    const activeMembership = getActiveMembership(customer);
    if (!activeMembership) {
        return 0;
    }

    return Math.floor(Number(amount || 0) * activeMembership.pointsPerPeso);
};
