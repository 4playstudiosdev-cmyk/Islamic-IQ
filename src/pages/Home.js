import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, MessageSquare, Compass, Star,
  CheckSquare, Bot, Baby, Flame, Trophy,
  ChevronRight, Bell, Sparkles
} from 'lucide-react';

const prayerTimes = [
  { name: 'Fajr',    arabic: 'الفجر',  time: '05:12', icon: '🌙', next: false },
  { name: 'Dhuhr',   arabic: 'الظهر',  time: '12:30', icon: '☀️', next: true  },
  { name: 'Asr',     arabic: 'العصر',  time: '15:45', icon: '🌤', next: false },
  { name: 'Maghrib', arabic: 'المغرب', time: '18:52', icon: '🌅', next: false },
  { name: 'Isha',    arabic: 'العشاء', time: '20:15', icon: '🌙', next: false },
];

const quickLinks = [
  { path: '/quran',   icon: BookOpen,      label: 'Quran',    sub: '114 Surahs',   color: '#1B6B3A', bg: 'rgba(27,107,58,0.12)' },
  { path: '/hadith',  icon: MessageSquare, label: 'Hadith',   sub: '7000+ Hadith', color: '#1A5276', bg: 'rgba(26,82,118,0.12)' },
  { path: '/namaz',   icon: Compass,       label: 'Namaz',    sub: 'Step by step', color: '#6D4C41', bg: 'rgba(109,76,65,0.12)' },
  { path: '/chatbot', icon: Bot,           label: 'AI Chat',  sub: 'Ask anything', color: '#148F77', bg: 'rgba(20,143,119,0.12)' },
  { path: '/mcq',     icon: CheckSquare,   label: 'MCQ Quiz', sub: 'Daily 5 Qs',   color: '#D35400', bg: 'rgba(211,84,0,0.12)'  },
  { path: '/wazifa',  icon: Star,          label: 'Wazifa',   sub: 'Track daily',  color: '#B7950B', bg: 'rgba(183,149,11,0.12)'},
  { path: '/kids',    icon: Baby,          label: 'Kids',     sub: 'Fun learning', color: '#8E44AD', bg: 'rgba(142,68,173,0.12)'},
  { path: '/',        icon: Sparkles,      label: 'Qibla',    sub: 'Direction',    color: '#2E8B57', bg: 'rgba(46,139,87,0.12)' },
];

