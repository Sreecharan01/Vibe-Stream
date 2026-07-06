const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  title: String,
  artist: String,
  albumArt: String,
  youtubeVideoId: String
});

const playlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  tracks: [trackSchema]
}, { timestamps: true });

module.exports = mongoose.model('Playlist', playlistSchema);
