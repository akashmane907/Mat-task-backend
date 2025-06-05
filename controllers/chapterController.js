const Chapter = require('../models/Chapter');
const redis = require('redis');
const fs = require('fs');

const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.connect();

// GET all chapters with filtering, pagination
exports.getAllChapters = async (req, res) => {
  try {
    const { class: className, unit, status, subject, weakChapters, page = 1, limit = 10 } = req.query;
    const filters = {};

    if (className) filters.class = className;
    if (unit) filters.unit = unit;
    if (status) filters.status = status;
    if (subject) filters.subject = subject;
    if (weakChapters === 'true') filters.isWeakChapter = true;

    const skip = (page - 1) * limit;

    const total = await Chapter.countDocuments(filters);
    const chapters = await Chapter.find(filters).skip(skip).limit(Number(limit));

    res.status(200).json({
      total,
      currentPage: Number(page),
      chapters
      

    });

     // cache 
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(response)); // Cache for 1 hour
    console.log('🗃️ Serving from DB and caching');

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET chapter by ID
exports.getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    res.status(200).json(chapter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST upload chapters via JSON file
exports.uploadChapters = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    const failed = [];

    for (let item of data) {
      try {
        await Chapter.create(item);
      } catch (err) {
        failed.push({ chapter: item.chapter || 'Unknown', error: err.message });
      }
    }

    // Invalidate cache
    await redisClient.flushAll();

    res.status(200).json({ message: 'Upload completed', failed });
  } catch (err) {
    res.status(500).json({ error: 'Invalid JSON file or server error' });
  }
};
