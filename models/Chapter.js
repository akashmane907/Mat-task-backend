const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  subject: String,
  chapter: String,
  class: String,
  unit: String,
  yearWiseQuestionCount: Object,
  questionSolved: Number,
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'] },
  isWeakChapter: Boolean
});

module.exports = mongoose.model('Chapter', chapterSchema);
