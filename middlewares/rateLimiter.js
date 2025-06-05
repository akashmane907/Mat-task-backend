const rateLimit = require('express-rate-limit');
const RedisStoreImport = require('rate-limit-redis');
const { createClient } = require('redis');

// Setup Redis client with legacyMode for rate-limit-redis compatibility
const redisClient = createClient({
  legacyMode: true,
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false, // Required for Upstash + Render
  },
});

redisClient.connect().catch((err) => {
  console.error("❌ Redis connection failed:", err);
});

// Handle CommonJS vs ESM export
const RedisStore = RedisStoreImport.default || RedisStoreImport;

// Express rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args), // ✅ needed for Upstash
  }),
});

module.exports = limiter;
