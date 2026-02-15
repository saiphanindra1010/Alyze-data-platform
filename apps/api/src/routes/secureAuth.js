/**
 * Secure Authentication Routes
 * All auth endpoints with proper security middleware
 */
import express from "express";
import {
    googleLogin,
    refreshToken,
    logout,
    logoutAll,
    validateSession,
    getCSRFToken,
} from "../controllers/secureAuthController.js";
import { authenticateToken, authenticateRefreshToken } from "../middlewares/authMiddleware.js";
import { validateCSRFToken } from "../middlewares/csrfMiddleware.js";
import { loginRateLimiter, tokenRefreshRateLimiter } from "../middlewares/rateLimitMiddleware.js";

const router = express.Router();

/**
 * @route   GET /auth/google
 * @desc    Google OAuth login callback
 * @access  Public
 */
router.get("/google", loginRateLimiter, googleLogin);

/**
 * @route   POST /auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Authenticated (refresh token)
 */
router.post("/refresh", tokenRefreshRateLimiter, authenticateRefreshToken, refreshToken);

/**
 * @route   POST /auth/logout
 * @desc    Logout from current device
 * @access  Authenticated
 */
router.post("/logout", authenticateRefreshToken, logout);

/**
 * @route   POST /auth/logout-all
 * @desc    Logout from all devices
 * @access  Authenticated
 */
router.post("/logout-all", authenticateToken, validateCSRFToken, logoutAll);

/**
 * @route   GET /auth/session
 * @desc    Validate current session and get user info
 * @access  Authenticated
 */
router.get("/session", authenticateToken, validateSession);

/**
 * @route   GET /auth/csrf
 * @desc    Get a new CSRF token
 * @access  Authenticated (session required)
 */
router.get("/csrf", getCSRFToken);

/**
 * Legacy endpoint for backward compatibility
 * @deprecated Use /auth/google instead
 */
router.get("/googleauth", loginRateLimiter, googleLogin);

export default router;
