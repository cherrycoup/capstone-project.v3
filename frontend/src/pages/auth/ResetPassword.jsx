import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { authAPI } from "../../utils/api.js";
import { KeyRound, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    useEffect(() => {
        if (!token || !email) {
            console.warn("Reset password page loaded without token or email", {
                hasToken: !!token,
                hasEmail: !!email,
                searchParams: Object.fromEntries(searchParams),
            });
        }
    }, [token, email, searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!token || !email) {
            setError("Invalid or expired reset link");
            return;
        }

        if (!password || !confirmPassword) {
            setError("Please enter a new password");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!/[A-Za-z]/.test(password) || !/\d/.test(password) || password.length < 8) {
            setError("Password must be at least 8 characters and include a letter and a number");
            return;
        }

        setLoading(true);
        try {
            await authAPI.resetPassword({ email, token, password });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8">
                        <div className="flex items-center justify-center mb-4">
                            <AlertCircle className="h-12 w-12 text-red-600" />
                        </div>
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-3">Invalid Reset Link</h1>
                            <p className="text-base text-gray-700 mb-2">
                                The password reset link is missing required information.
                            </p>
                            <p className="text-sm text-gray-600">
                                This typically happens when:
                            </p>
                            <ul className="text-sm text-gray-600 mt-2 space-y-1 text-left">
                                <li>• The link in your email was incomplete or corrupted</li>
                                <li>• The link has expired (valid for 30 minutes)</li>
                                <li>• You manually edited the URL</li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <Link
                                to="/forgot-password"
                                className="block text-center py-3 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                            >
                                Request a New Reset Link
                            </Link>
                            <Link
                                to="/login"
                                className="block text-center py-3 px-6 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                            >
                                Back to Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-8">
                    <div className="flex items-center justify-center mb-6">
                        <div className="rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 p-3">
                            <KeyRound className="h-6 w-6 text-white" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
                        Create New Password
                    </h1>
                    <p className="text-sm text-gray-500 text-center mb-8">
                        Enter your new password below
                    </p>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {success ? (
                        <div className="space-y-6">
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-700 font-medium">
                                    Password reset successfully!
                                </p>
                                <p className="text-sm text-green-600 mt-2">
                                    You can now sign in with your new password.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                            >
                                Sign In
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                        placeholder="Create a new password"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                        placeholder="Confirm your new password"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    At least 8 characters with a letter and number
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    )}

                    {!success && (
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Remember your password?{" "}
                                <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
