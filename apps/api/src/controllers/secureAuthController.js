/**
 * Secure Authentication Controller
 * Handles login, logout, token refresh, and session management
 */
import axios from "axios";
import initializeOAuthClient from "../utils/googleconfig.js";
import User from "../models/userModel.js";
import tokenService from "../services/tokenService.js";
import redisClient from "../config/redis.js";
import { SecurityConfig } from "../config/security.js";

/**
 * Set secure authentication cookies
 */
const setAuthCookies = (res, accessToken, refreshToken, fingerprint, sessionId) => {
    const isProduction = process.env.NODE_ENV === 'production';

    // Access Token Cookie
    res.cookie(SecurityConfig.cookies.accessTokenName, accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/',
        maxAge: SecurityConfig.jwt.accessTokenExpirySeconds * 1000,
    });

    // Refresh Token Cookie  
    res.cookie(SecurityConfig.cookies.refreshTokenName, refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/auth', // Only sent to auth routes
        maxAge: SecurityConfig.jwt.refreshTokenExpirySeconds * 1000,
    });

    // Fingerprint Cookie
    res.cookie(SecurityConfig.cookies.fingerprintName, fingerprint, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/',
        maxAge: SecurityConfig.jwt.refreshTokenExpirySeconds * 1000,
    });

    // Session ID cookie (for CSRF)
    res.cookie('sid', sessionId, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/',
        maxAge: SecurityConfig.jwt.refreshTokenExpirySeconds * 1000,
    });
};

/**
 * Clear authentication cookies
 */
const clearAuthCookies = (res) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    };

    res.clearCookie(SecurityConfig.cookies.accessTokenName, cookieOptions);
    res.clearCookie(SecurityConfig.cookies.refreshTokenName, { ...cookieOptions, path: '/auth' });
    res.clearCookie(SecurityConfig.cookies.fingerprintName, cookieOptions);
    res.clearCookie('sid', cookieOptions);
    res.clearCookie('csrf-token', { ...cookieOptions, httpOnly: false });
};

/**
 * Google OAuth Login Handler
 */
export const googleLogin = async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({
                error: 'Authorization code required',
                code: 'NO_AUTH_CODE'
            });
        }

        console.log('🔐 Processing Google OAuth login...');

        // Exchange code for tokens
        const Oauth2client = initializeOAuthClient();
        const googleRes = await Oauth2client.getToken(code);
        Oauth2client.setCredentials(googleRes.tokens);

        // Get user info from Google
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );

        const { email, name, picture } = userRes.data;

        // Validate email domain (optional - add your domain restrictions)
        // if (!email.endsWith('@yourcompany.com')) {
        //   return res.status(403).json({ error: 'Email domain not allowed' });
        // }

        // Find or create user
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name,
                email,
                profilePicture: picture,
                authProvider: 'google',
                lastLogin: new Date(),
            });
            console.log('✨ New user created:', email);
        } else {
            // Update last login
            user.lastLogin = new Date();
            await user.save();
        }

        // Generate fingerprint
        const { fingerprint, hash: fingerprintHash } = tokenService.generateFingerprint();

        // Generate tokens
        const accessToken = tokenService.generateAccessToken(
            { _id: user._id, email: user.email },
            fingerprintHash
        );

        const { token: refreshToken, sessionId } = await tokenService.generateRefreshToken(
            user._id.toString(),
            fingerprintHash,
            user.email
        );

        // Generate CSRF token
        const csrfToken = tokenService.generateCSRFToken();
        await tokenService.storeCSRFToken(sessionId, csrfToken);

        // Set secure cookies
        setAuthCookies(res, accessToken, refreshToken, fingerprint, sessionId);

        // Set CSRF token cookie (readable by JS)
        res.cookie('csrf-token', csrfToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 3600000,
        });

        console.log('✅ Login successful for:', email);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
            },
            csrfToken, // Send to client for state-changing requests
            expiresIn: SecurityConfig.jwt.accessTokenExpirySeconds,
        });

    } catch (err) {
        console.error('❌ Google login error:', err);
        return res.status(500).json({
            error: 'Authentication failed',
            code: 'AUTH_FAILED'
        });
    }
};

/**
 * Refresh Access Token
 */