export default function Home() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    setTimeout(() => setVisible(true), 100);
    return () => clearInterval(t);
  }, []);

  const hour = time.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100, opacity: visible ? 1 : 0, transition: 'opacity 0.5s' }}>

      {/* ── Header ── */}
      <div className="animate-fadeInUp" style={{
        background: 'linear-gradient(135deg, #0f3d22 0%, #1B6B3A 50%, #0a2e1a 100%)',
        borderRadius: 24,
        padding: '32px 36px',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(212,175,55,0.2)',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', right: -60, top: -60,
          width: 220, height: 220,
          borderRadius: '50%',
          border: '1px solid rgba(212,175,55,0.15)',
        }} />
        <div style={{
          position: 'absolute', right: 40, top: -30,
          width: 120, height: 120,
          borderRadius: '50%',
          border: '1px solid rgba(212,175,55,0.1)',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 4 }}>{greeting} 👋</p>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 6 }}>
              Assalamu Alaikum
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
              {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 12, padding: '10px 12px', cursor: 'pointer', color: 'white',
            }}>
              <Bell size={18} />
            </button>
          </div>
        </div>

        {/* Hijri date bar */}
        <div style={{
          marginTop: 20,
          background: 'rgba(0,0,0,0.25)',
          borderRadius: 14,
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid rgba(212,175,55,0.2)',
          backdropFilter: 'blur(10px)',
        }}>
          <div>
            <div className="arabic" style={{ fontSize: 20, color: '#f5d060', fontWeight: 600 }}>
              ١٤ رمضان ١٤٤٦
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>14 Ramadan 1446 AH</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 18 }}>⭐</span>
            <span style={{ fontSize: 24 }}>🌙</span>
            <span style={{ fontSize: 18 }}>⭐</span>
          </div>
        </div>
      </div>

      {/* ── Prayer Times ── */}
      <div className="animate-fadeInUp delay-2" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 4, height: 20, background: 'linear-gradient(#D4AF37,#f5d060)', borderRadius: 2 }} />
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>Prayer Times</h2>
          </div>
          <span style={{ fontSize: 12, color: '#3aad6e', fontWeight: 500 }}>📍 Karachi</span>
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
          {prayerTimes.map((p) => (
            <div key={p.name} style={{
              flex: '0 0 auto',
              width: 100,
              background: p.next
                ? 'linear-gradient(135deg, #1B6B3A, #0f3d22)'
                : 'var(--dark-card)',
              border: p.next ? '1px solid rgba(212,175,55,0.5)' : '1px solid var(--border)',
              borderRadius: 16,
              padding: '16px 12px',
              textAlign: 'center',
              boxShadow: p.next ? '0 8px 24px rgba(27,107,58,0.3)' : 'none',
              transition: 'transform 0.2s',
            }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{p.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: p.next ? 'white' : '#7a9585', marginBottom: 2 }}>
                {p.name}
              </div>
              <div className="arabic" style={{ fontSize: 11, color: p.next ? 'rgba(255,255,255,0.6)' : '#4a6355', marginBottom: 6 }}>
                {p.arabic}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: p.next ? '#f5d060' : '#3aad6e' }}>
                {p.time}
              </div>
              {p.next && (
                <div style={{
                  marginTop: 6, fontSize: 9, fontWeight: 700,
                  background: 'rgba(212,175,55,0.2)', color: '#f5d060',
                  borderRadius: 6, padding: '2px 6px',
                }}>NEXT</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Ayat of the Day ── */}
      <div className="animate-fadeInUp delay-3" style={{
        background: 'linear-gradient(135deg, #0f3d22, #1B6B3A, #0a2e1a)',
        border: '1px solid rgba(212,175,55,0.25)',
        borderRadius: 20,
        padding: '28px 28px',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '40%', height: '100%',
          background: 'radial-gradient(circle at right, rgba(212,175,55,0.06), transparent)',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(212,175,55,0.15)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: 8, padding: '5px 12px',
          }}>
            <span style={{ fontSize: 12 }}>✨</span>
            <span style={{ fontSize: 12, color: '#f5d060', fontWeight: 600 }}>Ayat of the Day</span>
          </div>
          <button onClick={() => navigate('/quran')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.4)', fontSize: 12,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            Read more <ChevronRight size={14} />
          </button>
        </div>
        <div className="arabic" style={{ fontSize: 24, color: 'white', fontWeight: 600, marginBottom: 16, lineHeight: 2 }}>
          وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 14 }} />
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 8 }}>
          "And whoever fears Allah — He will make for him a way out."
        </div>
        <div style={{ fontSize: 12, color: '#D4AF37', fontWeight: 500 }}>— Surah At-Talaq 65:2</div>
      </div>

      {/* ── Quick Access ── */}
      <div className="animate-fadeInUp delay-4" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ width: 4, height: 20, background: 'linear-gradient(#D4AF37,#f5d060)', borderRadius: 2 }} />
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>Quick Access</h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 12,
        }}>
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path + item.label}
                onClick={() => navigate(item.path)}
                style={{
                  background: 'var(--dark-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: '18px 12px',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                  transition: 'all 0.25s ease',
                  textAlign: 'center',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = item.bg;
                  e.currentTarget.style.borderColor = item.color + '44';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--dark-card)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: 46, height: 46,
                  background: item.bg,
                  border: `1px solid ${item.color}33`,
                  borderRadius: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={22} color={item.color} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'white', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 10, color: '#4a6355' }}>{item.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Progress + Featured Cards ── */}
      <div className="animate-fadeInUp delay-5" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 28 }}>
        {/* Streak */}
        <div style={{
          background: 'var(--dark-card)',
          border: '1px solid rgba(231,76,60,0.2)',
          borderRadius: 18, padding: '20px',
        }}>
          <Flame size={22} color="#e74c3c" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 26, fontWeight: 800, color: 'white' }}>7</div>
          <div style={{ fontSize: 12, color: '#7a9585', marginBottom: 10 }}>Day Streak 🔥</div>
          <div style={{ height: 4, background: 'rgba(231,76,60,0.15)', borderRadius: 2 }}>
            <div style={{ width: '23%', height: '100%', background: '#e74c3c', borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 10, color: '#4a6355', marginTop: 4 }}>7 / 30 days</div>
        </div>

        {/* MCQ Score */}
        <div style={{
          background: 'var(--dark-card)',
          border: '1px solid rgba(212,175,55,0.2)',
          borderRadius: 18, padding: '20px',
        }}>
          <Trophy size={22} color="#D4AF37" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 26, fontWeight: 800, color: 'white' }}>840</div>
          <div style={{ fontSize: 12, color: '#7a9585', marginBottom: 10 }}>MCQ Score ⭐</div>
          <div style={{ height: 4, background: 'rgba(212,175,55,0.15)', borderRadius: 2 }}>
            <div style={{ width: '84%', height: '100%', background: '#D4AF37', borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 10, color: '#4a6355', marginTop: 4 }}>840 / 1000 pts</div>
        </div>

        {/* Wazifa */}
        <div style={{
          background: 'var(--dark-card)',
          border: '1px solid rgba(46,139,87,0.2)',
          borderRadius: 18, padding: '20px',
        }}>
          <Star size={22} color="#2E8B57" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 26, fontWeight: 800, color: 'white' }}>3/5</div>
          <div style={{ fontSize: 12, color: '#7a9585', marginBottom: 10 }}>Wazifa Done ✅</div>
          <div style={{ height: 4, background: 'rgba(46,139,87,0.15)', borderRadius: 2 }}>
            <div style={{ width: '60%', height: '100%', background: '#2E8B57', borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 10, color: '#4a6355', marginTop: 4 }}>3 of 5 completed</div>
        </div>
      </div>

      {/* ── MCQ + Kids Banner ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <button onClick={() => navigate('/mcq')} style={{
          background: 'linear-gradient(135deg, #B7950B, #9A7D0A)',
          border: '1px solid rgba(212,175,55,0.3)',
          borderRadius: 18, padding: '22px',
          cursor: 'pointer', textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: '0 8px 24px rgba(183,149,11,0.25)',
          transition: 'transform 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{
            width: 48, height: 48,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <CheckSquare size={24} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 4 }}>Today's Islamic Quiz</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>5 questions · 2 min · Test your knowledge</div>
          </div>
        </button>

        <button onClick={() => navigate('/kids')} style={{
          background: 'linear-gradient(135deg, #6B2FA0, #8E44AD)',
          border: '1px solid rgba(142,68,173,0.3)',
          borderRadius: 18, padding: '22px',
          cursor: 'pointer', textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: '0 8px 24px rgba(142,68,173,0.25)',
          transition: 'transform 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{
            width: 48, height: 48,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Baby size={24} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 4 }}>Kids Islamic Learning</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>Arabic · Stories · Surahs · Games</div>
          </div>
        </button>
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
}