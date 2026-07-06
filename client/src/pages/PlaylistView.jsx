import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PlayerContext } from '../context/PlayerContext';
import { Play, ArrowLeft, Clock, Music } from 'lucide-react';

const PlaylistView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { playTrack } = useContext(PlayerContext);
  
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchPlaylist = async () => {
      try {
        const { data } = await axios.get(`/api/playlists/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setPlaylist(data);
      } catch (error) {
        console.error('Failed to fetch playlist', error);
        navigate('/playlists');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylist();
  }, [id, user, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!playlist) return null;

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex items-end gap-6 mb-8 bg-gradient-to-b from-surface/80 to-background p-8 rounded-3xl border border-surface-hover shadow-xl relative overflow-hidden group">
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-10 h-10 bg-black/50 hover:bg-black text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors z-10"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[150%] rounded-full bg-primary blur-[100px] group-hover:bg-[#1ed760] transition-colors duration-1000"></div>
        </div>

        <div className="relative z-10 w-40 h-40 md:w-56 md:h-56 bg-surface shadow-2xl flex items-center justify-center shrink-0 overflow-hidden">
          {playlist.tracks && playlist.tracks.length > 0 && playlist.tracks[0].albumArt ? (
            <img src={playlist.tracks[0].albumArt} alt={playlist.name} className="w-full h-full object-cover" />
          ) : (
            <Music size={64} className="text-text-secondary" />
          )}
        </div>
        
        <div className="relative z-10 flex-1">
          <p className="uppercase text-xs font-bold tracking-widest text-text-secondary mb-2">Playlist</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">{playlist.name}</h1>
          <div className="flex items-center gap-2 text-sm text-text-secondary font-medium">
            <span>{user?.username || 'You'}</span>
            <span>•</span>
            <span>{playlist.tracks?.length || 0} songs</span>
          </div>
        </div>
      </div>

      {/* Play Button */}
      <div className="px-4 mb-8">
        <button 
          onClick={() => playlist.tracks && playlist.tracks.length > 0 && playTrack(playlist.tracks[0])}
          disabled={!playlist.tracks || playlist.tracks.length === 0}
          className="w-14 h-14 bg-primary hover:bg-[#1ed760] hover:scale-105 active:scale-95 transition-all text-black rounded-full flex items-center justify-center shadow-lg shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-primary"
        >
          <Play fill="black" size={24} className="ml-1" />
        </button>
      </div>

      {/* Track List */}
      <div className="px-2">
        {playlist.tracks && playlist.tracks.length > 0 ? (
          <div className="bg-surface/30 border border-surface-hover rounded-2xl p-4 md:p-6 overflow-hidden">
            <table className="w-full text-left text-text-secondary text-sm">
              <thead>
                <tr className="border-b border-surface-hover">
                  <th className="pb-4 font-medium w-12 text-center">#</th>
                  <th className="pb-4 font-medium">Title</th>
                  <th className="pb-4 font-medium hidden md:table-cell">Artist</th>
                  <th className="pb-4 font-medium text-right pr-4"><Clock size={16} className="ml-auto" /></th>
                </tr>
              </thead>
              <tbody>
                {playlist.tracks.map((track, idx) => (
                  <tr 
                    key={idx} 
                    className="group hover:bg-white/5 transition-colors cursor-pointer"
                    onDoubleClick={() => playTrack(track)}
                  >
                    <td className="py-3 text-center">
                      <span className="group-hover:hidden">{idx + 1}</span>
                      <button 
                        onClick={() => playTrack(track)}
                        className="hidden group-hover:flex mx-auto w-6 h-6 items-center justify-center text-white"
                      >
                        <Play size={14} fill="currentColor" />
                      </button>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-4">
                        <img src={track.albumArt || 'https://via.placeholder.com/40'} alt={track.title} className="w-10 h-10 rounded shadow-sm" />
                        <div>
                          <p className="text-white font-medium group-hover:text-primary transition-colors text-base">{track.title}</p>
                          <p className="md:hidden text-xs mt-0.5">{track.artist}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 hidden md:table-cell">{track.artist}</td>
                    <td className="py-3 text-right pr-4">
                      {/* Fake duration since we don't store it in DB, or could just show a play button */}
                      <button 
                        onClick={() => playTrack(track)}
                        className="text-text-secondary hover:text-white transition-colors"
                      >
                        Play
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-surface/50 border border-surface-hover rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <Music size={48} className="text-text-secondary/50 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">It's a bit empty here...</h3>
            <p className="text-text-secondary max-w-md">
              Let's find some songs for your playlist. Search for tracks and click the "Add to Playlist" button to build your library.
            </p>
            <button 
              onClick={() => navigate('/search')}
              className="mt-6 bg-white text-black px-6 py-2.5 rounded-full font-bold hover:scale-105 active:scale-95 transition-transform"
            >
              Go to Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistView;
