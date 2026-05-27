import mongoose from "mongoose";

export const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

export const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizeEmail(value));

export const normalizePhone = (value) =>
    String(value || "").replace(/[^\d+]/g, "").trim();

export const isValidPhone = (value) => {
    const phone = normalizePhone(value);
    return /^(09\d{9}|\+639\d{9}|\d{7,15})$/.test(phone);
};

export const cleanString = (value, maxLength = 255) => {
    if (value === undefined || value === null) return "";
    return String(value).trim().slice(0, maxLength);
};

export const cleanOptionalUrl = (value, maxLength = 1000) => {
    const url = cleanString(value, maxLength);
    if (!url) return "";

    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:" ? url : "";
    } catch (error) {
        return "";
    }
};

export const cleanProfileImage = (value) => {
    const imageValue = cleanString(value, 1_500_000);
    if (!imageValue) return "";

    if (/^data:image\/(png|jpeg|jpg|webp);base64,[a-z0-9+/=]+$/i.test(imageValue)) {
        return imageValue;
    }

    return cleanOptionalUrl(imageValue);
};

export const parseCurrency = (value) => {
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue) || numberValue < 0) return null;
    return Math.round(numberValue * 100) / 100;
};

export const parseStockQuantity = (value) => {
    const numberValue = Number(value);
    if (!Number.isInteger(numberValue) || numberValue < 0) return null;
    return numberValue;
};

export const parseOrderQuantity = (value) => {
    const numberValue = Number(value);
    if (!Number.isInteger(numberValue) || numberValue < 1 || numberValue > 999) return null;
    return numberValue;
};

export const isValidFutureDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date >= today;
};

export const isStrongPassword = (password) => {
    if (typeof password !== "string" || password.length < 8) return false;

    return /[A-Za-z]/.test(password) && /\d/.test(password);
};

export const isStaffRole = (role) => {
    const normalized = String(role || "").toLowerCase();
    return normalized === "admin" || normalized === "staff";
};

export const isAdminRole = (role) => String(role || "").toLowerCase() === "admin";
