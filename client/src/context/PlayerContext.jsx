import React, { createContext, useState } from 'react';
import axios from 'axios';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const playTrack = async (track, newQueue = null) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    let activeQueue = queue;
    let newIndex = -1;

    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
      activeQueue = newQueue;
      newIndex = newQueue.findIndex(t => t.title === track.title && t.artist === track.artist);
    } else {
      newIndex = activeQueue.findIndex(t => t.title === track.title && t.artist === track.artist);
      if (newIndex === -1 && activeQueue.length === 0) {
        setQueue([track]);
        newIndex = 0;
      }
    }
    
    setCurrentIndex(newIndex);

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

  const playNext = async () => {
    if (currentIndex < queue.length - 1 && currentIndex !== -1) {
      await playTrack(queue[currentIndex + 1], queue);
    }
  };

  const playPrevious = async () => {
    if (currentIndex > 0) {
      await playTrack(queue[currentIndex - 1], queue);
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <PlayerContext.Provider value={{ 
      currentTrack, 
      isPlaying, 
      playTrack, 
      togglePlay, 
      queue, 
      setQueue,
      playNext,
      playPrevious,
      hasNext: currentIndex !== -1 && currentIndex < queue.length - 1,
      hasPrevious: currentIndex > 0
    }}>
      {children}
    </PlayerContext.Provider>
  );
};
