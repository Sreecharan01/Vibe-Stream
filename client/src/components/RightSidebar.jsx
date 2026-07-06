import React, { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { X, MoreHorizontal, CheckCircle2 } from 'lucide-react';

const RightSidebar = () => {
  const { currentTrack } = useContext(PlayerContext);

  if (!currentTrack) {
    return (
      <div className="w-80 bg-surface rounded-lg h-full flex flex-col hidden xl:flex shrink-0 border-l border-surface-hover/50 p-4 justify-center items-center text-text-secondary text-center">
        <p className="text-sm font-medium">No track playing</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-surface rounded-lg h-full flex flex-col hidden xl:flex shrink-0 p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold text-sm">Now playing</h2>
        <div className="flex items-center gap-3 text-text-secondary">
          <button className="hover:text-white transition-colors"><MoreHorizontal size={20} /></button>
          <button className="hover:text-white transition-colors"><X size={20} /></button>
        </div>
      </div>

      {/* Large Album Art */}
      <div className="w-full aspect-square bg-surface-hover rounded-xl shadow-lg mb-4 overflow-hidden">
        {currentTrack.albumArt ? (
          <img src={currentTrack.albumArt} alt={currentTrack.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-secondary/50">
            No Image
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="flex justify-between items-start mb-6">
        <div className="overflow-hidden pr-2">
          <h3 className="text-2xl font-bold text-white mb-1 leading-tight tracking-tight">{currentTrack.title}</h3>
          <p className="text-text-secondary text-base hover:underline cursor-pointer">{currentTrack.artist}</p>
        </div>
        <button className="text-primary hover:scale-105 transition-transform shrink-0 mt-1">
          <CheckCircle2 size={24} fill="currentColor" className="text-[#1ed760]" />
        </button>
      </div>

      {/* About the artist placeholder */}
      <div className="bg-surface-hover rounded-xl overflow-hidden mt-2 relative group cursor-pointer">
        <div className="h-32 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0 z-10" />
        <img 
          src={currentTrack.albumArt} 
          alt="Artist Background" 
          className="w-full h-48 object-cover blur-sm opacity-50 group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute top-4 left-4 z-20">
          <h4 className="text-white font-bold text-sm">About the artist</h4>
        </div>
        <div className="absolute bottom-4 left-4 z-20 pr-4">
          <h5 className="text-white font-bold text-lg mb-1">{currentTrack.artist}</h5>
          <p className="text-text-secondary text-xs line-clamp-2">Listen to {currentTrack.artist}'s top tracks and explore their discography.</p>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
