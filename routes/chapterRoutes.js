const express = require('express');
const router = express.Router();
const controller = require('../controllers/chapterController');
const isAdmin = require('../middlewares/isAdmin');
const upload = require('../middlewares/uploadMiddleware');
const cache = require('../middlewares/cache');

router.get('/', cache, controller.getAllChapters);
router.get('/:id', controller.getChapterById);
router.post('/', isAdmin, upload, controller.uploadChapters);

module.exports = router;
