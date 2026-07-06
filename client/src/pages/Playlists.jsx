import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Lock, LogIn, Plus, ListMusic, Play } from 'lucide-react';
import { PlayerContext } from '../context/PlayerContext';

const Playlists = () => {
  const { user } = useContext(AuthContext);
  const { playTrack } = useContext(PlayerContext);
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    if (user) {
      fetchPlaylists();
    }
  }, [user]);

  const fetchPlaylists = async () => {
    try {
      const { data } = await axios.get('/api/playlists', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setPlaylists(data);
    } catch (error) {
      console.error('Failed to fetch playlists', error);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      const { data } = await axios.post(
        '/api/playlists',
        { name: newPlaylistName },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setPlaylists([...playlists, data]);
      setNewPlaylistName('');
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create playlist', error);
    }
  };

  if (!user) {
    return (
      <div className="h-full min-h-[70vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-surface border border-surface-hover rounded-full flex items-center justify-center mb-6 shadow-xl">
          <Lock size={32} className="text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Your Library is locked</h1>
        <p className="text-text-secondary text-lg mb-8 max-w-md text-center">
          Log in to Vibe-Stream to view, create, and manage your private playlists.
        </p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-white text-black hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all font-bold px-8 py-3.5 rounded-full flex items-center gap-2"
        >
          <LogIn size={20} />
          <span>Log In to continue</span>
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Your Library</h1>
          <p className="text-text-secondary">Welcome back, {user?.username || user?.email || 'Listener'}</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-primary hover:bg-[#1ed760] text-black px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Plus size={18} />
          <span>Create Playlist</span>
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreatePlaylist} className="mb-8 bg-surface border border-surface-hover p-6 rounded-2xl animate-in slide-in-from-top-4 fade-in duration-300">
          <h3 className="text-white font-semibold mb-4">Name your new playlist</h3>
          <div className="flex gap-4">
            <input
              type="text"
              autoFocus
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="e.g. Summer Vibes 2026"
              className="flex-1 bg-black/40 border border-surface-hover text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-text-secondary/50"
            />
            <button 
              type="submit"
              disabled={!newPlaylistName.trim()}
              className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
            <button 
              type="button"
              onClick={() => { setIsCreating(false); setNewPlaylistName(''); }}
              className="bg-transparent text-white px-6 py-3 rounded-xl font-bold hover:bg-surface-hover transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      
      {playlists.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {playlists.map((playlist) => (
            <div 
              key={playlist._id} 
              onClick={() => navigate(`/playlists/${playlist._id}`)}
              className="bg-surface hover:bg-surface-hover p-4 rounded-xl transition-all duration-300 group cursor-pointer"
            >
              <div className="relative mb-4 aspect-square shadow-lg overflow-hidden rounded-lg bg-black/50 flex items-center justify-center">
                {playlist.tracks && playlist.tracks.length > 0 && playlist.tracks[0].albumArt ? (
                  <img src={playlist.tracks[0].albumArt} alt="Album Art" className="w-full h-full object-cover" />
                ) : (
                  <ListMusic size={48} className="text-text-secondary group-hover:text-white transition-colors" />
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (playlist.tracks && playlist.tracks.length > 0) playTrack(playlist.tracks[0], playlist.tracks);
                  }}
                  className="absolute bottom-2 right-2 bg-primary text-black p-3 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:scale-105 hover:bg-[#1ed760]"
                >
                  <Play fill="black" size={20} className="ml-0.5" />
                </button>
              </div>
              <h3 className="text-white font-semibold truncate text-base mb-1">{playlist.name}</h3>
              <p className="text-text-secondary text-sm truncate">{playlist.tracks?.length || 0} tracks</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface/50 border border-surface-hover rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px]">
          <ListMusic size={48} className="text-text-secondary/50 mb-4" />
          <p className="text-text-secondary text-lg">You don't have any playlists yet.</p>
          <p className="text-text-secondary text-sm mt-2">Click "Create Playlist" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default Playlists;
