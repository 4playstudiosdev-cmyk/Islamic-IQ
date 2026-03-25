import React, { useState, useEffect } from 'react';
import { Plus, X, Flame, Trophy, Check } from 'lucide-react';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .ht-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { to{background-position:200% center} }
  @keyframes pop     { 0%{transform:scale(1)} 50%{transform:scale(1.18)} 100%{transform:scale(1)} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .ht-card { background:#0F0F0D; border:1px solid rgba(201,168,76,0.1); border-radius:16px; transition:all 0.3s; }
  .habit-row { background:#0F0F0D; border:1px solid rgba(201,168,76,0.08); border-radius:14px; transition:all 0.3s; }
  .habit-row.done { border-color:rgba(46,204,113,0.3); background:rgba(46,204,113,0.04); }
  .check-btn { width:36px;height:36px;border-radius:50%;border:2px solid rgba(201,168,76,0.3);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;flex-shrink:0; }
  .check-btn.done { background:#2ecc71;border-color:#2ecc71;animation:pop 0.3s ease; }
`;

const TODAY = () => new Date().toISOString().split('T')[0];
const WEEK  = () => Array.from({length:7},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-6+i); return d.toISOString().split('T')[0]; });

const DEFAULT_HABITS = [
  { id:'fajr',      name:'Fajr Prayer',        emoji:'🌙', color:'#1A5276', target:1  },
  { id:'dhuhr',     name:'Dhuhr Prayer',        emoji:'☀️', color:'#C9A84C', target:1  },
  { id:'asr',       name:'Asr Prayer',          emoji:'🌤️', color:'#E8A838', target:1  },
  { id:'maghrib',   name:'Maghrib Prayer',      emoji:'🌅', color:'#E05C2A', target:1  },
  { id:'isha',      name:'Isha Prayer',         emoji:'🌙', color:'#6B48C4', target:1  },
  { id:'quran',     name:'Read Quran',          emoji:'📖', color:'#2E8B57', target:1  },
  { id:'dhikr',     name:'Morning Dhikr',       emoji:'📿', color:'#8E44AD', target:1  },
  { id:'tahajjud',  name:'Tahajjud Prayer',     emoji:'✨', color:'#148F77', target:1  },
  { id:'sadaqah',   name:'Give Sadaqah',        emoji:'💚', color:'#27AE60', target:1  },
  { id:'fast',      name:'Optional Fast',       emoji:'🤲', color:'#D35400', target:1  },
];

function loadData() { try { return JSON.parse(localStorage.getItem('habits_v1')||'null'); } catch { return null; } }
function saveData(d) { try { localStorage.setItem('habits_v1', JSON.stringify(d)); } catch {} }

export default function HabitTracker() {
  const [data, setData] = useState(() => {
    const saved = loadData();
    if (saved) return saved;
    const logs = {};
    DEFAULT_HABITS.forEach(h => { logs[h.id] = {}; });
    return { logs, custom:[], streak:{ lastDate:'', days:0 } };
  });
  const [adding, setAdding]   = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('⭐');
  const [tab, setTab]         = useState('today');

  const today  = TODAY();
  const week   = WEEK();
  const allHabits = [...DEFAULT_HABITS, ...(data.custom||[])];

  useEffect(() => {
    const streak = { ...data.streak };
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
    const yStr = yesterday.toISOString().split('T')[0];
    if (streak.lastDate !== today) {
      const allDone = allHabits.every(h => data.logs?.[h.id]?.[today]);
      if (allDone && streak.lastDate === yStr) streak.days = (streak.days||0)+1;
      else if (allDone) streak.days = 1;
      if (allDone) { streak.lastDate = today; update({ streak }); }
    }
  }, [data.logs]);

  const update = (patch) => {
    setData(prev => { const next={...prev,...patch}; saveData(next); return next; });
  };

  const toggle = (habitId) => {
    const cur = data.logs?.[habitId]?.[today];
    const newLogs = { ...data.logs, [habitId]: { ...(data.logs[habitId]||{}), [today]: !cur } };
    update({ logs: newLogs });
  };

  const isDone    = (id) => !!data.logs?.[id]?.[today];
  const doneCount = allHabits.filter(h => isDone(h.id)).length;
  const pct       = Math.round((doneCount/allHabits.length)*100);

  const addCustom = () => {
    if (!newName.trim()) return;
    const id = `custom_${Date.now()}`;
    const custom = [...(data.custom||[]), { id, name:newName.trim(), emoji:newEmoji, color:'#C9A84C', target:1 }];
    const logs   = { ...data.logs, [id]: {} };
    update({ custom, logs });
    setNewName(''); setAdding(false);
  };

  const removeCustom = (id) => {
    update({ custom: (data.custom||[]).filter(h=>h.id!==id) });
  };

  // Week completion grid
  const getWeekData = (habitId) => week.map(d => !!data.logs?.[habitId]?.[d]);

  return (
    <div className="ht-root" style={{ padding:'24px 28px', maxWidth:900, margin:'0 auto' }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#050505,#0F0F0D)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:20, padding:'22px 28px', marginBottom:22, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, background:'radial-gradient(ellipse,rgba(201,168,76,0.07),transparent)', borderRadius:'50%', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:14, position:'relative' }}>
          <div style={{ width:50, height:50, background:'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🔥</div>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:3, color:'rgba(201,168,76,0.6)', marginBottom:4 }}>DAILY GOALS</div>
            <h1 className="gold-shimmer" style={{ fontSize:22, fontWeight:800, fontFamily:'Cinzel,serif' }}>Habit Tracker</h1>
            <p style={{ fontSize:12, color:'rgba(242,237,228,0.4)', marginTop:2 }}>
              {new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}
            </p>
          </div>
          {/* Stats */}
          <div style={{ marginLeft:'auto', display:'flex', gap:10 }}>
            <div style={{ textAlign:'center', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:12, padding:'10px 14px' }}>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:18, fontWeight:700, color:'#C9A84C' }}>{doneCount}/{allHabits.length}</div>
              <div style={{ fontSize:9, color:'rgba(201,168,76,0.5)', letterSpacing:1 }}>TODAY</div>
            </div>
            <div style={{ textAlign:'center', background:'rgba(255,107,0,0.08)', border:'1px solid rgba(255,107,0,0.2)', borderRadius:12, padding:'10px 14px' }}>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:18, fontWeight:700, color:'#FF6B00', display:'flex', alignItems:'center', gap:4 }}><Flame size={14}/>{data.streak?.days||0}</div>
              <div style={{ fontSize:9, color:'rgba(255,107,0,0.5)', letterSpacing:1 }}>STREAK</div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:11 }}>
            <span style={{ color:'rgba(242,237,228,0.4)' }}>Daily Progress</span>
            <span style={{ color:pct===100?'#2ecc71':'#C9A84C', fontWeight:700 }}>{pct}%</span>
          </div>
          <div style={{ height:6, background:'rgba(255,255,255,0.06)', borderRadius:3, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${pct}%`, background: pct===100?'linear-gradient(90deg,#2ecc71,#27ae60)':'linear-gradient(90deg,#C9A84C,#E8C97A)', borderRadius:3, transition:'width 0.5s' }}/>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {[['today','📅 Today'],['week','📊 This Week'],['add','➕ Add Habit']].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ padding:'9px 16px', background:tab===id?'rgba(201,168,76,0.15)':'rgba(201,168,76,0.04)', border:`1px solid ${tab===id?'rgba(201,168,76,0.4)':'rgba(201,168,76,0.1)'}`, borderRadius:10, color:tab===id?'#C9A84C':'rgba(242,237,228,0.5)', cursor:'pointer', fontSize:12, fontWeight:tab===id?700:400, fontFamily:'inherit' }}>
            {label}
          </button>
        ))}
      </div>

      {/* TODAY */}
      {tab === 'today' && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {allHabits.map((h, i) => {
            const done = isDone(h.id);
            return (
              <div key={h.id} className={`habit-row ${done?'done':''}`}
                style={{ padding:'16px 18px', display:'flex', alignItems:'center', gap:14, animation:`fadeUp 0.3s ${i*0.04}s ease both` }}>
                <span style={{ fontSize:22, flexShrink:0 }}>{h.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:done?'rgba(242,237,228,0.5)':'rgba(242,237,228,0.9)', textDecoration:done?'line-through':'none' }}>{h.name}</div>
                </div>
                {h.id.startsWith('custom_') && (
                  <button onClick={() => removeCustom(h.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(242,237,228,0.2)', padding:4 }}><X size={12}/></button>
                )}
                <button className={`check-btn ${done?'done':''}`} onClick={() => toggle(h.id)}>
                  {done && <Check size={18} color="white"/>}
                </button>
              </div>
            );
          })}

          {/* All done message */}
          {pct === 100 && (
            <div style={{ textAlign:'center', padding:'24px', background:'rgba(46,204,113,0.08)', border:'1px solid rgba(46,204,113,0.2)', borderRadius:16, animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontSize:36, marginBottom:8 }}>🏆</div>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:16, fontWeight:700, color:'#2ecc71' }}>All Habits Complete!</div>
              <div style={{ fontSize:12, color:'rgba(46,204,113,0.6)', marginTop:4 }}>MashAllah! May Allah accept your efforts. Ameen 🤲</div>
            </div>
          )}
        </div>
      )}

      {/* WEEK */}
      {tab === 'week' && (
        <div className="ht-card" style={{ padding:'22px', overflowX:'auto' }}>
          <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:16 }}>7-DAY OVERVIEW</div>
          {/* Day headers */}
          <div style={{ display:'grid', gridTemplateColumns:`180px repeat(7,1fr)`, gap:6, marginBottom:8 }}>
            <div/>
            {week.map(d => {
              const isToday = d === today;
              const dayName = new Date(d).toLocaleDateString('en-US',{weekday:'short'});
              return (
                <div key={d} style={{ textAlign:'center', fontSize:10, color:isToday?'#C9A84C':'rgba(242,237,228,0.3)', fontFamily:'Cinzel,serif', fontWeight:isToday?700:400, paddingBottom:4 }}>
                  {dayName}
                </div>
              );
            })}
          </div>
          {/* Habit rows */}
          {allHabits.map((h, i) => {
            const weekData = getWeekData(h.id);
            const doneThisWeek = weekData.filter(Boolean).length;
            return (
              <div key={h.id} style={{ display:'grid', gridTemplateColumns:`180px repeat(7,1fr)`, gap:6, marginBottom:8, alignItems:'center' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, overflow:'hidden' }}>
                  <span style={{ fontSize:16 }}>{h.emoji}</span>
                  <span style={{ fontSize:12, color:'rgba(242,237,228,0.7)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{h.name}</span>
                </div>
                {weekData.map((done, di) => (
                  <div key={di} style={{ display:'flex', justifyContent:'center' }}>
                    <div style={{ width:28, height:28, borderRadius:7, background:done?h.color:'rgba(255,255,255,0.04)', border:`1px solid ${done?h.color+'55':'rgba(255,255,255,0.06)'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {done && <Check size={13} color="white"/>}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
          {/* Weekly score */}
          <div style={{ marginTop:16, padding:'14px', background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.12)', borderRadius:12, display:'flex', alignItems:'center', gap:12 }}>
            <Trophy size={20} color="#C9A84C"/>
            <div style={{ fontSize:13, color:'rgba(242,237,228,0.6)' }}>
              Weekly completion: <span style={{ color:'#C9A84C', fontWeight:700 }}>{Math.round(allHabits.reduce((s,h)=>s+getWeekData(h.id).filter(Boolean).length,0)/(allHabits.length*7)*100)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* ADD */}
      {tab === 'add' && (
        <div>
          <div className="ht-card" style={{ padding:'22px', marginBottom:14 }}>
            <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:16 }}>NEW HABIT</div>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:11, color:'rgba(242,237,228,0.4)', marginBottom:6 }}>EMOJI</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:10 }}>
                {['⭐','🕌','📖','🤲','💚','🌙','📿','✨','🏃','💧'].map(e => (
                  <button key={e} onClick={() => setNewEmoji(e)}
                    style={{ width:38,height:38,fontSize:20,borderRadius:8,border:`1px solid ${newEmoji===e?'rgba(201,168,76,0.5)':'rgba(201,168,76,0.1)'}`,background:newEmoji===e?'rgba(201,168,76,0.15)':'transparent',cursor:'pointer' }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, color:'rgba(242,237,228,0.4)', marginBottom:6 }}>HABIT NAME</div>
              <input value={newName} onChange={e=>setNewName(e.target.value)}
                placeholder="e.g. Evening Dhikr"
                onKeyDown={e=>e.key==='Enter'&&addCustom()}
                style={{ width:'100%', padding:'11px 14px', background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:10, color:'#F2EDE4', fontSize:13, fontFamily:'inherit', outline:'none' }}/>
            </div>
            <button onClick={addCustom}
              style={{ width:'100%', padding:'12px', background:'linear-gradient(135deg,#C9A84C,#E8C97A)', border:'none', borderRadius:10, color:'#050505', fontFamily:'Cinzel,serif', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <Plus size={16}/> Add Habit
            </button>
          </div>

          {/* Custom habits list */}
          {(data.custom||[]).length > 0 && (
            <div className="ht-card" style={{ padding:'20px' }}>
              <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:14 }}>MY CUSTOM HABITS</div>
              {(data.custom||[]).map(h => (
                <div key={h.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.08)', borderRadius:10, marginBottom:8 }}>
                  <span style={{ fontSize:18 }}>{h.emoji}</span>
                  <span style={{ flex:1, fontSize:13, color:'rgba(242,237,228,0.7)' }}>{h.name}</span>
                  <button onClick={() => removeCustom(h.id)} style={{ background:'rgba(231,76,60,0.1)', border:'1px solid rgba(231,76,60,0.2)', borderRadius:7, padding:'5px 8px', cursor:'pointer', color:'#e74c3c' }}><X size={12}/></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quran verse */}
      <div style={{ marginTop:20, background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.1)', borderRadius:14, padding:'16px 20px', textAlign:'center' }}>
        <div className="arabic" style={{ fontSize:14, color:'rgba(201,168,76,0.7)', marginBottom:6 }}>إِنَّ اللَّهَ مَعَ الصَّابِرِينَ</div>
        <div style={{ fontSize:12, color:'rgba(242,237,228,0.3)', fontStyle:'italic' }}>"Indeed, Allah is with the patient." — Quran 2:153</div>
      </div>
    </div>
  );
}