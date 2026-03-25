import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon:'📖', title:'Holy Quran',         desc:'114 Surahs · 30 Parahs · Arabic + Urdu + English · Audio Recitation' },
  { icon:'📚', title:'Hadith Library',     desc:'Bukhari · Muslim · Tirmidhi · Abu Dawud · Ibn Majah · Nasai' },
  { icon:'🕌', title:'Namaz Guide',        desc:'9-step animated guide with beautiful prayer position figures' },
  { icon:'💧', title:'Wudu Guide',         desc:'10-step animated water effects with Fard & Sunnah labels' },
  { icon:'🕐', title:'Prayer Times',       desc:'Live GPS · Hijri Date · Countdown to next Salah' },
  { icon:'🧭', title:'Qibla Compass',      desc:'Real-time compass pointing toward Makkah al-Mukarramah' },
  { icon:'🤖', title:'AI Islamic Chat',    desc:'Groq AI powered · Instant answers to all Islamic questions' },
  { icon:'📝', title:'MCQ Quiz',           desc:'160+ questions · 8 categories · Daily AI-generated quiz' },
  { icon:'👶', title:'Kids Section',       desc:'Alphabet · Surahs · Prophet stories · Duas · Islamic poems' },
  { icon:'⭐', title:'Wazifa Tracker',     desc:'Daily dhikr counter · Subhanallah · Alhamdulillah · Allahu Akbar' },
  { icon:'✨', title:"Allah's 99 Names",   desc:'Asma-ul-Husna · Arabic calligraphy · Meanings · Audio' },
  { icon:'🕋', title:'Zakat Calculator',   desc:'Gold · Silver · Cash · Livestock · Business assets' },
  { icon:'📅', title:'Islamic Calendar',   desc:'Hijri calendar · Islamic events · Eid dates · Ramadan countdown' },
  { icon:'🔥', title:'Habit Tracker',      desc:'Build Islamic habits · Daily streaks · Prayer & Quran goals' },
  { icon:'🗺️', title:'Masjid Finder',      desc:'Find nearest mosques · Prayer times · Directions' },
  { icon:'⏰', title:'Smart Reminders',    desc:'Prayer alerts · Quran reminders · Islamic event notifications' },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  :root {
    --gold:   #C9A84C;
    --gold2:  #E8C97A;
    --gold3:  #F5DFA0;
    --black:  #030303;
    --dark:   #0A0A08;
    --card:   #0F0F0D;
    --white:  #F2EDE4;
    --muted:  rgba(242,237,228,0.42);
  }

  .lp * { margin:0; padding:0; box-sizing:border-box; }
  .lp {
    font-family:'Plus Jakarta Sans',sans-serif;
    background:var(--black);
    color:var(--white);
    overflow-x:hidden;
  }

  /* Gold shimmer text */
  .g-text {
    background:linear-gradient(100deg, var(--gold) 0%, var(--gold2) 40%, var(--gold3) 60%, var(--gold) 100%);
    background-size:200% auto;
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    background-clip:text;
    animation:shimmer 5s linear infinite;
  }

  @keyframes shimmer    { to{background-position:200% center} }
  @keyframes fadeUp     { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn     { from{opacity:0} to{opacity:1} }
  @keyframes rotSlow    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes rotSlowRev { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
  @keyframes pulse      { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
  @keyframes float      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes lineGrow   { from{width:0;opacity:0} to{width:60px;opacity:1} }

  /* Nav */
  .lp-nav {
    position:fixed;top:0;left:0;right:0;z-index:999;
    display:flex;align-items:center;justify-content:space-between;
    padding:0 48px;height:68px;
    transition:all 0.4s;
  }
  .lp-nav.scrolled {
    background:rgba(3,3,3,0.92);
    backdrop-filter:blur(24px);
    border-bottom:1px solid rgba(201,168,76,0.1);
  }

  /* Hero */
  .hero-badge {
    display:inline-flex;align-items:center;gap:8px;
    background:rgba(201,168,76,0.07);
    border:1px solid rgba(201,168,76,0.18);
    border-radius:50px;padding:6px 18px;
    font-family:'Cinzel',serif;font-size:10px;
    letter-spacing:2.5px;color:var(--gold);
  }

  .btn-primary {
    background:linear-gradient(135deg,var(--gold),var(--gold2));
    color:#050505;border:none;
    font-family:'Cinzel',serif;font-weight:700;
    font-size:13px;letter-spacing:1.5px;
    padding:14px 32px;border-radius:50px;
    cursor:pointer;transition:all 0.3s;
    position:relative;overflow:hidden;
  }
  .btn-primary::after {
    content:'';position:absolute;inset:0;
    background:linear-gradient(135deg,transparent,rgba(255,255,255,0.18),transparent);
    transform:translateX(-100%);transition:0.5s;
  }
  .btn-primary:hover { transform:translateY(-2px);box-shadow:0 10px 32px rgba(201,168,76,0.38); }
  .btn-primary:hover::after { transform:translateX(100%); }

  .btn-ghost {
    background:transparent;
    border:1px solid rgba(242,237,228,0.18);
    color:var(--white);font-size:13px;
    padding:13px 28px;border-radius:50px;
    cursor:pointer;transition:all 0.3s;
  }
  .btn-ghost:hover { border-color:var(--gold);color:var(--gold); }

  /* Feature cards */
  .feat-card {
    background:var(--card);
    border:1px solid rgba(201,168,76,0.08);
    border-radius:18px;padding:26px 22px;
    transition:all 0.35s;cursor:default;
    position:relative;overflow:hidden;
  }
  .feat-card::after {
    content:'';position:absolute;
    inset:0;opacity:0;
    background:linear-gradient(135deg,rgba(201,168,76,0.05),transparent 60%);
    transition:0.3s;
  }
  .feat-card:hover { transform:translateY(-5px);border-color:rgba(201,168,76,0.25);box-shadow:0 24px 48px rgba(0,0,0,0.5); }
  .feat-card:hover::after { opacity:1; }

  /* Stats */
  .stat-item { text-align:center;padding:0 32px;border-right:1px solid rgba(201,168,76,0.12); }
  .stat-item:last-child { border-right:none; }

  /* Scroll indicator */
  @keyframes scrollBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }

  /* Section divider */
  .gold-line { width:60px;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:0 auto; }

  @media (max-width:768px) {
    .lp-nav { padding:0 20px; }
    .hero-title { font-size:clamp(32px,10vw,56px) !important; }
    .feat-grid { grid-template-columns:repeat(2,1fr) !important; }
    .stats-row { flex-wrap:wrap;gap:20px !important; }
    .stat-item { border-right:none;padding:0 16px; }
    .cta-btns { flex-direction:column;align-items:center; }
  }
`;

export default function Landing() {
  const navigate   = useNavigate();
  const { isLoggedIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const goApp = () => navigate('/login');
  const goLogin  = () => navigate('/login');

  return (
    <div className="lp">
      <style>{CSS}</style>

      {/* ── NAV ────────────────────────────────────────────────── */}
      <nav className={`lp-nav ${scrolled ? 'scrolled' : ''}`}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:34,height:34,background:'linear-gradient(135deg,#C9A84C,#E8C97A)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,flexShrink:0}}>☽</div>
          <span style={{fontFamily:'Cinzel,serif',fontSize:16,fontWeight:700,letterSpacing:2}} className="g-text">IslamIQ</span>
        </div>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          {isLoggedIn ? (
            <button className="btn-primary" onClick={() => navigate('/login')} style={{padding:'10px 24px',fontSize:12}}>Open App</button>
          ) : (
            <>
              <button className="btn-ghost" onClick={() => navigate('/login')} style={{padding:'10px 22px',fontSize:12}}>Sign In</button>
              <button className="btn-primary" onClick={() => navigate('/login')} style={{padding:'10px 22px',fontSize:12}}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'120px 24px 80px',position:'relative',overflow:'hidden'}}>

        {/* BG elements */}
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 60%, rgba(201,168,76,0.07) 0%, transparent 60%)',pointerEvents:'none'}}/>

        {/* Outer ring */}
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'min(600px,90vw)',height:'min(600px,90vw)',border:'1px solid rgba(201,168,76,0.05)',borderRadius:'50%',animation:'rotSlow 40s linear infinite',pointerEvents:'none'}}>
          {[0,60,120,180,240,300].map((d,i) => (
            <div key={i} style={{position:'absolute',width:5,height:5,background:'rgba(201,168,76,0.35)',borderRadius:'50%',top:'50%',left:'50%',transformOrigin:'0 0',transform:`rotate(${d}deg) translateX(${Math.min(300,45)}vw) translateY(-50%)`}}/>
          ))}
        </div>

        {/* Inner ring */}
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'min(360px,60vw)',height:'min(360px,60vw)',border:'1px solid rgba(201,168,76,0.04)',borderRadius:'50%',animation:'rotSlowRev 25s linear infinite',pointerEvents:'none'}}/>

        {/* Content */}
        <div style={{position:'relative',zIndex:1,maxWidth:820}}>
          {/* Bismillah */}
          <div style={{fontFamily:'Scheherazade New,serif',fontSize:'clamp(18px,3vw,26px)',color:'rgba(201,168,76,0.4)',marginBottom:22,letterSpacing:4,direction:'rtl',animation:'fadeIn 1.2s ease'}}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          {/* Badge */}
          <div style={{display:'flex',justifyContent:'center',marginBottom:28,animation:'fadeUp 0.7s ease'}}>
            <div className="hero-badge">
              <div style={{width:5,height:5,background:'var(--gold)',borderRadius:'50%',animation:'pulse 2s infinite'}}/>
              YOUR COMPLETE ISLAMIC COMPANION
            </div>
          </div>

          {/* Main title */}
          <h1 className="hero-title" style={{fontFamily:'Cinzel,serif',fontSize:'clamp(38px,7vw,78px)',fontWeight:900,lineHeight:1.08,marginBottom:20,animation:'fadeUp 0.7s 0.1s ease both'}}>
            <span className="g-text">Strengthen</span>
            <br/>
            <span style={{color:'var(--white)'}}>Your Connection</span>
            <br/>
            <span className="g-text">With Islam</span>
          </h1>

          {/* Subtitle */}
          <p style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(16px,2.2vw,22px)',color:'var(--muted)',maxWidth:560,margin:'0 auto 44px',lineHeight:1.65,fontWeight:300,animation:'fadeUp 0.7s 0.2s ease both'}}>
            16 powerful Islamic features in one beautiful app — Quran, Hadith, Prayer Times, AI Chat, and so much more.
          </p>

          {/* CTAs */}
          <div className="cta-btns" style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap',marginBottom:64,animation:'fadeUp 0.7s 0.3s ease both'}}>
            <button className="btn-primary" onClick={goApp} style={{fontSize:'14px',padding:'15px 38px'}}>
              ✦ {isLoggedIn ? 'Open App' : 'Get Started Free'}
            </button>
            {!isLoggedIn && (
              <button className="btn-ghost" onClick={goLogin} style={{fontSize:'13px',padding:'15px 34px'}}>
                Sign In →
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="stats-row" style={{display:'flex',justifyContent:'center',animation:'fadeUp 0.7s 0.4s ease both',gap:0}}>
            {[{n:'16+',l:'Features'},{n:'6236',l:'Quran Ayats'},{n:'26,000+',l:'Hadiths'},{n:'99',l:"Allah's Names"}].map(s => (
              <div className="stat-item" key={s.l}>
                <div style={{fontFamily:'Cinzel,serif',fontSize:'clamp(22px,3vw,30px)',fontWeight:700,color:'var(--gold)',marginBottom:4}}>{s.n}</div>
                <div style={{fontSize:11,color:'var(--muted)',letterSpacing:1}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll arrow */}
        <div style={{position:'absolute',bottom:28,left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:6,opacity:0.35,animation:'scrollBounce 2s ease infinite'}}>
          <div style={{fontSize:10,fontFamily:'Cinzel,serif',letterSpacing:2,color:'var(--gold)'}}>SCROLL</div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7l6 6 6-6" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section style={{padding:'100px 40px',maxWidth:1200,margin:'0 auto',position:'relative',zIndex:1}}>
        <div style={{textAlign:'center',marginBottom:64}}>
          <div style={{fontFamily:'Cinzel,serif',fontSize:10,letterSpacing:4,color:'rgba(201,168,76,0.6)',marginBottom:14}}>EVERYTHING YOU NEED</div>
          <h2 style={{fontFamily:'Cinzel,serif',fontSize:'clamp(26px,4vw,42px)',fontWeight:700,marginBottom:18,lineHeight:1.2}}>
            <span className="g-text">16 Powerful Features</span>
            <br/>
            <span style={{color:'var(--white)',fontSize:'0.75em',fontWeight:400,fontFamily:'Cormorant Garamond,serif'}}>for your Islamic journey</span>
          </h2>
          <div className="gold-line"/>
        </div>

        <div className="feat-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))',gap:14}}>
          {FEATURES.map((f,i) => (
            <div key={i} className="feat-card" style={{animationDelay:`${i*0.04}s`}}>
              <div style={{fontSize:26,marginBottom:12}}>{f.icon}</div>
              <div style={{fontFamily:'Cinzel,serif',fontSize:12,fontWeight:600,color:'var(--gold)',marginBottom:7,letterSpacing:0.8}}>{f.title}</div>
              <div style={{fontSize:12,color:'var(--muted)',lineHeight:1.75}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AYAH SECTION ───────────────────────────────────────── */}
      <section style={{padding:'80px 40px',textAlign:'center',background:'linear-gradient(180deg,transparent,rgba(201,168,76,0.03),transparent)',borderTop:'1px solid rgba(201,168,76,0.07)',borderBottom:'1px solid rgba(201,168,76,0.07)',position:'relative',zIndex:1}}>
        <div style={{maxWidth:660,margin:'0 auto'}}>
          <div style={{fontFamily:'Scheherazade New,serif',fontSize:'clamp(20px,3.5vw,32px)',color:'var(--gold)',lineHeight:2,marginBottom:18,direction:'rtl',opacity:0.9}}>
            وَمَن يَتَّقِ ٱللَّهَ يَجْعَل لَّهُۥ مَخْرَجًا
          </div>
          <p style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(15px,2vw,19px)',color:'var(--muted)',fontStyle:'italic',fontWeight:300,marginBottom:8}}>
            "And whoever fears Allah — He will make for him a way out."
          </p>
          <div style={{fontSize:11,color:'rgba(201,168,76,0.4)',letterSpacing:2}}>SURAH AT-TALAQ · 65:2</div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section style={{padding:'100px 40px',textAlign:'center',position:'relative',zIndex:1}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 65%)',pointerEvents:'none'}}/>
        <div style={{maxWidth:560,margin:'0 auto',position:'relative'}}>
          <div style={{fontFamily:'Cinzel,serif',fontSize:10,letterSpacing:4,color:'rgba(201,168,76,0.6)',marginBottom:16}}>START TODAY — IT'S FREE</div>
          <h2 style={{fontFamily:'Cinzel,serif',fontSize:'clamp(26px,4vw,44px)',fontWeight:700,lineHeight:1.2,marginBottom:16}}>
            Begin Your<br/>
            <span className="g-text">Islamic Journey</span>
          </h2>
          <p style={{fontSize:14,color:'var(--muted)',marginBottom:38,lineHeight:1.7,fontWeight:300}}>
            Join Muslims around the world using IslamIQ to deepen their faith and Islamic knowledge.
          </p>
          <div className="cta-btns" style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <button className="btn-primary" onClick={() => navigate('/login')} style={{fontSize:'14px',padding:'15px 40px'}}>
              Create Free Account
            </button>
            <button className="btn-ghost" onClick={() => navigate('/login')} style={{padding:'15px 36px',fontSize:'13px'}}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{padding:'32px 48px',borderTop:'1px solid rgba(201,168,76,0.08)',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12,position:'relative',zIndex:1}}>
        <div style={{display:'flex',alignItems:'center',gap:9}}>
          <div style={{width:26,height:26,background:'linear-gradient(135deg,#C9A84C,#E8C97A)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12}}>☽</div>
          <span style={{fontFamily:'Cinzel,serif',fontSize:13,fontWeight:700,letterSpacing:2}} className="g-text">IslamIQ</span>
        </div>
        <div style={{fontSize:11,color:'rgba(242,237,228,0.2)',letterSpacing:0.5}}>© 2026 IslamIQ — Your Complete Islamic Companion</div>
        <div style={{fontFamily:'Scheherazade New,serif',fontSize:13,color:'rgba(201,168,76,0.35)',direction:'rtl'}}>بِسْمِ اللَّهِ</div>
      </footer>
    </div>
  );
}