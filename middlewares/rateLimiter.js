const rateLimit = require('express-rate-limit');
const RedisStoreImport = require('rate-limit-redis');
const { createClient } = require('redis');

// Create Redis client for Upstash (TLS and cloud-friendly)
const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false, // Optional but useful for Render + Upstash
  },
});

redisClient.connect().catch((err) => {
  console.error("❌ Redis connection failed:", err);
});

// Support ESM/CJS
const RedisStore = RedisStoreImport.default || RedisStoreImport;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redisClient, // ✅ correct for Upstash
  }),
});

module.exports = limiter;
