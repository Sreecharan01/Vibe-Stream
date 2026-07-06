import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Music, LogIn, Mail, Lock, User } from 'lucide-react';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // If already logged in, redirect to playlists
  if (user) {
    navigate('/playlists');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(username, email, password);
      navigate('/playlists');
    } catch (error) {
      // In a real app, we would show a toast or error message here
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full min-h-[80vh] flex items-center justify-center relative overflow-hidden rounded-2xl">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#1ed760]/10 blur-[150px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="backdrop-blur-xl bg-surface/50 border border-surface-hover p-10 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-[#1ed760] rounded-full flex items-center justify-center shadow-lg shadow-primary/30 mb-4 transform hover:scale-105 transition-transform duration-300">
              <Music size={32} className="text-black" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
            <p className="text-text-secondary text-sm mt-2">Sign up for Vibe-Stream to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your display name"
                  className="w-full bg-black/40 border border-surface-hover text-white pl-12 pr-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-text-secondary/50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-black/40 border border-surface-hover text-white pl-12 pr-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-text-secondary/50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-surface-hover text-white pl-12 pr-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-text-secondary/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-[#1ed760] text-black font-bold text-base py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(29,185,84,0.3)] hover:shadow-[0_0_30px_rgba(29,185,84,0.5)] active:scale-[0.98] flex justify-center items-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
               <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign Up</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-text-secondary">
              Already have an account? <Link to="/login" className="text-white font-medium hover:text-primary transition-colors">Log in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
