import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Search as SearchIcon, Play } from 'lucide-react';
import { PlayerContext } from '../context/PlayerContext';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { playTrack } = useContext(PlayerContext);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/music/search?q=${encodeURIComponent(query)}`);
      setResults(data);
    } catch (error) {
      console.error('Search failed', error);
    }
    setLoading(false);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl">
      <form onSubmit={handleSearch} className="relative mb-8 max-w-md">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to listen to?" 
          className="w-full bg-[#242424] text-white pl-12 pr-4 py-3 rounded-full outline-none focus:ring-2 focus:ring-white border border-transparent transition-all"
        />
      </form>

      {loading && <p className="text-text-secondary">Searching...</p>}

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
                <Play fill="black" size={20} />
              </button>
            </div>
            <h3 className="text-white font-semibold truncate text-base mb-1">{track.title}</h3>
            <p className="text-text-secondary text-sm truncate">{track.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
