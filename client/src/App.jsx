import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Studio } from './pages/Studio';
import { About } from './pages/About';
import { Settings } from './pages/Settings';
import { useTTS } from './hooks/useTTS';

export function App() {
  const ttsState = useTTS();

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 selection:bg-brand-500 selection:text-white">
        {/* Global Navigation */}
        <Navbar serverStatus={ttsState.serverStatus} />

        {/* Main Content Viewport */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home serverStatus={ttsState.serverStatus} />} />
            <Route path="/studio" element={<Studio ttsState={ttsState} />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/settings"
              element={
                <Settings
                  serverStatus={ttsState.serverStatus}
                  onRefreshStatus={() => {}}
                />
              }
            />
            <Route path="/how-it-works" element={<Home serverStatus={ttsState.serverStatus} />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
