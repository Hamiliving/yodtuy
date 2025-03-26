require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/family-videos')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// File upload configuration
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Video Schema
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  filename: String,
  uploadDate: { type: Date, default: Date.now },
  uploader: String
});

const Video = mongoose.model('Video', videoSchema);

// Routes
app.post('/api/upload', upload.single('video'), async (req, res) => {
  try {
    const video = new Video({
      title: req.body.title,
      description: req.body.description,
      filename: req.file.filename,
      uploader: req.body.uploader
    });
    await video.save();
    res.json({ success: true, video });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find().sort({ uploadDate: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
