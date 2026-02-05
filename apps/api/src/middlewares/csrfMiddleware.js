/**
 * CSRF Protection Middleware
 * Implements double-submit cookie pattern with Redis-backed validation
 */
import tokenService from '../services/tokenService.js';
import { SecurityConfig } from '../config/security.js';

/**
 * Generate and set CSRF token
 * Call this after successful login
 */
export const generateCSRFToken = async (req, res, next) => {
    try {
        const sessionId = req.sessionId || req.user?.sid || req.cookies?.sid;

        if (!sessionId) {
            return next();
        }

        const csrfToken = tokenService.generateCSRFToken();

        // Store in Redis
        await tokenService.storeCSRFToken(sessionId, csrfToken);

        // Set in cookie (not HttpOnly - needs to be readable by JS)
        res.cookie(SecurityConfig.cookies.csrfTokenName, csrfToken, {
            httpOnly: false,  // JS needs to read this
            secure: SecurityConfig.cookies.secure,
            sameSite: 'strict',
            path: '/',
            maxAge: 3600000, // 1 hour
        });

        // Also expose in response header
        res.set('X-CSRF-Token', csrfToken);

        req.csrfToken = csrfToken;
        next();
    } catch (error) {
        console.error('CSRF token generation error:', error);
        next();
    }
};

/**
 * Validate CSRF token
 * Apply to all state-changing requests (POST, PUT, DELETE, PATCH)
 */
export const validateCSRFToken = async (req, res, next) => {
    // Skip CSRF for safe methods
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    if (safeMethods.includes(req.method)) {
        return next();
    }

    try {
        const sessionId = req.sessionId || req.user?.sid || req.cookies?.sid;

        if (!sessionId) {
            return res.status(403).json({
                error: 'Session required for CSRF validation',
                code: 'NO_SESSION'
            });
        }

        // Get CSRF token from header or body
        const csrfToken =
            req.headers['x-csrf-token'] ||
            req.headers['csrf-token'] ||
            req.body?._csrf;

        if (!csrfToken) {
            return res.status(403).json({
                error: 'CSRF token required',
                code: 'NO_CSRF_TOKEN'
            });
        }

        // Validate against stored token
        const isValid = await tokenService.validateCSRFToken(sessionId, csrfToken);

        if (!isValid) {
            console.warn('⚠️ CSRF token validation failed for session:', sessionId);
            return res.status(403).json({
                error: 'Invalid CSRF token',
                code: 'INVALID_CSRF_TOKEN'
            });
        }

        next();
    } catch (error) {
        console.error('CSRF validation error:', error);
        return res.status(500).json({
            error: 'CSRF validation failed',
            code: 'CSRF_ERROR'
        });
    }
};

/**
 * Refresh CSRF token
 * Should be called periodically or after sensitive operations
 */
export const refreshCSRFToken = async (req, res) => {
    try {
        const sessionId = req.sessionId || req.user?.sid || req.cookies?.sid;

        if (!sessionId) {
            return res.status(401).json({
                error: 'Authentication required',
                code: 'NO_SESSION'
            });
        }

        const csrfToken = tokenService.generateCSRFToken();
        await tokenService.storeCSRFToken(sessionId, csrfToken);

        res.cookie(SecurityConfig.cookies.csrfTokenName, csrfToken, {
            httpOnly: false,
            secure: SecurityConfig.cookies.secure,
            sameSite: 'strict',
            path: '/',
            maxAge: 3600000,
        });

        res.json({ csrfToken });
    } catch (error) {
        console.error('CSRF refresh error:', error);
        res.status(500).json({
            error: 'Failed to refresh CSRF token',
            code: 'CSRF_REFRESH_ERROR'
        });
    }
};

export default { generateCSRFToken, validateCSRFToken, refreshCSRFToken };
