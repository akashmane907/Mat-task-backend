const rateLimit = require('express-rate-limit');
const RedisStoreImport = require('rate-limit-redis');
const { createClient } = require('redis');

// ✅ Use environment variable
const redisClient = createClient({
  legacyMode: true,
  url: process.env.REDIS_URL,
});

redisClient.connect().catch(console.error);

// Handle ESM default export if needed
const RedisStore = RedisStoreImport.default || RedisStoreImport;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});

module.exports = limiter;
