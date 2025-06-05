const rateLimit = require('express-rate-limit');
const RedisStoreImport = require('rate-limit-redis');
const { createClient } = require('redis');

// For compatibility with latest redis
const redisClient = createClient({
  legacyMode: true,
  url: 'redis://localhost:6379',
});

redisClient.connect().catch(console.error);

// Handle default export
const RedisStore = RedisStoreImport.default || RedisStoreImport;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});

module.exports = limiter;
