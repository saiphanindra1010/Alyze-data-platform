/**
 * Server Entry Point
 * Initializes database, Redis, and starts the Express server
 */
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import redisClient from "./src/config/redis.js";
import app from "./app.js";

// Load environment variables first
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'JWT_SECRET',
  'DB',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName] || String(process.env[varName]).trim() === '');
if (missingVars.length > 0) {
  console.error('❌ Missing or empty required environment variables:', missingVars.join(', '));
  process.exit(1);
}

// Warn about weak JWT secret in production
if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET.length < 32) {
  console.warn('⚠️ WARNING: JWT_SECRET should be at least 32 characters in production!');
}

const PORT = process.env.PORT || 5000;

/**
 * Initialize all services and start server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();

    // Connect to Redis
    console.log('🔄 Connecting to Redis...');
    try {
      await redisClient.connect();
    } catch (redisError) {
      console.warn('⚠️ Redis connection failed, running without token revocation support');
      console.warn('   To enable full security features, ensure Redis is running at:', process.env.REDIS_URL || 'redis://localhost:6379');
    }

    // Start Express server
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 ========================================');
      console.log('   Server started successfully!');
      console.log('   ========================================');
      console.log(`   🌐 API:     http://localhost:${PORT}`);
      console.log(`   💾 MongoDB: Connected`);
      console.log(`   📦 Redis:   ${redisClient.isReady() ? 'Connected ✅' : 'Not available ⚠️'}`);
      console.log(`   🔐 Mode:    ${process.env.NODE_ENV || 'development'}`);
      console.log('   ========================================');
      console.log('');
      console.log('   Security Features Enabled:');
      console.log('   ✅ JWT Access/Refresh Token Pattern');
      console.log('   ✅ Token Fingerprinting');
      console.log('   ✅ HttpOnly Secure Cookies');
      console.log('   ✅ CSRF Protection');
      console.log('   ✅ Rate Limiting');
      console.log('   ✅ XSS Protection (CSP + Sanitization)');
      console.log('   ✅ NoSQL Injection Prevention');
      console.log('   ✅ Security Headers (Helmet)');
      console.log('   ✅ HPP Protection');
      console.log(redisClient.isReady() ? '   ✅ Token Blacklisting (Redis)' : '   ⚠️ Token Blacklisting (Requires Redis)');
      console.log('   ========================================');
      console.log('');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();
