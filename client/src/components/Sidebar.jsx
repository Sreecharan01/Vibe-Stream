import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Library, Music } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Your Library', path: '/playlists', icon: Library },
  ];

  return (
    <div className="w-64 bg-black flex flex-col h-full p-6 pt-8 text-text-secondary border-r border-surface-hover hidden md:flex">
      <div className="flex items-center gap-3 text-white mb-8 px-2">
        <Music className="text-primary w-8 h-8" />
        <span className="text-2xl font-bold tracking-tight">VibeStream</span>
      </div>
      
      <nav className="flex flex-col gap-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex items-center gap-4 px-2 py-2 font-semibold transition-colors duration-200 ${isActive ? 'text-white' : 'hover:text-white'}`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'text-white' : ''}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
