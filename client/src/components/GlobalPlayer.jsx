import React, { useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Play, Pause, SkipBack, SkipForward, Volume2, Mic2, Download, ListPlus, Plus, Heart } from 'lucide-react';
import { PlayerContext } from '../context/PlayerContext';
import { AuthContext } from '../context/AuthContext';
import LyricsPanel from './LyricsPanel';

const GlobalPlayer = () => {
  const { currentTrack, isPlaying, togglePlay, playNext, playPrevious, hasNext, hasPrevious } = useContext(PlayerContext);
  const { user } = useContext(AuthContext);
  
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [showLyrics, setShowLyrics] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Playlist state
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const audioRef = useRef(null);
  const menuRef = useRef(null);

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

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowPlaylistMenu(false);
        setIsCreating(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPlaylists = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get('/api/playlists', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setPlaylists(data);
    } catch (error) {
      console.error('Failed to fetch playlists', error);
    }
  };

  const handleMenuToggle = () => {
    if (!showPlaylistMenu) {
      fetchPlaylists();
    }
    setShowPlaylistMenu(!showPlaylistMenu);
    setIsCreating(false);
  };

  const [showToast, setShowToast] = useState(false);

  const addTrackToPlaylist = async (playlist) => {
    if (!user || !currentTrack) return;
    setIsAdding(true);
    try {
      // Check if track already exists in playlist to prevent duplicates
      const trackExists = playlist.tracks?.some(t => t.title === currentTrack.title && t.artist === currentTrack.artist);
      if (trackExists) {
        alert('Song is already in this playlist!');
        setIsAdding(false);
        return;
      }

      const updatedTracks = [...(playlist.tracks || []), {
        title: currentTrack.title,
        artist: currentTrack.artist,
        albumArt: currentTrack.albumArt,
        youtubeVideoId: currentTrack.youtubeVideoId || ''
      }];
      
      await axios.put(`/api/playlists/${playlist._id}`, { tracks: updatedTracks }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setShowPlaylistMenu(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Failed to add track', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleCreateAndAdd = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim() || !user) return;
    setIsAdding(true);
    try {
      // Create playlist
      const { data: newPlaylist } = await axios.post('/api/playlists', { name: newPlaylistName }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      // Add track to new playlist
      await addTrackToPlaylist(newPlaylist);
      
      setNewPlaylistName('');
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create and add', error);
      setIsAdding(false);
    }
  };

  const handleLikedSongs = async () => {
    if (!user) return;
    const likedPlaylist = playlists.find(p => p.name === 'Liked Songs');
    if (likedPlaylist) {
      await addTrackToPlaylist(likedPlaylist);
    } else {
      // Create 'Liked Songs' if it doesn't exist
      setNewPlaylistName('Liked Songs');
      setIsCreating(true);
      // We simulate form submission
      setTimeout(() => document.getElementById('create-playlist-btn')?.click(), 100);
    }
  };

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
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-[#1ed760] text-black px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(30,215,96,0.5)] z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          Saved to playlist!
        </div>
      )}

      {/* Lyrics Panel */}
      <LyricsPanel isOpen={showLyrics} onClose={() => setShowLyrics(false)} track={currentTrack} />

      <div className="w-full h-24 bg-black border-t border-surface flex items-center justify-between px-4 shrink-0 z-50">
        
        {/* Hidden Audio Player */}
        {currentTrack.previewUrl && (
          <audio 
            ref={audioRef}
            src={currentTrack.previewUrl} 
            onTimeUpdate={(e) => setPlayed(e.target.currentTime)}
            onDurationChange={(e) => setDuration(e.target.duration)}
            onEnded={() => {
              if (hasNext) {
                playNext();
              } else {
                if (isPlaying) togglePlay();
              }
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
            <button 
              onClick={playPrevious}
              disabled={!hasPrevious}
              className={`transition-colors ${hasPrevious ? 'text-text-secondary hover:text-white' : 'text-text-secondary/30 cursor-not-allowed'}`}
            >
              <SkipBack size={20} fill="currentColor" />
            </button>
            <button 
              className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause fill="black" size={16} /> : <Play fill="black" size={16} className="ml-1" />}
            </button>
            <button 
              onClick={playNext}
              disabled={!hasNext}
              className={`transition-colors ${hasNext ? 'text-text-secondary hover:text-white' : 'text-text-secondary/30 cursor-not-allowed'}`}
            >
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
          
          {/* Add to Playlist Popover */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={handleMenuToggle}
              className={`transition-colors hover:text-white ${showPlaylistMenu ? 'text-primary' : 'text-text-secondary'}`}
              title="Add to Playlist"
            >
              <ListPlus size={18} />
            </button>

            {showPlaylistMenu && (
              <div className="absolute bottom-12 right-[-60px] w-64 bg-surface border border-surface-hover rounded-xl shadow-2xl p-2 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
                {!user ? (
                  <div className="p-4 text-center">
                    <p className="text-sm text-text-secondary mb-3">Log in to add to playlist.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-3 py-2">Add to Playlist</h3>
                    
                    <button 
                      onClick={handleLikedSongs}
                      disabled={isAdding}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-surface-hover transition-colors flex items-center gap-3 text-white disabled:opacity-50"
                    >
                      <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-1.5 rounded-md">
                        <Heart size={14} fill="white" className="text-white" />
                      </div>
                      <span className="font-medium">Liked Songs</span>
                    </button>

                    <div className="my-1 border-t border-surface-hover"></div>

                    <div className="max-h-48 overflow-y-auto scrollbar-hide">
                      {playlists.filter(p => p.name !== 'Liked Songs').map(playlist => (
                        <button
                          key={playlist._id}
                          onClick={() => addTrackToPlaylist(playlist)}
                          disabled={isAdding}
                          className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-surface-hover transition-colors text-white truncate text-sm disabled:opacity-50"
                        >
                          {playlist.name}
                        </button>
                      ))}
                    </div>

                    <div className="my-1 border-t border-surface-hover"></div>

                    {isCreating ? (
                      <form onSubmit={handleCreateAndAdd} className="p-2">
                        <input 
                          type="text" 
                          autoFocus
                          value={newPlaylistName}
                          onChange={(e) => setNewPlaylistName(e.target.value)}
                          placeholder="Playlist name..."
                          className="w-full bg-black/40 border border-surface-hover text-white px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-primary text-sm mb-2"
                        />
                        <div className="flex gap-2">
                          <button 
                            type="submit" 
                            id="create-playlist-btn"
                            disabled={!newPlaylistName.trim() || isAdding}
                            className="bg-primary text-black text-xs font-bold px-3 py-1.5 rounded-md flex-1 hover:bg-[#1ed760] transition-colors disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setIsCreating(false)}
                            className="bg-transparent text-text-secondary text-xs font-bold px-3 py-1.5 rounded-md hover:bg-surface-hover hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button 
                        onClick={() => setIsCreating(true)}
                        className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-surface-hover transition-colors flex items-center gap-3 text-text-secondary hover:text-white text-sm mt-1"
                      >
                        <Plus size={16} />
                        <span>Create new playlist</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

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
