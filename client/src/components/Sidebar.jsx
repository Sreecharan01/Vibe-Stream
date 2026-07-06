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

      <div className="mt-auto mb-4 border-t border-surface-hover pt-6">
        <Link 
          to="/profile"
          className={`flex items-center gap-4 px-2 py-2 font-semibold transition-colors duration-200 ${location.pathname === '/profile' ? 'text-white' : 'hover:text-white'}`}
        >
          <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          Profile
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
