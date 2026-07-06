import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Music, LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // If already logged in, redirect to playlists
  if (user) {
    navigate('/playlists');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    try {
      await login(email, password);
      navigate('/playlists');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setAuthError(error.response.data.message);
      } else {
        setAuthError('Invalid email or password.');
      }
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
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="text-text-secondary text-sm mt-2">Log in to Vibe-Stream to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            {authError && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                {authError}
              </div>
            )}

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
                  <span>Log In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-text-secondary">
              Don't have an account? <Link to="/signup" className="text-white font-medium hover:text-primary cursor-pointer transition-colors">Sign up for Vibe-Stream</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
