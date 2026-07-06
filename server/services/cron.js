const cron = require('node-cron');
const axios = require('axios');
const ytSearch = require('yt-search');
const Chart = require('../models/Chart');

const fetchCharts = async () => {
  console.log('Running cron job to fetch trending charts...');
  try {
    // Using iTunes top songs RSS feed for free data
    const response = await axios.get('https://itunes.apple.com/us/rss/topsongs/limit=20/json');
    const entries = response.data.feed.entry || [];
    
    const tracks = [];
    let rank = 1;

    for (const entry of entries) {
      const title = entry['im:name'].label;
      const artist = entry['im:artist'].label;
      const albumArt = entry['im:image'][2].label; // 170x170 image
      
      tracks.push({
        title,
        artist,
        albumArt,
        youtubeVideoId: '',
        rank
      });
      rank++;
    }

    // Update or create the trending chart
    const chart = await Chart.findOneAndUpdate(
      { type: 'trending' },
      { tracks, lastUpdated: Date.now() },
      { upsert: true, new: true }
    );
    console.log('Charts updated successfully.');

  } catch (error) {
    console.error('Error fetching charts:', error.message);
  }
};

const setupCron = () => {
  // Run on startup
  fetchCharts();

  // Run every 24 hours at midnight
  cron.schedule('0 0 * * *', () => {
    fetchCharts();
  });
};

module.exports = setupCron;
