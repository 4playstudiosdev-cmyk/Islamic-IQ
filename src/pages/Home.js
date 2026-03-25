/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, MessageSquare, Compass, Star, CheckSquare, Bot, Baby, Navigation, Droplets, Hexagon, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation as useAppLocation } from '../context/LocationContext';

const CalendarIcon = () => <span style={{fontSize:18}}>📅</span>;
const ZakatIcon    = () => <span style={{fontSize:18}}>🕋</span>;
const FlameIcon    = () => <span style={{fontSize:18}}>🔥</span>;
const BellIcon     = () => <span style={{fontSize:18}}>🌙</span>;
const TasbeehI     = () => <span style={{fontSize:18}}>📿</span>;
const DuaI         = () => <span style={{fontSize:18}}>🤲</span>;
const JummahI      = () => <span style={{fontSize:18}}>🕌</span>;
const RamadanI     = () => <span style={{fontSize:18}}>🌙</span>;

// ── Convert 24hr to 12hr ─────────────────────────────────────
const to12hr = (time24) => {
  if (!time24) return '--:--';
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr   = h % 12 || 12;
  return `${hr}:${String(m).padStart(2,'0')} ${ampm}`;
};

// ── Quick links ────────────────────────────────────────────────
const QUICK = [
  { path:'/quran',       icon:BookOpen,      label:'Quran',        sub:'114 Surahs',    color:'#C9A84C', bg:'rgba(201,168,76,0.1)'  },
  { path:'/hadith',      icon:MessageSquare, label:'Hadith',       sub:'6 Books',       color:'#E8C97A', bg:'rgba(232,201,122,0.1)' },
  { path:'/namaz',       icon:Compass,       label:'Namaz',        sub:'Step by step',  color:'#C9A84C', bg:'rgba(201,168,76,0.1)'  },
  { path:'/wudu',        icon:Droplets,      label:'Wudu',         sub:'10 Steps',      color:'#E8C97A', bg:'rgba(232,201,122,0.1)' },
  { path:'/chatbot',     icon:Bot,           label:'AI Chat',      sub:'Ask anything',  color:'#C9A84C', bg:'rgba(201,168,76,0.1)'  },
  { path:'/mcq',         icon:CheckSquare,   label:'MCQ Quiz',     sub:'Daily quiz',    color:'#E8C97A', bg:'rgba(232,201,122,0.1)' },
  { path:'/wazifa',      icon:Star,          label:'Wazifa',       sub:'Track dhikr',   color:'#C9A84C', bg:'rgba(201,168,76,0.1)'  },
  { path:'/kids',        icon:Baby,          label:'Kids',         sub:'Fun learning',  color:'#E8C97A', bg:'rgba(232,201,122,0.1)' },
  { path:'/qibla',       icon:Navigation,    label:'Qibla',        sub:'Find direction',color:'#C9A84C', bg:'rgba(201,168,76,0.1)'  },
  { path:'/allah-names', icon:Hexagon,       label:'99 Names',     sub:'Asma ul Husna', color:'#E8C97A', bg:'rgba(232,201,122,0.1)' },
  { path:'/masjid',      icon:MapPin,        label:'Masjid Finder',sub:'Nearby mosques',color:'#C9A84C', bg:'rgba(201,168,76,0.1)'  },
  { path:'/calendar',    icon:CalendarIcon,  label:'Calendar',     sub:'Hijri events',  color:'#E8C97A', bg:'rgba(232,201,122,0.1)' },
  { path:'/zakat',       icon:ZakatIcon,     label:'Zakat',        sub:'Calculator',    color:'#C9A84C', bg:'rgba(201,168,76,0.1)'  },
  { path:'/habits',      icon:FlameIcon,     label:'Habits',       sub:'Daily tracker', color:'#E8C97A', bg:'rgba(232,201,122,0.1)' },
  { path:'/events',      icon:BellIcon,      label:'Events',       sub:'Islamic events',color:'#C9A84C', bg:'rgba(201,168,76,0.1)'  },
  { path:'/arabic-word', icon:BookOpen,      label:'Arabic Word',  sub:'Learn daily',   color:'#E8C97A', bg:'rgba(232,201,122,0.1)' },
  { path:'/tasbeeh',     icon:TasbeehI,      label:'Tasbeeh',      sub:'Digital counter',color:'#C9A84C', bg:'rgba(201,168,76,0.1)'  },
  { path:'/duas',        icon:DuaI,          label:'Dua Collection',sub:'25+ duas',     color:'#E8C97A', bg:'rgba(232,201,122,0.1)' },
  { path:'/jummah',      icon:JummahI,       label:"Jumu'ah",      sub:'Friday guide',  color:'#C9A84C', bg:'rgba(201,168,76,0.1)'  },
  { path:'/ramadan',     icon:RamadanI,      label:'Ramadan',      sub:'Sehri/Iftar',   color:'#E8C97A', bg:'rgba(232,201,122,0.1)' },
];

