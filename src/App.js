import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import Layout from './components/Layout';

// Auth & Landing
import Landing      from './pages/Landing';
import Login        from './pages/Login';
import Signup       from './pages/Signup';
import AuthCallback from './pages/AuthCallback';
import SetupProfile  from './pages/SetupProfile';
import ConfirmEmail  from './pages/ConfirmEmail';

// App pages
import Home         from './pages/Home';
import Quran        from './pages/Quran';
import Hadith       from './pages/Hadith';
import Namaz        from './pages/Namaz';
import Kids         from './pages/Kids';
import MCQ          from './pages/MCQ';
import Wazifa       from './pages/Wazifa';
import Chatbot      from './pages/Chatbot';
import MasjidFinder   from './pages/MasjidFinder';
import IslamicCalendar from './pages/IslamicCalendar';
import Zakat          from './pages/Zakat';
import HabitTracker   from './pages/HabitTracker';
import IslamicEvents  from './pages/IslamicEvents';
import ArabicWord     from './pages/ArabicWord';
import Tasbeeh       from './pages/Tasbeeh';
import QuranReader   from './pages/QuranReader';
import Tafseer       from './pages/Tafseer';
import DuaCollection from './pages/DuaCollection';
import Jummah        from './pages/Jummah';
import Ramadan       from './pages/Ramadan';
import PrayerTimes  from './pages/PrayerTimes';
import Wudu         from './pages/Wudu';
import Qibla        from './pages/Qibla';
import AllahNames   from './pages/AllahNames';

// Protected route - redirects to login if not authenticated
function ProtectedRoute({ children }) {
  const { isLoggedIn, loading, user } = useAuth();
  if (loading) return null;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  // Block unconfirmed email users
  if (user && !user.email_confirmed_at && user.app_metadata?.provider === 'email') {
    return <Navigate to="/confirm-email" replace />;
  }
  return children;
}

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) return (
    <div style={{ background:'#030303', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:40, marginBottom:14 }}>☽</div>
        <div style={{ color:'#C9A84C', fontFamily:'Cinzel,serif', letterSpacing:2, fontSize:13 }}>Loading IslamIQ...</div>
      </div>
    </div>
  );

  return (
    <Routes>
      {/* Public */}
      <Route path="/"              element={<Landing />} />
      <Route path="/login"         element={<Login />} />
      <Route path="/signup"        element={<Signup />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/setup-profile" element={<SetupProfile />} />
      <Route path="/confirm-email" element={<ConfirmEmail />} />

      {/* App — ✅ Home button goes to /home not / */}
      <Route path="/home"        element={<Layout><Home /></Layout>} />
      <Route path="/quran"       element={<Layout><Quran /></Layout>} />
      <Route path="/hadith"      element={<Layout><Hadith /></Layout>} />
      <Route path="/namaz"       element={<Layout><Namaz /></Layout>} />
      <Route path="/wudu"        element={<Layout><Wudu /></Layout>} />
      <Route path="/prayer"      element={<Layout><PrayerTimes /></Layout>} />
      <Route path="/qibla"       element={<Layout><Qibla /></Layout>} />
      <Route path="/chatbot"     element={<Layout><Chatbot /></Layout>} />
      <Route path="/mcq"         element={<Layout><MCQ /></Layout>} />
      <Route path="/kids"        element={<Layout><Kids /></Layout>} />
      <Route path="/wazifa"      element={<Layout><Wazifa /></Layout>} />
      <Route path="/allah-names" element={<Layout><AllahNames /></Layout>} />

      {/* New Pages */}
      <Route path="/masjid"      element={<Layout><MasjidFinder /></Layout>} />
      <Route path="/calendar"    element={<Layout><IslamicCalendar /></Layout>} />
      <Route path="/zakat"       element={<Layout><Zakat /></Layout>} />
      <Route path="/habits"      element={<Layout><HabitTracker /></Layout>} />
      <Route path="/events"      element={<Layout><IslamicEvents /></Layout>} />
      <Route path="/arabic-word" element={<Layout><ArabicWord /></Layout>} />

      {/* Quran extras */}
      <Route path='/quran-reader' element={<Layout><QuranReader /></Layout>} />
      <Route path='/tafseer'      element={<Layout><Tafseer /></Layout>} />

      {/* 5 New Pages */}
      <Route path="/tasbeeh"   element={<Layout><Tasbeeh /></Layout>} />
      <Route path="/duas"      element={<Layout><DuaCollection /></Layout>} />
      <Route path="/jummah"    element={<Layout><Jummah /></Layout>} />
      <Route path="/ramadan"   element={<Layout><Ramadan /></Layout>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <LocationProvider>
          <AppRoutes />
        </LocationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;