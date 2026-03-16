import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, BookOpen, MessageSquare, Compass,
  Star, CheckSquare, Bot, Baby, Menu, X, Moon,
  Clock, Droplets, Navigation
} from 'lucide-react';

const navItems = [
  { path: '/',        icon: Home,         label: 'Home',        color: '#2E8B57' },
  { path: '/quran',   icon: BookOpen,     label: 'Quran',       color: '#1B6B3A' },
  { path: '/hadith',  icon: MessageSquare,label: 'Hadith',      color: '#1A5276' },
  { path: '/namaz',   icon: Compass,      label: 'Namaz',       color: '#6D4C41' },
  { path: '/prayer',  icon: Clock,        label: 'Prayer',      color: '#D4AF37' },
  { path: '/wudu',    icon: Droplets,     label: 'Wudu',        color: '#1A5276' },
  { path: '/qibla',   icon: Navigation,   label: 'Qibla',       color: '#D4AF37' },
  { path: '/wazifa',  icon: Star,         label: 'Wazifa',      color: '#B7950B' },
  { path: '/mcq',     icon: CheckSquare,  label: 'MCQ',         color: '#D35400' },
  { path: '/kids',    icon: Baby,         label: 'Kids',        color: '#8E44AD' },
  { path: '/chatbot', icon: Bot,          label: 'AI Chat',     color: '#148F77' },
];

