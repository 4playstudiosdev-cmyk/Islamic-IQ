import React, { useState, useEffect } from 'react';
import { useLocation as useAppLocation } from '../context/LocationContext';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .rm-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  @keyframes shimmer { to{background-position:200% center} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse   { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.03)} }
  @keyframes countdown { 0%,100%{opacity:0.7} 50%{opacity:1} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .rm-card { background:#0F0F0D; border:1px solid rgba(201,168,76,0.1); border-radius:18px; }
  .tab-btn { background:rgba(201,168,76,0.04); border:1px solid rgba(201,168,76,0.1); border-radius:10px; color:rgba(242,237,228,0.5); cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; transition:all 0.25s; padding:9px 16px; }
  .tab-btn.active { background:rgba(201,168,76,0.15); border-color:rgba(201,168,76,0.4); color:#C9A84C; font-weight:700; }
`;

const RAMADAN_DUAS = [
  { day: '1-10',  arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ', english: 'O Ever-Living, O Self-Sustaining, by Your mercy I seek help.', theme: '🤲 Days of Mercy' },
  { day: '11-20', arabic: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ دِقَّهُ وَجِلَّهُ', english: 'O Allah, forgive all my sins, the small and great of them.', theme: '🌟 Days of Forgiveness' },
  { day: '21-30', arabic: 'اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ', english: 'O Allah, save me from the Hellfire.', theme: '🔥 Days of Salvation' },
];

const SUHOOR_DHAUR = 'نَوَيْتُ أَنْ أَصُومَ غَدًا لِلَّهِ تَعَالَى مِنْ فَرِيضَةِ شَهْرِ رَمَضَانَ';
const IFTAR_DUA   = 'اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ';

const QURAN_PLAN = [
  { day:'Day 1-3',   surah:'Al-Fatiha + Al-Baqara 1-50' },
  { day:'Day 4-6',   surah:'Al-Baqara 51-141' },
  { day:'Day 7-9',   surah:'Al-Baqara 142-286' },
  { day:'Day 10-12', surah:'Aal-Imran' },
  { day:'Day 13-15', surah:'An-Nisa' },
  { day:'Day 16-18', surah:'Al-Maidah + Al-Anam' },
  { day:'Day 19-21', surah:'Al-Araf + Al-Anfal' },
  { day:'Day 22-24', surah:'At-Tawbah + Yunus' },
  { day:'Day 25-27', surah:'Hud — Al-Kahf' },
  { day:'Day 28-30', surah:'Maryam — An-Nas' },
];

export default function Ramadan() {
  const { coords } = useAppLocation();
  const [tab, setTab]       = useState('times');
  const [times, setTimes]   = useState(null);
  const [now, setNow]       = useState(new Date());
  const [countdown, setCountdown] = useState('');
  const [nextType, setNextType]   = useState('');
  const [habits, setHabits] = useState(() => { try { return JSON.parse(localStorage.getItem('ramadan_habits')||'{}'); } catch { return {}; } });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (coords?.lat) fetchTimes(coords.lat, coords.lng);
  }, [coords]);

  useEffect(() => {
    if (!times) return;
    calcCountdown();
  }, [now, times]);

  const fetchTimes = async (lat, lng) => {
    try {
      const d   = new Date();
      const dd  = String(d.getDate()).padStart(2,'0');
      const mm  = String(d.getMonth()+1).padStart(2,'0');
      const yyyy= d.getFullYear();
      const res = await fetch(`https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=1`);
      const data= await res.json();
      if (data.code === 200) setTimes(data.data.timings);
    } catch {}
  };

  const toMins = (t) => { if (!t) return 0; const [h,m]=t.split(':').map(Number); return h*60+m; };
  const to12   = (t) => { if (!t) return '--:--'; const [h,m]=t.split(':').map(Number); return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`; };

  const calcCountdown = () => {
    if (!times) return;
    const nowMins = now.getHours()*60+now.getMinutes();
    const fajrMins= toMins(times.Fajr);
    const magMins = toMins(times.Maghrib);
    let target, type;
    if (nowMins < fajrMins) { target = fajrMins; type = '🌙 Suhoor Ends'; }
    else if (nowMins < magMins) { target = magMins; type = '🌅 Iftar'; }
    else { target = fajrMins + 1440; type = '🌙 Suhoor (Tomorrow)'; }
    const diff = (target - nowMins) * 60 - now.getSeconds();
    const h = Math.floor(diff/3600);
    const m = Math.floor((diff%3600)/60);
    const s = diff%60;
    setCountdown(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    setNextType(type);
  };

  const toggleHabit = (key) => {
    const dayKey = `${key}_${today}`;
    const next   = { ...habits, [dayKey]: !habits[dayKey] };
    setHabits(next);
    try { localStorage.setItem('ramadan_habits', JSON.stringify(next)); } catch {}
  };

  const HABITS = [
    {key:'fajr',       label:'Fajr Prayer',      emoji:'🌙'},
    {key:'quran',      label:'Read Quran (1 Juz)',emoji:'📖'},
    {key:'taraweeh',   label:'Taraweeh Prayer',   emoji:'🕌'},
    {key:'dhikr',      label:'Morning Dhikr',     emoji:'📿'},
    {key:'sadaqah',    label:'Give Sadaqah',       emoji:'💚'},
    {key:'tahajjud',   label:'Tahajjud',           emoji:'✨'},
  ];

  return (
    <div className="rm-root" style={{ padding:'24px 28px', maxWidth:800, margin:'0 auto' }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#050505,#0A0A08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:20, padding:'22px 28px', marginBottom:22, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at top right,rgba(201,168,76,0.08),transparent 60%)', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:14, position:'relative' }}>
          <div style={{ fontSize:40 }}>🌙</div>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:3, color:'rgba(201,168,76,0.6)', marginBottom:4 }}>HOLY MONTH</div>
            <h1 className="gold-shimmer" style={{ fontSize:24, fontWeight:800, fontFamily:'Cinzel,serif' }}>Ramadan Mode</h1>
            <p style={{ fontSize:12, color:'rgba(242,237,228,0.4)', marginTop:2 }}>{now.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p>
          </div>
          {/* Countdown */}
          {countdown && (
            <div style={{ marginLeft:'auto', textAlign:'center', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:14, padding:'12px 18px' }}>
              <div style={{ fontSize:11, color:'rgba(201,168,76,0.6)', marginBottom:4 }}>{nextType}</div>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:24, fontWeight:900, color:'#C9A84C', letterSpacing:2, animation:'countdown 1s ease-in-out infinite' }}>{countdown}</div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto' }}>
        {[['times','⏰ Sehri/Iftar'],['duas','🤲 Duas'],['habits','✅ Habits'],['plan','📖 Quran Plan']].map(([id,label]) => (
          <button key={id} className={`tab-btn ${tab===id?'active':''}`} onClick={() => setTab(id)} style={{ flexShrink:0 }}>{label}</button>
        ))}
      </div>

      {/* TIMES */}
      {tab === 'times' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
            {[
              { label:'🌙 Sehri Ends (Imsak)', time:times?.Imsak||times?.Fajr, color:'#1A5276', desc:'Stop eating before this time' },
              { label:'🌅 Iftar (Maghrib)',     time:times?.Maghrib, color:'#C9A84C', desc:'Break your fast at this time' },
              { label:'🌙 Fajr Prayer',         time:times?.Fajr, color:'#8E44AD', desc:'Dawn prayer after Sehri' },
              { label:'🕌 Taraweeh (Isha)',     time:times?.Isha, color:'#2E8B57', desc:'Night prayer in Ramadan' },
            ].map((item, i) => (
              <div key={i} className="rm-card" style={{ padding:'18px', border:`1px solid ${item.color}22` }}>
                <div style={{ fontSize:12, color:`${item.color}`, fontWeight:700, marginBottom:6 }}>{item.label}</div>
                <div style={{ fontFamily:'Cinzel,serif', fontSize:28, fontWeight:900, color:item.color, marginBottom:4 }}>{to12(item.time)}</div>
                <div style={{ fontSize:11, color:'rgba(242,237,228,0.4)' }}>{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Sehri + Iftar duas */}
          <div className="rm-card" style={{ padding:'20px', marginBottom:12 }}>
            <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:14 }}>SEHRI DUA (NIYYAH)</div>
            <div className="arabic" style={{ fontSize:16, color:'#E8C97A', lineHeight:2.2, direction:'rtl', marginBottom:8 }}>{SUHOOR_DHAUR}</div>
            <div style={{ fontSize:12, color:'rgba(242,237,228,0.45)', fontStyle:'italic' }}>I intend to keep the fast tomorrow for the sake of Allah, from the obligatory fast of Ramadan.</div>
          </div>
          <div className="rm-card" style={{ padding:'20px' }}>
            <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:14 }}>IFTAR DUA</div>
            <div className="arabic" style={{ fontSize:16, color:'#E8C97A', lineHeight:2.2, direction:'rtl', marginBottom:8 }}>{IFTAR_DUA}</div>
            <div style={{ fontSize:12, color:'rgba(242,237,228,0.45)', fontStyle:'italic' }}>O Allah, for You I fasted, in You I believe, upon You I rely, and with Your provision I break my fast.</div>
          </div>
        </div>
      )}

      {/* DUAS */}
      {tab === 'duas' && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {RAMADAN_DUAS.map((d, i) => (
            <div key={i} className="rm-card" style={{ padding:'20px', animation:`fadeUp 0.3s ${i*0.1}s ease both` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#E8C97A' }}>{d.theme}</div>
                <div style={{ fontSize:11, color:'rgba(201,168,76,0.6)', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:6, padding:'3px 8px' }}>{d.day}</div>
              </div>
              <div className="arabic" style={{ fontSize:18, color:'#C9A84C', lineHeight:2.2, marginBottom:10, direction:'rtl' }}>{d.arabic}</div>
              <div style={{ fontSize:12, color:'rgba(242,237,228,0.55)', fontStyle:'italic', lineHeight:1.7 }}>{d.english}</div>
            </div>
          ))}
        </div>
      )}

      {/* HABITS */}
      {tab === 'habits' && (
        <div>
          <div className="rm-card" style={{ padding:'20px', marginBottom:14 }}>
            <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:16 }}>TODAY'S RAMADAN HABITS</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {HABITS.map(h => {
                const done = !!habits[`${h.key}_${today}`];
                return (
                  <div key={h.key} onClick={() => toggleHabit(h.key)}
                    style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', background:done?'rgba(46,204,113,0.06)':'rgba(255,255,255,0.02)', border:`1px solid ${done?'rgba(46,204,113,0.2)':'rgba(201,168,76,0.08)'}`, borderRadius:12, cursor:'pointer', transition:'all 0.2s' }}>
                    <span style={{ fontSize:22 }}>{h.emoji}</span>
                    <div style={{ flex:1, fontSize:14, fontWeight:600, color:done?'rgba(242,237,228,0.5)':'rgba(242,237,228,0.9)', textDecoration:done?'line-through':'none' }}>{h.label}</div>
                    <div style={{ width:28, height:28, borderRadius:'50%', background:done?'#2ecc71':'transparent', border:`2px solid ${done?'#2ecc71':'rgba(201,168,76,0.3)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>
                      {done && '✓'}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop:16, fontSize:13, textAlign:'center', color:'rgba(201,168,76,0.6)' }}>
              {HABITS.filter(h=>habits[`${h.key}_${today}`]).length}/{HABITS.length} completed today
            </div>
          </div>
        </div>
      )}

      {/* QURAN PLAN */}
      {tab === 'plan' && (
        <div className="rm-card" style={{ padding:'20px' }}>
          <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:16 }}>30-DAY QURAN COMPLETION PLAN</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {QURAN_PLAN.map((p, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.08)', borderRadius:10 }}>
                <div style={{ width:70, flexShrink:0, fontSize:11, color:'rgba(201,168,76,0.6)', fontFamily:'Cinzel,serif' }}>{p.day}</div>
                <div style={{ fontSize:12, color:'rgba(242,237,228,0.7)' }}>{p.surah}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:16, background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.12)', borderRadius:12, padding:'14px', textAlign:'center' }}>
            <div style={{ fontSize:12, color:'rgba(242,237,228,0.5)' }}>Reading ~20 pages per day completes the full Quran in Ramadan 📖</div>
          </div>
        </div>
      )}
    </div>
  );
}