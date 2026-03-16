import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Quran from './pages/Quran';
import Hadith from '../api/Hadith';
import Namaz from './pages/Namaz';
import Kids from './pages/Kids';
import MCQ from './pages/MCQ';
import Wazifa from './pages/Wazifa';
import Chatbot from './pages/Chatbot';
import PrayerTimes from './pages/PrayerTimes';
import Wudu from './pages/Wudu';
import Qibla from './pages/Qibla';

function App() {
  return (
    <Router>
      <div className="geo-bg" />
      <Routes>
        <Route path="/"          element={<Layout><Home /></Layout>} />
        <Route path="/quran"     element={<Layout><Quran /></Layout>} />
        <Route path="/hadith"    element={<Layout><Hadith /></Layout>} />
        <Route path="/namaz"     element={<Layout><Namaz /></Layout>} />
        <Route path="/kids"      element={<Layout><Kids /></Layout>} />
        <Route path="/mcq"       element={<Layout><MCQ /></Layout>} />
        <Route path="/wazifa"    element={<Layout><Wazifa /></Layout>} />
        <Route path="/chatbot"   element={<Layout><Chatbot /></Layout>} />
        <Route path="/prayer"    element={<Layout><PrayerTimes /></Layout>} />
        <Route path="/wudu"      element={<Layout><Wudu /></Layout>} />
        <Route path="/qibla"     element={<Layout><Qibla /></Layout>} />
      </Routes>
    </Router>
  );
}
export default App;