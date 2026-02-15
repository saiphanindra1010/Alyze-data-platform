/**
 * Secure Token Service
 * Handles JWT generation with fingerprinting, hashing, and validation
 */
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { SecurityConfig, FingerprintConfig } from '../config/security.js';
import redisClient from '../config/redis.js';

class TokenService {
    /**
     * Generate a cryptographically secure random string
     */
    generateSecureRandom(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }

    /**
     * Generate a fingerprint for token binding
     * This creates a unique identifier based on the request
     */
    generateFingerprint() {
        const fingerprint = this.generateSecureRandom(32);
        const hash = crypto
            .createHash(FingerprintConfig.hashAlgorithm)
            .update(fingerprint)
            .digest('hex');

        return { fingerprint, hash };
    }

    /**
     * Hash a fingerprint for comparison
     */
    hashFingerprint(fingerprint) {
        return crypto
            .createHash(FingerprintConfig.hashAlgorithm)
            .update(fingerprint)
            .digest('hex');
    }

    /**
     * Generate Access Token (short-lived)
     */
    generateAccessToken(payload, fingerprintHash) {
        const tokenId = uuidv4();

        const tokenPayload = {
            ...payload,
            jti: tokenId,                    // JWT ID for revocation
            fph: fingerprintHash,            // Fingerprint hash for binding
            type: 'access',
            iat: Math.floor(Date.now() / 1000),
        };

        return jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: SecurityConfig.jwt.accessTokenExpiry,
            algorithm: SecurityConfig.jwt.algorithm,
            issuer: 'analatica-api',
            audience: 'analatica-client',
        });
    }

    /**
     * Generate Refresh Token (long-lived, stored in Redis)
     * @param {string} userId
     * @param {string} fingerprintHash
     * @param {string} [email] - Optional; include for access token generation on refresh
     */
    async generateRefreshToken(userId, fingerprintHash, email) {
        const tokenId = uuidv4();
        const sessionId = uuidv4();

        const tokenPayload = {
            userId,
            ...(email && { email }),
            jti: tokenId,
            sid: sessionId,
            fph: fingerprintHash,
            type: 'refresh',
            iat: Math.floor(Date.now() / 1000),
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
            expiresIn: SecurityConfig.jwt.refreshTokenExpiry,
            algorithm: SecurityConfig.jwt.algorithm,
            issuer: 'analatica-api',
            audience: 'analatica-client',
        });

        // Store refresh token in Redis for validation
        await redisClient.storeRefreshToken(
            userId,
            tokenId,
            SecurityConfig.jwt.refreshTokenExpirySeconds
        );

        // Store session data
        await redisClient.setSession(userId, {
            sessionId,
            tokenId,
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
        }, SecurityConfig.jwt.refreshTokenExpirySeconds);

        return { token, sessionId, tokenId };
    }

    /**
     * Verify Access Token with fingerprint validation
     */
    async verifyAccessToken(token, fingerprint) {
        try {
            // Check if token is blacklisted
            const isBlacklisted = await redisClient.isTokenBlacklisted(token);
            if (isBlacklisted) {
                throw new Error('Token has been revoked');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET, {
                algorithms: [SecurityConfig.jwt.algorithm],
                issuer: 'analatica-api',
                audience: 'analatica-client',
            });

            // Verify token type
            if (decoded.type !== 'access') {
                throw new Error('Invalid token type');
            }

            // Verify fingerprint binding
            if (fingerprint) {
                const fingerprintHash = this.hashFingerprint(fingerprint);
                if (decoded.fph !== fingerprintHash) {
                    console.warn('⚠️ Token fingerprint mismatch - possible token theft attempt');
                    throw new Error('Token fingerprint mismatch');
                }
            }

            return { valid: true, decoded };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }

    /**
     * Verify Refresh Token and check Redis validity
     */
    async verifyRefreshToken(token, fingerprint) {
        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
                {
                    algorithms: [SecurityConfig.jwt.algorithm],
                    issuer: 'analatica-api',
                    audience: 'analatica-client',
                }
            );

            // Verify token type
            if (decoded.type !== 'refresh') {
                throw new Error('Invalid token type');
            }

            // Verify fingerprint binding
            if (fingerprint) {
                const fingerprintHash = this.hashFingerprint(fingerprint);
                if (decoded.fph !== fingerprintHash) {
                    console.warn('⚠️ Refresh token fingerprint mismatch - possible token theft');
                    // Revoke all user sessions on suspected theft
                    await redisClient.deleteAllUserSessions(decoded.userId);
                    throw new Error('Token fingerprint mismatch - all sessions revoked');
                }
            }

            // Verify token exists in Redis (not revoked)
            const isValid = await redisClient.isRefreshTokenValid(decoded.userId, decoded.jti);
            if (!isValid) {
                throw new Error('Refresh token has been revoked');
            }

            return { valid: true, decoded };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }

    /**
     * Revoke Access Token (blacklist)
     */
    async revokeAccessToken(token) {
        try {
            const decoded = jwt.decode(token);
            if (!decoded) return false;

            // Calculate remaining time until expiry
            const exp = decoded.exp * 1000;
            const now = Date.now();
            const remainingSeconds = Math.max(0, Math.floor((exp - now) / 1000));

            if (remainingSeconds > 0) {
                await redisClient.blacklistToken(token, remainingSeconds);
            }
            return true;
        } catch (error) {
            console.error('Error revoking access token:', error);
            return false;
        }
    }

    /**
     * Revoke Refresh Token
     */
    async revokeRefreshToken(userId, tokenId) {
        return await redisClient.revokeRefreshToken(userId, tokenId);
    }

    /**
     * Revoke all user tokens (logout from all devices)
     */
    async revokeAllUserTokens(userId) {
        return await redisClient.deleteAllUserSessions(userId);
    }

    /**
     * Generate CSRF Token
     */
    generateCSRFToken() {
        return this.generateSecureRandom(32);
    }

    /**
     * Store CSRF Token in Redis
     */
    async storeCSRFToken(sessionId, csrfToken) {
        return await redisClient.storeCSRFToken(sessionId, csrfToken);
    }

    /**
     * Validate CSRF Token
     */
    async validateCSRFToken(sessionId, providedToken) {
        const storedToken = await redisClient.getCSRFToken(sessionId);
        if (!storedToken || storedToken !== providedToken) {
            return false;
        }
        return true;
    }

    /**
     * Rotate tokens (issue new access token using refresh token)
     */
    async rotateTokens(refreshToken, fingerprint) {
        const result = await this.verifyRefreshToken(refreshToken, fingerprint);

        if (!result.valid) {
            throw new Error(result.error || 'Invalid refresh token');
        }

        const { decoded } = result;
        const { fingerprint: newFingerprint, hash: newHash } = this.generateFingerprint();

        // Generate new access token
        const accessToken = this.generateAccessToken(
            { _id: decoded.userId, email: decoded.email },
            newHash
        );

        // Optionally rotate refresh token too (more secure)
        // For now, we keep the same refresh token

        return {
            accessToken,
            fingerprint: newFingerprint,
            expiresIn: SecurityConfig.jwt.accessTokenExpirySeconds,
        };
    }
}

const tokenService = new TokenService();
export default tokenService;
