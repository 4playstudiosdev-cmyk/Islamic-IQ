/* eslint-disable react-hooks/exhaustive-deps, no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, RefreshCw, Loader, Settings, X } from 'lucide-react';
import { useLocation as useAppLocation } from '../context/LocationContext';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .pt-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer  { to{background-position:200% center} }
  @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes pulse    { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
  @keyframes countdown{ 0%{opacity:0.7} 50%{opacity:1} 100%{opacity:0.7} }
  @keyframes barFill  { from{width:0} to{width:var(--w)} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .pt-card { background:#0F0F0D; border:1px solid rgba(201,168,76,0.1); border-radius:18px; transition:all 0.3s; }
  .pt-card:hover { border-color:rgba(201,168,76,0.25); }
  .pt-prayer { background:#0F0F0D; border:1px solid rgba(201,168,76,0.08); border-radius:16px; transition:all 0.3s; cursor:pointer; }
  .pt-prayer:hover { border-color:rgba(201,168,76,0.25); transform:translateY(-2px); }
  .pt-prayer.next { border-color:rgba(201,168,76,0.4); background:rgba(201,168,76,0.06); box-shadow:0 4px 24px rgba(201,168,76,0.12); }
  .pt-prayer.passed { opacity:0.55; }
  .pt-btn { background:rgba(201,168,76,0.08); border:1px solid rgba(201,168,76,0.15); border-radius:10px; color:#C9A84C; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.2s; padding:9px 18px; font-size:12px; }
  .pt-btn:hover { background:rgba(201,168,76,0.15); border-color:rgba(201,168,76,0.3); }
  .pt-input { background:rgba(201,168,76,0.04); border:1px solid rgba(201,168,76,0.15); border-radius:10px; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; outline:none; padding:10px 14px; font-size:13px; width:100%; }
  .pt-input:focus { border-color:rgba(201,168,76,0.4); }
  .pt-input::placeholder { color:rgba(242,237,228,0.25); }
`;

const PRAYERS_LIST = [
  { key:'Fajr',    arabic:'الفجر',  emoji:'🌙', desc:'Dawn Prayer' },
  { key:'Sunrise', arabic:'الشروق', emoji:'🌅', desc:'Sunrise', info:true },
  { key:'Dhuhr',   arabic:'الظهر',  emoji:'☀️', desc:'Midday Prayer' },
  { key:'Asr',     arabic:'العصر',  emoji:'🌤️', desc:'Afternoon Prayer' },
  { key:'Maghrib', arabic:'المغرب', emoji:'🌇', desc:'Sunset Prayer' },
  { key:'Isha',    arabic:'العشاء', emoji:'🌙', desc:'Night Prayer' },
  { key:'Imsak',   arabic:'الإمساك',emoji:'🤲', desc:'Suhoor ends', info:true },
];

const METHODS = [
  { id:1,  name:'Karachi (Pakistan)' },
  { id:2,  name:'North America (ISNA)' },
  { id:3,  name:'Muslim World League' },
  { id:4,  name:'Makkah (UMM AL-QURA)' },
  { id:5,  name:'Egypt' },
  { id:7,  name:'Tehran' },
  { id:8,  name:'Gulf Region' },
  { id:12, name:'Turkey' },
  { id:15, name:'SphericalGeography' },
];

function to12(t) {
  if (!t) return '--:--';
  const [h, m] = t.split(':').map(Number);
  return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`;
}

function toMins(t) {
  if (!t) return 0;
  const [h,m] = t.split(':').map(Number);
  return h*60+m;
}

export default function PrayerTimes() {
  // ✅ Use shared location from context
  const { coords, city, country, loading: locLoading, detectLocation: refetchLocation, setManualCity } = useAppLocation();

  const [times, setTimes]           = useState(null);
  const [hijri, setHijri]           = useState(null);
  const [gregorian, setGregorian]   = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [now, setNow]               = useState(new Date());
  const [next, setNext]             = useState(null);
  const [method, setMethod]         = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [cityInput, setCityInput]   = useState('');
  const [hijriAdj, setHijriAdj]     = useState(() => parseInt(localStorage.getItem('hijri_adj')||'-1'));
  const tickRef = useRef(null);

  useEffect(() => {
    tickRef.current = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tickRef.current);
  }, []);

  // ✅ Fetch prayer times when coords available from context
  useEffect(() => {
    if (coords?.lat && coords?.lng) {
      fetchByCoords(coords.lat, coords.lng, method);
    }
  }, [coords, method]);

  useEffect(() => {
    if (!times) return;
    const prayerKeys = ['Fajr','Dhuhr','Asr','Maghrib','Isha'];
    const nowMins    = now.getHours()*60 + now.getMinutes();
    let found = null;
    for (const k of prayerKeys) {
      if (times[k] && toMins(times[k]) > nowMins) { found = k; break; }
    }
    setNext(found || 'Fajr');
  }, [times, now]);

  // Location handled by LocationContext

  const fetchByCoords = async (lat, lng, m = method) => {
    const today = new Date();
    const dd    = String(today.getDate()).padStart(2,'0');
    const mm    = String(today.getMonth()+1).padStart(2,'0');
    const yyyy  = today.getFullYear();
    const url   = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=${m}`;
    const res   = await fetch(url);
    const data  = await res.json();
    if (data.code === 200) {
      setTimes(data.data.timings);
      setGregorian(data.data.date.gregorian.date);
      // Hijri with adjustment
      const adj     = parseInt(localStorage.getItem('hijri_adj')||'-1');
      const gDate   = new Date(data.data.date.gregorian.date.split('-').reverse().join('-'));
      const adjDate = new Date(gDate.getTime() + adj*86400000);
      const adjDD   = String(adjDate.getDate()).padStart(2,'0');
      const adjMM   = String(adjDate.getMonth()+1).padStart(2,'0');
      const adjYYYY = adjDate.getFullYear();
      try {
        const hRes = await fetch(`https://api.aladhan.com/v1/gToH/${adjDD}-${adjMM}-${adjYYYY}`);
        const hDat = await hRes.json();
        if (hDat.data) setHijri(hDat.data.hijri);
        else setHijri(data.data.date.hijri);
      } catch { setHijri(data.data.date.hijri); }
    } else throw new Error('API error');
  };

  const fetchByCity = async (c) => {
    setLoading(true); setError(null);
    try {
      const today = new Date();
      const dd    = String(today.getDate()).padStart(2,'0');
      const mm    = String(today.getMonth()+1).padStart(2,'0');
      const yyyy  = today.getFullYear();
      const url   = `https://api.aladhan.com/v1/timingsByCity/${dd}-${mm}-${yyyy}?city=${encodeURIComponent(c)}&country=&method=${method}`;
      const res   = await fetch(url);
      const data  = await res.json();
      if (data.code === 200) {
        setTimes(data.data.timings);
        // city handled by context
        setHijri(data.data.date.hijri);
      } else throw new Error('City not found');
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  // ── Countdown ────────────────────────────────────────────────
  const getCountdown = () => {
    if (!next || !times?.[next]) return '00:00:00';
    const [h, m] = times[next].split(':').map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);
    if (target <= now) target.setDate(target.getDate()+1);
    const diff = target - now;
    const hrs  = Math.floor(diff/3600000);
    const mins = Math.floor((diff%3600000)/60000);
    const secs = Math.floor((diff%60000)/1000);
    return `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  };

  // ── Progress through day ─────────────────────────────────────
  const getDayProgress = () => {
    const nowMins = now.getHours()*60 + now.getMinutes();
    return (nowMins / (24*60)) * 100;
  };

  const isPassed = (key) => {
    if (!times?.[key]) return false;
    return toMins(times[key]) < now.getHours()*60 + now.getMinutes();
  };

  const timeStr = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  return (
    <div className="pt-root" style={{ padding:'24px 28px', maxWidth:900, margin:'0 auto' }}>
      <style>{CSS}</style>

      {/* ── Header ────────────────────────────────────── */}
      <div style={{ background:'linear-gradient(135deg,#050505,#0F0F0D)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:22, padding:'26px 30px', marginBottom:22, position:'relative', overflow:'hidden', animation:'fadeUp 0.5s ease' }}>
        <div style={{ position:'absolute', top:-50, right:-50, width:200, height:200, background:'radial-gradient(ellipse,rgba(201,168,76,0.07),transparent)', borderRadius:'50%', pointerEvents:'none' }}/>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16, position:'relative' }}>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:3, color:'rgba(201,168,76,0.6)', marginBottom:6 }}>PRAYER TIMES</div>
            <h1 className="gold-shimmer" style={{ fontSize:26, fontWeight:800, fontFamily:'Cinzel,serif', marginBottom:6 }}>Salah Times</h1>
            {(city || country) && (
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'rgba(242,237,228,0.5)' }}>
                <MapPin size={13} color="#C9A84C"/>
                <span>{[city, country].filter(Boolean).join(', ')}</span>
              </div>
            )}
            <div style={{ fontSize:12, color:'rgba(242,237,228,0.35)', marginTop:4 }}>{dateStr}</div>
            {hijri && (
              <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:4 }}>
                <div style={{ fontSize:12, color:'rgba(201,168,76,0.6)', fontFamily:'Cinzel,serif' }}>
                  ✦ {hijri.day} {hijri.month?.en} {hijri.year} AH
                </div>
                <div style={{ display:'flex', gap:3 }}>
                  {[{v:-1,l:'🇵🇰'},{v:0,l:'🌍'},{v:1,l:'🇸🇦'}].map(o => (
                    <button key={o.v} onClick={() => { localStorage.setItem('hijri_adj',o.v); setHijriAdj(o.v); refetchLocation(); }}
                      style={{ fontSize:10, padding:'1px 5px', borderRadius:4, border:'none', cursor:'pointer', background: hijriAdj===o.v ? 'rgba(201,168,76,0.2)' : 'transparent', color: hijriAdj===o.v ? '#C9A84C' : 'rgba(255,255,255,0.3)' }}>
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live clock */}
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:'clamp(24px,3vw,36px)', fontWeight:700, color:'#C9A84C', letterSpacing:2 }}>{timeStr}</div>
            <div style={{ display:'flex', gap:8, marginTop:8, justifyContent:'flex-end' }}>
              <button className="pt-btn" onClick={() => { refetchLocation(); }} disabled={loading || locLoading}
                style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px' }}>
                {loading ? <Loader size={12} style={{ animation:'spin 1s linear infinite' }}/> : <RefreshCw size={12}/>}
                Refresh
              </button>
              <button className="pt-btn" onClick={() => setShowSettings(s => !s)}
                style={{ padding:'7px 10px' }}>
                <Settings size={12}/>
              </button>
            </div>
          </div>
        </div>

        {/* Day progress bar */}
        <div style={{ marginTop:18, height:4, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${getDayProgress()}%`, background:'linear-gradient(90deg,#C9A84C,#E8C97A)', borderRadius:2, transition:'width 1s linear' }}/>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:4, fontSize:9, color:'rgba(242,237,228,0.2)' }}>
          <span>12:00 AM</span><span>6:00 AM</span><span>12:00 PM</span><span>6:00 PM</span><span>12:00 AM</span>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="pt-card" style={{ padding:'20px', marginBottom:20, animation:'fadeUp 0.3s ease' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontSize:12, fontFamily:'Cinzel,serif', color:'#C9A84C', letterSpacing:1 }}>SETTINGS</div>
            <button onClick={() => setShowSettings(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(242,237,228,0.4)' }}><X size={14}/></button>
          </div>

          {/* City search */}
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, color:'rgba(242,237,228,0.4)', marginBottom:6 }}>SEARCH BY CITY</div>
            <div style={{ display:'flex', gap:8 }}>
              <input className="pt-input" value={cityInput} onChange={e => setCityInput(e.target.value)}
                placeholder="e.g. Karachi, London, Dubai..."
                onKeyDown={e => { if(e.key==='Enter') { setManualCity(cityInput); fetchByCity(cityInput); }}}/>
              <button className="pt-btn" onClick={() => { setManualCity(cityInput); fetchByCity(cityInput); }} style={{ whiteSpace:'nowrap' }}>Search</button>
            </div>
          </div>

          {/* Method */}
          <div>
            <div style={{ fontSize:11, color:'rgba(242,237,228,0.4)', marginBottom:8 }}>CALCULATION METHOD</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:6 }}>
              {METHODS.map(m => (
                <button key={m.id} onClick={() => { setMethod(m.id); refetchLocation(); }}
                  style={{ padding:'8px 12px', background: method===m.id ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.03)', border:`1px solid ${method===m.id ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.07)'}`, borderRadius:8, color: method===m.id ? '#C9A84C' : 'rgba(242,237,228,0.4)', fontSize:11, cursor:'pointer', textAlign:'left', fontFamily:'inherit' }}>
                  {method===m.id && '✓ '}{m.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background:'rgba(231,76,60,0.08)', border:'1px solid rgba(231,76,60,0.2)', borderRadius:14, padding:'14px 18px', marginBottom:18, display:'flex', alignItems:'center', gap:10 }}>
          <span>⚠️</span>
          <span style={{ fontSize:13, color:'#e74c3c' }}>{error}</span>
          <button className="pt-btn" onClick={refetchLocation} style={{ marginLeft:'auto' }}>Retry</button>
        </div>
      )}

      {/* Loading */}
      {loading && !times && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:60, gap:12 }}>
          <Loader size={24} color="#C9A84C" style={{ animation:'spin 1s linear infinite' }}/>
          <span style={{ color:'rgba(242,237,228,0.4)', fontSize:13 }}>Getting prayer times...</span>
        </div>
      )}

      {times && (
        <>
          {/* ── Countdown to next prayer ──────────────── */}
          {next && (
            <div style={{ background:'linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.04))', border:'1px solid rgba(201,168,76,0.25)', borderRadius:20, padding:'22px 28px', marginBottom:20, display:'flex', alignItems:'center', gap:20, flexWrap:'wrap', animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontSize:32 }}>{PRAYERS_LIST.find(p=>p.key===next)?.emoji || '🕐'}</div>
              <div>
                <div style={{ fontSize:11, color:'rgba(201,168,76,0.6)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:4 }}>NEXT PRAYER</div>
                <div style={{ fontFamily:'Cinzel,serif', fontSize:20, fontWeight:700, color:'#E8C97A' }}>
                  {next} · {to12(times[next])}
                </div>
                <div className="arabic" style={{ fontSize:14, color:'rgba(201,168,76,0.5)', marginTop:2 }}>
                  {PRAYERS_LIST.find(p=>p.key===next)?.arabic}
                </div>
              </div>
              <div style={{ marginLeft:'auto', textAlign:'center' }}>
                <div style={{ fontFamily:'Cinzel,serif', fontSize:'clamp(28px,4vw,42px)', fontWeight:900, color:'#C9A84C', letterSpacing:3, animation:'countdown 2s ease-in-out infinite' }}>
                  {getCountdown()}
                </div>
                <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2 }}>REMAINING</div>
              </div>
            </div>
          )}

          {/* ── Prayer cards ───────────────────────────── */}
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {PRAYERS_LIST.filter(p => times[p.key]).map((p, i) => {
              const isNext   = p.key === next && !p.info;
              const passed   = isPassed(p.key) && !isNext;
              const nowMins  = now.getHours()*60 + now.getMinutes();
              const pMins    = toMins(times[p.key]);
              const nextMins = next && times[next] ? toMins(times[next]) : 0;

              return (
                <div key={p.key} className={`pt-prayer ${isNext?'next':''} ${passed?'passed':''}`}
                  style={{ padding:'18px 22px', display:'flex', alignItems:'center', gap:16, animation:`fadeUp 0.4s ${i*0.06}s ease both` }}>

                  {/* Status indicator */}
                  <div style={{ width:4, height:48, borderRadius:2, flexShrink:0, background: isNext ? '#C9A84C' : passed ? 'rgba(242,237,228,0.1)' : 'rgba(201,168,76,0.2)' }}/>

                  {/* Emoji */}
                  <div style={{ fontSize:26, flexShrink:0 }}>{p.emoji}</div>

                  {/* Name */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                      <span style={{ fontFamily:'Cinzel,serif', fontSize:15, fontWeight:700, color: isNext ? '#E8C97A' : passed ? 'rgba(242,237,228,0.4)' : 'rgba(242,237,228,0.85)' }}>
                        {p.key}
                      </span>
                      {isNext && (
                        <div style={{ background:'rgba(201,168,76,0.2)', border:'1px solid rgba(201,168,76,0.4)', borderRadius:5, padding:'1px 8px', fontSize:9, color:'#C9A84C', fontFamily:'Cinzel,serif', letterSpacing:1 }}>
                          NEXT
                        </div>
                      )}
                      {passed && !p.info && (
                        <div style={{ fontSize:10, color:'rgba(242,237,228,0.25)' }}>✓ Passed</div>
                      )}
                      {p.info && (
                        <div style={{ fontSize:10, color:'rgba(242,237,228,0.3)', fontStyle:'italic' }}>info only</div>
                      )}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div className="arabic" style={{ fontSize:14, color:'rgba(201,168,76,0.5)' }}>{p.arabic}</div>
                      <div style={{ fontSize:11, color:'rgba(242,237,228,0.3)' }}>· {p.desc}</div>
                    </div>
                  </div>

                  {/* Time */}
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontFamily:'Cinzel,serif', fontSize:18, fontWeight:700, color: isNext ? '#C9A84C' : passed ? 'rgba(242,237,228,0.35)' : 'rgba(242,237,228,0.8)' }}>
                      {to12(times[p.key])}
                    </div>
                    {isNext && (
                      <div style={{ fontSize:11, color:'rgba(201,168,76,0.6)', marginTop:2 }}>
                        in {getCountdown()}
                      </div>
                    )}
                    {!isNext && !passed && !p.info && (
                      <div style={{ fontSize:11, color:'rgba(242,237,228,0.25)', marginTop:2 }}>
                        in {(() => {
                          const diff = pMins - (now.getHours()*60+now.getMinutes());
                          const d    = diff < 0 ? diff + 1440 : diff;
                          return d < 60 ? `${d}m` : `${Math.floor(d/60)}h ${d%60}m`;
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Extra times ───────────────────────────── */}
          {(times.Midnight || times.Lastthird) && (
            <div style={{ marginTop:16, background:'#0F0F0D', border:'1px solid rgba(201,168,76,0.08)', borderRadius:16, padding:'16px 20px' }}>
              <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:12 }}>ADDITIONAL TIMES</div>
              <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                {[['Midnight','Midnight','🌑'],['Lastthird','Last Third','🌃'],['Imsak','Imsak','🤲']].map(([k,l,e]) => times[k] && (
                  <div key={k} style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span>{e}</span>
                    <div>
                      <div style={{ fontSize:11, color:'rgba(242,237,228,0.4)' }}>{l}</div>
                      <div style={{ fontSize:14, fontWeight:600, color:'rgba(242,237,228,0.7)', fontFamily:'Cinzel,serif' }}>{to12(times[k])}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Hadith ────────────────────────────────── */}
          <div style={{ marginTop:16, background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.1)', borderRadius:16, padding:'16px 20px', textAlign:'center' }}>
            <div className="arabic" style={{ fontSize:16, color:'rgba(201,168,76,0.7)', marginBottom:6 }}>
              الصَّلَاةُ عِمَادُ الدِّينِ
            </div>
            <div style={{ fontSize:12, color:'rgba(242,237,228,0.3)', fontStyle:'italic' }}>
              "Prayer is the pillar of religion." — Prophet Muhammad ﷺ
            </div>
          </div>
        </>
      )}
    </div>
  );
}