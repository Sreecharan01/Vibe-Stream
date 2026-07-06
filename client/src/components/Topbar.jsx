import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, Search as SearchIcon, Bell, Download } from 'lucide-react';

const Topbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="h-16 w-full flex items-center justify-between px-4 bg-black shrink-0">
      {/* Left: Spotify Logo */}
      <div className="w-1/4 flex items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            {/* Using a simple circle to represent the logo spot */}
            <div className="w-4 h-4 bg-black rounded-full" />
          </div>
          <span className="font-bold text-lg hidden md:block">VibeStream</span>
        </div>
      </div>

      {/* Center: Home & Search */}
      <div className="flex-1 max-w-xl flex items-center justify-center gap-2">
        <button 
          onClick={() => navigate('/')}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${location.pathname === '/' ? 'bg-surface text-white' : 'bg-surface/50 text-text-secondary hover:text-white hover:bg-surface'}`}
        >
          <Home size={24} fill={location.pathname === '/' ? 'currentColor' : 'none'} />
        </button>

        <form onSubmit={handleSearch} className="flex-1 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-text-secondary group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="text"
            placeholder="What do you want to play?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full h-12 pl-12 pr-4 bg-surface/50 border-2 border-transparent focus:border-surface-hover rounded-full text-white placeholder-text-secondary focus:outline-none focus:bg-surface transition-all font-medium"
          />
        </form>
      </div>

      {/* Right: Actions & Profile */}
      <div className="w-1/4 flex items-center justify-end gap-4 text-text-secondary font-bold text-sm">
        <button className="hidden lg:block bg-white text-black px-4 py-1.5 rounded-full hover:scale-105 active:scale-95 transition-transform">
          Explore Premium
        </button>
        <button className="hidden lg:flex items-center gap-1.5 hover:text-white transition-colors">
          <Download size={16} />
          <span>Install App</span>
        </button>
        <button className="w-10 h-10 rounded-full hover:bg-surface flex items-center justify-center hover:text-white transition-colors">
          <Bell size={20} />
        </button>
        
        {user ? (
          <button 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-surface-hover border-4 border-black flex items-center justify-center overflow-hidden hover:scale-105 transition-transform"
          >
            <div className="w-full h-full bg-gradient-to-br from-primary to-purple-500 text-black flex items-center justify-center font-bold text-lg">
              {user.username ? user.username[0].toUpperCase() : 'U'}
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/signup')} className="hover:text-white hover:scale-105 transition-all">Sign up</button>
            <button onClick={() => navigate('/login')} className="bg-white text-black px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-transform">Log in</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
