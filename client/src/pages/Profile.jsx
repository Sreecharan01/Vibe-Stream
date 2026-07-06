import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User, LogOut, ListMusic, Play, Heart, Mail } from 'lucide-react';
import { PlayerContext } from '../context/PlayerContext';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const { playTrack } = useContext(PlayerContext);
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchPlaylists = async () => {
      try {
        const { data } = await axios.get('/api/playlists', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setPlaylists(data);
      } catch (error) {
        console.error('Failed to fetch playlists', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const totalTracks = playlists.reduce((acc, playlist) => acc + (playlist.tracks?.length || 0), 0);
  const likedSongsPlaylist = playlists.find(p => p.name === 'Liked Songs');
  const otherPlaylists = playlists.filter(p => p.name !== 'Liked Songs');

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-12 bg-gradient-to-b from-surface to-background p-8 rounded-3xl border border-surface-hover shadow-2xl relative overflow-hidden">
        {/* Abstract Background for Header */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-50%] right-[-10%] w-[50%] h-[150%] rounded-full bg-primary blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 w-32 h-32 md:w-48 md:h-48 bg-surface-hover rounded-full shadow-2xl flex items-center justify-center border-4 border-black shrink-0 overflow-hidden group">
          <User size={64} className="text-text-secondary group-hover:scale-110 transition-transform duration-300" />
        </div>
        
        <div className="relative z-10 flex-1 text-center md:text-left">
          <p className="uppercase text-xs font-bold tracking-widest text-text-secondary mb-2">Profile</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight truncate">{user.username || 'Listener'}</h1>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm text-text-secondary font-medium">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-primary" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <ListMusic size={16} className="text-primary" />
              <span>{playlists.length} Public Playlists</span>
            </div>
            <div className="flex items-center gap-2">
              <Play size={16} className="text-primary" />
              <span>{totalTracks} Saved Tracks</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="relative z-10 bg-transparent border border-surface-hover hover:border-white text-white px-6 py-2.5 rounded-full font-bold transition-all flex items-center gap-2 mt-4 md:mt-0 hover:bg-white/5 active:scale-95"
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Liked Songs Highlight */}
          {likedSongsPlaylist && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Heart className="text-primary" fill="currentColor" />
                Your Liked Songs
              </h2>
              {likedSongsPlaylist.tracks && likedSongsPlaylist.tracks.length > 0 ? (
                <div className="bg-surface/40 border border-surface-hover rounded-2xl p-6 overflow-x-auto">
                  <table className="w-full text-left text-text-secondary text-sm">
                    <thead>
                      <tr className="border-b border-surface-hover">
                        <th className="pb-3 font-medium w-12 text-center">#</th>
                        <th className="pb-3 font-medium">Title</th>
                        <th className="pb-3 font-medium">Artist</th>
                        <th className="pb-3 font-medium text-right pr-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {likedSongsPlaylist.tracks.map((track, idx) => (
                        <tr key={idx} className="group hover:bg-white/5 transition-colors">
                          <td className="py-3 text-center">{idx + 1}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <img src={track.albumArt || 'https://via.placeholder.com/40'} alt={track.title} className="w-10 h-10 rounded shadow-sm" />
                              <span className="text-white font-medium group-hover:text-primary transition-colors">{track.title}</span>
                            </div>
                          </td>
                          <td className="py-3">{track.artist}</td>
                          <td className="py-3 text-right pr-4">
                            <button 
                              onClick={() => playTrack(track)}
                              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 ml-auto"
                            >
                              <Play size={14} fill="black" className="text-black ml-0.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-text-secondary">You haven't liked any songs yet.</p>
              )}
            </section>
          )}

          {/* All Other Playlists */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Your Playlists</h2>
            {otherPlaylists.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {otherPlaylists.map((playlist) => (
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
                      {playlist.tracks && playlist.tracks.length > 0 && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            playTrack(playlist.tracks[0]);
                          }}
                          className="absolute bottom-2 right-2 bg-primary text-black p-3 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:scale-105 hover:bg-[#1ed760]"
                        >
                          <Play fill="black" size={20} className="ml-0.5" />
                        </button>
                      )}
                    </div>
                    <h3 className="text-white font-semibold truncate text-base mb-1">{playlist.name}</h3>
                    <p className="text-text-secondary text-sm truncate">{playlist.tracks?.length || 0} tracks</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface/30 border border-surface-hover rounded-2xl p-8 text-center text-text-secondary">
                <ListMusic size={32} className="mx-auto mb-3 opacity-50" />
                <p>No custom playlists created yet.</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default Profile;
