import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Play, Music } from 'lucide-react';
import { PlayerContext } from '../context/PlayerContext';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [charts, setCharts] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const { playTrack } = useContext(PlayerContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const { data } = await axios.get('/api/music/charts');
        setCharts(data);
      } catch (error) {
        console.error('Failed to fetch charts', error);
      }
    };
    fetchCharts();

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
    }
  }, [user]);

  // Combine playlists and charts for the quick play grid
  const quickPlayItems = [...playlists];
  // Fill the rest with charts if we don't have enough playlists (up to 8 items)
  if (quickPlayItems.length < 8 && charts.length > 0) {
    const needed = 8 - quickPlayItems.length;
    quickPlayItems.push(...charts.slice(0, needed).map(c => ({
      _id: c.title, // dummy ID for charts
      name: c.title,
      isChart: true,
      tracks: [c]
    })));
  }

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Filter Chips */}
      <div className="flex items-center gap-2 mb-6">
        <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold">All</button>
        <button className="bg-surface-hover hover:bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-semibold transition-colors">Music</button>
        <button className="bg-surface-hover hover:bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-semibold transition-colors">Podcasts</button>
      </div>

      {/* Quick Play Grid (Rectangular cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {quickPlayItems.slice(0, 8).map((item, i) => (
          <div 
            key={item._id || i}
            onClick={() => {
              if (item.isChart) {
                playTrack(item.tracks[0]);
              } else {
                navigate(`/playlists/${item._id}`);
              }
            }}
            className="flex items-center bg-surface-hover/50 hover:bg-surface-hover rounded-md overflow-hidden group cursor-pointer transition-colors"
          >
            <div className="w-16 h-16 shrink-0 bg-surface shadow-md flex items-center justify-center">
              {item.tracks && item.tracks.length > 0 && item.tracks[0].albumArt ? (
                <img src={item.tracks[0].albumArt} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <Music size={24} className="text-text-secondary" />
              )}
            </div>
            <div className="flex-1 px-4 py-2 font-bold text-white text-sm truncate">
              {item.name}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (item.tracks && item.tracks.length > 0) playTrack(item.tracks[0]);
              }}
              className="w-12 h-12 bg-primary text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-105 hover:bg-[#1ed760] shadow-lg mr-2 shrink-0"
            >
              <Play fill="black" size={20} className="ml-1" />
            </button>
          </div>
        ))}
      </div>
      
      {/* Section: Recommended Stations / Trending Today */}
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">Trending Today</h2>
        <button className="text-sm font-bold text-text-secondary hover:underline">Show all</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mb-10">
        {charts.length > 0 ? (
          charts.slice(0, 6).map((track, i) => (
            <div 
              key={i} 
              className="bg-surface hover:bg-surface-hover p-4 rounded-xl transition-all duration-300 group cursor-pointer relative flex flex-col"
              onClick={() => playTrack(track)}
            >
              <div className="relative mb-4 aspect-square shadow-lg overflow-hidden rounded-md">
                <img src={track.albumArt || 'https://via.placeholder.com/150'} alt={track.title} className="w-full h-full object-cover" />
                <button className="absolute bottom-2 right-2 bg-primary text-black p-3 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:scale-105 hover:bg-[#1ed760] z-10">
                  <Play fill="black" size={20} className="ml-1" />
                </button>
              </div>
              <h3 className="text-white font-bold truncate text-base mb-1">{track.title}</h3>
              <p className="text-text-secondary text-sm line-clamp-2 mt-1">{track.artist}</p>
            </div>
          ))
        ) : (
          <p className="text-text-secondary">Loading charts...</p>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
