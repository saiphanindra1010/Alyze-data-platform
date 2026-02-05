/**
 * Rate Limiting Middleware
 * Prevents brute force attacks on authentication endpoints
 */
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import redisClient from '../config/redis.js';
import { SecurityConfig } from '../config/security.js';

/**
 * Custom Redis store for rate limiting
 */
class RedisStore {
    constructor() {
        this.prefix = 'rl:';
    }

    async increment(key) {
        const result = await redisClient.incrementRateLimit(
            this.prefix + key,
            Math.ceil(SecurityConfig.rateLimit.windowMs / 1000)
        );
        return {
            totalHits: result.count,
            resetTime: new Date(Date.now() + SecurityConfig.rateLimit.windowMs),
        };
    }

    async decrement(key) {
        const client = redisClient.getClient();
        if (client) {
            await client.decr(this.prefix + key);
        }
    }

    async resetKey(key) {
        const client = redisClient.getClient();
        if (client) {
            await client.del(this.prefix + key);
        }
    }
}

/**
 * Generate key based on IP and user (if authenticated).
 * ipKeyGenerator normalizes IPv6 so users can't bypass limits by rotating addresses.
 */
const keyGenerator = (req, res) => {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const userId = req.user?._id || 'anonymous';
    return `${ipKeyGenerator(ip)}:${userId}`;
};

/**
 * General API rate limiter
 */
export const generalRateLimiter = rateLimit({
    windowMs: SecurityConfig.rateLimit.windowMs,
    max: SecurityConfig.rateLimit.maxRequests,
    message: {
        error: 'Too many requests, please try again later',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(SecurityConfig.rateLimit.windowMs / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator,
    skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === '/health' || req.path === '/';
    },
});

/**
 * Strict rate limiter for login attempts
 */
export const loginRateLimiter = rateLimit({
    windowMs: SecurityConfig.rateLimit.loginWindowMs,
    max: SecurityConfig.rateLimit.loginMaxAttempts,
    message: {
        error: 'Too many login attempts. Please try again later.',
        code: 'LOGIN_RATE_LIMIT',
        retryAfter: Math.ceil(SecurityConfig.rateLimit.loginWindowMs / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req, res) => {
        const ip = req.ip || req.connection?.remoteAddress || 'unknown';
        return `login:${ipKeyGenerator(ip)}`;
    },
    skipSuccessfulRequests: true, // Don't count successful logins
});

/**
 * Very strict rate limiter for password reset
 */
export const passwordResetRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts per hour
    message: {
        error: 'Too many password reset attempts. Please try again later.',
        code: 'PASSWORD_RESET_RATE_LIMIT',
        retryAfter: 3600,
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req, res) => {
        const ip = req.ip || req.connection?.remoteAddress || 'unknown';
        return `pwreset:${ipKeyGenerator(ip)}`;
    },
});

/**
 * Token refresh rate limiter
 */
export const tokenRefreshRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 refresh attempts per minute
    message: {
        error: 'Too many token refresh attempts',
        code: 'REFRESH_RATE_LIMIT',
        retryAfter: 60,
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * IP-based blocking for suspicious activity
 */
export const suspiciousActivityHandler = async (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;

    // Check if IP is blocked
    const client = redisClient.getClient();
    if (client) {
        const isBlocked = await client.get(`blocked:${ip}`);
        if (isBlocked) {
            return res.status(403).json({
                error: 'Access denied due to suspicious activity',
                code: 'IP_BLOCKED'
            });
        }
    }

    next();
};

/**
 * Block IP for suspicious activity
 */
export const blockIP = async (ip, durationSeconds = 3600) => {
    const client = redisClient.getClient();
    if (client) {
        await client.setex(`blocked:${ip}`, durationSeconds, 'blocked');
        console.warn(`🚫 Blocked IP: ${ip} for ${durationSeconds} seconds`);
    }
};

export default {
    generalRateLimiter,
    loginRateLimiter,
    passwordResetRateLimiter,
    tokenRefreshRateLimiter,
    suspiciousActivityHandler,
    blockIP,
};
