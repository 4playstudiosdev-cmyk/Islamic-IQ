import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, BookOpen, MessageSquare, Compass,
  Star, CheckSquare, Bot, Baby, Menu, X, Moon, Clock, Droplets, Navigation
} from 'lucide-react';

const navItems = [
  { path: '/',         icon: Home,          label: 'Home',         color: '#2E8B57' },
  { path: '/quran',    icon: BookOpen,       label: 'Quran',        color: '#1B6B3A' },
  { path: '/hadith',   icon: MessageSquare,  label: 'Hadith',       color: '#1A5276' },
  { path: '/namaz',    icon: Compass,        label: 'Namaz',        color: '#6D4C41' },
  { path: '/prayer',   icon: Clock,          label: 'Prayer Times', color: '#D4AF37' },
  { path: '/wudu',     icon: Droplets,       label: 'Wudu Guide',   color: '#1A5276' },
  { path: '/qibla',    icon: Navigation,     label: 'Qibla',        color: '#D4AF37' },
  { path: '/wazifa',   icon: Star,           label: 'Wazifa',       color: '#B7950B' },
  { path: '/mcq',      icon: CheckSquare,    label: 'MCQ Quiz',     color: '#D35400' },
  { path: '/kids',     icon: Baby,           label: 'Kids',         color: '#8E44AD' },
  { path: '/chatbot',  icon: Bot,            label: 'AI Chat',      color: '#148F77' },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 72,
        background: 'linear-gradient(180deg, #0e1f14 0%, #080f0a 100%)',
        borderRight: '1px solid rgba(46,139,87,0.15)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0',
        transition: 'width 0.3s ease',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
        overflow: 'hidden',
      }}>
        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#D4AF37', padding: '8px 22px',
            display: 'flex', alignItems: 'center', marginBottom: 8,
          }}
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo */}
        <div style={{
          padding: sidebarOpen ? '16px 20px' : '16px 18px',
          marginBottom: 16,
          borderBottom: '1px solid rgba(46,139,87,0.15)',
        }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #1B6B3A, #D4AF37)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Moon size={18} color="white" />
          </div>
          {sidebarOpen && (
            <div style={{ marginTop: 10 }}>
              <div style={{
                fontSize: 18, fontWeight: 800,
                background: 'linear-gradient(135deg, #e8c84a, #f5d060)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>IslamIQ</div>
              <div style={{ fontSize: 11, color: '#4a6355', marginTop: 2 }}>Your Islamic Companion</div>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '0 10px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center',
                  gap: 12,
                  padding: '11px 12px',
                  borderRadius: 12,
                  border: 'none',
                  background: isActive
                    ? `linear-gradient(135deg, ${item.color}22, ${item.color}11)`
                    : 'transparent',
                  cursor: 'pointer',
                  marginBottom: 4,
                  transition: 'all 0.2s ease',
                  borderLeft: isActive ? `3px solid ${item.color}` : '3px solid transparent',
                }}
              >
                <Icon
                  size={20}
                  color={isActive ? item.color : '#4a6355'}
                  style={{ flexShrink: 0 }}
                />
                {sidebarOpen && (
                  <span style={{
                    fontSize: 13, fontWeight: isActive ? 600 : 400,
                    color: isActive ? item.color : '#7a9585',
                    whiteSpace: 'nowrap',
                  }}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        {sidebarOpen && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(46,139,87,0.15)' }}>
            <div className="arabic" style={{ fontSize: 14, color: '#D4AF37', opacity: 0.8 }}>
              بِسْمِ اللَّهِ
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1,
        marginLeft: 72,
        minHeight: '100vh',
        transition: 'margin-left 0.3s ease',
      }}>
        {children}
      </main>
    </div>
  );
}