const PRAYERS = ['Fajr','Dhuhr','Asr','Maghrib','Isha'];
const PRAYER_ARABIC = { Fajr:'الفجر', Dhuhr:'الظهر', Asr:'العصر', Maghrib:'المغرب', Isha:'العشاء' };
const PRAYER_ICONS  = { Fajr:'🌙', Dhuhr:'☀️', Asr:'🌤️', Maghrib:'🌅', Isha:'🌙' };

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer  { to{background-position:200% center} }
  @keyframes pulse_g  { 0%,100%{opacity:0.5} 50%{opacity:1} }
  @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .gold-text {
    background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C);
    background-size:200% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; animation:shimmer 4s linear infinite;
  }
  .qcard { transition:all 0.25s; cursor:pointer; }
  .qcard:hover { transform:translateY(-3px); }
  .prayer-card { transition:all 0.3s; }
`;

export default function Home() {
  const navigate            = useNavigate();
  const { profile, user }   = useAuth();
  const { coords, city, loading: locLoading } = useAppLocation();
  const [now, setNow]       = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState({});
  const [nextPrayer, setNextPrayer]   = useState(null);
  const [countdown, setCountdown]     = useState('');
  const [ayat, setAyat]               = useState(null);
  const [hijri, setHijri]             = useState('');
  const [hijriAdj, setHijriAdj]       = useState(() => {
    return parseInt(localStorage.getItem('hijri_adj') || '-1');
  });
  const [loading, setLoading]         = useState(true);

  // ── Tick every second ─────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // ── Load prayer times + ayat ──────────────────────────────
  useEffect(() => {
    if (coords) loadData();
    else if (!locLoading) loadData(); // use defaults if no location
  }, [coords]);

  // ── Update countdown every second ─────────────────────────
  useEffect(() => {
    if (!nextPrayer || !prayerTimes[nextPrayer]) return;
    const [h, m] = prayerTimes[nextPrayer].split(':').map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const diff = target - now;
    const hrs  = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    if (hrs > 0) setCountdown(`${hrs}h ${mins}m ${secs}s`);
    else         setCountdown(`${mins}m ${secs}s`);
  }, [now, nextPrayer, prayerTimes]);

  const loadData = async () => {
    setLoading(true);

    // ✅ Use coords from LocationContext (already fetched once)
    const lat = coords?.lat || 24.8607;
    const lng = coords?.lng || 67.0011;

    // ── Step 3: Prayer times + Hijri ────────────────────────
    try {
      const today = new Date();
      const dd    = String(today.getDate()).padStart(2,'0');
      const mm    = String(today.getMonth()+1).padStart(2,'0');
      const yyyy  = today.getFullYear();
      const url   = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=1&school=1`;
      const pr    = await fetch(url);
      const prd   = await pr.json();

      if (prd.code === 200 && prd.data) {
        const t     = prd.data.timings;
        const times = { Fajr:t.Fajr, Dhuhr:t.Dhuhr, Asr:t.Asr, Maghrib:t.Maghrib, Isha:t.Isha };
        setPrayerTimes(times);

        // ✅ Hijri date — fetch separately with exact lat/lng for local moon sighting
        try {
          // city from LocationContext
          // Use gToH with location-based adjustment
          const today2 = new Date();
          const dd2    = String(today2.getDate()).padStart(2,'0');
          const mm2    = String(today2.getMonth()+1).padStart(2,'0');
          const yyyy2  = today2.getFullYear();
          // Use timings-based Hijri (most accurate for that location)
          const hd     = prd.data.date.hijri;
          // Apply local moon sighting adjustment
          const adj     = parseInt(localStorage.getItem('hijri_adj') || '-1');
          const gDate   = new Date(prd.data.date.gregorian.date.split('-').reverse().join('-'));
          const adjDate = new Date(gDate.getTime() + adj * 86400000);
          const adjDD   = String(adjDate.getDate()).padStart(2,'0');
          const adjMM   = String(adjDate.getMonth()+1).padStart(2,'0');
          const adjYYYY = adjDate.getFullYear();
          try {
            const adjRes = await fetch(`https://api.aladhan.com/v1/gToH/${adjDD}-${adjMM}-${adjYYYY}`);
            const adjDat = await adjRes.json();
            if (adjDat.data) {
              const ah = adjDat.data.hijri;
              setHijri(`${ah.day} ${ah.month.en} ${ah.year} AH`);
            } else setHijri(`${parseInt(hd.day)} ${hd.month.en} ${hd.year} AH`);
          } catch { setHijri(`${parseInt(hd.day)} ${hd.month.en} ${hd.year} AH`); }
        } catch {
          const hd = prd.data.date.hijri;
          setHijri(`${hd.day} ${hd.month.en} ${hd.year} AH`);
        }

        // Find next prayer
        const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
        let next = 'Fajr';
        for (const p of PRAYERS) {
          const [ph, pm] = t[p].split(':').map(Number);
          if (ph * 60 + pm > nowMins) { next = p; break; }
        }
        setNextPrayer(next);
      } else throw new Error('API error');
    } catch (e) {
      console.error('Prayer API error:', e);
      // Last resort — hardcoded Karachi times
      setPrayerTimes({ Fajr:'05:08', Dhuhr:'12:25', Asr:'15:50', Maghrib:'18:45', Isha:'20:10' });
      setNextPrayer('Isha');
      // Get Hijri from separate API
      try {
        const today2 = new Date();
        const dd2=String(today2.getDate()).padStart(2,'0');
        const mm2=String(today2.getMonth()+1).padStart(2,'0');
        const yyyy2=today2.getFullYear();
        const hRes = await fetch(`https://api.aladhan.com/v1/gToH/${dd2}-${mm2}-${yyyy2}?adjustment=-1`);
        const hDat = await hRes.json();
        if (hDat.data) {
          const h = hDat.data.hijri;
          setHijri(`${h.day} ${h.month.en} ${h.year} AH`);
        }
      } catch { setHijri(''); }
    }

    // ── Step 4: Ayat of the Day ──────────────────────────────
    try {
      const n   = Math.floor(Math.random() * 6236) + 1;
      const res = await fetch(`https://api.alquran.cloud/v1/ayah/${n}/editions/quran-simple,en.asad`);
      const d   = await res.json();
      if (d.data) {
        setAyat({
          arabic:  d.data[0].text,
          english: d.data[1].text,
          ref:     `${d.data[0].surah.englishName} ${d.data[0].surah.number}:${d.data[0].numberInSurah}`,
        });
      }
    } catch {}

    setLoading(false);
  };

  // ── Greeting ───────────────────────────────────────────────
  const hour     = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || 'Friend';
  const timeStr  = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  const dateStr  = now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  return (
    <div style={{ padding:'24px 28px', maxWidth:1100, margin:'0 auto', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{CSS}</style>

      {/* ── HERO HEADER ────────────────────────────────────── */}
      <div style={{ background:'linear-gradient(135deg,#050505,#0F0F0D,#050505)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:22, padding:'28px 32px', marginBottom:22, position:'relative', overflow:'hidden', animation:'fadeUp 0.5s ease' }}>
        {/* BG glow */}
        <div style={{ position:'absolute', top:-60, right:-60, width:280, height:280, background:'radial-gradient(ellipse,rgba(201,168,76,0.08),transparent 70%)', borderRadius:'50%', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-40, left:-40, width:200, height:200, background:'radial-gradient(ellipse,rgba(201,168,76,0.05),transparent 70%)', borderRadius:'50%', pointerEvents:'none' }}/>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16, position:'relative' }}>
          <div>
            {/* Greeting */}
            <div style={{ fontSize:12, color:'rgba(201,168,76,0.6)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:6 }}>
              {greeting.toUpperCase()}
            </div>
            <h1 style={{ fontSize:'clamp(20px,3vw,30px)', fontWeight:800, marginBottom:6 }}>
              <span className="gold-text">
                As-salamu Alaykum, {userName}! 🌙
              </span>
            </h1>
            <div style={{ fontSize:12, color:'rgba(245,240,232,0.4)', marginBottom:4 }}>{dateStr}</div>
            {hijri && (
              <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                <div style={{ fontSize:12, color:'rgba(201,168,76,0.5)', fontFamily:'Cinzel,serif' }}>✦ {hijri}</div>
                <div style={{ display:'flex', gap:4 }}>
                  {[{v:-1,l:'🇵🇰 PK'},{v:0,l:'🌍 Global'},{v:1,l:'🇸🇦 SA'}].map(opt => (
                    <button key={opt.v} onClick={() => { localStorage.setItem('hijri_adj', opt.v); setHijriAdj(opt.v); loadData(); }}
                      style={{ fontSize:9, padding:'2px 7px', borderRadius:5, border:'none', cursor:'pointer', fontFamily:'inherit',
                        background: hijriAdj===opt.v ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.05)',
                        color: hijriAdj===opt.v ? '#C9A84C' : 'rgba(255,255,255,0.3)'
                      }}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live clock */}
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:'clamp(22px,3vw,32px)', fontWeight:700, color:'#C9A84C', letterSpacing:2 }}>
              {timeStr}
            </div>
            {city && <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', marginTop:4 }}>📍 {city}</div>}
          </div>
        </div>

        {/* Next prayer countdown */}
        {nextPrayer && prayerTimes[nextPrayer] && (
          <div style={{ marginTop:18, display:'flex', alignItems:'center', gap:12, background:'rgba(201,168,76,0.07)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:12, padding:'12px 18px', width:'fit-content' }}>
            <div style={{ fontSize:20 }}>{PRAYER_ICONS[nextPrayer]}</div>
            <div>
              <div style={{ fontSize:11, color:'rgba(201,168,76,0.6)', letterSpacing:1 }}>NEXT PRAYER</div>
              <div style={{ fontSize:15, fontWeight:700, color:'#E8C97A' }}>
                {nextPrayer} · {to12hr(prayerTimes[nextPrayer])}
              </div>
            </div>
            <div style={{ marginLeft:8, padding:'6px 14px', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:8 }}>
              <div style={{ fontSize:10, color:'rgba(201,168,76,0.5)', letterSpacing:1 }}>IN</div>
              <div style={{ fontSize:14, fontWeight:700, color:'#C9A84C', fontFamily:'Cinzel,serif' }}>{countdown}</div>
            </div>
          </div>
        )}
      </div>

      {/* ── PRAYER TIMES ROW ───────────────────────────────── */}
      <div style={{ display:'flex', gap:10, marginBottom:22, overflowX:'auto', paddingBottom:4 }}>
        {loading ? (
          <div style={{ display:'flex', gap:10, width:'100%' }}>
            {PRAYERS.map(p => (
              <div key={p} style={{ flex:'1 1 0', minWidth:90, background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.08)', borderRadius:14, padding:'14px 12px', textAlign:'center' }}>
                <div style={{ fontSize:18, marginBottom:6 }}>{PRAYER_ICONS[p]}</div>
                <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', fontFamily:'Cinzel,serif' }}>{p}</div>
                <div style={{ fontSize:13, color:'rgba(245,240,232,0.3)', marginTop:4 }}>--:--</div>
              </div>
            ))}
          </div>
        ) : PRAYERS.map(p => {
          const isNext = p === nextPrayer;
          return (
            <div key={p} className="prayer-card" onClick={() => navigate('/prayer')} style={{ flex:'1 1 0', minWidth:90, background: isNext ? 'linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.08))' : 'rgba(10,10,8,0.8)', border:`1px solid ${isNext ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.08)'}`, borderRadius:14, padding:'14px 12px', textAlign:'center', cursor:'pointer', borderTop: isNext ? '2px solid #C9A84C' : '2px solid transparent' }}>
              <div style={{ fontSize:18, marginBottom:6 }}>{PRAYER_ICONS[p]}</div>
              <div className="arabic" style={{ fontSize:12, color:'rgba(201,168,76,0.7)', marginBottom:2 }}>{PRAYER_ARABIC[p]}</div>
              <div style={{ fontSize:11, color: isNext ? '#E8C97A' : 'rgba(245,240,232,0.5)', fontFamily:'Cinzel,serif', fontWeight: isNext ? 700 : 400 }}>{p}</div>
              <div style={{ fontSize:14, fontWeight:700, color: isNext ? '#C9A84C' : 'rgba(245,240,232,0.7)', marginTop:4, fontFamily:'Cinzel,serif' }}>
                {to12hr(prayerTimes[p])}
              </div>
              {isNext && <div style={{ fontSize:9, color:'#C9A84C', marginTop:4, letterSpacing:1 }}>NEXT</div>}
            </div>
          );
        })}
      </div>

      {/* ── AYAT OF THE DAY ────────────────────────────────── */}
      {ayat && (
        <div onClick={() => navigate('/quran')} style={{ background:'linear-gradient(135deg,#050505,#0F0F0D)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:18, padding:'22px 26px', marginBottom:22, cursor:'pointer', transition:'all 0.3s', animation:'fadeUp 0.5s 0.1s ease both' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(201,168,76,0.35)'; e.currentTarget.style.transform='translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(201,168,76,0.15)'; e.currentTarget.style.transform='translateY(0)'; }}
        >
          <div style={{ fontSize:10, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:14 }}>✦ AYAT OF THE DAY</div>
          <div className="arabic" style={{ fontSize:'clamp(18px,2.5vw,24px)', color:'#E8C97A', lineHeight:2.2, marginBottom:14, textAlign:'right' }}>
            {ayat.arabic}
          </div>
          <div style={{ fontSize:13, color:'rgba(245,240,232,0.5)', fontStyle:'italic', lineHeight:1.75, marginBottom:8 }}>
            "{ayat.english}"
          </div>
          <div style={{ fontSize:11, color:'rgba(201,168,76,0.4)', letterSpacing:1 }}>— {ayat.ref}</div>
        </div>
      )}

      {/* ── QUICK ACCESS GRID ──────────────────────────────── */}
      <div style={{ marginBottom:8 }}>
        <div style={{ fontSize:10, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:14 }}>QUICK ACCESS</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(100px,1fr))', gap:10 }}>
          {QUICK.map((q, i) => {
            const Icon = q.icon;
            return (
              <div key={i} className="qcard" onClick={() => navigate(q.path)}
                style={{ background:'rgba(10,10,8,0.8)', border:`1px solid rgba(201,168,76,0.08)`, borderRadius:16, padding:'16px 12px', textAlign:'center', animation:`fadeUp 0.4s ${i*0.04}s ease both` }}
                onMouseEnter={e => { e.currentTarget.style.background=q.bg; e.currentTarget.style.borderColor='rgba(201,168,76,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(10,10,8,0.8)'; e.currentTarget.style.borderColor='rgba(201,168,76,0.08)'; }}
              >
                <Icon size={22} color={q.color} style={{ marginBottom:8 }}/>
                <div style={{ fontSize:11, fontWeight:700, color:'rgba(245,240,232,0.85)', marginBottom:3 }}>{q.label}</div>
                <div style={{ fontSize:9, color:'rgba(245,240,232,0.3)' }}>{q.sub}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}