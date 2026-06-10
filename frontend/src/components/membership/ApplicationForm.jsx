import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { validateApplicationData, MEMBERSHIP_TIERS } from '../../utils/membership';
import { toast } from 'sonner';
import '../../styles/membership.css';

export default function ApplicationForm({ selectedTier, onSubmit, isLoading = false, userInfo = null }) {
    const [formData, setFormData] = useState({
        fullName: userInfo?.name || '',
        email: userInfo?.contactInfo?.email || '',
        phone: userInfo?.contactInfo?.phone || '',
        address: userInfo?.contactInfo?.address || '',
        membershipType: selectedTier || '',
        idFile: null,
        additionalNotes: ''
    });

    const [errors, setErrors] = useState({});
    const [idPreview, setIdPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            setErrors(prev => ({
                ...prev,
                idFile: 'Please upload a valid ID file (JPG, PNG, or PDF)'
            }));
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({
                ...prev,
                idFile: 'File size must be less than 5MB'
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            idFile: file
        }));

        // Create preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setIdPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }

        setErrors(prev => ({
            ...prev,
            idFile: ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form data
        const validation = validateApplicationData(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            toast.error('Please correct the form errors');
            return;
        }

        try {
            setUploading(true);
            await onSubmit(formData);
        } finally {
            setUploading(false);
        }
    };

    const selectedTierInfo = MEMBERSHIP_TIERS[formData.membershipType?.toUpperCase()];

    return (
        <div className="application-form-container">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Selected Tier Summary */}
                {selectedTierInfo && (
                    <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-3xl">{selectedTierInfo.displayIcon}</span>
                                {selectedTierInfo.tier} Membership
                            </CardTitle>
                            <CardDescription>
                                {selectedTierInfo.annual_fee > 0
                                    ? `₱${selectedTierInfo.annual_fee.toLocaleString()}/year`
                                    : 'Free membership'}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}

                {/* Personal Information Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Personal Information</CardTitle>
                        <CardDescription>
                            Please provide your accurate personal details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <Label htmlFor="fullName" className="text-sm font-medium">
                                Full Name *
                            </Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                className={errors.fullName ? 'border-red-500' : ''}
                                disabled={isLoading || uploading}
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" /> {errors.fullName}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email Address *
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="your.email@example.com"
                                className={errors.email ? 'border-red-500' : ''}
                                disabled={isLoading || uploading}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" /> {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <Label htmlFor="phone" className="text-sm font-medium">
                                Phone Number *
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="09xxxxxxxxx or +639xxxxxxxxx"
                                className={errors.phone ? 'border-red-500' : ''}
                                disabled={isLoading || uploading}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" /> {errors.phone}
                                </p>
                            )}
                        </div>

                        {/* Address */}
                        <div>
                            <Label htmlFor="address" className="text-sm font-medium">
                                Complete Address *
                            </Label>
                            <Textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Street address, barangay, city, province, postal code"
                                rows={3}
                                className={errors.address ? 'border-red-500' : ''}
                                disabled={isLoading || uploading}
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" /> {errors.address}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* ID Upload Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Valid ID Upload</CardTitle>
                        <CardDescription>
                            Upload a clear photo of your valid ID (Passport, Driver's License, Voter ID, SSS, or TIN)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
                            errors.idFile ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                        }`}>
                            {idPreview ? (
                                <div className="space-y-4">
                                    <img
                                        src={idPreview}
                                        alt="ID Preview"
                                        className="max-h-48 mx-auto rounded-lg"
                                    />
                                    <div className="flex items-center justify-center gap-2 text-green-600">
                                        <CheckCircle className="h-5 w-5" />
                                        <span className="text-sm font-medium">
                                            {formData.idFile?.name}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            PNG, JPG, or PDF up to 5MB
                                        </p>
                                    </div>
                                </div>
                            )}

                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".jpg,.jpeg,.png,.pdf"
                                disabled={isLoading || uploading}
                                className="hidden"
                                id="idFile"
                            />
                            <label
                                htmlFor="idFile"
                                className="cursor-pointer"
                            />
                        </div>

                        {errors.idFile && (
                            <p className="text-red-500 text-sm flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" /> {errors.idFile}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Membership Type Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Membership Type</CardTitle>
                        <CardDescription>
                            Select your preferred membership tier
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.values(MEMBERSHIP_TIERS).map((tier) => (
                                <button
                                    key={tier.tier}
                                    type="button"
                                    onClick={() => handleInputChange({
                                        target: { name: 'membershipType', value: tier.tier }
                                    })}
                                    className={`p-4 rounded-lg border-2 transition text-left ${
                                        formData.membershipType === tier.tier
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    disabled={isLoading || uploading}
                                >
                                    <div className="text-2xl mb-2">{tier.displayIcon}</div>
                                    <div className="font-semibold text-gray-900">{tier.tier}</div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {tier.annual_fee > 0
                                            ? `₱${tier.annual_fee}/year`
                                            : 'Free'}
                                    </div>
                                </button>
                            ))}
                        </div>
                        {errors.membershipType && (
                            <p className="text-red-500 text-sm mt-4 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" /> {errors.membershipType}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Additional Notes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Additional Information</CardTitle>
                        <CardDescription>
                            Any additional details you'd like to share (optional)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            name="additionalNotes"
                            value={formData.additionalNotes}
                            onChange={handleInputChange}
                            placeholder="e.g., How did you hear about us? What are your main interests?"
                            rows={4}
                            disabled={isLoading || uploading}
                        />
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={isLoading || uploading}
                        className="flex-1"
                    >
                        {isLoading || uploading ? (
                            <>
                                <Loader className="h-4 w-4 mr-2 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Application'
                        )}
                    </Button>
                </div>

                {/* Info Banner */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <p className="text-sm text-blue-900">
                            <strong>What happens next?</strong> Your application will be reviewed by our team within 24-48 hours.
                            Activation will be set once your order is completed.
                        </p>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
