const express = require('express');
const axios = require('axios');
const ytSearch = require('yt-search');
const Chart = require('../models/Chart');

const router = express.Router();

router.get('/charts', async (req, res) => {
  try {
    const chart = await Chart.findOne({ type: 'trending' });
    res.json(chart ? chart.tracks : []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Query is required' });

  try {
    // Search iTunes API
    const itunesResponse = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=20`);
    const results = itunesResponse.data.results.map(item => ({
      title: item.trackName,
      artist: item.artistName,
      albumArt: item.artworkUrl100,
      previewUrl: item.previewUrl
    }));
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Failed to search music' });
  }
});

router.get('/youtube', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: 'Query is required' });

  try {
    const r = await ytSearch(query + ' audio');
    const videos = r.videos;
    if (videos.length > 0) {
      res.json({ videoId: videos[0].videoId });
    } else {
      res.status(404).json({ message: 'No video found' });
    }
  } catch (error) {
    console.error('YouTube search error:', error);
    res.status(500).json({ message: 'Failed to search youtube' });
  }
});

router.get('/lyrics', async (req, res) => {
  const { title, artist } = req.query;
  if (!title || !artist) return res.status(400).json({ message: 'Title and artist are required' });

  try {
    const response = await axios.get(`https://lrclib.net/api/search?q=${encodeURIComponent(title + ' ' + artist)}`);
    if (response.data && response.data.length > 0) {
      res.json({ lyrics: response.data[0].plainLyrics || response.data[0].syncedLyrics });
    } else {
      res.status(404).json({ message: 'Lyrics not found' });
    }
  } catch (error) {
    console.error('Lyrics search error:', error.message);
    res.status(500).json({ message: 'Failed to search lyrics' });
  }
});

module.exports = router;
