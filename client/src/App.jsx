import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import GlobalPlayer from './components/GlobalPlayer';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Playlists from './pages/Playlists';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import { PlayerProvider } from './context/PlayerContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Router>
          <div className="flex h-screen overflow-hidden bg-background text-white">
            <Sidebar />
            <div className="flex-1 overflow-y-auto pb-24 bg-gradient-to-b from-surface to-background">
              <main className="p-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/playlists" element={<Playlists />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
            </div>
            <GlobalPlayer />
          </div>
        </Router>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;
