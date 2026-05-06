const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_REQUESTS = 300;

const blockedKeys = new Set(["__proto__", "prototype", "constructor"]);

const sanitizeValue = (value) => {
    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }

    if (value && typeof value === "object" && !(value instanceof Date)) {
        return Object.entries(value).reduce((clean, [key, nestedValue]) => {
            if (blockedKeys.has(key) || key.startsWith("$") || key.includes(".")) {
                return clean;
            }

            clean[key] = sanitizeValue(nestedValue);
            return clean;
        }, {});
    }

    return typeof value === "string" ? value.trim() : value;
};

export const securityHeaders = (req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
    res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    next();
};

export const sanitizeInput = (req, res, next) => {
    if (req.body && typeof req.body === "object") {
        req.body = sanitizeValue(req.body);
    }

    if (req.params && typeof req.params === "object") {
        Object.assign(req.params, sanitizeValue(req.params));
    }

    next();
};

export const createRateLimiter = ({
    windowMs = DEFAULT_WINDOW_MS,
    max = DEFAULT_MAX_REQUESTS,
} = {}) => {
    const hits = new Map();

    return (req, res, next) => {
        const now = Date.now();
        const key = req.ip || req.socket?.remoteAddress || "unknown";
        const record = hits.get(key);

        if (!record || record.resetAt <= now) {
            hits.set(key, { count: 1, resetAt: now + windowMs });
            return next();
        }

        record.count += 1;

        if (record.count > max) {
            const retryAfter = Math.ceil((record.resetAt - now) / 1000);
            res.setHeader("Retry-After", String(retryAfter));
            return res.status(429).json({
                success: false,
                message: "Too many requests. Please try again later",
            });
        }

        next();
    };
};
