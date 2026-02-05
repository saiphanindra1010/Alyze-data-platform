/**
 * Authentication Middleware
 * Verifies JWT tokens with fingerprint binding
 */
import tokenService from '../services/tokenService.js';
import { SecurityConfig } from '../config/security.js';

/**
 * Main authentication middleware
 * Validates access token and fingerprint binding
 */
export const authenticateToken = async (req, res, next) => {
    try {
        // Get access token from HTTP-only cookie
        const accessToken = req.cookies[SecurityConfig.cookies.accessTokenName];

        // Fallback to Authorization header for API clients
        const authHeader = req.headers.authorization;
        const token = accessToken || (authHeader && authHeader.split(' ')[1]);

        if (!token) {
            return res.status(401).json({
                error: 'Authentication required',
                code: 'NO_TOKEN'
            });
        }

        // Get fingerprint from cookie
        const fingerprint = req.cookies[SecurityConfig.cookies.fingerprintName];

        // Verify token with fingerprint binding
        const result = await tokenService.verifyAccessToken(token, fingerprint);

        if (!result.valid) {
            // Check if token expired - client should use refresh token
            if (result.error === 'jwt expired') {
                return res.status(401).json({
                    error: 'Token expired',
                    code: 'TOKEN_EXPIRED'
                });
            }

            return res.status(401).json({
                error: 'Invalid token',
                code: 'INVALID_TOKEN'
            });
        }

        // Attach user data to request
        req.user = result.decoded;
        req.tokenId = result.decoded.jti;

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            error: 'Authentication failed',
            code: 'AUTH_ERROR'
        });
    }
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const accessToken = req.cookies[SecurityConfig.cookies.accessTokenName];
        const authHeader = req.headers.authorization;
        const token = accessToken || (authHeader && authHeader.split(' ')[1]);

        if (token) {
            const fingerprint = req.cookies[SecurityConfig.cookies.fingerprintName];
            const result = await tokenService.verifyAccessToken(token, fingerprint);

            if (result.valid) {
                req.user = result.decoded;
                req.tokenId = result.decoded.jti;
            }
        }

        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};

/**
 * Refresh token authentication
 * Used only for token refresh endpoint
 */
export const authenticateRefreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies[SecurityConfig.cookies.refreshTokenName];

        if (!refreshToken) {
            return res.status(401).json({
                error: 'Refresh token required',
                code: 'NO_REFRESH_TOKEN'
            });
        }

        const fingerprint = req.cookies[SecurityConfig.cookies.fingerprintName];
        const result = await tokenService.verifyRefreshToken(refreshToken, fingerprint);

        if (!result.valid) {
            return res.status(401).json({
                error: result.error || 'Invalid refresh token',
                code: 'INVALID_REFRESH_TOKEN'
            });
        }

        req.user = result.decoded;
        req.refreshTokenId = result.decoded.jti;
        req.sessionId = result.decoded.sid;

        next();
    } catch (error) {
        console.error('Refresh token error:', error);
        return res.status(500).json({
            error: 'Token refresh failed',
            code: 'REFRESH_ERROR'
        });
    }
};

export default { authenticateToken, optionalAuth, authenticateRefreshToken };
