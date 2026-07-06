import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Library, Plus, Search as SearchIcon, List, Heart, Music } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (user) {
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
      fetchPlaylists();
    } else {
      setPlaylists([]);
    }
  }, [user, location.pathname]); // Refresh when navigating (e.g. creating playlist)

  const handleCreatePlaylist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const newName = `My Playlist #${playlists.length + 1}`;
      const { data } = await axios.post('/api/playlists', { name: newName }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setPlaylists([...playlists, data]);
      navigate(`/playlists/${data._id}`);
    } catch (error) {
      console.error('Failed to create playlist', error);
    }
  };

  const likedPlaylist = playlists.find(p => p.name === 'Liked Songs');
  const otherPlaylists = playlists.filter(p => p.name !== 'Liked Songs');

  return (
    <div className="w-80 bg-surface rounded-lg flex flex-col h-full hidden md:flex shrink-0">
      
      {/* Library Header */}
      <div className="p-4 flex items-center justify-between text-text-secondary">
        <button 
          onClick={() => navigate('/playlists')}
          className="flex items-center gap-3 hover:text-white transition-colors font-bold"
        >
          <Library size={24} />
          Your Library
        </button>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleCreatePlaylist}
            className="w-8 h-8 rounded-full hover:bg-surface-hover flex items-center justify-center hover:text-white transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-2 flex items-center gap-2 text-sm font-medium">
        <button className="bg-surface-hover hover:bg-white/10 text-white px-3 py-1.5 rounded-full transition-colors">Playlists</button>
        <button className="bg-surface-hover hover:bg-white/10 text-white px-3 py-1.5 rounded-full transition-colors">Artists</button>
        <button className="bg-surface-hover hover:bg-white/10 text-white px-3 py-1.5 rounded-full transition-colors">Albums</button>
      </div>

      {/* Search & Sort */}
      <div className="px-4 py-2 flex items-center justify-between text-text-secondary text-sm mt-2">
        <button className="hover:text-white hover:bg-surface-hover w-8 h-8 rounded-full flex items-center justify-center transition-colors">
          <SearchIcon size={16} />
        </button>
        <button className="flex items-center gap-1 hover:text-white transition-colors">
          <span>Recents</span>
          <List size={16} />
        </button>
      </div>

      {/* Playlist List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 mt-2">
        {!user && (
          <div className="p-4 bg-surface-hover rounded-lg mx-2 mb-4">
            <h4 className="text-white font-bold mb-1">Create your first playlist</h4>
            <p className="text-sm text-text-secondary mb-4">It's easy, we'll help you</p>
            <button onClick={() => navigate('/login')} className="bg-white text-black font-bold px-4 py-1.5 rounded-full text-sm hover:scale-105 transition-transform">
              Log in
            </button>
          </div>
        )}

        {likedPlaylist && (
          <div 
            onClick={() => navigate(`/profile`)}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-surface-hover cursor-pointer transition-colors"
          >
            <div className="w-12 h-12 rounded bg-gradient-to-br from-indigo-500 to-purple-400 flex items-center justify-center shrink-0">
              <Heart size={20} fill="white" className="text-white" />
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-white font-medium truncate">Liked Songs</h4>
              <p className="text-text-secondary text-xs flex items-center gap-1">
                <span className="text-[#1ed760]"><Heart size={10} fill="currentColor" /></span> Playlist • {likedPlaylist.tracks?.length || 0} songs
              </p>
            </div>
          </div>
        )}

        {otherPlaylists.map(playlist => (
          <div 
            key={playlist._id}
            onClick={() => navigate(`/playlists/${playlist._id}`)}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-surface-hover cursor-pointer transition-colors"
          >
            <div className="w-12 h-12 rounded bg-surface-hover flex items-center justify-center shrink-0 overflow-hidden">
              {playlist.tracks && playlist.tracks.length > 0 && playlist.tracks[0].albumArt ? (
                <img src={playlist.tracks[0].albumArt} alt="" className="w-full h-full object-cover" />
              ) : (
                <Music size={20} className="text-text-secondary" />
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-white font-medium truncate">{playlist.name}</h4>
              <p className="text-text-secondary text-xs truncate">Playlist • {user?.username || 'You'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
