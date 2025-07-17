import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { CourseGenerator } from './pages/CourseGenerator';
import { CourseEditor } from './pages/CourseEditor';
import { CoursePreview } from './pages/CoursePreview';
import { PricingPage } from './pages/PricingPage';
import { AuthProvider } from './contexts/AuthContext';
// import { CourseProvider } from './contexts/CourseContext';

function App() {
  return (
    <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Navigation />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              <Route path="/generator" element={<CourseGenerator />} />
              <Route path="/editor/:courseId" element={<CourseEditor />} />
              <Route path="/preview/:courseId" element={<CoursePreview />} />
              <Route path="/pricing" element={<PricingPage />} />
            </Routes>
          </div>
        </Router>
    </AuthProvider>
  );
}

export default App;