// Bottom nav shows only 5 most important items + "More"
const bottomNav = [
  { path: '/',       icon: Home,      label: 'Home',   color: '#2E8B57' },
  { path: '/quran',  icon: BookOpen,  label: 'Quran',  color: '#1B6B3A' },
  { path: '/prayer', icon: Clock,     label: 'Prayer', color: '#D4AF37' },
  { path: '/hadith', icon: MessageSquare, label: 'Hadith', color: '#1A5276' },
  { path: '/chatbot',icon: Bot,       label: 'AI Chat',color: '#148F77' },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile]       = useState(window.innerWidth < 768);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const goTo = (path) => {
    navigate(path);
    setSidebarOpen(false);
    setDrawerOpen(false);
  };

  // ── MOBILE LAYOUT ─────────────────────────────────────────────
  if (isMobile) return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>

      {/* Mobile Top Bar */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: 'linear-gradient(180deg, #0e1f14 0%, #080f0a 100%)',
        borderBottom: '1px solid rgba(46,139,87,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', height: 56,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#1B6B3A,#D4AF37)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Moon size={16} color="white"/>
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, background: 'linear-gradient(135deg,#e8c84a,#f5d060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IslamIQ</span>
        </div>
        {/* Current page name */}
        <span style={{ fontSize: 13, color: '#7a9585', fontWeight: 600 }}>
          {navItems.find(n => n.path === location.pathname)?.label || 'IslamIQ'}
        </span>
        {/* Menu button */}
        <button onClick={() => setDrawerOpen(true)} style={{ background: 'rgba(46,139,87,0.15)', border: '1px solid rgba(46,139,87,0.2)', borderRadius: 10, padding: '6px 10px', cursor: 'pointer', color: '#D4AF37' }}>
          <Menu size={20}/>
        </button>
      </header>

      {/* Content area */}
      <main style={{ flex: 1, marginTop: 56, marginBottom: 64, overflowY: 'auto' }}>
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: 'linear-gradient(180deg, #0e1f14 0%, #080f0a 100%)',
        borderTop: '1px solid rgba(46,139,87,0.2)',
        display: 'flex', alignItems: 'center',
        height: 64, padding: '0 8px',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {bottomNav.map(item => {
          const Icon     = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button key={item.path} onClick={() => goTo(item.path)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 3, border: 'none', background: 'transparent', cursor: 'pointer', padding: '6px 4px',
              borderRadius: 12, transition: 'all 0.2s',
              borderTop: isActive ? `2px solid ${item.color}` : '2px solid transparent',
            }}>
              <Icon size={20} color={isActive ? item.color : '#4a6355'}/>
              <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 400, color: isActive ? item.color : '#4a6355', whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
            </button>
          );
        })}
        {/* More button */}
        <button onClick={() => setDrawerOpen(true)} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 3, border: 'none', background: 'transparent', cursor: 'pointer', padding: '6px 4px',
          borderTop: '2px solid transparent',
        }}>
          <Menu size={20} color="#4a6355"/>
          <span style={{ fontSize: 9, color: '#4a6355' }}>More</span>
        </button>
      </nav>

      {/* Full Drawer Menu (slides up from bottom) */}
      {drawerOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300 }} onClick={() => setDrawerOpen(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}/>
          <div onClick={e => e.stopPropagation()} style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(180deg, #0e1f14 0%, #080f0a 100%)',
            borderRadius: '24px 24px 0 0',
            border: '1px solid rgba(46,139,87,0.2)',
            padding: '16px 16px 32px',
            maxHeight: '80vh', overflowY: 'auto',
          }}>
            {/* Handle */}
            <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, margin: '0 auto 16px' }}/>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#1B6B3A,#D4AF37)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Moon size={18} color="white"/>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, background: 'linear-gradient(135deg,#e8c84a,#f5d060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IslamIQ</div>
                  <div style={{ fontSize: 10, color: '#4a6355' }}>Your Islamic Companion</div>
                </div>
              </div>
              <button onClick={() => setDrawerOpen(false)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer', color: '#7a9585' }}>
                <X size={18}/>
              </button>
            </div>

            {/* All nav items in grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {navItems.map(item => {
                const Icon     = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button key={item.path} onClick={() => goTo(item.path)} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 6, padding: '14px 8px',
                    background: isActive ? `${item.color}18` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isActive ? item.color+'44' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                    <Icon size={22} color={isActive ? item.color : '#7a9585'}/>
                    <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 400, color: isActive ? item.color : '#7a9585', textAlign: 'center' }}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="arabic" style={{ textAlign: 'center', fontSize: 14, color: '#D4AF37', opacity: 0.6, marginTop: 16 }}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── DESKTOP LAYOUT (unchanged sidebar) ───────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 72,
        background: 'linear-gradient(180deg, #0e1f14 0%, #080f0a 100%)',
        borderRight: '1px solid rgba(46,139,87,0.15)',
        display: 'flex', flexDirection: 'column',
        padding: '20px 0',
        transition: 'width 0.3s ease',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100, overflow: 'hidden',
      }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#D4AF37', padding: '8px 22px', display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          {sidebarOpen ? <X size={22}/> : <Menu size={22}/>}
        </button>

        <div style={{ padding: sidebarOpen ? '16px 20px' : '16px 18px', marginBottom: 16, borderBottom: '1px solid rgba(46,139,87,0.15)' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#1B6B3A,#D4AF37)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Moon size={18} color="white"/>
          </div>
          {sidebarOpen && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 18, fontWeight: 800, background: 'linear-gradient(135deg,#e8c84a,#f5d060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>IslamIQ</div>
              <div style={{ fontSize: 11, color: '#4a6355', marginTop: 2 }}>Your Islamic Companion</div>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, padding: '0 10px' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => goTo(item.path)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: 12, border: 'none', background: isActive ? `linear-gradient(135deg,${item.color}22,${item.color}11)` : 'transparent', cursor: 'pointer', marginBottom: 4, transition: 'all 0.2s', borderLeft: isActive ? `3px solid ${item.color}` : '3px solid transparent' }}>
                <Icon size={20} color={isActive ? item.color : '#4a6355'} style={{ flexShrink: 0 }}/>
                {sidebarOpen && <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? item.color : '#7a9585', whiteSpace: 'nowrap' }}>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {sidebarOpen && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(46,139,87,0.15)' }}>
            <div className="arabic" style={{ fontSize: 14, color: '#D4AF37', opacity: 0.8 }}>بِسْمِ اللَّهِ</div>
          </div>
        )}
      </aside>

      <main style={{ flex: 1, marginLeft: 72, minHeight: '100vh', transition: 'margin-left 0.3s ease' }}>
        {children}
      </main>
    </div>
  );
}