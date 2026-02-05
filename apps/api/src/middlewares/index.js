/**
 * Middleware Exports
 * Central export point for all security middlewares
 */

// Authentication
export {
    authenticateToken,
    optionalAuth,
    authenticateRefreshToken,
} from './authMiddleware.js';

// CSRF Protection
export {
    generateCSRFToken,
    validateCSRFToken,
    refreshCSRFToken,
} from './csrfMiddleware.js';

// Rate Limiting
export {
    generalRateLimiter,
    loginRateLimiter,
    passwordResetRateLimiter,
    tokenRefreshRateLimiter,
    suspiciousActivityHandler,
    blockIP,
} from './rateLimitMiddleware.js';

// Security Headers & Input Validation
export {
    securityHeaders,
    additionalSecurityHeaders,
    sanitizeInput,
    preventSQLInjection,
    preventNoSQLInjection,
} from './securityMiddleware.js';
