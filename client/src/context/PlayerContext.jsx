import React, { createContext, useState } from 'react';
import axios from 'axios';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);

  const playTrack = async (track) => {
    // Set the track immediately to keep the browser's user-gesture active
    setCurrentTrack(track);
    setIsPlaying(true);

    // Always ensure we have the high-quality previewUrl
    if (!track.previewUrl) {
      try {
        const { data } = await axios.get(`/api/music/search?q=${encodeURIComponent(track.title + ' ' + track.artist)}`);
        if (data && data.length > 0 && data[0].previewUrl) {
           setCurrentTrack(prev => ({ ...prev, previewUrl: data[0].previewUrl }));
        }
      } catch (err) {
        console.error('Failed to fetch audio for track', err);
      }
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, playTrack, togglePlay, queue, setQueue }}>
      {children}
    </PlayerContext.Provider>
  );
};
