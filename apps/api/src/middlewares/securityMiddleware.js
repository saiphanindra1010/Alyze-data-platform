/**
 * Security Headers Middleware
 * Prevents XSS, clickjacking, MIME sniffing, and other attacks
 */
import helmet from 'helmet';
import { SecurityConfig } from '../config/security.js';

/**
 * Configure Helmet for security headers
 */
export const securityHeaders = helmet({
    // Content Security Policy - Prevents XSS
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            scriptSrc: ["'self'"],
            connectSrc: [
                "'self'",
                "https://www.googleapis.com",
                "https://accounts.google.com",
                "https://oauth2.googleapis.com",
                process.env.FRONTEND_URL || "http://localhost:5173",
            ].filter(Boolean),
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"], // Prevents clickjacking
            upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
        },
        reportOnly: false,
    },

    // Strict Transport Security - Forces HTTPS
    strictTransportSecurity: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
    },

    // X-Content-Type-Options - Prevents MIME sniffing
    noSniff: true,

    // X-Frame-Options - Prevents clickjacking
    frameguard: {
        action: 'deny',
    },

    // X-XSS-Protection - Legacy XSS protection
    xssFilter: true,

    // Referrer Policy
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
    },

    // Permissions Policy - Restricts browser features
    permittedCrossDomainPolicies: {
        permittedPolicies: 'none',
    },

    // Hide X-Powered-By
    hidePoweredBy: true,

    // IE No Open
    ieNoOpen: true,

    // DNS Prefetch Control
    dnsPrefetchControl: {
        allow: false,
    },
});

/**
 * Custom security headers not covered by Helmet
 */
export const additionalSecurityHeaders = (req, res, next) => {
    // Permissions Policy (formerly Feature Policy)
    res.setHeader(
        'Permissions-Policy',
        'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()'
    );

    // Cache control for sensitive data
    if (req.path.includes('/auth') || req.path.includes('/profile')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }

    // Cross-Origin headers
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');

    next();
};

/**
 * XSS sanitization middleware
 * Sanitizes user input to prevent stored XSS
 */
export const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        if (typeof obj === 'string') {
            // Basic XSS prevention - escape HTML entities
            return obj
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;')
                .replace(/`/g, '&#x60;')
                .replace(/=/g, '&#x3D;');
        }
        if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    // Skip sanitization for certain fields
                    const skipFields = ['password', 'token', 'code'];
                    if (!skipFields.includes(key)) {
                        obj[key] = sanitize(obj[key]);
                    }
                }
            }
        }
        return obj;
    };

    // Sanitize body, query, and params
    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);
    if (req.params) req.params = sanitize(req.params);

    next();
};

/**
 * SQL Injection prevention (basic patterns)
 */
export const preventSQLInjection = (req, res, next) => {
    const sqlPatterns = [
        /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
        /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
        /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
        /((\%27)|(\'))union/i,
        /exec(\s|\+)+(s|x)p\w+/i,
    ];

    const checkForSQL = (obj) => {
        if (typeof obj === 'string') {
            for (const pattern of sqlPatterns) {
                if (pattern.test(obj)) {
                    return true;
                }
            }
        }
        if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    if (checkForSQL(obj[key])) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    if (checkForSQL(req.body) || checkForSQL(req.query) || checkForSQL(req.params)) {
        console.warn('⚠️ Potential SQL injection attempt from:', req.ip);
        return res.status(400).json({
            error: 'Invalid input detected',
            code: 'INVALID_INPUT'
        });
    }

    next();
};

/**
 * NoSQL Injection prevention
 */
export const preventNoSQLInjection = (req, res, next) => {
    const checkForNoSQL = (obj) => {
        if (typeof obj === 'object' && obj !== null) {
            // Check for MongoDB operators
            const dangerousKeys = ['$where', '$gt', '$lt', '$ne', '$in', '$nin', '$or', '$and', '$not', '$regex'];
            for (const key in obj) {
                if (dangerousKeys.includes(key)) {
                    return true;
                }
                if (typeof obj[key] === 'object' && checkForNoSQL(obj[key])) {
                    return true;
                }
            }
        }
        return false;
    };

    if (checkForNoSQL(req.body) || checkForNoSQL(req.query)) {
        console.warn('⚠️ Potential NoSQL injection attempt from:', req.ip);
        return res.status(400).json({
            error: 'Invalid input detected',
            code: 'INVALID_INPUT'
        });
    }

    next();
};

export default {
    securityHeaders,
    additionalSecurityHeaders,
    sanitizeInput,
    preventSQLInjection,
    preventNoSQLInjection,
};
