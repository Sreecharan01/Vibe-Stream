const mongoose = require('mongoose');

const chartTrackSchema = new mongoose.Schema({
  title: String,
  artist: String,
  albumArt: String,
  youtubeVideoId: String,
  rank: Number
});

const chartSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['trending'] },
  tracks: [chartTrackSchema],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chart', chartSchema);
