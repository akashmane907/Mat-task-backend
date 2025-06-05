const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
});

client.connect().catch(console.error);

module.exports = async (req, res, next) => {
  try {
    const key = `chapters:${JSON.stringify(req.query)}`;
    const cached = await client.get(key);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    // Override res.json to cache response
    res.sendResponse = res.json;
    res.json = (body) => {
      client.setEx(key, 3600, JSON.stringify(body)); // cache for 1 hour
      res.sendResponse(body);
    };

  } catch (error) {
    console.error('Redis cache error:', error);
    // If Redis fails, continue without caching
  }

  next();
};
