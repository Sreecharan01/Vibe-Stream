import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Play } from 'lucide-react';
import { PlayerContext } from '../context/PlayerContext';

const Dashboard = () => {
  const [charts, setCharts] = useState([]);
  const { playTrack } = useContext(PlayerContext);

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
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-4xl font-bold text-white mb-8">Good evening</h1>
      
      <h2 className="text-2xl font-bold text-white mb-6">Trending Today</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {charts.length > 0 ? (
          charts.map((track, i) => (
            <div 
              key={i} 
              className="bg-surface hover:bg-surface-hover p-4 rounded-xl transition-all duration-300 group cursor-pointer relative"
              onClick={() => playTrack(track)}
            >
              <div className="relative mb-4 aspect-square shadow-lg overflow-hidden rounded-lg">
                <img src={track.albumArt || 'https://via.placeholder.com/150'} alt={track.title} className="w-full h-full object-cover" />
                <button className="absolute bottom-2 right-2 bg-primary text-black p-3 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:scale-105 hover:bg-[#1ed760]">
                  <Play fill="black" size={20} />
                </button>
              </div>
              <h3 className="text-white font-semibold truncate text-base mb-1">{track.title}</h3>
              <p className="text-text-secondary text-sm truncate">{track.artist}</p>
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
