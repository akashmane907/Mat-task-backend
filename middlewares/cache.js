const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });
client.connect();

module.exports = async (req, res, next) => {
  const key = `chapters:${JSON.stringify(req.query)}`;
  const cached = await client.get(key);
  if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }

  res.sendResponse = res.json;
  res.json = (body) => {
    client.setEx(key, 3600, JSON.stringify(body)); // 1 hour
    res.sendResponse(body);
  };

  next();
};
