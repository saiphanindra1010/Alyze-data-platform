/**
 * Security Configuration
 * Centralized security constants and configurations
 */

export const SecurityConfig = {
    // JWT Configuration
    jwt: {
        accessTokenExpiry: '15m',        // Short-lived access tokens
        refreshTokenExpiry: '7d',        // Longer refresh tokens
        accessTokenExpirySeconds: 15 * 60,
        refreshTokenExpirySeconds: 7 * 24 * 60 * 60,
        algorithm: 'HS512',              // Stronger algorithm
    },

    // Cookie Configuration
    // Cookie Configuration
    cookies: {
        httpOnly: true,                  // Prevents XSS attacks
        secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
        sameSite: 'strict',              // CSRF protection
        path: '/',
        accessTokenName: process.env.NODE_ENV === 'production' ? '__Host-access-token' : 'access-token',
        refreshTokenName: process.env.NODE_ENV === 'production' ? '__Host-refresh-token' : 'refresh-token',
        csrfTokenName: 'csrf-token',
        fingerprintName: process.env.NODE_ENV === 'production' ? '__Host-fgp' : 'fgp',
    },

    // Rate Limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000,        // 15 minutes
        maxRequests: 100,                // 100 requests per window
        loginMaxAttempts: 5,             // 5 login attempts
        loginWindowMs: 15 * 60 * 1000,   // 15 minutes lockout
    },

    // Session Configuration
    session: {
        maxConcurrentSessions: 5,        // Max 5 devices logged in
        idleTimeout: 30 * 60 * 1000,     // 30 minutes idle timeout
    },

    // Password Security (for future email/password auth)
    password: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        saltRounds: 12,
    },

    // Security Headers
    headers: {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "https:"],
                scriptSrc: ["'self'"],
                connectSrc: ["'self'", "https://www.googleapis.com", "https://accounts.google.com"],
                frameSrc: ["'none'"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
            },
        },
        referrerPolicy: 'strict-origin-when-cross-origin',
        hsts: {
            maxAge: 31536000,              // 1 year
            includeSubDomains: true,
            preload: true,
        },
    },

    // Allowed Origins (update with your domains)
    cors: {
        allowedOrigins: [
            'http://localhost:5173',
            'http://localhost:3000',
            process.env.FRONTEND_URL,
        ].filter(Boolean),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Request-ID'],
        exposedHeaders: ['X-CSRF-Token'],
        credentials: true,
        maxAge: 86400, // 24 hours
    },
};

// Token fingerprint configuration
export const FingerprintConfig = {
    cookieName: '__Host-fgp',
    hashAlgorithm: 'sha256',
};

export default SecurityConfig;
