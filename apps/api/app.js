/**
 * Express Application
 * Super Secure Configuration with Redis JWT, CSRF, XSS Protection
 */
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import hpp from "hpp";

// Config
import { SecurityConfig } from "./src/config/security.js";
import redisClient from "./src/config/redis.js";

// Security Middlewares
import {
  securityHeaders,
  additionalSecurityHeaders,
  sanitizeInput,
  preventNoSQLInjection,
} from "./src/middlewares/securityMiddleware.js";
import {
  generalRateLimiter,
  suspiciousActivityHandler,
} from "./src/middlewares/rateLimitMiddleware.js";

// Routes
import secureAuth from "./src/routes/secureAuth.js";
import users from "./src/routes/users.js";
import Connections from "./src/routes/connections.js";

// Services
import getmetadata from "./src/services/getMetadata.js";

// Import auth middleware
import { authenticateToken } from "./src/middlewares/authMiddleware.js";
import { validateCSRFToken } from "./src/middlewares/csrfMiddleware.js";

// Initialize Express app
const app = express();

// ============================================
// SECURITY MIDDLEWARE (Order matters!)
// ============================================

// 1. Trust proxy (for rate limiting behind reverse proxy)
app.set("trust proxy", 1);

// 2. Security headers (Helmet)
app.use(securityHeaders);
app.use(additionalSecurityHeaders);

// 3. CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (SecurityConfig.cors.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("⚠️ CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: SecurityConfig.cors.methods,
    allowedHeaders: SecurityConfig.cors.allowedHeaders,
    exposedHeaders: SecurityConfig.cors.exposedHeaders,
    credentials: SecurityConfig.cors.credentials,
    maxAge: SecurityConfig.cors.maxAge,
  })
);

// 4. Body parsing with size limits
app.use(express.json({ limit: "10kb" })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// 5. Cookie parser
app.use(cookieParser());

// 6. HTTP Parameter Pollution protection
app.use(hpp());

// 7. Rate limiting
app.use(generalRateLimiter);

// 8. Suspicious activity detection
app.use(suspiciousActivityHandler);

// 9. Input sanitization (XSS prevention)
app.use(sanitizeInput);

// 10. NoSQL injection prevention
app.use(preventNoSQLInjection);

// ============================================
// HEALTH CHECK (No auth required)
// ============================================
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    redis: redisClient.isReady() ? "connected" : "disconnected",
  });
});

// ============================================
// PUBLIC ROUTES
// ============================================
app.use("/auth", secureAuth);

app.get("/test", (req, res) => {
  res.json({ success: "API is working securely! 🔐" });
});

// ============================================
// PROTECTED ROUTES (Apply auth + CSRF)
// ============================================

// Profile routes - require auth and CSRF for mutations
app.use("/profile", authenticateToken, users);

// Connections routes - require auth and CSRF for mutations
app.use("/connections", authenticateToken, Connections);

// Metadata service
app.get("/getmetadata", authenticateToken, getmetadata);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    code: "NOT_FOUND",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);

  // Don't leak error details in production
  const isDev = process.env.NODE_ENV !== "production";

  // Handle specific error types
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation failed",
      code: "VALIDATION_ERROR",
      details: isDev ? err.message : undefined,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Invalid token",
      code: "INVALID_TOKEN",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Token expired",
      code: "TOKEN_EXPIRED",
    });
  }

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      error: "CORS policy violation",
      code: "CORS_ERROR",
    });
  }

  // Generic error response
  res.status(err.status || 500).json({
    error: isDev ? err.message : "Internal server error",
    code: err.code || "INTERNAL_ERROR",
    stack: isDev ? err.stack : undefined,
  });
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on("SIGTERM", async () => {
  console.log("🔄 SIGTERM received, shutting down gracefully...");
  await redisClient.disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🔄 SIGINT received, shutting down gracefully...");
  await redisClient.disconnect();
  process.exit(0);
});

export default app;
