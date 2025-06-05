const rateLimit = require('express-rate-limit');
const RedisStoreImport = require('rate-limit-redis');
const { createClient } = require('redis');

// Create Redis client (Upstash-compatible)
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect().catch((err) => {
  console.error("❌ Redis connection failed:", err);
});

// Handle both CommonJS and ESM versions of Redis Store
const RedisStore = RedisStoreImport.default || RedisStoreImport;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});

module.exports = limiter;
