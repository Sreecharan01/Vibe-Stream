import React, { useContext, useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Mic2, Download } from 'lucide-react';
import { PlayerContext } from '../context/PlayerContext';
import LyricsPanel from './LyricsPanel';

const GlobalPlayer = () => {
  const { currentTrack, isPlaying, togglePlay } = useContext(PlayerContext);
  
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [showLyrics, setShowLyrics] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack?.previewUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  if (!currentTrack) return null;

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === Infinity) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const progressPercent = duration > 0 ? (played / duration) * 100 : 0;

  const handleDownload = async () => {
    if (!currentTrack?.previewUrl) return;
    try {
      setIsDownloading(true);
      const response = await fetch(currentTrack.previewUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${currentTrack.title} - ${currentTrack.artist}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* Lyrics Panel */}
      <LyricsPanel isOpen={showLyrics} onClose={() => setShowLyrics(false)} track={currentTrack} />

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-black border-t border-surface-hover flex items-center justify-between px-4 z-50">
        
        {/* Hidden Audio Player */}
        {currentTrack.previewUrl && (
          <audio 
            ref={audioRef}
            src={currentTrack.previewUrl} 
            onTimeUpdate={(e) => setPlayed(e.target.currentTime)}
            onDurationChange={(e) => setDuration(e.target.duration)}
            onEnded={() => {
              if (isPlaying) togglePlay(); 
            }}
          />
        )}

        {/* Now Playing Info */}
        <div className="flex items-center gap-4 w-1/4 min-w-[180px]">
          <img src={currentTrack.albumArt} alt="Album Art" className="w-16 h-16 rounded-md shadow-md flex-shrink-0" />
          
          <div className="overflow-hidden">
            <h4 className="text-white font-medium text-sm truncate">{currentTrack.title}</h4>
            <p className="text-text-secondary text-xs truncate mt-1">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center justify-center max-w-2xl w-2/4">
          <div className="flex items-center gap-6 mb-2">
            <button className="text-text-secondary hover:text-white transition-colors">
              <SkipBack size={20} fill="currentColor" />
            </button>
            <button 
              className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause fill="black" size={16} /> : <Play fill="black" size={16} className="ml-1" />}
            </button>
            <button className="text-text-secondary hover:text-white transition-colors">
              <SkipForward size={20} fill="currentColor" />
            </button>
          </div>
          <div className="w-full flex items-center gap-2 text-xs text-text-secondary">
            <span>{formatTime(played)}</span>
            <div className="h-1 flex-1 bg-surface-hover rounded-full overflow-hidden group cursor-pointer relative">
              <div 
                className="h-full bg-white group-hover:bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center justify-end w-1/4 gap-4 pr-2 text-text-secondary">
          <button 
            onClick={handleDownload} 
            disabled={isDownloading || !currentTrack.previewUrl}
            className={`transition-colors ${isDownloading ? 'text-primary animate-pulse' : 'text-text-secondary hover:text-white'}`}
            title="Download High Quality Audio"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={() => setShowLyrics(!showLyrics)} 
            className={`hover:text-white transition-colors ${showLyrics ? 'text-primary' : 'text-text-secondary'}`}
            title="Lyrics"
          >
            <Mic2 size={18} />
          </button>
          <div className="flex items-center gap-2 w-32 text-text-secondary">
            <Volume2 size={20} />
            <input 
              type="range" 
              min={0} 
              max={1} 
              step="any"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-surface-hover rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GlobalPlayer;
