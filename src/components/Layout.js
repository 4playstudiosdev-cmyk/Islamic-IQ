import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, BookOpen, MessageSquare, Compass,
  Star, CheckSquare, Bot, Baby, Menu, X, Moon,
  Clock, Droplets, Navigation, Hexagon,
  MapPin, CalendarDays, Flame, Bell, BookMarked
} from 'lucide-react';

// Coins icon fallback
import { useAuth } from '../context/AuthContext';

const BookOpenIcon = (p) => <span style={{fontSize:p.size||20}}>📖</span>;
const TafseerIcon  = (p) => <span style={{fontSize:p.size||20}}>📚</span>;
const TasbeehIcon  = (p) => <span style={{fontSize:p.size||20}}>📿</span>;
const HandsIcon   = (p) => <span style={{fontSize:p.size||20}}>🤲</span>;
const MosqueIcon  = (p) => <span style={{fontSize:p.size||20}}>🕌</span>;
const MoonIcon2   = (p) => <span style={{fontSize:p.size||20}}>🌙</span>;
const Coins = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={props.size||24} height={props.size||24}>
    <circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>
  </svg>
);

const G  = '#C9A84C';
const G2 = '#E8C97A';

const navItems = [
  { path:'/home',        icon:Home,          label:'Home',        color:G  },
  { path:'/quran',       icon:BookOpen,      label:'Quran',       color:G  },
  { path:'/hadith',      icon:MessageSquare, label:'Hadith',      color:G2 },
  { path:'/namaz',       icon:Compass,       label:'Namaz',       color:G  },
  { path:'/prayer',      icon:Clock,         label:'Prayer',      color:G2 },
  { path:'/wudu',        icon:Droplets,      label:'Wudu',        color:G  },
  { path:'/qibla',       icon:Navigation,    label:'Qibla',       color:G2 },
  { path:'/allah-names', icon:Hexagon,       label:'Allah Names', color:G  },
  { path:'/wazifa',      icon:Star,          label:'Wazifa',      color:G2 },
  { path:'/mcq',         icon:CheckSquare,   label:'MCQ',         color:G  },
  { path:'/kids',        icon:Baby,          label:'Kids',        color:G2 },
  { path:'/chatbot',     icon:Bot,           label:'AI Chat',     color:G  },
  { path:'/masjid',      icon:MapPin,        label:'Masjid',      color:G2 },
  { path:'/calendar',    icon:CalendarDays,  label:'Calendar',    color:G  },
  { path:'/zakat',       icon:Coins,         label:'Zakat',       color:G2 },
  { path:'/habits',      icon:Flame,         label:'Habits',      color:G  },
  { path:'/events',      icon:Bell,          label:'Events',      color:G2 },
  { path:'/arabic-word', icon:BookMarked,    label:'Arabic Word', color:G  },
  { path:'/quran-reader',icon:BookOpenIcon,  label:'Quran Read',  color:G2 },
  { path:'/tafseer',     icon:TafseerIcon,   label:'Tafseer',     color:G  },
  { path:'/tasbeeh',     icon:TasbeehIcon,   label:'Tasbeeh',     color:G2 },
  { path:'/duas',        icon:HandsIcon,     label:'Duas',        color:G  },
  { path:'/jummah',      icon:MosqueIcon,    label:'Jummah',      color:G2 },
  { path:'/ramadan',     icon:MoonIcon2,     label:'Ramadan',     color:G  },
];