export const refreshToken = async (req, res) => {
    try {
        const { user, sessionId } = req;

        // Generate new fingerprint
        const { fingerprint, hash: fingerprintHash } = tokenService.generateFingerprint();

        // Email may be in refresh token (new) or fetch from DB (legacy tokens)
        let email = user.email;
        if (!email) {
            const u = await User.findById(user.userId).select('email').lean();
            email = u?.email;
        }
        const accessToken = tokenService.generateAccessToken(
            { _id: user.userId, email: email || '' },
            fingerprintHash
        );

        // Update fingerprint cookie
        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('access-token', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            path: '/',
            maxAge: SecurityConfig.jwt.accessTokenExpirySeconds * 1000,
        });

        res.cookie('fgp', fingerprint, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            path: '/',
            maxAge: SecurityConfig.jwt.refreshTokenExpirySeconds * 1000,
        });

        // Generate new CSRF token
        const csrfToken = tokenService.generateCSRFToken();
        await tokenService.storeCSRFToken(sessionId, csrfToken);

        res.cookie('csrf-token', csrfToken, {
            httpOnly: false,
            secure: isProduction,
            sameSite: 'strict',
            path: '/',
            maxAge: 3600000,
        });

        console.log('🔄 Token refreshed for user:', user.userId);

        return res.status(200).json({
            success: true,
            message: 'Token refreshed',
            csrfToken,
            expiresIn: SecurityConfig.jwt.accessTokenExpirySeconds,
        });

    } catch (err) {
        console.error('❌ Token refresh error:', err);
        clearAuthCookies(res);
        return res.status(500).json({
            error: 'Token refresh failed',
            code: 'REFRESH_FAILED'
        });
    }
};

/**
 * Logout - Single device
 */
export const logout = async (req, res) => {
    try {
        const accessToken = req.cookies['access-token'];
        const { user, refreshTokenId, sessionId } = req;

        // Blacklist the access token
        if (accessToken) {
            await tokenService.revokeAccessToken(accessToken);
        }

        // Revoke refresh token
        if (user?.userId && refreshTokenId) {
            await tokenService.revokeRefreshToken(user.userId, refreshTokenId);
        }

        // Delete session
        if (user?.userId && sessionId) {
            await redisClient.deleteSession(user.userId, sessionId);
        }

        // Clear all auth cookies
        clearAuthCookies(res);

        console.log('👋 User logged out:', user?.userId);

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (err) {
        console.error('❌ Logout error:', err);
        // Still clear cookies even if there's an error
        clearAuthCookies(res);
        return res.status(200).json({
            success: true,
            message: 'Logged out'
        });
    }
};

/**
 * Logout from all devices
 */
export const logoutAll = async (req, res) => {
    try {
        const { user } = req;

        if (user?.userId || user?._id) {
            const userId = user.userId || user._id;
            await tokenService.revokeAllUserTokens(userId);
            console.log('👋 User logged out from all devices:', userId);
        }

        clearAuthCookies(res);

        return res.status(200).json({
            success: true,
            message: 'Logged out from all devices'
        });

    } catch (err) {
        console.error('❌ Logout all error:', err);
        clearAuthCookies(res);
        return res.status(200).json({
            success: true,
            message: 'Logged out from all devices'
        });
    }
};

/**
 * Validate current session
 */
export const validateSession = async (req, res) => {
    try {
        const { user } = req;

        // Get fresh user data
        const freshUser = await User.findById(user._id).select('-password');

        if (!freshUser) {
            clearAuthCookies(res);
            return res.status(401).json({
                error: 'User not found',
                code: 'USER_NOT_FOUND'
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: freshUser._id,
                name: freshUser.name,
                email: freshUser.email,
                profilePicture: freshUser.profilePicture,
            },
            sessionValid: true,
        });

    } catch (err) {
        console.error('❌ Session validation error:', err);
        return res.status(500).json({
            error: 'Session validation failed',
            code: 'VALIDATION_FAILED'
        });
    }
};

/**
 * Get CSRF token
 */
export const getCSRFToken = async (req, res) => {
    try {
        const sessionId = req.cookies['sid'];

        if (!sessionId) {
            return res.status(401).json({
                error: 'Session required',
                code: 'NO_SESSION'
            });
        }

        const csrfToken = tokenService.generateCSRFToken();
        await tokenService.storeCSRFToken(sessionId, csrfToken);

        res.cookie('csrf-token', csrfToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 3600000,
        });

        return res.status(200).json({
            csrfToken
        });

    } catch (err) {
        console.error('❌ CSRF token error:', err);
        return res.status(500).json({
            error: 'Failed to generate CSRF token',
            code: 'CSRF_ERROR'
        });
    }
};

export default {
    googleLogin,
    refreshToken,
    logout,
    logoutAll,
    validateSession,
    getCSRFToken,
};
