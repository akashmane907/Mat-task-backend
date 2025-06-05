require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const chapterRoutes = require('./routes/chapterRoutes');
const rateLimiter = require('./middlewares/rateLimiter');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/api/v1/chapters', chapterRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// MongoDB + Redis
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    app.listen(process.env.PORT, () => {
      console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
  } catch (err) {
    console.error('Server error:', err);
  }
};

startServer();