const bottomNav = [
  { path:'/home',    icon:Home,          label:'Home',   color:G  },
  { path:'/quran',   icon:BookOpen,      label:'Quran',  color:G  },
  { path:'/prayer',  icon:Clock,         label:'Prayer', color:G2 },
  { path:'/hadith',  icon:MessageSquare, label:'Hadith', color:G2 },
  { path:'/chatbot', icon:Bot,           label:'AI',     color:G  },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  :root {
    --bg:     #030303;
    --dark:   #0A0A08;
    --dark2:  #0F0F0D;
    --gold:   #C9A84C;
    --gold2:  #E8C97A;
    --border: rgba(201,168,76,0.12);
    --muted:  rgba(242,237,228,0.35);
    --text:   #F2EDE4;
    --dark-card: #0F0F0D;
  }
  * { box-sizing:border-box; }
  body { background:#030303 !important; margin:0; }
  .arabic { font-family:'Scheherazade New',serif !important; direction:rtl; }
  @keyframes shimmer { to{background-position:200% center} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
  .nav-btn { transition:all 0.2s; }
  .nav-btn:hover { background:rgba(201,168,76,0.08) !important; }
`;

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile]       = useState(window.innerWidth < 768);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const { profile, user, signOut } = useAuth();

  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || '';

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const goTo = (path) => { navigate(path); setSidebarOpen(false); setDrawerOpen(false); };

  // ── MOBILE ───────────────────────────────────────────────────
  if (isMobile) return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#030303', position:'relative' }}>
      <style>{CSS}</style>

      {/* Top bar */}
      <header style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, background:'rgba(3,3,3,0.95)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(201,168,76,0.1)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px', height:56 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:30, height:30, background:'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>☽</div>
          <span style={{ fontSize:15, fontWeight:800, fontFamily:'Cinzel,serif', background:'linear-gradient(135deg,#C9A84C,#E8C97A)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>IslamIQ</span>
        </div>
        <span style={{ fontSize:12, color:'rgba(201,168,76,0.6)', fontFamily:'Cinzel,serif', letterSpacing:1 }}>
          {navItems.find(n=>n.path===location.pathname)?.label||''}
        </span>
        <button onClick={() => setDrawerOpen(true)} style={{ background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:10, padding:'6px 10px', cursor:'pointer', color:G }}>
          <Menu size={18}/>
        </button>
      </header>

      <main style={{ flex:1, marginTop:56, marginBottom:64, overflowY:'auto', background:'#030303' }}>
        {children}
      </main>

      {/* Bottom nav */}
      <nav style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:200, background:'rgba(3,3,3,0.97)', backdropFilter:'blur(20px)', borderTop:'1px solid rgba(201,168,76,0.1)', display:'flex', alignItems:'center', height:64, padding:'0 8px', paddingBottom:'env(safe-area-inset-bottom)' }}>
        {bottomNav.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button key={item.path} onClick={() => goTo(item.path)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, border:'none', background:'transparent', cursor:'pointer', padding:'6px 4px', borderRadius:10, borderTop: isActive?`2px solid ${G}`:'2px solid transparent' }}>
              <Icon size={19} color={isActive?G:'rgba(242,237,228,0.25)'}/>
              <span style={{ fontSize:9, fontWeight:isActive?700:400, color:isActive?G:'rgba(242,237,228,0.25)' }}>{item.label}</span>
            </button>
          );
        })}
        <button onClick={() => setDrawerOpen(true)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, border:'none', background:'transparent', cursor:'pointer', padding:'6px 4px', borderTop:'2px solid transparent' }}>
          <Menu size={19} color="rgba(242,237,228,0.25)"/>
          <span style={{ fontSize:9, color:'rgba(242,237,228,0.25)' }}>More</span>
        </button>
      </nav>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:300 }} onClick={() => setDrawerOpen(false)}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)' }}/>
          <div onClick={e=>e.stopPropagation()} style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(180deg,#0A0A08,#030303)', borderRadius:'24px 24px 0 0', border:'1px solid rgba(201,168,76,0.15)', padding:'16px 16px 32px', maxHeight:'80vh', overflowY:'auto' }}>
            <div style={{ width:40, height:4, background:'rgba(201,168,76,0.2)', borderRadius:2, margin:'0 auto 18px' }}/>
            {/* Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:36, height:36, background:'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>☽</div>
                <div>
                  <div style={{ fontSize:16, fontWeight:800, fontFamily:'Cinzel,serif', background:'linear-gradient(135deg,#C9A84C,#E8C97A)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>IslamIQ</div>
                  {userName && <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)' }}>Welcome, {userName}</div>}
                </div>
              </div>
              <button onClick={() => setDrawerOpen(false)} style={{ background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:10, padding:8, cursor:'pointer', color:G }}>
                <X size={16}/>
              </button>
            </div>
            {/* Grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button key={item.path} onClick={() => goTo(item.path)} style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6, padding:'14px 8px', background:isActive?'rgba(201,168,76,0.12)':'rgba(201,168,76,0.03)', border:`1px solid ${isActive?'rgba(201,168,76,0.4)':'rgba(201,168,76,0.08)'}`, borderRadius:14, cursor:'pointer', transition:'all 0.2s' }}>
                    <Icon size={20} color={isActive?G:'rgba(242,237,228,0.4)'}/>
                    <span style={{ fontSize:11, fontWeight:isActive?700:400, color:isActive?G:'rgba(242,237,228,0.4)', textAlign:'center' }}>{item.label}</span>
                  </button>
                );
              })}
            </div>
            {/* Sign out */}
            {user && (
              <button onClick={() => { signOut(); navigate('/'); }} style={{ width:'100%', marginTop:14, padding:'11px', background:'rgba(231,76,60,0.08)', border:'1px solid rgba(231,76,60,0.15)', borderRadius:12, color:'rgba(231,76,60,0.7)', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>
                Sign Out
              </button>
            )}
            <div className="arabic" style={{ textAlign:'center', fontSize:13, color:'rgba(201,168,76,0.4)', marginTop:14 }}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── DESKTOP ──────────────────────────────────────────────────
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#030303', position:'relative' }}>
      <style>{CSS}</style>

      {/* Sidebar */}
      <aside style={{ width:sidebarOpen?220:64, background:'linear-gradient(180deg,#0A0A08 0%,#030303 100%)', borderRight:'1px solid rgba(201,168,76,0.1)', display:'flex', flexDirection:'column', padding:'16px 0', transition:'width 0.3s ease', position:'fixed', top:0, left:0, bottom:0, zIndex:100, overflow:'hidden' }}>

        {/* Toggle button */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background:'none', border:'none', cursor:'pointer', color:G, padding:'8px 20px', display:'flex', alignItems:'center', marginBottom:8 }}>
          {sidebarOpen ? <X size={20}/> : <Menu size={20}/>}
        </button>

        {/* Logo */}
        <div style={{ padding:sidebarOpen?'12px 18px':'12px 14px', marginBottom:14, borderBottom:'1px solid rgba(201,168,76,0.1)' }}>
          <div style={{ width:34, height:34, background:'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>☽</div>
          {sidebarOpen && (
            <div style={{ marginTop:10 }}>
              <div style={{ fontSize:16, fontWeight:800, fontFamily:'Cinzel,serif', background:'linear-gradient(135deg,#C9A84C,#E8C97A)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>IslamIQ</div>
              {userName && <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', marginTop:2 }}>👤 {userName}</div>}
              {!userName && <div style={{ fontSize:11, color:'rgba(201,168,76,0.4)', marginTop:2 }}>Your Islamic Companion</div>}
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ flex:1, padding:'0 8px', overflowY:'auto' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => goTo(item.path)} className="nav-btn"
                style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:12, border:'none', background:isActive?'rgba(201,168,76,0.1)':'transparent', cursor:'pointer', marginBottom:3, borderLeft:isActive?`3px solid ${G}`:'3px solid transparent' }}>
                <Icon size={19} color={isActive?G:'rgba(242,237,228,0.3)'} style={{ flexShrink:0 }}/>
                {sidebarOpen && <span style={{ fontSize:12, fontWeight:isActive?700:400, color:isActive?G:'rgba(242,237,228,0.45)', whiteSpace:'nowrap' }}>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom: bismillah + signout */}
        <div style={{ padding:sidebarOpen?'12px 18px':'12px 14px', borderTop:'1px solid rgba(201,168,76,0.08)' }}>
          {sidebarOpen ? (
            <div>
              <div className="arabic" style={{ fontSize:12, color:'rgba(201,168,76,0.4)', marginBottom:8 }}>بِسْمِ اللَّهِ</div>
              {user && (
                <button onClick={() => { signOut(); navigate('/'); }}
                  style={{ width:'100%', padding:'8px', background:'rgba(231,76,60,0.07)', border:'1px solid rgba(231,76,60,0.12)', borderRadius:8, color:'rgba(231,76,60,0.6)', fontSize:11, cursor:'pointer', fontFamily:'inherit' }}>
                  Sign Out
                </button>
              )}
            </div>
          ) : (
            <div className="arabic" style={{ fontSize:16, color:'rgba(201,168,76,0.3)', textAlign:'center' }}>☽</div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex:1, marginLeft:sidebarOpen?220:64, minHeight:'100vh', transition:'margin-left 0.3s ease', background:'#030303', overflow:'auto' }}>
        {children}
      </main>
    </div>
  );
}