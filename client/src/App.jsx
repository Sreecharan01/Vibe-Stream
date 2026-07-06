import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import GlobalPlayer from './components/GlobalPlayer';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Playlists from './pages/Playlists';
import PlaylistView from './pages/PlaylistView';
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
          <div className="h-screen w-full bg-black text-white flex flex-col overflow-hidden">
            <Topbar />
            
            <div className="flex-1 flex gap-2 p-2 overflow-hidden h-[calc(100vh-64px-96px)]">
              <Sidebar />
              
              <main className="flex-1 bg-surface rounded-lg overflow-y-auto relative">
                <div className="absolute inset-0 pb-8">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/playlists" element={<Playlists />} />
                    <Route path="/playlists/:id" element={<PlaylistView />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </div>
              </main>

              <RightSidebar />
            </div>

            <GlobalPlayer />
          </div>
        </Router>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;
