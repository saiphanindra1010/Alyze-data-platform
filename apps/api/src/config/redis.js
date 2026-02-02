/**
 * Redis Configuration - Secure Session & Token Management
 * Used for token blacklisting, session storage, and rate limiting
 */
import Redis from 'ioredis';

class RedisClient {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    /**
     * Build Redis URL from REDIS_URL or from REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD
     */
    _getRedisUrl() {
        if (process.env.REDIS_URL) {
            return process.env.REDIS_URL;
        }
        const host = process.env.REDIS_HOST || 'localhost';
        const port = process.env.REDIS_PORT || '6379';
        const username = process.env.REDIS_USERNAME || '';
        const password = process.env.REDIS_PASSWORD || '';
        const protocol = process.env.REDIS_TLS === '1' ? 'rediss' : 'redis';
        const auth = password
            ? (username ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@` : `:${encodeURIComponent(password)}@`)
            : '';
        return `${protocol}://${auth}${host}:${port}`;
    }

    async connect() {
        try {
            const redisUrl = this._getRedisUrl();
            const useTls = redisUrl.startsWith('rediss://') ||
                process.env.NODE_ENV === 'production' ||
                process.env.REDIS_TLS === '1';

            this.client = new Redis(redisUrl, {
                maxRetriesPerRequest: 3,
                retryDelayOnFailover: 100,
                enableReadyCheck: true,
                lazyConnect: true,
                ...(useTls && {
                    tls: {
                        rejectUnauthorized: true
                    }
                })
            });

            this.client.on('connect', () => {
                this.isConnected = true;
                console.log('✅ Redis connected successfully');
            });

            this.client.on('error', (err) => {
                console.error('❌ Redis connection error:', err);
                this.isConnected = false;
            });

            this.client.on('close', () => {
                this.isConnected = false;
                console.log('🔴 Redis connection closed');
            });

            await this.client.connect();
            return this.client;
        } catch (error) {
            console.error('❌ Failed to connect to Redis:', error);
            throw error;
        }
    }

    getClient() {
        return this.client;
    }

    isReady() {
        return this.isConnected && this.client;
    }

    // Token blacklisting functions
    async blacklistToken(token, expiresInSeconds) {
        if (!this.isReady()) return false;
        try {
            await this.client.setex(`blacklist:${token}`, expiresInSeconds, 'true');
            return true;
        } catch (error) {
            console.error('Error blacklisting token:', error);
            return false;
        }
    }

    async isTokenBlacklisted(token) {
        if (!this.isReady()) return false;
        try {
            const result = await this.client.get(`blacklist:${token}`);
            return result === 'true';
        } catch (error) {
            console.error('Error checking blacklist:', error);
            return false;
        }
    }

    // Session management functions
    async setSession(userId, sessionData, expiresInSeconds) {
        if (!this.isReady()) return false;
        try {
            await this.client.setex(
                `session:${userId}:${sessionData.sessionId}`,
                expiresInSeconds,
                JSON.stringify(sessionData)
            );
            return true;
        } catch (error) {
            console.error('Error setting session:', error);
            return false;
        }
    }

    async getSession(userId, sessionId) {
        if (!this.isReady()) return null;
        try {
            const result = await this.client.get(`session:${userId}:${sessionId}`);
            return result ? JSON.parse(result) : null;
        } catch (error) {
            console.error('Error getting session:', error);
            return null;
        }
    }

    async deleteSession(userId, sessionId) {
        if (!this.isReady()) return false;
        try {
            await this.client.del(`session:${userId}:${sessionId}`);
            return true;
        } catch (error) {
            console.error('Error deleting session:', error);
            return false;
        }
    }

    async deleteAllUserSessions(userId) {
        if (!this.isReady()) return false;
        try {
            const keys = await this.client.keys(`session:${userId}:*`);
            if (keys.length > 0) {
                await this.client.del(...keys);
            }
            return true;
        } catch (error) {
            console.error('Error deleting all user sessions:', error);
            return false;
        }
    }

    // Refresh token storage
    async storeRefreshToken(userId, tokenId, expiresInSeconds) {
        if (!this.isReady()) return false;
        try {
            await this.client.setex(`refresh:${userId}:${tokenId}`, expiresInSeconds, 'valid');
            return true;
        } catch (error) {
            console.error('Error storing refresh token:', error);
            return false;
        }
    }

    async isRefreshTokenValid(userId, tokenId) {
        if (!this.isReady()) return false;
        try {
            const result = await this.client.get(`refresh:${userId}:${tokenId}`);
            return result === 'valid';
        } catch (error) {
            console.error('Error validating refresh token:', error);
            return false;
        }
    }

    async revokeRefreshToken(userId, tokenId) {
        if (!this.isReady()) return false;
        try {
            await this.client.del(`refresh:${userId}:${tokenId}`);
            return true;
        } catch (error) {
            console.error('Error revoking refresh token:', error);
            return false;
        }
    }

    // Rate limiting helpers
    async incrementRateLimit(key, windowSeconds) {
        if (!this.isReady()) return { count: 0 };
        try {
            const multi = this.client.multi();
            multi.incr(key);
            multi.expire(key, windowSeconds);
            const results = await multi.exec();
            return { count: results[0][1] };
        } catch (error) {
            console.error('Error incrementing rate limit:', error);
            return { count: 0 };
        }
    }

    // CSRF token storage
    async storeCSRFToken(sessionId, csrfToken, expiresInSeconds = 3600) {
        if (!this.isReady()) return false;
        try {
            await this.client.setex(`csrf:${sessionId}`, expiresInSeconds, csrfToken);
            return true;
        } catch (error) {
            console.error('Error storing CSRF token:', error);
            return false;
        }
    }

    async getCSRFToken(sessionId) {
        if (!this.isReady()) return null;
        try {
            return await this.client.get(`csrf:${sessionId}`);
        } catch (error) {
            console.error('Error getting CSRF token:', error);
            return null;
        }
    }

    async disconnect() {
        if (this.client) {
            await this.client.quit();
            this.isConnected = false;
        }
    }
}

// Singleton instance
const redisClient = new RedisClient();

export default redisClient;
