import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Play } from 'lucide-react';
import { PlayerContext } from '../context/PlayerContext';

const Search = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { playTrack } = useContext(PlayerContext);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    
    if (query) {
      const fetchResults = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(`/api/music/search?q=${encodeURIComponent(query)}`);
          setResults(data);
        } catch (error) {
          console.error('Search failed', error);
        }
        setLoading(false);
      };
      
      fetchResults();
    } else {
      setResults([]);
    }
  }, [location.search]);

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl">
      {loading && <p className="text-text-secondary mb-4">Searching...</p>}
      
      {!loading && results.length === 0 && (
        <div className="text-text-secondary pt-8">
          <h2 className="text-2xl font-bold text-white mb-2">Browse all</h2>
          <p>Type something in the top search bar to find your favorite songs.</p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-white mb-6">Top Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {results.map((track, i) => (
              <div 
                key={i} 
                className="bg-surface hover:bg-surface-hover p-4 rounded-xl transition-all duration-300 group cursor-pointer"
                onClick={() => playTrack(track)}
              >
                <div className="relative mb-4 aspect-square shadow-lg overflow-hidden rounded-lg">
                  <img src={track.albumArt || 'https://via.placeholder.com/150'} alt={track.title} className="w-full h-full object-cover" />
                  <button className="absolute bottom-2 right-2 bg-primary text-black p-3 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:scale-105 hover:bg-[#1ed760]">
                    <Play fill="black" size={20} className="ml-1" />
                  </button>
                </div>
                <h3 className="text-white font-semibold truncate text-base mb-1">{track.title}</h3>
                <p className="text-text-secondary text-sm truncate">{track.artist}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
