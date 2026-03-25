/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, RotateCcw, Target, Flame, TrendingUp } from 'lucide-react';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .wz-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer  { to{background-position:200% center} }
  @keyframes pulse    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
  @keyframes countUp  { 0%{transform:scale(1.3);opacity:0.5} 100%{transform:scale(1);opacity:1} }
  @keyframes ring     { 0%{stroke-dashoffset:var(--full)} 100%{stroke-dashoffset:var(--offset)} }
  @keyframes celebrate{ 0%{transform:scale(1)} 30%{transform:scale(1.15)} 60%{transform:scale(0.95)} 100%{transform:scale(1)} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .wz-card { background:#0F0F0D; border:1px solid rgba(201,168,76,0.1); border-radius:18px; transition:all 0.3s; }
  .wz-btn  { background:rgba(201,168,76,0.08); border:1px solid rgba(201,168,76,0.2); border-radius:10px; color:#C9A84C; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.2s; }
  .wz-btn:hover { background:rgba(201,168,76,0.15); }
  .dhikr-btn { cursor:pointer; transition:all 0.15s; user-select:none; -webkit-user-select:none; }
  .dhikr-btn:active { transform:scale(0.94); }
  .tab-btn { background:rgba(201,168,76,0.04); border:1px solid rgba(201,168,76,0.1); border-radius:10px; color:rgba(242,237,228,0.5); cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; transition:all 0.25s; padding:9px 16px; }
  .tab-btn.active { background:rgba(201,168,76,0.15); border-color:rgba(201,168,76,0.4); color:#C9A84C; font-weight:700; }
`;

const TODAY = () => new Date().toISOString().split('T')[0];
const WEEK  = () => Array.from({length:7}, (_,i) => {
  const d = new Date(); d.setDate(d.getDate()-6+i);
  return d.toISOString().split('T')[0];
});

const DEFAULT_DHIKR = [
  { id:'subhanallah',   arabic:'سُبْحَانَ اللَّهِ',    name:'Subhanallah',   meaning:'Glory be to Allah',           color:'#2E8B57', goal:100 },
  { id:'alhamdulillah', arabic:'الْحَمْدُ لِلَّهِ',    name:'Alhamdulillah', meaning:'All praise is to Allah',       color:'#C9A84C', goal:100 },
  { id:'allahuakbar',   arabic:'اللَّهُ أَكْبَرُ',     name:'Allahu Akbar',  meaning:'Allah is the Greatest',        color:'#8E44AD', goal:100 },
  { id:'lailahaillallah',arabic:'لَا إِلَهَ إِلَّا اللَّهُ', name:'La ilaha illallah', meaning:'There is no god but Allah', color:'#1A5276', goal:33 },
  { id:'astaghfirullah', arabic:'أَسْتَغْفِرُ اللَّهَ', name:'Astaghfirullah', meaning:'I seek forgiveness from Allah', color:'#D35400', goal:33 },
];

const GOALS = [33, 100, 500, 1000, 3000];

function loadData() {
  try { return JSON.parse(localStorage.getItem('wazifa_v2') || 'null'); } catch { return null; }
}
function saveData(d) {
  try { localStorage.setItem('wazifa_v2', JSON.stringify(d)); } catch {}
}

export default function Wazifa() {
  const [tab, setTab]       = useState('dhikr');
  const [data, setData]     = useState(() => {
    const saved = loadData();
    if (saved) return saved;
    const counts = {};
    DEFAULT_DHIKR.forEach(d => { counts[d.id] = {}; });
    return { counts, custom:[], goals:{}, streak:{ lastDate:'', days:0 }, history:{} };
  });
  const [adding, setAdding]   = useState(false);
  const [newName, setNewName] = useState('');
  const [newArabic, setNewArabic] = useState('');
  const [newGoal, setNewGoal] = useState(100);
  const [celebrate, setCelebrate] = useState(null);
  const animRef = useRef({});

  const today = TODAY();
  const allDhikr = [...DEFAULT_DHIKR, ...(data.custom || [])];

  // Update streak
  useEffect(() => {
    const streak = { ...data.streak };
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
    const yStr = yesterday.toISOString().split('T')[0];
    if (streak.lastDate !== today) {
      if (streak.lastDate === yStr) streak.days = (streak.days||0) + 1;
      else if (streak.lastDate !== today) streak.days = 1;
      streak.lastDate = today;
      update({ streak });
    }
  }, []);

  const update = (patch) => {
    setData(prev => {
      const next = { ...prev, ...patch };
      saveData(next);
      return next;
    });
  };

  const getCount = (id) => data.counts?.[id]?.[today] || 0;
  const getGoal  = (id) => data.goals?.[id] || (DEFAULT_DHIKR.find(d=>d.id===id)?.goal || 100);

  const tap = (dhikr) => {
    const newCount = getCount(dhikr.id) + 1;
    const goal     = getGoal(dhikr.id);
    const newCounts = {
      ...data.counts,
      [dhikr.id]: { ...(data.counts[dhikr.id]||{}), [today]: newCount }
    };
    // History
    const newHistory = { ...data.history, [today]: { ...(data.history[today]||{}), [dhikr.id]: newCount } };
    update({ counts: newCounts, history: newHistory });
    if (newCount === goal) {
      setCelebrate(dhikr.id);
      setTimeout(() => setCelebrate(null), 2000);
    }
  };

  const reset = (id) => {
    const newCounts = { ...data.counts, [id]: { ...(data.counts[id]||{}), [today]: 0 } };
    update({ counts: newCounts });
  };

  const setGoal = (id, goal) => {
    update({ goals: { ...data.goals, [id]: goal } });
  };

  const addCustom = () => {
    if (!newName.trim()) return;
    const custom = [...(data.custom||[]), {
      id: `custom_${Date.now()}`, name: newName.trim(),
      arabic: newArabic.trim(), meaning: '', color:'#C9A84C', goal: newGoal
    }];
    const counts = { ...data.counts, [`custom_${Date.now()}`]: {} };
    update({ custom, counts });
    setNewName(''); setNewArabic(''); setAdding(false);
  };

  const removeCustom = (id) => {
    update({ custom: (data.custom||[]).filter(d=>d.id!==id) });
  };

  const totalToday = allDhikr.reduce((sum, d) => sum + getCount(d.id), 0);
  const weekDays   = WEEK();

  // ── Ring progress ─────────────────────────────────────────
  const Ring = ({ count, goal, color, size=120 }) => {
    const r   = (size-16)/2;
    const circ = 2*Math.PI*r;
    const pct  = Math.min(count/goal, 1);
    const off  = circ * (1-pct);
    return (
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition:'stroke-dashoffset 0.4s ease' }}/>
      </svg>
    );
  };

  return (
    <div className="wz-root" style={{ padding:'24px 28px', maxWidth:900, margin:'0 auto' }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#050505,#0F0F0D)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:20, padding:'22px 28px', marginBottom:22, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, background:'radial-gradient(ellipse,rgba(201,168,76,0.07),transparent)', borderRadius:'50%', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:14, position:'relative' }}>
          <div style={{ width:50, height:50, background:'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>⭐</div>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:3, color:'rgba(201,168,76,0.6)', marginBottom:4 }}>DAILY REMEMBRANCE</div>
            <h1 className="gold-shimmer" style={{ fontSize:22, fontWeight:800, fontFamily:'Cinzel,serif' }}>Wazifa & Dhikr</h1>
            <p style={{ fontSize:12, color:'rgba(242,237,228,0.4)', marginTop:2 }}>Today: {new Date().toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'})}</p>
          </div>
          {/* Stats */}
          <div style={{ marginLeft:'auto', display:'flex', gap:12 }}>
            <div style={{ textAlign:'center', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:12, padding:'10px 16px' }}>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:20, fontWeight:700, color:'#C9A84C' }}>{totalToday.toLocaleString()}</div>
              <div style={{ fontSize:10, color:'rgba(201,168,76,0.5)', letterSpacing:1 }}>TODAY</div>
            </div>
            <div style={{ textAlign:'center', background:'rgba(255,107,0,0.08)', border:'1px solid rgba(255,107,0,0.2)', borderRadius:12, padding:'10px 16px' }}>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:20, fontWeight:700, color:'#FF6B00', display:'flex', alignItems:'center', gap:4 }}>
                <Flame size={16}/>{data.streak?.days||0}
              </div>
              <div style={{ fontSize:10, color:'rgba(255,107,0,0.5)', letterSpacing:1 }}>STREAK</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:22, overflowX:'auto' }}>
        {[['dhikr','📿 Dhikr Counter'],['progress','📊 Progress'],['custom','➕ Custom']].map(([id,label]) => (
          <button key={id} className={`tab-btn ${tab===id?'active':''}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {/* ══════ DHIKR TAB ══════ */}
      {tab === 'dhikr' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:14 }}>
          {allDhikr.map((d, i) => {
            const count   = getCount(d.id);
            const goal    = getGoal(d.id);
            const pct     = Math.min((count/goal)*100, 100);
            const isCel   = celebrate === d.id;
            const isDone  = count >= goal;
            return (
              <div key={d.id} className="wz-card" style={{ padding:'20px', animation:`fadeUp 0.4s ${i*0.07}s ease both`, border:`1px solid ${isDone?'rgba(46,204,113,0.3)':isCel?'rgba(201,168,76,0.5)':'rgba(201,168,76,0.1)'}`, boxShadow: isCel?'0 0 30px rgba(201,168,76,0.2)':'none' }}>
                {/* Top row */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                  <div>
                    <div className="arabic" style={{ fontSize:20, color:d.color, marginBottom:4 }}>{d.arabic}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:'rgba(242,237,228,0.85)' }}>{d.name}</div>
                    <div style={{ fontSize:11, color:'rgba(242,237,228,0.35)' }}>{d.meaning}</div>
                  </div>
                  {/* Ring */}
                  <div style={{ position:'relative', width:60, height:60 }}>
                    <Ring count={count} goal={goal} color={isDone?'#2ecc71':d.color} size={60}/>
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cinzel,serif', fontSize:11, fontWeight:700, color:isDone?'#2ecc71':d.color }}>
                      {isDone ? '✓' : `${Math.round(pct)}%`}
                    </div>
                  </div>
                </div>

                {/* Count display */}
                <div className="dhikr-btn" onClick={() => tap(d)}
                  style={{ background:`${d.color}12`, border:`2px solid ${d.color}33`, borderRadius:16, padding:'20px', textAlign:'center', marginBottom:12, animation: isCel ? 'celebrate 0.5s ease' : 'none' }}>
                  <div style={{ fontFamily:'Cinzel,serif', fontSize:48, fontWeight:900, color:d.color, lineHeight:1, animation:`countUp 0.2s ease` }}>
                    {count.toLocaleString()}
                  </div>
                  <div style={{ fontSize:11, color:'rgba(242,237,228,0.35)', marginTop:4 }}>Tap to count · Goal: {goal.toLocaleString()}</div>
                  {isDone && <div style={{ fontSize:12, color:'#2ecc71', marginTop:4, fontWeight:600 }}>🎉 Goal Complete!</div>}
                </div>

                {/* Progress bar */}
                <div style={{ height:4, background:'rgba(255,255,255,0.06)', borderRadius:2, marginBottom:12, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${d.color},${d.color}88)`, borderRadius:2, transition:'width 0.3s' }}/>
                </div>

                {/* Goal selector + reset */}
                <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                  <select value={goal} onChange={e => setGoal(d.id, parseInt(e.target.value))}
                    style={{ flex:1, padding:'6px 10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:8, color:'rgba(242,237,228,0.6)', fontSize:11, fontFamily:'inherit', outline:'none' }}>
                    {GOALS.map(g => <option key={g} value={g}>{g.toLocaleString()} times</option>)}
                  </select>
                  <button onClick={() => reset(d.id)} className="wz-btn" style={{ padding:'6px 10px', fontSize:11, display:'flex', alignItems:'center', gap:4 }}>
                    <RotateCcw size={11}/> Reset
                  </button>
                  {d.id.startsWith('custom_') && (
                    <button onClick={() => removeCustom(d.id)} style={{ padding:'6px 8px', background:'rgba(231,76,60,0.1)', border:'1px solid rgba(231,76,60,0.2)', borderRadius:8, color:'#e74c3c', cursor:'pointer' }}>
                      <X size={11}/>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════ PROGRESS TAB ══════ */}
      {tab === 'progress' && (
        <div>
          {/* Weekly chart */}
          <div className="wz-card" style={{ padding:'22px', marginBottom:16 }}>
            <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:18 }}>WEEKLY PROGRESS</div>
            <div style={{ display:'flex', gap:8, alignItems:'flex-end', height:120 }}>
              {weekDays.map((day, i) => {
                const dayData  = data.history?.[day] || {};
                const dayTotal = Object.values(dayData).reduce((s,v) => s+(v||0), 0);
                const maxVal   = Math.max(...weekDays.map(d => Object.values(data.history?.[d]||{}).reduce((s,v)=>s+(v||0),0)), 1);
                const h        = Math.max((dayTotal/maxVal)*100, 4);
                const isToday  = day === today;
                const dayName  = new Date(day).toLocaleDateString('en-US',{weekday:'short'});
                return (
                  <div key={day} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                    <div style={{ fontSize:10, color: isToday?'#C9A84C':'rgba(242,237,228,0.35)' }}>{dayTotal>0?dayTotal.toLocaleString():''}</div>
                    <div style={{ width:'100%', height:100, display:'flex', alignItems:'flex-end' }}>
                      <div style={{ width:'100%', height:`${h}%`, background: isToday?'linear-gradient(180deg,#C9A84C,#E8C97A)':'rgba(201,168,76,0.25)', borderRadius:'4px 4px 0 0', transition:'height 0.5s', minHeight:4 }}/>
                    </div>
                    <div style={{ fontSize:10, color: isToday?'#C9A84C':'rgba(242,237,228,0.3)', fontWeight: isToday?700:400 }}>{dayName}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Per dhikr stats */}
          <div className="wz-card" style={{ padding:'22px' }}>
            <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:16 }}>TODAY'S BREAKDOWN</div>
            {allDhikr.map(d => {
              const count = getCount(d.id);
              const goal  = getGoal(d.id);
              const pct   = Math.min((count/goal)*100, 100);
              return (
                <div key={d.id} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                  <div className="arabic" style={{ width:100, fontSize:13, color:d.color, flexShrink:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{d.arabic}</div>
                  <div style={{ flex:1, height:8, background:'rgba(255,255,255,0.06)', borderRadius:4, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${d.color},${d.color}88)`, borderRadius:4, transition:'width 0.5s' }}/>
                  </div>
                  <div style={{ width:80, textAlign:'right', fontFamily:'Cinzel,serif', fontSize:12, color: count>=goal?'#2ecc71':d.color }}>
                    {count.toLocaleString()}/{goal.toLocaleString()}
                  </div>
                </div>
              );
            })}
            {/* Streak info */}
            <div style={{ marginTop:16, padding:'14px 16px', background:'rgba(255,107,0,0.06)', border:'1px solid rgba(255,107,0,0.15)', borderRadius:12, display:'flex', alignItems:'center', gap:12 }}>
              <Flame size={24} color="#FF6B00"/>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:'#FF6B00' }}>{data.streak?.days||0} Day Streak 🔥</div>
                <div style={{ fontSize:11, color:'rgba(255,107,0,0.6)' }}>Keep going! Daily dhikr builds your connection with Allah</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════ CUSTOM TAB ══════ */}
      {tab === 'custom' && (
        <div>
          {!adding ? (
            <button onClick={() => setAdding(true)}
              style={{ width:'100%', padding:'16px', background:'rgba(201,168,76,0.06)', border:'2px dashed rgba(201,168,76,0.25)', borderRadius:16, color:'#C9A84C', cursor:'pointer', fontSize:14, fontFamily:'Cinzel,serif', letterSpacing:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:16 }}>
              <Plus size={18}/> Add Custom Dhikr
            </button>
          ) : (
            <div className="wz-card" style={{ padding:'22px', marginBottom:16 }}>
              <div style={{ fontSize:12, color:'#C9A84C', fontFamily:'Cinzel,serif', letterSpacing:1, marginBottom:16 }}>NEW DHIKR</div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[
                  { label:'NAME (English)', val:newName, set:setNewName, ph:'e.g. Salawat' },
                  { label:'ARABIC TEXT (optional)', val:newArabic, set:setNewArabic, ph:'e.g. اللَّهُمَّ صَلِّ عَلَى' },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize:10, color:'rgba(201,168,76,0.5)', letterSpacing:1, marginBottom:6 }}>{f.label}</div>
                    <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}
                      style={{ width:'100%', padding:'10px 14px', background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:10, color:'#F2EDE4', fontSize:13, fontFamily:'inherit', outline:'none' }}/>
                  </div>
                ))}
                <div>
                  <div style={{ fontSize:10, color:'rgba(201,168,76,0.5)', letterSpacing:1, marginBottom:6 }}>DAILY GOAL</div>
                  <div style={{ display:'flex', gap:6 }}>
                    {GOALS.map(g => (
                      <button key={g} onClick={() => setNewGoal(g)}
                        style={{ flex:1, padding:'8px 4px', background: newGoal===g?'rgba(201,168,76,0.2)':'rgba(255,255,255,0.04)', border:`1px solid ${newGoal===g?'rgba(201,168,76,0.4)':'rgba(255,255,255,0.08)'}`, borderRadius:8, color: newGoal===g?'#C9A84C':'rgba(242,237,228,0.4)', fontSize:11, cursor:'pointer', fontFamily:'inherit' }}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={addCustom}
                    style={{ flex:1, padding:'12px', background:'linear-gradient(135deg,#C9A84C,#E8C97A)', border:'none', borderRadius:10, color:'#050505', fontFamily:'Cinzel,serif', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                    Add Dhikr
                  </button>
                  <button onClick={() => setAdding(false)} className="wz-btn" style={{ padding:'12px 16px', fontSize:13 }}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Custom dhikr list */}
          {(data.custom||[]).length === 0 && !adding && (
            <div style={{ textAlign:'center', padding:40, color:'rgba(242,237,228,0.3)', fontSize:13 }}>
              <div style={{ fontSize:32, marginBottom:12 }}>📿</div>
              No custom dhikr yet. Add your first one!
            </div>
          )}
          {(data.custom||[]).map((d,i) => (
            <div key={d.id} className="wz-card" style={{ padding:'16px 20px', marginBottom:10, display:'flex', alignItems:'center', gap:14, animation:`fadeUp 0.3s ${i*0.07}s ease both` }}>
              <div className="arabic" style={{ fontSize:18, color:d.color, flex:1 }}>{d.arabic || d.name}</div>
              <div style={{ fontSize:13, color:'rgba(242,237,228,0.6)' }}>{d.name}</div>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:13, color:'#C9A84C' }}>{getCount(d.id)}/{getGoal(d.id)}</div>
              <button onClick={() => removeCustom(d.id)} style={{ padding:'6px 8px', background:'rgba(231,76,60,0.1)', border:'1px solid rgba(231,76,60,0.2)', borderRadius:8, color:'#e74c3c', cursor:'pointer' }}>
                <X size={12}/>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hadith */}
      <div style={{ marginTop:20, background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.1)', borderRadius:14, padding:'16px 20px', textAlign:'center' }}>
        <div className="arabic" style={{ fontSize:15, color:'rgba(201,168,76,0.7)', marginBottom:6, direction:'rtl' }}>
          أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
        </div>
        <div style={{ fontSize:12, color:'rgba(242,237,228,0.3)', fontStyle:'italic' }}>
          "Verily, in the remembrance of Allah do hearts find rest." — Quran 13:28
        </div>
      </div>
    </div>
  );
}