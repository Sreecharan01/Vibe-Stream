import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Mic2 } from 'lucide-react';

const LyricsPanel = ({ isOpen, onClose, track }) => {
  const [lyrics, setLyrics] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isOpen || !track) return;

    const fetchLyrics = async () => {
      setLoading(true);
      setError(false);
      try {
        const { data } = await axios.get(`/api/music/lyrics?title=${encodeURIComponent(track.title)}&artist=${encodeURIComponent(track.artist)}`);
        setLyrics(data.lyrics);
      } catch (err) {
        console.error('Failed to fetch lyrics', err);
        setError(true);
        setLyrics('');
      } finally {
        setLoading(false);
      }
    };

    fetchLyrics();
  }, [track, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-24 right-4 w-96 max-h-[500px] bg-surface border border-surface-hover rounded-xl shadow-2xl flex flex-col z-40 overflow-hidden transform transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/40 border-b border-surface-hover backdrop-blur-md">
        <div className="flex items-center gap-2 text-white">
          <Mic2 size={18} className="text-primary" />
          <h3 className="font-semibold text-sm">Lyrics</h3>
        </div>
        <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error || !lyrics ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-text-secondary text-center">
            <Mic2 size={32} className="opacity-20 mb-3" />
            <p className="text-sm">We couldn't find lyrics for this song.</p>
            <p className="text-xs opacity-60 mt-1">Instrumental or unreleased?</p>
          </div>
        ) : (
          <div className="text-white text-lg font-medium leading-loose whitespace-pre-wrap">
            {lyrics}
          </div>
        )}
      </div>
    </div>
  );
};

export default LyricsPanel;
