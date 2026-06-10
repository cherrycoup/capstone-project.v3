import { useState } from 'react';
import { X } from 'lucide-react';
import { customersAPI } from '../../utils/api';
import './modal.css';

const CUSTOMER_ROLES = ['Guest', 'Member'];

const formatDate = (value) => {
    if (!value) return 'Not available';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Not available';
    return date.toLocaleDateString();
};

const getPredictedExpiryDate = (customer, selectedRole) => {
    if (selectedRole !== 'Member') return null;

    const currentExpiry = customer?.membership?.expiresAt ? new Date(customer.membership.expiresAt) : null;
    const now = new Date();

    if (currentExpiry && currentExpiry > now) {
        return currentExpiry;
    }

    const joinedAt = customer?.membership?.joinedAt ? new Date(customer.membership.joinedAt) : now;
    return new Date(joinedAt.getTime() + 365 * 24 * 60 * 60 * 1000);
};

export default function RoleEditModal({ customer, onClose, onSave }) {
    const [selectedRole, setSelectedRole] = useState(customer?.role || 'Guest');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isExistingMember = customer?.role === 'Member';
    const predictedExpiryDate = getPredictedExpiryDate(customer, selectedRole);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Update the customer role by updating membership status
            // If role is Member, set membership status to Active
            // If role is Guest, set membership status to None
            const membershipUpdate = {
                status: selectedRole === 'Member' ? 'Active' : 'None',
                tier: selectedRole === 'Member' ? customer?.membership?.tier || 'Silver' : 'Silver',
                notes: `Role changed from ${customer?.role} to ${selectedRole}`,
                ...(selectedRole === 'Member' && predictedExpiryDate ? {
                    expiresAt: predictedExpiryDate.toISOString(),
                } : {}),
            };

            await customersAPI.updateMembership(customer._id, membershipUpdate);
            onSave();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update role');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2>Change Membership Role</h2>
                        <p className="modal-intro">Update the customer’s membership access level and role status from one secure dialog.</p>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="customer-info-badge">
                        <div className="customer-avatar">
                            {customer?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="customer-name">{customer?.name}</p>
                            <p className="customer-email">{customer?.contactInfo?.email}</p>
                        </div>
                    </div>

                    <div className="role-summary-card">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Role</p>
                            <p className="text-lg font-semibold text-slate-900">{selectedRole}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Expiry Date</p>
                            <p className="text-lg font-semibold text-slate-900">
                                {selectedRole === 'Member'
                                    ? formatDate(predictedExpiryDate)
                                    : 'None'}
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="role-form">
                        <div className="role-options">
                            {CUSTOMER_ROLES.map(role => (
                                <label key={role} className="role-option">
                                    <input
                                        type="radio"
                                        name="role"
                                        value={role}
                                        checked={selectedRole === role}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        disabled={role === 'Guest' && isExistingMember}
                                    />
                                    <div className="role-option-content">
                                        <span className="role-name">{role}</span>
                                        <span className="role-description">
                                            {role === 'Member' 
                                                ? 'Full access to membership benefits'
                                                : 'Limited access as guest'
                                            }
                                        </span>
                                    </div>
                                </label>
                            ))}
                        </div>
                        {isExistingMember && (
                            <p className="text-sm text-slate-500 mt-3">
                                Members cannot be downgraded to Guest through this form. Use the cancel membership action if you need to remove membership.
                            </p>
                        )}

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading || selectedRole === customer?.role}
                            >
                                {loading ? 'Updating...' : 'Update Role'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
